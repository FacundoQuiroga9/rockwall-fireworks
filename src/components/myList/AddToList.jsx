import { useMyList } from '../../hooks/useMyList';
export default function AddToList({ product, className = '' }) {
  const { add, list } = useMyList();
  const count = list.groups.flatMap((g) => g.items).filter((i) => i.productId === product.id).reduce((n, i) => n + i.quantity, 0);
  return <button className={`add-to-list ${className}`} type="button" onClick={() => add(product)} aria-label={`Add ${product.name} to My List${count ? `, ${count} already selected` : ''}`}><span aria-hidden="true">＋</span> {count ? `Add again (${count})` : 'Add to My List'}</button>;
}
