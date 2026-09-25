import { useState } from 'react';
import './ListGuide.css';

const steps = [
  { title: 'Build your list', text: 'Choose your fireworks and quantities.', icon: <><rect x="9" y="8" width="25" height="29" rx="3" /><path d="m14 18 3 3 6-7M14 29h8M35 24v16M27 32h16" /></> },
  { title: 'Save or print', text: 'Keep it on your phone or download the PDF.', icon: <><path d="M12 7h18l8 8v27H12zM29 7v10h9M18 24h14M18 30h10" /><rect x="32" y="27" width="13" height="19" rx="2" /><path d="M37 41h3" /></> },
  { title: 'Show it in store', text: 'Bring your selection to the counter to help us prepare your purchase.', icon: <><path d="M6 29h40M10 29v14h32V29M29 29V18h12v11" /><rect x="9" y="10" width="13" height="18" rx="2" /><path d="m12 17 2 2 5-5M14 24h3" /></> },
];
export default function ListGuide() {
  const [expanded, setExpanded] = useState(false);
  return <section className={`list-guide ${expanded ? 'is-expanded' : ''}`} aria-labelledby="list-guide-title"><h2 id="list-guide-title">From inspiration to in store.</h2><button className="list-guide-toggle" type="button" aria-expanded={expanded} aria-controls="list-guide-steps" onClick={() => setExpanded((v) => !v)}>Build. Save. Show in store. <span aria-hidden="true">{expanded ? '−' : '+'}</span></button><ol id="list-guide-steps">
    {steps.map((step, i) => <li key={step.title}><span className="list-guide-art" aria-hidden="true"><svg viewBox="0 0 52 52" width="52" height="52" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{step.icon}</svg><span>{i + 1}</span></span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}
  </ol><p className="list-guide-note">Phone or paper. Your list, your way.</p></section>;
}
