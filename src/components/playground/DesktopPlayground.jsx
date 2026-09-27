import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import products from '../../data/products.json';
import profileData from '../../data/playgroundProfiles.json';
import { buildPlaygroundDocument } from '../../shared/playgroundDocument';
import { PLAYGROUND_SCENES, sceneLabel, playgroundCatalog, sceneProfiles, getPlaygroundSession, savePlaygroundSession, updatePlaygroundSelection, getPlaygroundPreferences, savePlaygroundPreferences } from '../../shared/playgroundSelection';
import { useMyList } from '../../hooks/useMyList';
import baseAssets from '../../data/playgroundBases.json';
import environments from '../../data/playgroundEnvironments.json';
import { durationLabel } from '../../shared/playgroundPresentation';
import { productVideoPath } from '../../utils/productVideo';
import ProductRail from './ProductRail';
const bases = Object.fromEntries(Object.entries(baseAssets).map(([id, base]) => [id, { ...base, src: `${location.origin}${base.src}` }]));
const available = profileData.profiles;
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
  const html = useMemo(() => buildPlaygroundDocument({ profiles, scene, bases, environment: environments[scene] ? `${location.origin}${environments[scene].wide}` : undefined, preferences: getPlaygroundPreferences(), skyline: `${location.origin}/images/hero/dallas-skyline-2160.webp` }), [profiles, scene]);
  useEffect(() => {
    const instance = frame.current;
    const pause = () => instance?.contentWindow?.postMessage({ type: 'rockwall-pause' }, '*');
    const receive = (event) => { if (event.source === instance?.contentWindow && event.data?.type === 'rockwall-playground' && event.data.preferences) savePlaygroundPreferences(event.data.preferences); };
    window.addEventListener('message', receive);
    const hidden = () => { if (document.hidden) pause(); };
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) pause(); });
    if (frame.current) observer.observe(frame.current);
    document.addEventListener('visibilitychange', hidden);
    // StrictMode replays this effect without replacing the iframe. Pause here;
    // explicit selection changes destroy it, and actual removal runs unload.
    return () => { pause(); observer.disconnect(); document.removeEventListener('visibilitychange', hidden); window.removeEventListener('message', receive); };
  }, [html]);
  function change(action) {
    const next = updatePlaygroundSelection(available, selection, action);
    if (JSON.stringify(next.state) === JSON.stringify(selection)) { setAnnouncement(next.message); return; }
    // Stop the outgoing context before React replaces its document.
    frame.current?.contentWindow?.postMessage({ type: 'rockwall-destroy' }, '*');
    if (next.state.scene !== scene) { setFilter('All'); setSearch(''); }
    savePlaygroundSession(available, next.state); setSelection(next.state); setAnnouncement(next.message);
  }
  const toggle = (id) => change({ type: 'toggle', id });
  const { visible, groups } = playgroundCatalog(available, scene, filter, search);
  return <>
    <div className="playground-scene-tabs" role="group" aria-label="Playback scene">{PLAYGROUND_SCENES.map((value) => <button key={value} aria-pressed={scene === value} onClick={() => change({ type: 'scene', scene: value })}>{sceneLabel(value)}</button>)}</div>
    <p role="status" className="playground-status" aria-atomic="true">{announcement}</p>
    <div className="playground-selection-heading"><div><h2>Choose your fireworks</h2><p>Choose up to 4 for this scene.</p></div></div>
    <div className="playground-summary" aria-label="Selected fireworks">{selected.map((id) => { const p = available.find((p) => p.productId === id); return <div className="playground-chip" key={id}><span>{p.name}</span><button onClick={() => toggle(id)} aria-label={`Remove ${p.name} from selection`}>×</button></div>; })}<button className="playground-clear" disabled={!selected.length} onClick={() => change({ type: 'clear' })}>Clear active selection</button></div>
    <div className="playground-filters"><div role="group" aria-label="Filter available demonstrations">{groups.map(({ name, count }) => <button key={name} aria-pressed={filter === name} onClick={() => setFilter(name)}>{name} <span>{count}</span></button>)}</div><label className="sr-only" htmlFor="playground-search">Search available fireworks</label><input id="playground-search" type="search" value={search} placeholder={`Search ${sceneLabel(scene)}`} onChange={(e) => setSearch(e.target.value)}/>{(filter !== 'All' || search) && <button onClick={() => { setFilter('All'); setSearch(''); }}>Clear filters</button>}<span>{visible.length} available</span></div>
    <ProductRail resetKey={`${scene}:${filter}:${search}`}>{visible.map((profile) => {
      const product = products.find((p) => p.id === profile.productId);
      const checked = selected.includes(product.id);
      return <button type="button" key={product.id} className={`playground-product ${checked ? 'is-selected' : ''}`} aria-pressed={checked} aria-label={`${checked ? 'Deselect' : 'Select'} ${product.name}`} onClick={() => toggle(product.id)}>
        <span className="playground-check" aria-hidden="true">{checked ? '✓' : '+'}</span><img src={product.image} width="100" height="100" alt="" loading="lazy"/><span className="playground-category">{product.category}</span><strong>{product.name}</strong>{profile.kind.endsWith('sample') && <small>{profile.kind === 'shell-sample' ? 'Shell sample' : profile.sampleLabel}</small>}
      </button>;
    })}</ProductRail>{!visible.length && <p>No matches in this scene. Clear filters to see its fireworks.</p>}
    <div className="playground-stage-shell"><iframe key={`${selected.join(',')}:${scene}`} ref={frame} title="Fireworks playground and playback controls" srcDoc={html} sandbox="allow-scripts" className="playground-frame" /></div>
    <p className="playground-disclaimer">Illustrative simulation based on product demonstrations. Actual effects, colors, timing, apparent size and sound may vary. Not to scale.</p>
    {selected.length > 0 && <section className="playground-actions" aria-label="Selected product actions"><h3>Your active fireworks</h3>{selected.map((id) => { const profile = available.find((p) => p.productId === id); const product = products.find((p) => p.id === id); return <div key={id}><strong>{product.name}</strong><span>{durationLabel(profile)}</span><Link to={`/products/${product.slug}`}>Product details</Link><Link to={productVideoPath(product)}>Watch the reference</Link><button onClick={() => { add(product); setAnnouncement(`${product.name} added to My List.`); }}>+ My List</button></div>; })}</section>}
    {error && <p role="alert">{error}</p>}
  </>;
}
