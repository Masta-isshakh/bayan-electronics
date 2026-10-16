import type { Localized } from "./types";

// Company copy for the About, CEO message, Organization and Distributor pages. Source:
// the company's previous website (b-ledtec.com, English and Arabic pages, 2025), lightly
// copy-edited — wording and claims are the company's own, nothing added.

export type TitledText = { id: string; title: Localized; text: Localized };

export const overview: Localized[] = [
  {
    en: "Al Bayan Electronics & LED Technologies is a Qatar-based manufacturer of advanced LED lighting. Our factory was established to meet the growing demand across industrial, commercial, municipal and residential sectors for energy-efficient, reliable and eco-friendly lighting systems.",
    ar: "شركة البيان للإلكترونيات وتقنيات الـ LED شركة تصنيع مقرّها قطر، متخصصة في حلول إضاءة LED المتقدمة. تأسس مصنعنا لتلبية الطلب المتزايد في القطاعات الصناعية والتجارية والبلدية والسكنية على أنظمة إضاءة موفّرة للطاقة وموثوقة وصديقة للبيئة.",
  },
  {
    en: "We don’t just produce lighting products — we deliver lighting solutions tailored to our clients’ needs, with a focus on quality, innovation and sustainability. Our skilled and diverse team is driven by continuous improvement and committed to staying at the forefront of LED technology.",
    ar: "نحن لا ننتج منتجات إضاءة فحسب، بل نقدّم حلول إضاءة مصممة خصيصاً لاحتياجات عملائنا، مع التركيز على الجودة والابتكار والاستدامة. يعمل فريقنا الماهر والمتنوع على التحسين المستمر، ويلتزم بالبقاء في طليعة تكنولوجيا الـ LED.",
  },
];

export const offer: { lead: Localized; items: Localized[]; custom: Localized } = {
  lead: {
    en: "We manufacture and supply a wide range of LED lighting, including:",
    ar: "نصنّع ونورّد مجموعة واسعة من منتجات إضاءة LED، منها:",
  },
  items: [
    { en: "Industrial lighting", ar: "الإضاءة الصناعية" },
    { en: "Commercial lighting", ar: "الإضاءة التجارية" },
    { en: "Street and municipal lighting", ar: "إنارة الشوارع والإضاءة البلدية" },
    { en: "Residential and decorative lighting", ar: "الإضاءة السكنية والزخرفية" },
    { en: "Smart lighting control systems", ar: "أنظمة التحكم الذكي في الإضاءة" },
  ],
  custom: {
    en: "We also specialise in customised LED solutions, built to the specific requirements of different projects and industries.",
    ar: "ونتخصص أيضاً في حلول LED مخصّصة، تُصنع وفق المتطلبات المحددة لمختلف المشاريع والقطاعات.",
  },
};

export const differentiators: Localized[] = [
  { en: "High-quality production to international standards", ar: "إنتاج عالي الجودة وفق المعايير الدولية" },
  { en: "Low energy consumption", ar: "استهلاك منخفض للطاقة" },
  { en: "Flexible designs for different environments", ar: "تصميمات مرنة لمختلف البيئات" },
  { en: "Advanced lighting control technologies", ar: "تقنيات متقدمة للتحكم في الإضاءة" },
  { en: "Fast response to market and custom project needs", ar: "استجابة سريعة لاحتياجات السوق والمشاريع الخاصة" },
];

export const mission: Localized = {
  en: "We empower our clients with advanced, cost-effective electronics and LED lighting solutions that improve performance and promote sustainable growth.",
  ar: "نمكّن عملاءنا من خلال حلول إلكترونية وحلول إضاءة LED متطورة وفعّالة من حيث التكلفة، تحسّن الأداء وتعزّز النمو المستدام.",
};

export const vision: Localized = {
  en: "To be the preferred brand in electronics and LED lighting across the MENA region.",
  ar: "أن نكون العلامة التجارية المفضّلة في مجال الإلكترونيات وإضاءة LED في منطقة الشرق الأوسط وشمال أفريقيا.",
};

