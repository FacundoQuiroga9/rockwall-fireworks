import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import products from '../data/products.json';
import promotions from '../data/promotions.json';
import { useMyList } from '../hooks/useMyList';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { addPromotion, assessList, canPair, dissolveGroup, isBogoCandidate, promotionIsCurrent, promotionIsSelectable, promotionProgress, removeGroup, reviewGroup, setBogoPartner, setPairCount, setPromotionItem, setQuantity, startBogo } from '../shared/myList';
import { createListPdf } from '../shared/listPdf';
import './ProductsPage.css';
import './MyListPage.css';
import ListGuide from '../components/myList/ListGuide';
import { listProductName } from '../shared/listPresentation';

const bogo = promotions.find((p) => p.id === 'bogo-store');
function Quantity({ value, onChange, label }) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  return <label className="list-quantity"><span>{label.startsWith('Quantity for') ? 'Quantity' : label}</span><input aria-label={label} type="number" min="1" max="999" step="1" inputMode="numeric" value={draft} onChange={(e) => { setDraft(e.target.value); const n = Number(e.target.value); if (Number.isInteger(n) && n >= 1 && n <= 999) onChange(n); }} onBlur={() => setDraft(String(value))} /></label>;
}
function PromotionPicker({ update }) {
  const active = promotions.filter((p) => promotionIsSelectable(p));
  const [id, setId] = useState('');
  const [chosen, setChosen] = useState([]);
  const promotion = active.find((p) => p.id === id);
  return <section className="list-promotion-info"><h2>Store promotions</h2>{!active.length ? <p>No current coupon campaign is available. The dated Independence Day 2026 offers expired July 4, 2026; they are not applied to your list.</p> : <>
    <label>Choose a verified offer<select value={id} onChange={(e) => { setId(e.target.value); setChosen([]); }}><option value="">Choose an offer</option>{active.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
    {promotion && <><p>{promotion.conditions.join(' ')}</p>{promotion.kind === 'choice' && <p role="status">{Math.max(0, promotion.requiredQuantity - chosen.filter(Boolean).length)} of {promotion.requiredQuantity} choices remaining.</p>}{promotion.kind === 'choice' && Array.from({ length: promotion.requiredQuantity }, (_, i) => <label key={i}>Selection {i + 1}<select value={chosen[i] || ''} onChange={(e) => setChosen((old) => { const next = [...old]; next[i] = e.target.value; return next; })}><option value="">Choose product</option>{products.filter((p) => promotion.eligibleIds.includes(p.id)).map((p) => <option key={p.id} value={p.id}>{p.name} · {p.brand}</option>)}</select></label>)}<button className="list-button" type="button" disabled={promotion.kind === 'choice' && Array.from({length: promotion.requiredQuantity}, (_, i) => chosen[i]).some((value) => !value)} onClick={() => { update((list) => addPromotion(list, promotion, products, chosen.map((productId) => ({ productId, quantity: 1 })))); setId(''); setChosen([]); }}>Add configured promotion</button></>}
  </>}<details className="list-offer-archive"><summary>Independence Day 2026 · archived offers</summary><p>For reference only. A new validity period and complete eligible selection must be confirmed before these offers can be selected.</p>{promotions.filter((p) => p.campaign === 'independence-day-2026').map((p) => <article key={p.id}><h3>{p.name}</h3><p>{p.status === 'expired' ? 'Expired July 4, 2026' : 'Archived · current validity unconfirmed'}</p><ul>{p.conditions.slice(1).map((c) => <li key={c}>{c}</li>)}</ul></article>)}</details><p>BOGO means Buy One, Get One. Prepare an explicit pair from a marked product in your list. Both selections must be eligible and in the same category; brands may differ.</p></section>;
}
export default function MyListPage() {
  const { list, update, error, resetStorage } = useMyList();
  const [withPhotos, setWithPhotos] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const [counterView, setCounterView] = useState(false);
  const assessment = assessList(list, products, promotions);
  usePageMetadata({ title: 'My List | Rockwall Fireworks', description: 'Prepare a product list to show at Rockwall Fireworks.', path: '/my-list', noindex: true });
  const exportPdf = async () => {
    setExporting(true); setExportMessage('');
    try {
      const thumbnails = withPhotos ? (await import('../data/pdfThumbnails.json')).default : {};
      const bytes = createListPdf(assessList(list, products, promotions), { thumbnails });
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
      const link = document.createElement('a'); link.href = url; link.download = `rockwall-my-list-${new Date().toISOString().slice(0, 10)}.pdf`; link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 30000);
      setExportMessage('PDF downloaded. Your selected quantities and any pending conditions are included.');
    } catch { setExportMessage('PDF could not be created. Please try again. Your list has been kept.'); }
    finally { setExporting(false); }
  };
  return <main id="main-content" tabIndex="-1" className={`products-page my-list-page ${counterView ? 'counter-view' : ''}`}><div className="shell">
    <header className="list-heading"><div><p className="eyebrow">Plan your visit</p><h1>MY <em>LIST.</em></h1><p>Your fireworks, ready to show in store.</p><Link className="detail-back" to="/products">＋ Keep exploring</Link></div>{!counterView && <ListGuide />}</header>
    <p className="list-purpose">Saved on this device. No account required. This is a shopping list for your store visit; it does not place an order or reserve stock.</p>
    {error && <div role="alert" className="list-warning">{error}<button type="button" onClick={resetStorage}>Replace saved list with this selection</button></div>}
    <div className="list-layout"><div className="list-groups">
      {!list.groups.length && <section className="list-empty"><span aria-hidden="true">＋</span><h2>Build a great night.</h2><p>Add products from the catalog, choose your quantities, then bring your list to Rockwall.</p><Link className="list-button primary" to="/products">Find your fireworks</Link></section>}
      {assessment.groups.map((group, index) => <section className={`list-group list-group-${group.kind}`} key={group.id} aria-label={`${group.kind === 'bogo' ? 'BOGO pair' : 'Selection'} ${index + 1}`}>
        <header><div><span className="list-group-number">{String(index + 1).padStart(2, '0')}</span><h2>{group.kind === 'individual' ? 'Individual product' : group.kind === 'bogo' ? 'BOGO pair' : group.promotion?.name || 'Promotion'}</h2></div><span className={`list-state ${group.issues.length ? 'pending' : ''}`}>{group.state === 'complete' ? 'Complete · confirm in store' : group.kind === 'individual' && !group.issues.length ? 'Selected' : 'Needs review'}</span></header>
        {group.items.map((item, i) => {
          const current = products.find((p) => p.id === item.productId);
          const shown = item.snapshot;
          return <div className="list-product" key={`${item.productId}-${i}`}>
            {current && !item.changed ? <img src={current.image} alt="" width="64" height="64" /> : <span className="list-photo-pending" aria-label="Product image needs review">?</span>}
            <div className="list-product-copy"><p>{shown.category}</p><h3>{current ? <Link to={`/products/${current.slug}`}>{listProductName(shown, products)}</Link> : listProductName(shown, products)}</h3>
              {item.changed && <p className="list-warning">Current catalog: {current.name} · {current.category}. Review the product before accepting this change.</p>}
            </div>
            {group.kind !== 'individual' || item.paid == null ? <div className="list-unit-summary"><span>Paid <strong>{item.paid ?? '—'}</strong></span><span>Free <strong>{item.free ?? '—'}</strong></span><span>Total <strong>{item.quantity}</strong></span></div> : counterView ? <span className="list-counter-quantity">Qty <strong>{item.quantity}</strong></span> : null}
            {!counterView && (group.kind === 'individual' || (group.promotion?.kind === 'choice' && promotionIsCurrent(group.promotion))) && <Quantity label={`Quantity for ${shown.name}`} value={item.quantity} onChange={(n) => update((l) => setQuantity(l, group.id, i, n))} />}
            {!counterView && group.promotion?.kind === 'choice' && promotionIsCurrent(group.promotion) && <div className="list-pair-builder"><label>Change selected product<select value={item.productId} onChange={(e) => update((l) => setPromotionItem(l, group.id, i, products.find((p) => p.id === e.target.value), item.quantity, group.promotion))}>{!group.promotion.eligibleIds.includes(item.productId) && <option value={item.productId}>Review unavailable selection</option>}{products.filter((p) => group.promotion.eligibleIds.includes(p.id)).map((p) => <option key={p.id} value={p.id}>{p.name} · {p.brand} · {p.presentation}</option>)}</select></label><button className="list-button" type="button" onClick={() => update((l) => setPromotionItem(l, group.id, i, undefined, 0, group.promotion))}>Remove this product</button></div>}
          </div>;
        })}
        {!counterView && group.promotion?.kind === 'choice' && promotionIsCurrent(group.promotion) && <label className="list-pair-builder">Add an eligible product<select value="" onChange={(e) => update((l) => setPromotionItem(l, group.id, group.items.length, products.find((p) => p.id === e.target.value), 1, group.promotion))}><option value="">Choose another unit</option>{products.filter((p) => group.promotion.eligibleIds.includes(p.id)).map((p) => <option key={p.id} value={p.id}>{p.name} · {p.brand} · {p.presentation}</option>)}</select></label>}
        {!counterView && group.kind === 'bogo' && <div className="list-pair-builder"><label>Choose the second product <span>(adds an explicitly selected unit to this pair)</span><select value={group.items[1]?.productId || ''} onChange={(e) => { const p = products.find((p) => p.id === e.target.value); if (p) update((l) => setBogoPartner(l, group.id, p, products, bogo)); }}><option value="" disabled>Select a BOGO product</option>{products.filter((p) => canPair(group.items[0].product, p, bogo)).map((p) => <option key={p.id} value={p.id}>{p.name} · {p.brand || 'Brand not specified'} · {p.presentation}</option>)}</select></label><Quantity label="Number of requested pairs" value={group.items[0].quantity} onChange={(n) => update((l) => setPairCount(l, group.id, n))} /></div>}
        {group.kind === 'promotion' && group.promotion?.kind === 'choice' && <p role="status" className="list-promotion-progress">{promotionProgress(group.promotion, group.items).remaining ? `${promotionProgress(group.promotion, group.items).remaining} more eligible units needed.` : promotionProgress(group.promotion, group.items).excess ? `Remove ${promotionProgress(group.promotion, group.items).excess} excess units to complete this promotion.` : 'Required quantity selected.'}</p>}{group.issues.length > 0 && <div className="list-warning"><strong>{group.kind === 'bogo' ? 'BOGO is not applied yet.' : 'Review this selection.'}</strong><ul>{group.issues.map((issue) => <li key={issue}>{issue}</li>)}</ul></div>}
        {group.promotion && <details className="list-conditions"><summary>Promotion conditions</summary><ul>{group.promotion.conditions.map((c) => <li key={c}>{c}</li>)}</ul></details>}
        <div className="list-edit-actions">
          {group.kind === 'individual' && isBogoCandidate(group.items[0].product, bogo) && <button type="button" onClick={() => update((l) => startBogo(l, group.id, products, bogo))}>Prepare a BOGO pair with 1 unit</button>}
          {group.kind !== 'individual' && <button type="button" onClick={() => update((l) => dissolveGroup(l, group.id))}>Keep as individual products</button>}
          {(group.items.some((i) => i.changed) || (group.promotion && group.promotionRevision !== group.promotion.revision)) && !group.items.some((i) => i.missing) && <button type="button" onClick={() => update((l) => reviewGroup(l, group.id, products, promotions))}>Accept reviewed catalog and conditions</button>}
          <button className="list-remove" type="button" onClick={() => update((l) => removeGroup(l, group.id))} aria-label={`Remove selection ${index + 1}: ${group.items.map((i) => i.snapshot.name).join(', ')}`}>Remove</button>
        </div>
      </section>)}
      {!counterView && <PromotionPicker update={update} />}
    </div><div className="list-sidebar"><aside className="list-summary" aria-label="List summary"><p className="eyebrow">Bring it to Rockwall</p><h2>Your selection</h2><div className="list-total"><strong>{assessment.total}</strong><span>retail units selected</span></div><dl><div><dt>Paid units identified</dt><dd>{assessment.paid}</dd></div><div><dt>Bonus units confirmed</dt><dd>{assessment.free}</dd></div><div><dt>Units needing review</dt><dd>{assessment.pending}</dd></div></dl><p>Prices and availability are confirmed in store. No estimated price total.</p><p className="list-count-note">A pack counts as one retail unit. Pending pairs show selected units, with paid/free allocation left open.</p><button className="list-button" type="button" aria-pressed={counterView} onClick={() => setCounterView((v) => !v)}>{counterView ? 'Return to editing' : 'Show at the counter'}</button><label className="list-photo-choice"><input type="checkbox" checked={withPhotos} onChange={(e) => setWithPhotos(e.target.checked)} /> Include PDF thumbnails</label><button className="list-button primary" type="button" disabled={!list.groups.length || exporting} onClick={exportPdf}>{exporting ? 'Creating PDF…' : 'Download PDF ↓'}</button><p role="status">{exportMessage}</p><small>Stored in this browser only. App lists stay on that device.</small></aside></div></div>
  </div></main>;
}
