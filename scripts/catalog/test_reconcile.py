import csv
import tempfile
import unittest
import zipfile
from pathlib import Path
from unittest.mock import patch

import reconcile


class ReconciliationTests(unittest.TestCase):
    def test_xlsx_keeps_leading_zero_identifiers_and_sheet_rows(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / 'source.xlsx'
            with zipfile.ZipFile(path, 'w') as z:
                z.writestr('xl/workbook.xml', '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Items" sheetId="1" r:id="r1"/></sheets></workbook>')
                z.writestr('xl/_rels/workbook.xml.rels', '<Relationships><Relationship Id="r1" Target="worksheets/sheet1.xml"/></Relationships>')
                z.writestr('xl/sharedStrings.xml', '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><si><t>000123</t></si></sst>')
                z.writestr('xl/worksheets/sheet1.xml', '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData><row r="1"/><row r="3"><c r="A3" t="s"><v>0</v></c><c r="C3" t="inlineStr"><is><t>Piñata &quot;6&quot;</t></is></c><c r="D3" t="s"/><c r="E3" t="n"><v>8.00</v></c></row></sheetData></worksheet>')
            result = reconcile.xlsx_sheets(path)['Items']
            self.assertEqual(result[0], (1, {}))
            self.assertEqual(result[1], (3, {0: '000123', 2: 'Piñata "6"', 3: '', 4: '8.00'}))

    def test_csv_round_trip_preserves_quotes_accents_and_identifier_strings(self):
        with tempfile.TemporaryDirectory() as tmp, patch.object(reconcile, 'OUT', Path(tmp)):
            expected = [{'sku': '0000123', 'name': 'Piñata, 6" shells', 'variant': '24 pack'}]
            reconcile.write_csv('inventory.csv', expected)
            with (Path(tmp) / 'inventory.csv').open(encoding='utf-8-sig', newline='') as f:
                self.assertEqual(list(csv.DictReader(f)), expected)

    def test_delivered_ledgers_cover_every_variant_once_without_promoting_candidates(self):
        with (reconcile.OUT / 'inventory-master.csv').open(encoding='utf-8-sig', newline='') as f:
            master = list(csv.DictReader(f))
        with (reconcile.OUT / 'pending-products.csv').open(encoding='utf-8-sig', newline='') as f:
            pending = list(csv.DictReader(f))
        self.assertEqual(len({r['square_token'] for r in master}), len(master))
        self.assertEqual({r['square_token'] for r in pending}, {r['square_token'] for r in master if not r['rockwall_product_id']})
        for r in master:
            self.assertEqual(int(r['xlsx_row']), int(r['csv_row']) + 1)
            if r['match_status'] in ('probable', 'no_match', 'conflict'):
                self.assertEqual(r['rockwall_product_id'], '')
        festival = [r for r in master if r['original_name'].startswith('Festival Balls')]
        self.assertEqual(len(festival), 4)
        self.assertEqual(sum(r['match_status'] == 'confirmed' for r in festival), 1)


if __name__ == '__main__':
    unittest.main()