export const values: TitledText[] = [
  {
    id: "quality",
    title: { en: "Quality", ar: "الجودة" },
    text: {
      en: "We adhere to the highest standards in manufacturing and testing.",
      ar: "نلتزم بأعلى المعايير في التصنيع والاختبار.",
    },
  },
  {
    id: "integrity",
    title: { en: "Integrity", ar: "النزاهة" },
    text: { en: "Transparency and honesty guide everything we do.", ar: "الشفافية والصدق في كل ما نقوم به." },
  },
  {
    id: "customer-focus",
    title: { en: "Customer focus", ar: "التركيز على العملاء" },
    text: {
      en: "Our clients’ satisfaction is at the heart of our business.",
      ar: "رضا عملائنا في صميم عملنا.",
    },
  },
  {
    id: "trust",
    title: { en: "Trust", ar: "الثقة" },
    text: {
      en: "We build lasting relationships based on mutual trust.",
      ar: "نبني علاقات دائمة قائمة على الثقة المتبادلة.",
    },
  },
  {
    id: "teamwork",
    title: { en: "Teamwork", ar: "العمل الجماعي" },
    text: { en: "We succeed together as one team.", ar: "ننجح معاً كفريق واحد." },
  },
  {
    id: "growth",
    title: { en: "Growth", ar: "النمو" },
    text: {
      en: "We embrace innovation and continuous improvement.",
      ar: "نتبنّى الابتكار والتحسين المستمر.",
    },
  },
];

export const ceoMessage: { paragraphs: Localized[]; signature: Localized } = {
  paragraphs: [
    {
      en: "At Al Bayan Electronics & LED Technologies, we believe lighting is more than a product. It is a message of sustainability, innovation and a better quality of life.",
      ar: "نؤمن في شركة البيان للإلكترونيات وتقنيات الـ LED بأن الإضاءة أكثر من مجرد منتج؛ إنها رسالة استدامة وابتكار وتحسين لجودة الحياة.",
    },
    {
      en: "Our manufacturing philosophy is built on a clear vision: to deliver high-quality, energy-efficient LED lighting that serves a wide range of sectors, from industrial and commercial to municipal and residential. We are committed to environmentally friendly products, diverse lighting tones and intelligent control technologies tailored to modern infrastructure.",
      ar: "ترتكز فلسفة التصنيع لدينا على رؤية واضحة: تقديم حلول إضاءة LED عالية الجودة وموفّرة للطاقة تخدم مجموعة واسعة من القطاعات، من القطاعين الصناعي والتجاري إلى القطاعين البلدي والسكني. ونلتزم بتقديم منتجات صديقة للبيئة ودرجات إضاءة متنوعة وتقنيات تحكم ذكية مصممة لاحتياجات البنية التحتية الحديثة.",
    },
    {
      en: "We see LED technology as a powerful gateway to the future — not only for its efficiency and economic value, but for its ability to make cities smarter, safer and more sustainable. This belief drives us to keep innovating in both products and processes, so our lighting solutions evolve with our clients’ demands.",
      ar: "ننظر إلى تقنية الـ LED باعتبارها بوابة قوية نحو المستقبل، لا لكفاءتها وقيمتها الاقتصادية فحسب، بل لقدرتها على جعل المدن أكثر ذكاءً وأماناً واستدامة. ويدفعنا هذا الإيمان إلى الابتكار المستمر في المنتجات والعمليات، لنقدّم حلول إضاءة مرنة تتطور مع متطلبات عملائنا.",
    },
    {
      en: "Our goals are closely aligned with Qatar National Vision 2030 and its ambition for a diversified, sustainable economy. As a Qatari manufacturer, we are proud to contribute to that vision by supporting infrastructure development while preserving environmental resources.",
      ar: "تتماشى أهدافنا بعمق مع رؤية قطر الوطنية 2030 التي تطمح إلى بناء اقتصاد متنوع ومستدام. وبصفتنا شركة تصنيع قطرية، نفخر بالمساهمة في تحقيق هذه الرؤية من خلال دعم تطوير البنية التحتية مع الحفاظ على الموارد البيئية.",
    },
    {
      en: "At Al Bayan, our ambition goes beyond manufacturing. We aim to make a positive, lasting difference to people’s daily lives by making environments safer, more comfortable and more efficient through smart lighting.",
      ar: "يتجاوز طموحنا في البيان حدود التصنيع؛ إذ نهدف إلى إحداث أثر إيجابي ودائم في حياة الناس اليومية من خلال جعل البيئات أكثر أماناً وراحة وكفاءة بفضل الإضاءة الذكية.",
    },
    {
      en: "Together, we illuminate the future with innovation, sustainability and a deep commitment to Qatar’s vision.",
      ar: "معاً ننير المستقبل بالابتكار والاستدامة والالتزام العميق برؤية قطر.",
    },
  ],
  signature: {
    en: "Chief Executive Officer, Al Bayan Electronics & LED Technologies",
    ar: "الرئيس التنفيذي، البيان للإلكترونيات وتقنيات الـ LED",
  },
};

