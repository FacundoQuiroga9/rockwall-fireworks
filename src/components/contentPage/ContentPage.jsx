import './ContentPage.css';

export const ContentSection = ({ children, title }) => (
  <section className="content-section">
    <h2>{title}</h2>
    {children}
  </section>
);

const ContentPage = ({ children, description, eyebrow, title }) => (
  <article className="content-page">
    <header className="content-page__header">
      {eyebrow ? <p className="content-page__eyebrow">{eyebrow}</p> : null}
      <h1>{title}</h1>
      <p className="content-page__description">{description}</p>
    </header>

    <div className="content-page__body">{children}</div>
  </article>
);

export default ContentPage;
