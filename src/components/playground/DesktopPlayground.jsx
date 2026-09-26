import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import products from '../../data/products.json';
import profileData from '../../data/playgroundProfiles.json';
import { buildPlaygroundDocument } from '../../shared/playgroundDocument';
import { filterPlaygroundProfiles, profileGroup, profileScene, sceneProfiles, getPlaygroundSession, savePlaygroundSession, updatePlaygroundSelection, getPlaygroundPreferences, savePlaygroundPreferences } from '../../shared/playgroundSelection';
import { useMyList } from '../../hooks/useMyList';
import baseAssets from '../../data/playgroundBases.json';
import { durationLabel } from '../../shared/playgroundPresentation';
import { productVideoPath } from '../../utils/productVideo';
const bases = Object.fromEntries(Object.entries(baseAssets).map(([id, base]) => [id, { ...base, src: `${location.origin}${base.src}` }]));
const available = profileData.profiles;
const groups = ['All', ...new Set(available.map(profileGroup))];
export default function DesktopPlayground() {
  const [params] = useSearchParams();
  const [initial] = useState(() => getPlaygroundSession(available, params.get('product')));
  const [selection, setSelection] = useState(initial.state);
  const { scene, picks } = selection;
  const selected = picks[scene];
  useEffect(() => savePlaygroundSession(available, selection), [selection]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [announcement, setAnnouncement] = useState(initial.message);
  const frame = useRef(null);
  const { add, error } = useMyList();
  const profiles = useMemo(() => sceneProfiles(available, selected, scene), [selected, scene]);
  const html = useMemo(() => buildPlaygroundDocument({ profiles, scene, bases, preferences: getPlaygroundPreferences(), skyline: `${location.origin}/images/hero/dallas-skyline-2160.webp` }), [profiles, scene]);
  useEffect(() => {
    const instance = frame.current;
    const pause = () => instance?.contentWindow?.postMessage({ type: 'rockwall-pause' }, '*');
    const receive = (event) => { if (event.source === instance?.contentWindow && event.data?.type === 'rockwall-playground' && event.data.preferences) savePlaygroundPreferences(event.data.preferences); };
    window.addEventListener('message', receive);
    const hidden = () => { if (document.hidden) pause(); };
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) pause(); });
    if (frame.current) observer.observe(frame.current);
    document.addEventListener('visibilitychange', hidden);
    return () => { instance?.contentWindow?.postMessage({ type: 'rockwall-destroy' }, '*'); observer.disconnect(); document.removeEventListener('visibilitychange', hidden); window.removeEventListener('message', receive); };
  }, [html]);
  function change(action) {
    const next = updatePlaygroundSelection(available, selection, action);
    if (JSON.stringify(next.state) === JSON.stringify(selection)) { setAnnouncement(next.message); return; }
    // Stop the outgoing context before React replaces its document.
    frame.current?.contentWindow?.postMessage({ type: 'rockwall-destroy' }, '*');
    savePlaygroundSession(available, next.state); setSelection(next.state); setAnnouncement(next.message);
  }
  const toggle = (id) => change({ type: 'toggle', id });
  const visible = filterPlaygroundProfiles(available, filter, search);
  return <>
    <div className="playground-scene-tabs" role="group" aria-label="Playback scene">{['aerial','ground'].map((value) => <button key={value} aria-pressed={scene === value} onClick={() => change({ type: 'scene', scene: value })}>{value === 'aerial' ? 'Dallas sky' : 'Fountain field'} <span>{picks[value].length}{value !== scene ? ' saved' : ''}</span></button>)}<p>{selected.length} active {selected.length === 1 ? 'pick' : 'picks'} · {scene === 'ground' ? 'Ground scene' : 'Dallas sky'}. Only these picks will play.</p></div>
    <p role="status" className="playground-status">{announcement}</p>
    <div className="playground-stage-shell"><iframe key={`${selected.join(',')}:${scene}`} ref={frame} title="Fireworks playground and playback controls" srcDoc={html} sandbox="allow-scripts" className="playground-frame" /></div>
    <p className="playground-disclaimer">Illustrative simulation based on product demonstrations. Actual effects, colors, timing, apparent size and sound may vary. Not to scale.</p>
    <div className="playground-selection-heading"><div><h2>Choose your fireworks</h2><p>Select up to 4 per scene. Choosing a different type switches scenes and saves your picks.</p></div><span className="playground-count">{selected.length} of 4 active</span></div>
    <div className="playground-summary" aria-label="Selected fireworks">{selected.map((id) => { const p = available.find((p) => p.productId === id); return <div className="playground-chip" key={id}><span>{p.name}<small>{profileScene(p) === 'ground' ? 'Fountain field' : 'Dallas sky'}</small></span><button onClick={() => toggle(id)} aria-label={`Remove ${p.name} from selection`}>×</button></div>; })}<button className="playground-clear" disabled={!selected.length} onClick={() => change({ type: 'clear' })}>Clear active selection</button></div>
    <div className="playground-filters"><div role="group" aria-label="Filter available demonstrations">{groups.map((group) => <button key={group} aria-pressed={filter === group} onClick={() => setFilter(group)}>{group}</button>)}</div><label className="sr-only" htmlFor="playground-search">Search available fireworks</label><input id="playground-search" type="search" value={search} placeholder="Search fireworks" onChange={(e) => setSearch(e.target.value)}/>{(filter !== 'All' || search) && <button onClick={() => { setFilter('All'); setSearch(''); }}>Clear filters</button>}<span>{visible.length} available</span></div>
    {selected.length === 4 && <p className="playground-limit">Four active picks. Remove one to add another in this scene.</p>}
    <div className="playground-products">{visible.map((profile) => {
      const product = products.find((p) => p.id === profile.productId);
      const checked = selected.includes(product.id);
      return <button type="button" key={product.id} className={`playground-product ${checked ? 'is-selected' : ''}`} aria-pressed={checked} aria-label={`${checked ? 'Deselect' : 'Select'} ${product.name}`} aria-disabled={!checked && profileScene(profile) === scene && selected.length === 4} onClick={() => toggle(product.id)}>
        <span className="playground-check" aria-hidden="true">{checked ? '✓' : '+'}</span><img src={product.image} width="100" height="100" alt="" loading="lazy"/><span className="playground-category">{product.category}</span><strong>{product.name}</strong>{profile.kind.endsWith('sample') && <small>{profile.kind === 'shell-sample' ? 'Shell sample' : profile.kind === 'fountain-sample' ? 'Fountain excerpt' : 'Demo excerpt'}</small>}
      </button>;
    })}</div>{!visible.length && <p>No reviewed demonstrations match. Try All or clear your search.</p>}
    {selected.length > 0 && <section className="playground-actions" aria-label="Selected product actions"><h3>Your active fireworks</h3>{selected.map((id) => { const profile = available.find((p) => p.productId === id); const product = products.find((p) => p.id === id); return <div key={id}><strong>{product.name}</strong><span>{durationLabel(profile)}</span><Link to={`/products/${product.slug}`}>Product details</Link><Link to={productVideoPath(product)}>Watch the reference</Link><button onClick={() => { add(product); setAnnouncement(`${product.name} added to My List.`); }}>+ My List</button></div>; })}</section>}
    {error && <p role="alert">{error}</p>}
  </>;
}
