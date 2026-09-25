import { useEffect } from 'react';
import { siteConfig } from '../config/siteConfig';

const getOrCreateMeta = (attribute, name) => {
  const selector = `meta[${attribute}="${name}"]`;
  const existingMeta = document.head.querySelector(selector);
  if (existingMeta) return existingMeta;

  const meta = document.createElement('meta');
  meta.setAttribute(attribute, name);
  document.head.append(meta);
  return meta;
};

const getOrCreateCanonical = () => {
  const existingCanonical = document.head.querySelector(
    'link[rel="canonical"]',
  );
  if (existingCanonical) return existingCanonical;

  const canonical = document.createElement('link');
  canonical.rel = 'canonical';
  document.head.append(canonical);
  return canonical;
};

export const usePageMetadata = ({ description, path, title, image, noindex = false }) => {
  useEffect(() => {
    const canonicalUrl = new URL(path, siteConfig.url).href;
    const socialImageUrl = new URL(
      image || siteConfig.seo.socialImage,
      siteConfig.url,
    ).href;

    document.title = title;
    getOrCreateCanonical().href = canonicalUrl;

    [
      ['name', 'description', description],
      ['name', 'robots', noindex ? 'noindex, follow' : 'index, follow'],
      ['property', 'og:title', title],
      ['property', 'og:description', description],
      ['property', 'og:url', canonicalUrl],
      ['property', 'og:image', socialImageUrl],
      ['property', 'og:image:alt', image ? title : 'Rockwall Fireworks'],
      ['name', 'twitter:title', title],
      ['name', 'twitter:description', description],
      ['name', 'twitter:image', socialImageUrl],
      ['name', 'twitter:image:alt', image ? title : 'Rockwall Fireworks'],
    ].forEach(([attribute, name, content]) => {
      getOrCreateMeta(attribute, name).content = content;
    });
    // Product photographs have different source dimensions from the home social card.
    for (const key of ['og:image:width', 'og:image:height']) {
      document.head.querySelector(`meta[property="${key}"]`)?.remove();
    }
  }, [description, path, title, image, noindex]);
};