export const organization: { intro: Localized; leadership: Localized; departments: TitledText[]; closing: Localized } =
  {
    intro: {
      en: "Our organisational structure is built to support agility, innovation and excellence across every department. Each team plays a vital role in delivering high-quality LED lighting — from concept and production to delivery and after-sales support.",
      ar: "صُمّم هيكلنا التنظيمي لدعم المرونة والابتكار والتميّز في جميع الأقسام. ويؤدي كل فريق دوراً حيوياً في تقديم حلول إضاءة LED عالية الجودة، بدءاً من الفكرة والإنتاج وحتى التسليم ودعم ما بعد البيع.",
    },
    leadership: {
      en: "The company is led by the President & CEO, supported directly by the Vice President – Manufacturing Director, ensuring strategic leadership and operational excellence across the business.",
      ar: "يتولى قيادة الشركة الرئيس والمدير التنفيذي، ويدعمه مباشرةً نائب الرئيس – مدير التصنيع، بما يضمن القيادة الاستراتيجية والتميّز التشغيلي في جميع أنحاء الشركة.",
    },
    departments: [
      {
        id: "internal-audit",
        title: { en: "Internal Audit", ar: "التدقيق الداخلي" },
        text: {
          en: "An independent unit that ensures compliance, accountability and process optimisation across the organisation.",
          ar: "وحدة مستقلة تضمن الامتثال والمساءلة وتحسين العمليات في جميع أنحاء الشركة.",
        },
      },
      {
        id: "administration-hr",
        title: { en: "Administration & HR", ar: "الشؤون الإدارية والموارد البشرية" },
        text: {
          en: "Employee relations, hiring, IT infrastructure and transport logistics — keeping internal operations running smoothly.",
          ar: "علاقات الموظفين والتوظيف والبنية التحتية لتقنية المعلومات ولوجستيات النقل، بما يضمن سلاسة العمليات الداخلية.",
        },
      },
      {
        id: "finance",
        title: { en: "Finance & Accounting", ar: "المالية والمحاسبة" },
        text: {
          en: "Financial planning, budgeting, reporting and accounting, with a focus on transparency and fiscal control.",
          ar: "التخطيط المالي وإعداد الميزانيات والتقارير وجميع الأعمال المحاسبية، مع التركيز على الشفافية والرقابة المالية.",
        },
      },
      {
        id: "supply-chain",
        title: { en: "Supply Chain", ar: "سلسلة التوريد" },
        text: {
          en: "Procurement, warehouse management and logistics, so materials flow efficiently and on time from suppliers to production.",
          ar: "المشتريات وإدارة المستودعات والخدمات اللوجستية، لضمان تدفق المواد بكفاءة وفي الوقت المناسب من الموردين إلى الإنتاج.",
        },
      },
      {
        id: "presales",
        title: { en: "Presales & Technical Support", ar: "ما قبل البيع والدعم الفني" },
        text: {
          en: "Works closely with clients and engineering teams on technical assistance and lighting design proposals, including lux calculations.",
          ar: "يعمل عن قرب مع العملاء والفرق الهندسية لتقديم المساعدة الفنية ومقترحات تصميم الإضاءة، بما في ذلك حسابات شدة الإضاءة (اللوكس).",
        },
      },
      {
        id: "technical-production",
        title: { en: "Technical & Production", ar: "القسم الفني والإنتاج" },
        text: {
          en: "Product design and manufacturing, making sure every unit meets our quality and performance standards.",
          ar: "تصميم المنتجات وتصنيعها، بما يضمن أن كل وحدة تلبي معايير الجودة والأداء لدينا.",
        },
      },
      {
        id: "quality-control",
        title: { en: "Quality Control", ar: "مراقبة الجودة" },
        text: {
          en: "Monitors and verifies product quality through stringent inspection, to local and international standards.",
          ar: "يراقب جودة المنتجات ويتحقق منها من خلال عمليات فحص صارمة وفق المعايير المحلية والدولية.",
        },
      },
      {
        id: "sales-marketing",
        title: { en: "Sales & Marketing", ar: "المبيعات والتسويق" },
        text: {
          en: "Sales, market research, advertising and digital marketing, structured to support B2B and B2C business locally and internationally.",
          ar: "المبيعات وأبحاث السوق والإعلان والتسويق الرقمي، بهيكل يدعم الأعمال مع الشركات والأفراد محلياً ودولياً.",
        },
      },
    ],
    closing: {
      en: "Every department works to the same mission: innovative, sustainable, high-performance LED lighting that contributes to Qatar’s growth and to the global lighting industry.",
      ar: "تعمل جميع الأقسام وفق الرسالة نفسها: حلول إضاءة LED مبتكرة ومستدامة وعالية الأداء تساهم في نمو قطر وفي صناعة الإضاءة العالمية.",
    },
  };

