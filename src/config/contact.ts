export const contact = {
  phoneDisplay: "+380 67 643 8000",
  phoneHref: "tel:+380676438000",
  email: "info@lexduo.com.ua",
  emailHref: "mailto:info@lexduo.com.ua",
  telegram: "https://t.me/kushnirenko33",
  // Must match the address in the bar registry (ЄРАУ/КМКДКА) and the state company
  // register character for character — Google cross-checks the site against those
  // listings, and a mismatched index or missing office number reads as a different
  // business at the same street.
  streetAddress: "вул. Успішна, 28, кв. 42-43",
  addressLocality: "Київ",
  addressDistrict: "Голосіївський район",
  postalCode: "03189",
  addressCountry: "UA",
  // Pin for вул. Успішна, 28 (Теремки-І), not the generic Kyiv city-centre coordinate.
  latitude: 50.3861732,
  longitude: 30.4567894,
  // Second number on the bar-registry record. Not shown in the UI — it exists so the
  // schema advertises the same pair of numbers the registry does, which is one more
  // thing Google can match this domain against those already-ranking listings on.
  registryPhone: "+380676404077",
  openingHours: "Пн–Пт 09:00–18:00",
} as const;
