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

export const usePageMetadata = ({ description, path, title }) => {
  useEffect(() => {
    const canonicalUrl = new URL(path, siteConfig.url).href;
    const socialImageUrl = new URL(
      siteConfig.seo.socialImage,
      siteConfig.url,
    ).href;

    document.title = title;
    getOrCreateCanonical().href = canonicalUrl;

    [
      ['name', 'description', description],
      ['property', 'og:title', title],
      ['property', 'og:description', description],
      ['property', 'og:url', canonicalUrl],
      ['property', 'og:image', socialImageUrl],
      ['name', 'twitter:title', title],
      ['name', 'twitter:description', description],
      ['name', 'twitter:image', socialImageUrl],
    ].forEach(([attribute, name, content]) => {
      getOrCreateMeta(attribute, name).content = content;
    });
  }, [description, path, title]);
};
