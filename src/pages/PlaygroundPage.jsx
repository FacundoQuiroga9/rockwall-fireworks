import { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { playgroundDevice } from '../shared/playgroundDevice';
import { siteConfig } from '../config/siteConfig';
import './PlaygroundPage.css';

const DesktopPlayground = lazy(() => import('../components/playground/DesktopPlayground'));
function device() {
  if (import.meta.env.DEV && ['phone', 'tablet'].includes(new URLSearchParams(location.search).get('previewDevice'))) return 'app-preview';
  return playgroundDevice({ userAgent: navigator.userAgent, platform: navigator.userAgentData?.platform || navigator.platform, mobile: navigator.userAgentData?.mobile, touchPoints: navigator.maxTouchPoints, fine: matchMedia('(any-pointer: fine)').matches, hover: matchMedia('(any-hover: hover)').matches });
}
export default function PlaygroundPage() {
  const [mode, setMode] = useState(device);
  useEffect(() => {
    const pointer = matchMedia('(any-pointer: fine)'); const hover = matchMedia('(any-hover: hover)');
    const update = () => setMode(device()); pointer.addEventListener('change', update); hover.addEventListener('change', update);
    return () => { pointer.removeEventListener('change', update); hover.removeEventListener('change', update); };
  }, []);
  usePageMetadata({ title: 'Fireworks Playground | Rockwall Fireworks', description: 'Explore reviewed fireworks demonstrations in an illustrative Dallas night sky.', path: '/playground' });
  return <main id="main-content" className="playground-page" tabIndex="-1"><div className="shell">
    <header className="playground-heading"><div><p className="eyebrow">Explore the effects</p><h1>Your sky. Your picks.</h1><p>Pick your fireworks. Discover their rhythm, color and character.</p></div><Link to="/my-list">My List →</Link></header>
    {mode === 'desktop' ? <Suspense fallback={<p role="status">Preparing the playground…</p>}><DesktopPlayground /></Suspense> : <section className="playground-app-preview" aria-labelledby="app-preview-title">
      <div className="playground-static-sky" aria-hidden="true"><span className="static-ring"/><span className="static-palm"/><img src="/images/hero/dallas-skyline-800.webp" alt="" width="800" height="268"/><span className="static-caption">Dallas after dark · illustrative preview</span></div>
      <div className="playground-preview-copy"><p className="eyebrow">Made for a bigger sky</p><h2 id="app-preview-title">Explore here on a computer.<br />Take it with you in a future app update.</h2><p>The web playground is available on desktop and laptop browsers. A touch-friendly experience is being prepared for the Rockwall app.</p><p className="playground-release-note">The playground is not yet included in the App Store version. This update is still in local preview.</p><div className="playground-links"><a className="playground-primary" href={siteConfig.mobileApp.appStoreUrl} target="_blank" rel="noopener noreferrer">View current iOS app <span className="sr-only">(opens a new tab)</span>↗</a><span>Android · Coming soon</span></div><Link to="/products">Keep exploring the catalog →</Link></div>
    </section>}
    {mode !== 'desktop' && <p className="playground-disclaimer">Illustrative simulation based on product demonstrations. Actual effects, colors, timing, apparent size and sound may vary. Not to scale.</p>}
    <details className="playground-about"><summary>About this simulation</summary><p>This is a visual approximation. Camera exposure, framing, distance and recording conditions influence the reference. The Dallas skyline is an artistic background, not a firing location or a scale reference. Apparent size and synthesized sound cannot be used to compare physical height or loudness.</p><p>Shell demonstrations show one identified sample from a package, not its entire contents. This experience does not replace product instructions or safety guidance. Only products with reviewed profiles are available here.</p></details>
  </div></main>;
}
