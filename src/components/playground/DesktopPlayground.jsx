import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import products from '../../data/products.json';
import profileData from '../../data/playgroundProfiles.json';
import { buildPlaygroundDocument } from '../../shared/playgroundDocument';
import { filterPlaygroundProfiles, profileGroup, profileScene, sceneProfiles, togglePlaygroundSelection } from '../../shared/playgroundSelection';
import { useMyList } from '../../hooks/useMyList';
import baseAssets from '../../data/playgroundBases.json';
import { durationLabel } from '../../shared/playgroundPresentation';
import { productVideoPath } from '../../utils/productVideo';
const bases = Object.fromEntries(Object.entries(baseAssets).map(([id, base]) => [id, { ...base, src: `${location.origin}${base.src}` }]));
const available = profileData.profiles;
const groups = ['All', ...new Set(available.map(profileGroup))];
export default function DesktopPlayground() {
  const [params] = useSearchParams();
  const initial = available.find((p) => p.productId === params.get('product'));
  const [selected, setSelected] = useState(initial ? [initial.productId] : []);
  const [scene, setScene] = useState(initial ? profileScene(initial) : 'aerial');
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const frame = useRef(null);
  const { add, error } = useMyList();
  const profiles = useMemo(() => sceneProfiles(available, selected, scene), [selected, scene]);
  const html = useMemo(() => buildPlaygroundDocument({ profiles, scene, bases, skyline: `${location.origin}/images/hero/dallas-skyline-2160.webp` }), [profiles, scene]);
  useEffect(() => {
    const pause = () => frame.current?.contentWindow?.postMessage({ type: 'rockwall-pause' }, '*');
    const hidden = () => { if (document.hidden) pause(); };
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) pause(); });
    if (frame.current) observer.observe(frame.current);
    document.addEventListener('visibilitychange', hidden);
    return () => { pause(); observer.disconnect(); document.removeEventListener('visibilitychange', hidden); };
  }, [html]);
  function toggle(id) {
    const next = togglePlaygroundSelection(selected, id);
    if (next.limited) { setAnnouncement('Four selected. Remove a firework before adding another.'); return; }
    setSelected(next.ids); setAnnouncement('Selection updated. Playback reset; press Play selection when ready.');
  }
  const visible = filterPlaygroundProfiles(available, filter, search);
  return <>
    <div className="playground-scene-tabs" role="group" aria-label="Playback scene">{['aerial','ground'].map((value) => <button key={value} aria-pressed={scene === value} onClick={() => { setScene(value); setAnnouncement('Scene changed. Your selections are kept; playback reset.'); }}>{value === 'aerial' ? 'Dallas sky' : 'Fountain field'} <span>{sceneProfiles(available, selected, value).length}</span></button>)}<p>{profiles.length} selected for this scene{selected.length > profiles.length ? ` · ${selected.length - profiles.length} kept in the other scene` : ''}. Scenes play separately.</p></div>
    <div className="playground-stage-shell"><iframe key={`${selected.join(',')}:${scene}`} ref={frame} title="Fireworks playground and playback controls" srcDoc={html} sandbox="allow-scripts" className="playground-frame" /></div>
    <p className="playground-disclaimer">Illustrative simulation based on product demonstrations. Actual effects, colors, timing, apparent size and sound may vary. Not to scale.</p>
    <div className="playground-selection-heading"><div><h2>Choose your fireworks</h2><p>Select up to 4. Each keeps its own rhythm, starting together when you press Play.</p></div><span className="playground-count">{selected.length} of 4 selected</span></div>
    <div className="playground-summary" aria-label="Selected fireworks">{selected.map((id) => { const p = available.find((p) => p.productId === id); return <div className="playground-chip" key={id}><span>{p.name}<small>{profileScene(p) === 'ground' ? 'Fountain field' : 'Dallas sky'}</small></span><button onClick={() => toggle(id)} aria-label={`Remove ${p.name} from selection`}>×</button></div>; })}<button className="playground-clear" disabled={!selected.length} onClick={() => { setSelected([]); setAnnouncement('Selection cleared. Playback stopped.'); }}>Clear selection</button></div>
    <div className="playground-filters"><div role="group" aria-label="Filter available demonstrations">{groups.map((group) => <button key={group} aria-pressed={filter === group} onClick={() => setFilter(group)}>{group}</button>)}</div><label className="sr-only" htmlFor="playground-search">Search available fireworks</label><input id="playground-search" type="search" value={search} placeholder="Search fireworks" onChange={(e) => setSearch(e.target.value)}/>{(filter !== 'All' || search) && <button onClick={() => { setFilter('All'); setSearch(''); }}>Clear filters</button>}<span>{visible.length} available</span></div>
    {selected.length === 4 && <p className="playground-limit">Four selected. Remove one to choose another.</p>}
    <div className="playground-products">{visible.map((profile) => {
      const product = products.find((p) => p.id === profile.productId);
      const checked = selected.includes(product.id);
      return <button type="button" key={product.id} className={`playground-product ${checked ? 'is-selected' : ''}`} aria-pressed={checked} aria-label={`${checked ? 'Deselect' : 'Select'} ${product.name}`} aria-disabled={!checked && selected.length === 4} onClick={() => toggle(product.id)}>
        <span className="playground-check" aria-hidden="true">{checked ? '✓' : '+'}</span><img src={product.image} width="100" height="100" alt="" loading="lazy"/><span className="playground-category">{product.category}</span><strong>{product.name}</strong>{profile.kind.endsWith('sample') && <small>{profile.kind === 'shell-sample' ? 'Shell sample' : profile.kind === 'fountain-sample' ? 'Fountain excerpt' : 'Demo excerpt'}</small>}
      </button>;
    })}</div>{!visible.length && <p>No reviewed demonstrations match. Try All or clear your search.</p>}
    {selected.length > 0 && <section className="playground-actions" aria-label="Selected product actions"><h3>Your selected fireworks</h3>{selected.map((id) => { const profile = available.find((p) => p.productId === id); const product = products.find((p) => p.id === id); return <div key={id}><strong>{product.name}</strong><span>{durationLabel(profile)}</span><Link to={`/products/${product.slug}`}>Product details</Link><Link to={productVideoPath(product)}>Watch the reference</Link><button onClick={() => { add(product); setAnnouncement(`${product.name} added to My List.`); }}>+ My List</button></div>; })}</section>}
    <p role="status" className="playground-status">{announcement}</p>{error && <p role="alert">{error}</p>}
  </>;
}
