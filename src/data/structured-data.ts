export const legalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  name: 'Lex Duo',
  alternateName: ['Адвокати Кушніренко', 'Кушніренко', 'Kushnirenko'],
  serviceType: 'Юридичні послуги',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Юридичні послуги Lex Duo',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Кримінальне право',
          description: 'Захист у кримінальних справах, представництво в суді'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Цивільне право',
          description: 'Представництво в цивільних справах, договірне право'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Військове право',
          description: 'Юридична допомога військовослужбовцям, мобілізація'
        }
      }
      // Add more services as needed
    ]
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Київ',
    addressCountry: 'UA',
    addressRegion: 'Київ'
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '25',
    bestRating: '5'
  }
};