export const distributor: { intro: Localized; benefitsLead: Localized; benefits: Localized[]; closing: Localized } = {
  intro: {
    en: "Partner with B-LED Lighting Technologies and join a network committed to delivering innovative, high-performance LED lighting.",
    ar: "تعاونوا مع B-LED لتقنيات الإضاءة وانضموا إلى شبكة ملتزمة بتقديم حلول إضاءة LED مبتكرة وعالية الأداء.",
  },
  benefitsLead: { en: "As our distributor, you benefit from:", ar: "بصفتكم موزعاً لدينا، تستفيدون من:" },
  benefits: [
    {
      en: "Products customised to your country’s technical and regulatory standards",
      ar: "تخصيص منتجاتنا وفق المعايير الفنية والتنظيمية في بلدكم",
    },
    {
      en: "A dedicated, experienced team that supports you at every step",
      ar: "فريق متفانٍ وذو خبرة يدعمكم في كل خطوة",
    },
    {
      en: "Advanced production facilities and rigorous quality control for consistent products",
      ar: "مرافق إنتاج متطورة وأنظمة صارمة لمراقبة الجودة تضمن ثبات جودة المنتجات",
    },
    {
      en: "Flexible capacity to meet your volume and project demands reliably",
      ar: "طاقة إنتاجية مرنة تلبي متطلبات الكميات والمشاريع بموثوقية وكفاءة",
    },
  ],
  closing: {
    en: "We are looking for long-term partners who share our vision for quality, sustainability and growth.",
    ar: "نبحث عن شركاء على المدى الطويل يشاركوننا رؤيتنا للجودة والاستدامة والنمو.",
  },
};
