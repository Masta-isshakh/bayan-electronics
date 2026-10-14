import { assets } from "./assets";
import type { FamilySlug, SectorSlug } from "./taxonomy";
import type { Confirmable, ImageAsset, Localized } from "./types";

export type Sector = Confirmable & {
  slug: SectorSlug;
  name: Localized;
  line: Localized;
  challenge: Localized;
  approach: Localized;
  products: FamilySlug[];
  image: ImageAsset;
  alt: Localized;
};

export const sectors: Sector[] = [
  {
    slug: "commercial-offices",
    confirm: true,
    name: { en: "Commercial & offices", ar: "المباني التجارية والمكاتب" },
    line: {
      en: "Comfortable, controllable light for workspaces that run all day.",
      ar: "إضاءة مريحة وقابلة للتحكّم لبيئات عمل تعمل طوال اليوم.",
    },
    challenge: {
      en: "Offices run long hours, change layout often and are lit for screen work. Lighting has to be even, comfortable on the eyes and easy to adjust, while keeping energy use down.",
      ar: "تعمل المكاتب لساعات طويلة، وتتغيّر مخططاتها باستمرار، وتعتمد على العمل أمام الشاشات. لذا يجب أن تكون الإضاءة متجانسة ومريحة للعين وسهلة الضبط، مع خفض استهلاك الطاقة.",
    },
    approach: {
      en: "We match panels, linear systems and downlights to the ceiling and layout, add DALI or 0–10V control where it pays back, and test every batch in our own laboratory before it goes to site.",
      ar: "نختار الألواح والأنظمة الخطية والإنارة الغائرة بما يناسب السقف والمخطط، ونضيف التحكّم عبر DALI أو 0–10V حيث يحقق عائداً واضحاً، ونختبر كل دفعة في مختبرنا قبل توريدها إلى الموقع.",
    },
    products: ["led-panels", "linear-batten", "downlights-spotlights", "smart-connected"],
    image: assets.solutions["commercial-offices"],
    alt: { en: "Open-plan office lit by LED panels", ar: "مكتب مفتوح مضاء بألواح LED" },
  },
  {
    slug: "industrial-warehouses",
    confirm: true,
    name: { en: "Industrial & warehouses", ar: "المنشآت الصناعية والمستودعات" },
    line: {
      en: "Robust light for high ceilings, long shifts and tough conditions.",
      ar: "إضاءة متينة للأسقف العالية والورديات الطويلة وظروف التشغيل الصعبة.",
    },
    challenge: {
      en: "High ceilings, heat, dust and round-the-clock shifts make maintenance expensive. Fixtures must hold their output for years with as few interventions as possible.",
      ar: "الأسقف العالية والحرارة والغبار والعمل على مدار الساعة تجعل الصيانة مكلفة. لذلك يجب أن تحافظ وحدات الإنارة على أدائها لسنوات بأقل قدر من التدخل.",
    },
    approach: {
      en: "We specify high-bays, sealed battens and floodlights for the mounting height and environment, check thermal performance in our laboratory, and record each batch so spares and replacements are easy to source.",
      ar: "نحدّد وحدات الأسقف العالية ووحدات الباتن المحكمة والكشافات وفق ارتفاع التركيب وظروف البيئة، ونتحقّق من الأداء الحراري في مختبرنا، ونسجّل كل دفعة لتسهيل توفير قطع الغيار والاستبدال.",
    },
    products: ["high-bay-industrial", "linear-batten", "floodlights-area", "drivers-electronics"],
    image: assets.solutions["industrial-warehouses"],
    alt: { en: "Warehouse aisles under LED high-bay lighting", ar: "ممرات مستودع تحت إنارة LED للأسقف العالية" },
  },
  {
    slug: "infrastructure-roads",
    confirm: true,
    name: { en: "Infrastructure & roads", ar: "البنية التحتية والطرق" },
    line: {
      en: "Roadway and area lighting built for Qatar's heat and a long service life.",
      ar: "إنارة طرق ومساحات مفتوحة مصمّمة لحرارة قطر ولعمر تشغيلي طويل.",
    },
    challenge: {
      en: "Roads, interchanges and public areas need uniform, glare-controlled light, and fixtures that withstand summer temperatures above 45 °C, sand and humidity for many years.",
      ar: "تحتاج الطرق والتقاطعات والمساحات العامة إلى إضاءة متجانسة مع التحكّم في الوهج، ووحدات تتحمّل حرارة الصيف التي تتجاوز 45 درجة مئوية والرمال والرطوبة لسنوات طويلة.",
    },
    approach: {
      en: "We supply street and area luminaires with optics selected for the road class, test ingress protection and thermal behaviour in-house, and keep full traceability from supplier batch to installed fixture.",
      ar: "نورّد وحدات إنارة الشوارع والمساحات المفتوحة بعدسات مختارة وفق فئة الطريق، ونختبر الحماية من الغبار والماء والسلوك الحراري داخل المصنع، ونحافظ على إمكانية التتبّع الكاملة من دفعة المورّد حتى الوحدة المركّبة.",
    },
    products: ["street-roadway", "floodlights-area", "smart-connected", "custom-oem"],
    image: assets.solutions["infrastructure-roads"],
    alt: { en: "Highway interchange lit at night", ar: "تقاطع طرق سريعة مضاء ليلاً" },
  },
  {
    slug: "hospitality",
    confirm: true,
    name: { en: "Hospitality", ar: "الضيافة والفنادق" },
    line: {
      en: "Warm, layered light for hotels, restaurants and guest spaces.",
      ar: "إضاءة دافئة ومتعددة الطبقات للفنادق والمطاعم ومساحات الضيوف.",
    },
    challenge: {
      en: "Hotels and restaurants rely on atmosphere. Light has to be warm, consistent from room to room and adjustable through the day, without visible glare or colour shifts.",
      ar: "تعتمد الفنادق والمطاعم على الأجواء. لذا يجب أن تكون الإضاءة دافئة ومتناسقة بين الغرف وقابلة للتعديل على مدار اليوم، دون وهج ظاهر أو تفاوت في الألوان.",
    },
    approach: {
      en: "We combine downlights, strips in profiles and façade lighting, keep colour temperature consistent across batches, and pre-configure dimming so scenes work from the first day.",
      ar: "نجمع بين الإنارة الغائرة والأشرطة داخل المقاطع وإنارة الواجهات، ونحافظ على ثبات درجة حرارة اللون بين الدفعات، ونهيّئ التعتيم مسبقاً لتعمل المشاهد الضوئية من اليوم الأول.",
    },
    products: ["downlights-spotlights", "led-strips-profiles", "facade-architectural", "smart-connected"],
    image: assets.solutions.hospitality,
    alt: { en: "Hotel lobby with warm accent lighting", ar: "ردهة فندق بإضاءة إبراز دافئة" },
  },
  {
    slug: "retail-malls",
    confirm: true,
    name: { en: "Retail & malls", ar: "متاجر التجزئة ومراكز التسوق" },
    line: {
      en: "Light that sells: accurate colour, clear accents, low running cost.",
      ar: "إضاءة تدعم البيع: ألوان دقيقة وإبراز واضح وتكلفة تشغيل منخفضة.",
    },
    challenge: {
      en: "Shoppers judge products by how they look under the light. Retail spaces need accurate colour rendering, flexible accents and fixtures that run long hours at low cost.",
      ar: "يحكم المتسوّقون على المنتجات من خلال مظهرها تحت الضوء. لذا تحتاج مساحات البيع إلى تجسيد دقيق للألوان وإبراز مرن ووحدات تعمل لساعات طويلة بتكلفة منخفضة.",
    },
    approach: {
      en: "We select spots and linear systems for colour rendering and beam angle, and supply matched batches so every store in a mall reads the same.",
      ar: "نختار الكشافات والأنظمة الخطية وفق مؤشر تجسيد الألوان وزاوية الإشعاع، ونورّد دفعات متطابقة ليظهر كل متجر في المركز بالمستوى نفسه.",
    },
    products: ["downlights-spotlights", "linear-batten", "led-strips-profiles", "led-panels"],
    image: assets.solutions["retail-malls"],
    alt: { en: "Shopping mall concourse with linear lighting", ar: "ممر مركز تسوق بإضاءة خطية" },
  },
  {
    slug: "education-healthcare",
    confirm: true,
    name: { en: "Education & healthcare", ar: "التعليم والرعاية الصحية" },
    line: {
      en: "Calm, even light for classrooms, wards and clinics.",
      ar: "إضاءة هادئة ومتجانسة للفصول الدراسية وأجنحة المرضى والعيادات.",
    },
    challenge: {
      en: "Schools and clinics need comfortable, flicker-free light that supports concentration and care, in fixtures that are easy to clean and maintain.",
      ar: "تحتاج المدارس والعيادات إلى إضاءة مريحة خالية من الوميض تدعم التركيز والرعاية، في وحدات سهلة التنظيف والصيانة.",
    },
    approach: {
      en: "We specify panels and linear luminaires for even, low-glare light, check driver performance in our laboratory, and document every delivery for facility managers.",
      ar: "نحدّد الألواح والوحدات الخطية لإضاءة متجانسة منخفضة الوهج، ونتحقّق من أداء المشغّلات في مختبرنا، ونوثّق كل توريد لمديري المرافق.",
    },
    products: ["led-panels", "linear-batten", "downlights-spotlights", "smart-connected"],
    image: assets.solutions["education-healthcare"],
    alt: { en: "Bright classroom with ceiling panels", ar: "فصل دراسي مضاء بألواح سقفية" },
  },
  {
    slug: "sports-outdoor",
    confirm: true,
    name: { en: "Sports & outdoor", ar: "المنشآت الرياضية والمساحات الخارجية" },
    line: {
      en: "Floodlighting and outdoor lighting for pitches, courts and parks.",
      ar: "كشافات وإنارة خارجية للملاعب والساحات والحدائق.",
    },
    challenge: {
      en: "Pitches, courts and parks need controlled, uniform light with minimal spill, from fixtures that survive heat, wind-blown sand and night-time humidity.",
      ar: "تحتاج الملاعب والساحات والحدائق إلى إضاءة متجانسة ومضبوطة بأقل تسرّب ضوئي، من وحدات تتحمّل الحرارة والرمال والرطوبة الليلية.",
    },
    approach: {
      en: "We select floodlights and optics for the playing area, test sealing and thermal performance in-house, and coordinate aiming and controls with your consultant.",
      ar: "نختار الكشافات والعدسات وفق مساحة اللعب، ونختبر إحكام الإغلاق والأداء الحراري داخل المصنع، وننسّق توجيه الوحدات وأنظمة التحكّم مع استشاريكم.",
    },
    products: ["floodlights-area", "high-bay-industrial", "smart-connected", "street-roadway"],
    image: assets.solutions["sports-outdoor"],
    alt: { en: "Floodlit sports pitch at night", ar: "ملعب رياضي مضاء بالكشافات ليلاً" },
  },
  {
    slug: "residential-villas",
    confirm: true,
    name: { en: "Residential & villas", ar: "المجمعات السكنية والفلل" },
    line: {
      en: "Comfortable light for homes, compounds and private villas.",
      ar: "إضاءة مريحة للمنازل والمجمعات السكنية والفلل الخاصة.",
    },
    challenge: {
      en: "Homes need warm, comfortable light indoors and discreet, durable lighting outside, often specified across many villas that must look identical.",
      ar: "تحتاج المنازل إلى إضاءة داخلية دافئة ومريحة وإضاءة خارجية متينة وغير لافتة، وغالباً ما تُحدَّد لعدد كبير من الفلل التي يجب أن تبدو متطابقة.",
    },
    approach: {
      en: "We supply downlights, strips and outdoor fixtures from documented batches, so every villa in a compound gets the same light and records are kept for later additions.",
      ar: "نورّد الإنارة الغائرة والأشرطة والوحدات الخارجية من دفعات موثّقة، لتحصل كل فيلا في المجمع على الإضاءة نفسها، مع الاحتفاظ بالسجلات لأي إضافات لاحقة.",
    },
    products: ["downlights-spotlights", "led-strips-profiles", "street-roadway", "facade-architectural"],
    image: assets.solutions["residential-villas"],
    alt: { en: "Villa exterior lit at dusk", ar: "واجهة فيلا مضاءة عند الغسق" },
  },
  {
    slug: "mosques-public",
    confirm: true,
    name: { en: "Mosques & public buildings", ar: "المساجد والمباني العامة" },
    line: {
      en: "Dignified, even light for prayer halls, domes and civic spaces.",
      ar: "إضاءة متجانسة تليق بقاعات الصلاة والقباب والمباني العامة.",
    },
    challenge: {
      en: "Prayer halls and civic buildings need calm, even light, careful treatment of domes and minarets, and fixtures that can be maintained safely at height.",
      ar: "تحتاج قاعات الصلاة والمباني العامة إلى إضاءة هادئة ومتجانسة، ومعالجة دقيقة للقباب والمآذن، ووحدات يمكن صيانتها بأمان على الارتفاعات.",
    },
    approach: {
      en: "We combine interior and façade fixtures, adapt designs through custom manufacturing where needed, and work in Arabic and English with your consultant and contractor.",
      ar: "نجمع بين وحدات الإنارة الداخلية وإنارة الواجهات، ونكيّف التصاميم عند الحاجة من خلال التصنيع حسب الطلب، ونتواصل باللغتين العربية والإنجليزية مع الاستشاري والمقاول.",
    },
    products: ["facade-architectural", "downlights-spotlights", "custom-oem", "led-strips-profiles"],
    image: assets.solutions["mosques-public"],
    alt: { en: "Mosque dome and minaret lit at night", ar: "قبة مسجد ومئذنته مضاءتان ليلاً" },
  },
];

export function getSector(slug: string): Sector | undefined {
  return sectors.find((sector) => sector.slug === slug);
}

export function sectorsBySlugs(slugs: readonly SectorSlug[]): Sector[] {
  return slugs.map((slug) => sectors.find((s) => s.slug === slug)).filter((s): s is Sector => Boolean(s));
}
