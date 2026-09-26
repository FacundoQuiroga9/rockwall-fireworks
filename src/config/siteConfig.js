export const siteConfig = {
  name: 'Rockwall Fireworks',
  url: 'https://www.rockwallfireworks.com',
  description:
    'Family-owned fireworks store proudly serving Rockwall, Texas since 1975.',
  seo: {
    socialImage: '/images/social/rockwall-fireworks-og.jpg',
    home: {
      path: '/',
      title: 'Rockwall Fireworks | Serving Rockwall, Texas Since 1975',
      description:
        'Serving Rockwall, Texas since 1975 with family-friendly service, low prices, and a wide selection of fireworks. Plan your visit to Rockwall Fireworks.',
    },
    terms: {
      path: '/terms-and-conditions',
      title: 'Terms & Conditions | Rockwall Fireworks',
      description:
        'Read the terms and conditions for using the informational Rockwall Fireworks mobile app.',
    },
    appPrivacy: {
      path: '/app-privacy',
      title: 'App Privacy Policy | Rockwall Fireworks',
      description:
        'Learn how the Rockwall Fireworks mobile app handles favorites, local storage, external links, and privacy.',
    },
    appSupport: {
      path: '/app-support',
      title: 'Mobile App Support | Rockwall Fireworks',
      description:
        'Get official support for the Rockwall Fireworks mobile app, find answers to common questions, and contact the store.',
    },
    mobileApp: {
      path: '/mobile-app',
      title: 'Rockwall Fireworks Mobile App | Official App',
      description:
        'Plan your next celebration in Rockwall, Texas with the Rockwall Fireworks app: product catalog, favorites, seasonal dates, store information, and safety guidance.',
    },
  },
  announcement: 'No tariff tax guaranteed',
  navigation: [
    { label: 'Home', sectionId: 'top' },
    { label: 'Products', path: '/products' },
    { label: 'Playground', path: '/playground' },
    { label: 'About', sectionId: 'about' },
    { label: 'Contact', sectionId: 'contact' },
  ],
  address: {
    streetAddress: '10489 State Hwy 205',
    addressLocality: 'Lavon',
    addressRegion: 'TX',
    postalCode: '75166',
    addressCountry: 'US',
    display: '10489 State Hwy 205, Lavon, TX 75166',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=10489+State+Hwy+205,+Lavon,+TX+75166',
  },
  phone: {
    display: '(214) 471-3434',
    href: 'tel:+12144713434',
    structured: '+1-214-471-3434',
  },
  email: 'contact@rockwallfireworks.com',
  mobileApp: {
    mockupImage: '/images/mobile/rockwall-fireworks-app-mockup-800.webp',
    appStoreBadge: '/images/mobile/store-badges/app-store.svg',
    googlePlayBadge: '/images/mobile/store-badges/google-play.svg',
    appStoreUrl: 'https://apps.apple.com/us/app/id6793552663',
    // Android is not available yet; no placeholder download link.
    googlePlayUrl: null,
  },
  socialLinks: [
    {
      id: 'instagram',
      label: 'Instagram',
      url: 'https://www.instagram.com/rockwallfireworks2/',
    },
    {
      id: 'facebook',
      label: 'Facebook',
      url: 'https://www.facebook.com/rockwallfireworksllc',
    },
  ],
  openHoursText: '8am - 12am',
  promotion: {
    image: '/images/promotion/50th-anniversary-offers.webp',
    imageAlt: 'Rockwall Fireworks 50th anniversary special offers',
    offersUrl: '/rf coupons.pdf',
  },
  paymentMethods: [
    {
      id: 'american-express',
      name: 'American Express',
      image: '/images/payments/amex.webp',
      width: 128,
      height: 128,
    },
    {
      id: 'visa',
      name: 'Visa',
      image: '/images/payments/visa.webp',
      width: 192,
      height: 62,
    },
    {
      id: 'mastercard',
      name: 'Mastercard',
      image: '/images/payments/mastercard.webp',
      width: 128,
      height: 79,
    },
  ],
  developer: {
    name: 'Bondi Code',
    url: 'https://bondicode.com/',
  },
};
