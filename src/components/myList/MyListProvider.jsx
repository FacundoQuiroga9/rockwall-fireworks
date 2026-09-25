import { useCallback, useEffect, useRef, useState } from 'react';
import { MyListContext } from '../../hooks/myListContext';
import { addProduct, emptyList, parseList } from '../../shared/myList';

const KEY = 'rockwall:my-list:v1';
export default function MyListProvider({ children }) {
  const [initial] = useState(() => {
    try { return { list: parseList(localStorage.getItem(KEY)), error: '', writable: true }; }
    catch { return { list: emptyList(), error: 'Your saved list could not be loaded. Changes will stay in this session until you reset local list storage.', writable: false }; }
  });
  const [list, setList] = useState(initial.list);
  const [error, setError] = useState(initial.error);
  const current = useRef(initial.list);
  const writable = useRef(initial.writable);
  const update = useCallback((change) => {
    const next = change(current.current);
    current.current = next; setList(next);
    if (!writable.current) return;
    try { localStorage.setItem(KEY, JSON.stringify(next)); setError(''); }
    catch { setError('Your list is available in this session, but could not be saved on this device. Download a PDF to keep a copy.'); }
  }, []);
  useEffect(() => {
    const receive = (event) => {
      if (event.key !== KEY && event.key !== null) return;
      try { const next = parseList(event.key === null ? null : event.newValue); current.current = next; setList(next); writable.current = true; setError(''); }
      catch { setError('Another tab has a saved list that needs review. Your current selection has been kept.'); }
    };
    window.addEventListener('storage', receive);
    return () => window.removeEventListener('storage', receive);
  }, []);
  const resetStorage = () => { writable.current = true; update(() => current.current); };
  const count = list.groups.reduce((sum, g) => sum + g.items.reduce((n, i) => n + i.quantity, 0), 0);
  return <MyListContext.Provider value={{ list, update, count, error, resetStorage, add: (product) => update((value) => addProduct(value, product)) }}>{children}</MyListContext.Provider>;
}
