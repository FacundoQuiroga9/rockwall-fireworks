import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { seasonalConfig } from '../src/config/seasonalConfig.js';
import { siteConfig } from '../src/config/siteConfig.js';
import {
  getFeaturedProducts,
  getProductCategories,
} from '../src/utils/productData.js';
import { getSeasonalCountdown } from '../src/utils/seasonalCountdown.js';

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const products = JSON.parse(
  await readFile(path.join(projectRoot, 'src/data/products.json'), 'utf8'),
);
const brands = JSON.parse(
  await readFile(path.join(projectRoot, 'src/data/brands.json'), 'utf8'),
);

const assertPublicAssetExists = async (assetPath) => {
  assert.ok(assetPath.startsWith('/'));
  const asset = await readFile(
    path.join(projectRoot, 'public', assetPath),
  );
  assert.ok(asset.byteLength > 0);
};

test('products have unique IDs and valid local image paths', async () => {
  const ids = products.map((product) => product.id);
  assert.equal(new Set(ids).size, products.length);

  for (const product of products) {
    assert.match(product.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(product.name.trim());
    assert.ok(Number.isFinite(product.sortOrder));

    await assertPublicAssetExists(product.image);
    await assertPublicAssetExists(
      product.image.replace(/\.webp$/, '-320.webp'),
    );
    await assertPublicAssetExists(
      product.image.replace(/\.webp$/, '-480.webp'),
    );
  }
});

test('brand and shared commercial assets resolve to local files', async () => {
  assert.equal(new Set(brands.map((brand) => brand.id)).size, brands.length);

  for (const brand of brands) {
    assert.ok(brand.name.trim());
    assert.ok(brand.width > 0);
    assert.ok(brand.height > 0);
    await assertPublicAssetExists(brand.image);
    await assertPublicAssetExists(
      brand.image.replace(/\.webp$/, '-160.webp'),
    );
  }

  await assertPublicAssetExists(siteConfig.promotion.image);
  await assertPublicAssetExists(
    siteConfig.promotion.image.replace(/\.webp$/, '-480.webp'),
  );
  await assertPublicAssetExists(
    siteConfig.promotion.image.replace(/\.webp$/, '-640.webp'),
  );
  await assertPublicAssetExists(siteConfig.promotion.offersUrl);
  await assertPublicAssetExists(siteConfig.seo.socialImage);
  await assertPublicAssetExists(siteConfig.mobileApp.mockupImage);
  await assertPublicAssetExists(siteConfig.mobileApp.appStoreBadge);
  await assertPublicAssetExists(siteConfig.mobileApp.googlePlayBadge);

  for (const paymentMethod of siteConfig.paymentMethods) {
    await assertPublicAssetExists(paymentMethod.image);
  }
});

test('SEO files use real site data and valid structured JSON', async () => {
  const indexHtml = await readFile(
    path.join(projectRoot, 'index.html'),
    'utf8',
  );
  const jsonLdMatch = indexHtml.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  );
  assert.ok(jsonLdMatch);

  const structuredData = JSON.parse(jsonLdMatch[1]);
  assert.equal(structuredData.name, siteConfig.name);
  assert.equal(structuredData.telephone, siteConfig.phone.structured);
  assert.equal(structuredData.email, siteConfig.email);
  assert.equal(
    structuredData.address.streetAddress,
    siteConfig.address.streetAddress,
  );
  assert.equal(structuredData.ratingValue, undefined);
  assert.equal(structuredData.openingHours, undefined);

  const robots = await readFile(
    path.join(projectRoot, 'public/robots.txt'),
    'utf8',
  );
  const sitemap = await readFile(
    path.join(projectRoot, 'public/sitemap.xml'),
    'utf8',
  );
  assert.match(robots, /Sitemap: https:\/\/www\.rockwallfireworks\.com\/sitemap\.xml/);
  assert.match(sitemap, /https:\/\/www\.rockwallfireworks\.com\/terms-and-conditions/);
});

