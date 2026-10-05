/**
 * The two advocates of the firm, as they are filed in the bar registry.
 *
 * Every field here is transcribed from the Unified Register of Advocates of Ukraine
 * (ЄРАУ) and must keep matching it. The registry mirrors — uadvokat.com.ua,
 * ProAdvokat.com.ua, kmkdka.radaadvokativ.com.ua — already outrank this site for
 * "кушніренко адвокат", so the certificate numbers, issuing body and address are what
 * let Google recognise those listings and this domain as the same two people. A
 * paraphrase or a rounded date breaks that match.
 */
export interface Advocate {
  /** Stable fragment used to build the Person @id and the page anchor. */
  id: string;
  /** Full ПІБ in the registry's own spelling. */
  fullName: string;
  givenName: string;
  familyName: string;
  patronymic: string;
  /** Latin transliteration, so the entity also resolves for Latin-script queries. */
  latinName: string;
  jobTitle: string;
  role: "founder" | "partner";
  /**
   * Свідоцтво про право на заняття адвокатською діяльністю. `issuedBy` is the
   * nominative name of the issuing body; `issuedByInstrumental` is the same name in
   * the instrumental case, because the sentence it lands in reads "видане <ким>" and
   * Ukrainian inflects there — "видане Рада адвокатів" is wrong, "видане Радою
   * адвокатів" is right, and the ending cannot be derived reliably in code.
   */
  certificate: {
    number: string;
    date: string;
    issuedBy: string;
    issuedByInstrumental: string;
  };
  /** Рада адвокатів, where the advocate's right to practise is registered. */
  barCouncil: string;
  specializations: string[];
  bio: string;
  /** Registry pages that describe this same person — the sameAs evidence trail. */
  registryUrls: string[];
  /** Contact listed against this advocate in the registry, where one is published. */
  registryEmail?: string;
}

export const advocates: Advocate[] = [
  {
    id: "valeriy-kushnirenko",
    fullName: "Кушніренко Валерій Ісайович",
    givenName: "Валерій",
    familyName: "Кушніренко",
    patronymic: "Ісайович",
    latinName: "Valeriy Kushnirenko",
    jobTitle: "Адвокат, керуючий партнер",
    role: "founder",
    certificate: {
      number: "289",
      date: "2020-01-13",
      issuedBy: "Рада адвокатів міста Києва",
      issuedByInstrumental: "Радою адвокатів міста Києва",
    },
    barCouncil: "Рада адвокатів міста Києва",
    specializations: [
      "Кримінальне право",
      "Військове право",
      "Господарські спори",
      "Адміністративні справи",
    ],
    bio:
      "Керуючий партнер адвокатського об'єднання «Кушніренко і партнери». Веде кримінальні провадження на всіх стадіях — від затримання до касації, а також справи військовослужбовців та господарські спори. Представляє інтереси клієнтів у судах усіх інстанцій.",
    registryUrls: [
      "https://uadvokat.com.ua/reestr/kiev/kiev/kushnirenko-valeriy-isayovich.html",
    ],
  },
  {
    id: "iryna-kushnirenko",
    fullName: "Кушніренко Ірина Олександрівна",
    givenName: "Ірина",
    familyName: "Кушніренко",
    patronymic: "Олександрівна",
    latinName: "Iryna Kushnirenko",
    jobTitle: "Адвокат, партнер",
    role: "partner",
    certificate: {
      number: "417",
      date: "2007-07-17",
      issuedBy: "Луганська обласна КДКА",
      issuedByInstrumental: "Луганською обласною КДКА",
    },
    barCouncil: "Рада адвокатів міста Києва",
    specializations: [
      "Цивільне право",
      "Сімейне право",
      "Спадкові справи",
      "Справи про ДТП",
    ],
    bio:
      "Адвокат із практикою з 2007 року, партнер адвокатського об'єднання «Кушніренко і партнери». Спеціалізується на цивільних і сімейних справах — розлучення, поділ майна, аліменти, спадщина — та на захисті учасників ДТП і спорах зі страховими компаніями.",
    registryUrls: [
      "https://uadvokat.com.ua/reestr/kiev/kiev/kushnirenko-irina-oleksandrivna.html",
    ],
    registryEmail: "adv.kushnir@gmail.com",
  },
];

export function getAdvocate(id: string): Advocate | undefined {
  return advocates.find((a) => a.id === id);
}

/** Readable form of the certificate line, used in the page copy and in the schema. */
export function certificateLine(a: Advocate): string {
  const [y, m, d] = a.certificate.date.split("-");
  return `Свідоцтво про право на заняття адвокатською діяльністю № ${a.certificate.number} від ${d}.${m}.${y}, видане ${a.certificate.issuedByInstrumental}`;
}
