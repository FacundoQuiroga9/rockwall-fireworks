# Commercial rules — recorded before implementation

Reviewed 2026-09-24. The Square volume is not mounted. Work uses the preserved, token-reconciled CSV/Excel evidence in `../2026-08-square/inventory-master.csv`; it does not claim a new byte-level inspection of either original. Original exports remain untouched.

## Confirmed

- User: buying one BOGO product gives one additional eligible product. Both must be BOGO and in the same category. Brands may differ.
- Eligibility is attached to exact approved Square variants, never inferred from a category, photograph or similar name. 68 source rows carry the BOGO marker. Eight published product identities link to those rows.
- Explicit 200 gram and 500 gram cake classifications occur in approved presentation fields and the linked Square product name/category. No 250 gram classification occurs in the reconciled source. Shipping weights and image size are not classification evidence. Conflicts and unclassified sets stay in separate categories and cannot mix with either weight category.
- `public/rf coupons.pdf`, both pages inspected: three priced coupons expire July 4, 2025. 500g cakes $50 each; three 200g cakes $75; a 24-count 60g artillery-shell pack $75. Each says while supplies last. No exact eligible-product list is specified. Page one requires bringing the card for one free novelty; it belongs to the same 2025 mailing and has no separately verified current validity. These offers are archived and disabled.
- Silent Treatment is Fox, confirmed by the user for the existing ID and photo.

## Questions sent to the user

1. Are the August 2026 BOGO markers still current; what are the dates?
2. Can prices differ, and which selected unit is paid/free in that case?
3. Transaction limits and compatibility with other offers/coupons?
4. Access to the original CSV/Excel or an alternate local path; any current coupon campaign?

## Safe implementation boundary while answers are pending

Product/quantity lists and packaged retail units work without prices. Historical BOGO evidence is labelled as requiring store confirmation. The customer may save explicit candidate pairs, including an incomplete pair, but pending rules produce no paid/free allocation or claimed applied benefit. No automatic bonus selection. Expired or changed campaigns never apply silently. Unknown prices produce no monetary total. Archived offers are structured evidence, not selectable live campaigns.

Each list group owns its own selected units; no unit reference can be used in a second group. Converting an individual unit into a candidate pair transfers that unit, instead of copying it. Dissolving a pair preserves only the units actually selected. Stable product ID plus a saved identity snapshot detects unavailable/changed variants; no replacement by name. Promotion revisions require a new review. List persistence is local to each browser/device, independently of favorites.

## Shared source

`src/data/products.json` stays the commercial master. `commercial-review.json` records persistent classifications, Square codes and BOGO evidence by ID; sync applies it after existing corrections. `src/data/promotions.json` and `src/shared/` are copied and byte-checked by the existing sync/check workflow. Neither platform depends on its sibling at runtime.