test('app publication pages have routes, metadata, and hidden navigation', async () => {
  const appSource = await readFile(
    path.join(projectRoot, 'src/App.jsx'),
    'utf8',
  );
  const footerSource = await readFile(
    path.join(projectRoot, 'src/components/footer/Footer.jsx'),
    'utf8',
  );
  const metadataSource = await readFile(
    path.join(projectRoot, 'src/hooks/usePageMetadata.js'),
    'utf8',
  );
  const sitemap = await readFile(
    path.join(projectRoot, 'public/sitemap.xml'),
    'utf8',
  );
  const hostingerFallback = await readFile(
    path.join(projectRoot, 'public/.htaccess'),
    'utf8',
  );

  const appPageSeo = [
    siteConfig.seo.terms,
    siteConfig.seo.appPrivacy,
    siteConfig.seo.appSupport,
    siteConfig.seo.mobileApp,
  ];

  for (const pageSeo of appPageSeo) {
    assert.ok(pageSeo.path.startsWith('/'));
    assert.ok(pageSeo.title.trim());
    assert.ok(pageSeo.description.trim());
    assert.match(appSource, new RegExp(`path="${pageSeo.path}"`));
  }

  for (const metadataName of [
    'description',
    'og:title',
    'og:description',
    'og:url',
    'og:image',
    'twitter:title',
    'twitter:description',
    'twitter:image',
  ]) {
    assert.match(metadataSource, new RegExp(`['"]${metadataName}['"]`));
  }

  assert.equal(siteConfig.mobileApp.appStoreUrl, '#');
  assert.equal(siteConfig.mobileApp.googlePlayUrl, '#');
  assert.doesNotMatch(footerSource, /\/mobile-app/);
  assert.doesNotMatch(sitemap, /\/mobile-app/);

  for (const publicPagePath of [
    '/terms-and-conditions',
    '/app-privacy',
    '/app-support',
  ]) {
    assert.match(sitemap, new RegExp(publicPagePath));
  }

  assert.match(hostingerFallback, /RewriteEngine On/);
  assert.match(
    hostingerFallback,
    /RewriteCond %\{REQUEST_FILENAME\} -f \[OR\]/,
  );
  assert.match(
    hostingerFallback,
    /RewriteCond %\{REQUEST_FILENAME\} -d/,
  );
  assert.match(hostingerFallback, /RewriteRule \^ - \[L\]/);
  assert.match(hostingerFallback, /RewriteRule \^ index\.html \[L\]/);
  assert.doesNotMatch(hostingerFallback, /\bR=(?:301|302)\b/);
});

test('featured products are sorted without mutating the source data', () => {
  const originalOrder = products.map((product) => product.id);
  const featuredProducts = getFeaturedProducts(products);

  assert.equal(featuredProducts.length, 10);
  assert.deepEqual(
    featuredProducts.map((product) => product.sortOrder),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  );
  assert.deepEqual(
    products.map((product) => product.id),
    originalOrder,
  );
  assert.deepEqual(getProductCategories(products), [
    'Cakes',
    'Reloadables',
    'Artillery Shells',
    'Assortments',
  ]);
});

test('New Year range remains open on January 1 in the store time zone', () => {
  const januaryFirstInTexas = Date.parse('2026-01-01T12:00:00-06:00');
  const state = getSeasonalCountdown(
    seasonalConfig,
    januaryFirstInTexas,
  );

  assert.equal(state.isOpen, true);
  assert.equal(state.title, "New Year's Eve");
  assert.ok(state.remaining.days >= 0);
  assert.ok(state.remaining.hours >= 0);
  assert.ok(state.remaining.minutes >= 0);
});

test('countdown selects the next configured range without negative values', () => {
  const julyTwentiethInTexas = Date.parse('2026-07-20T12:00:00-05:00');
  const state = getSeasonalCountdown(
    seasonalConfig,
    julyTwentiethInTexas,
  );

  assert.equal(state.isOpen, false);
  assert.equal(state.title, 'Diwali');
  assert.ok(state.target > julyTwentiethInTexas);
  assert.ok(Object.values(state.remaining).every((value) => value >= 0));
});
