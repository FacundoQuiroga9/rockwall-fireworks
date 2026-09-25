import promotions from '../../data/promotions.json';
import { getBogoState } from '../../shared/myList';
import './BogoBadge.css';

export default function BogoBadge({ product }) {
  const state = getBogoState(product, promotions);
  if (!state.marked) return null;
  return <span className={`bogo-ticket ${state.active ? 'bogo-ticket-active' : ''}`} aria-label={`BOGO: Buy One, Get One. ${state.active ? 'Verified active offer. Confirm application in store.' : 'Source marked. Current eligibility and offer need store confirmation.'}`}>
    <span className="bogo-ticket-mark" aria-hidden="true">1<span>+</span>1</span>
    <span className="bogo-ticket-copy" aria-hidden="true"><strong>BOGO</strong><small>{state.active ? 'Verified offer' : 'Check in store'}</small></span>
  </span>;
}
