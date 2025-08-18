// SEO Configuration for Lex Duo
export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogImage: string;
  ogType: string;
  structuredData?: any;
}

export const defaultSEO: SEOConfig = {
  title: "Lex Duo - Адвокати Кушніренко | Професійна юридична допомога в Києві",
  description: "Lex Duo - професійна адвокатська компанія в Києві. Спеціалізуємося на цивільних, кримінальних та господарських справах. Надаємо комплексну юридичну допомогу, судовий захист та правовий супровід.",
  keywords: "адвокат Київ, адвокатська компанія, юридична допомога, судовий захист, цивільні справи, кримінальні справи, господарські спори, військовий адвокат, юридичні послуги, правовий супровід, адвокатська фірма Київ, адвокат захист, військове право, мобілізація, військовослужбовці, кримінальне право, цивільне право, господарське право, адвокат по кримінальних справах, адвокат по цивільних справах, адвокат по господарських справах, юридична консультація, правова допомога, захист прав, судові спори, адвокатська практика, Lex Duo, Кушніренко, адвокати Кушніренко",
  canonical: "https://lexduo.com.ua",
  ogImage: "/images/hero-1200.webp",
  ogType: "website",
  structuredData: {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "Lex Duo",
    "alternateName": ["Адвокати Кушніренко", "Кушніренко", "Kushnirenko"],
    "url": "https://lexduo.com.ua",
    "description": "Професійна адвокатська компанія в Києві. Спеціалізація: кримінальне право, цивільне право, військове право.",
    "image": "https://lexduo.com.ua/images/hero-1200.webp",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Київ",
      "addressCountry": "UA",
      "addressRegion": "Київ"
    },
    "serviceType": "Юридичні послуги",
    "areaServed": [
      {
        "@type": "Country",
        "name": "Україна"
      },
      {
        "@type": "City",
        "name": "Київ"
      }
    ],
    "availableLanguage": ["uk", "en", "ru"],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["uk", "en", "ru"],
      "serviceArea": "UA"
    }
  }
};

export const pageSEO: Record<string, SEOConfig> = {
  home: {
    title: "Адвокати Кушніренко | Київ - Професійна юридична допомога",
    description: "Адвокати Кушніренко в Києві. Спеціалізація: кримінальне право, цивільне право, військове право. Безкоштовна консультація. Захист прав у суді.",
    keywords: "адвокати Кушніренко, адвокат Київ, кримінальне право, цивільне право, військове право, юридична допомога, судовий захист, мобілізація, військовослужбовці",
    canonical: "https://lexduo.com.ua",
    ogImage: "/images/hero-1200.webp",
    ogType: "website"
  },
  contact: {
    title: "Контакти | Lex Duo - Адвокати в Києві",
    description: "Зв'яжіться з адвокатами Lex Duo для отримання професійної юридичної консультації та допомоги. Кримінальне право, цивільне право, військове право.",
    keywords: "контакти адвоката, юридична консультація, адвокат Київ, Lex Duo, адвокати Кушніренко, кримінальне право, цивільне право, військове право",
    canonical: "https://lexduo.com.ua/contact",
    ogImage: "/images/hero-1200.webp",
    ogType: "website"
  },
  blog: {
    title: "Блог | Lex Duo - Юридичні статті та поради",
    description: "Читайте актуальні юридичні статті, поради та новини від адвокатів Lex Duo. Кримінальне право, цивільні справи, військове право, мобілізація.",
    keywords: "юридичний блог, адвокатські статті, правові поради, кримінальне право, цивільне право, військове право, мобілізація, захист прав",
    canonical: "https://lexduo.com.ua/blog",
    ogImage: "/images/hero-1200.webp",
    ogType: "website"
  },
  thankYou: {
    title: "Дякуємо за звернення | Lex Duo",
    description: "Дякуємо за ваше звернення до адвокатської компанії Lex Duo. Ми зв'яжемося з вами найближчим часом.",
    keywords: "дякуємо, звернення, адвокатська компанія, Lex Duo, юридична допомога",
    canonical: "https://lexduo.com.ua/thank-you",
    ogImage: "/images/hero-1200.webp",
    ogType: "website"
  }
};

// Generate meta tags for a page
export function generateMetaTags(config: SEOConfig, url: string) {
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    canonical: config.canonical,
    ogTitle: config.title,
    ogDescription: config.description,
    ogImage: `${url}${config.ogImage}`,
    ogType: config.ogType,
    ogUrl: config.canonical,
    twitterCard: "summary_large_image",
    twitterTitle: config.title,
    twitterDescription: config.description,
    twitterImage: `${url}${config.ogImage}`,
    structuredData: config.structuredData
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbs(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

// Generate FAQ structured data
export function generateFAQ(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// Generate local business structured data
export function generateLocalBusiness(config: any) {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": config.name,
    "description": config.description,
    "url": config.url,
    "telephone": config.telephone,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": config.city,
      "addressCountry": config.country,
      "addressRegion": config.region
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": config.latitude,
      "longitude": config.longitude
    },
    "openingHours": config.openingHours,
    "priceRange": config.priceRange,
    "paymentAccepted": config.paymentAccepted,
    "currenciesAccepted": config.currenciesAccepted,
    "areaServed": config.areaServed,
    "availableLanguage": config.availableLanguage
  };
}
