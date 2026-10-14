import { pending } from "@/lib/placeholder";
import { assets } from "./assets";
import type { FamilySlug, ProductCategory, SectorSlug, SpecKey } from "./taxonomy";
import type { Confirmable, ImageAsset, Localized } from "./types";

export type Download = { id: string; label: Localized; href: string };

export type ProductFamily = Confirmable & {
  slug: FamilySlug;
  /** Bento tile size on the home page. */
  tile: "large" | "medium" | "small";
  categories: ProductCategory[];
  name: Localized;
  descriptor: Localized;
  intro: Localized;
  image: ImageAsset;
  alt: Localized;
  /** Two specification rows revealed on the bento tile. */
  chips: [SpecKey, SpecKey];
  specs: Record<SpecKey, string>;
  applications: SectorSlug[];
  related: FamilySlug[];
  downloads: Download[];
};

const specLabels: Record<SpecKey, string> = {
  efficacy: "luminous efficacy (lm/W)",
  cct: "CCT options (K)",
  cri: "colour rendering index (CRI)",
  ipik: "IP / IK rating",
  power: "power range (W)",
  warranty: "warranty period",
};

function pendingSpecs(family: string): Record<SpecKey, string> {
  return Object.fromEntries(
    Object.entries(specLabels).map(([key, label]) => [key, pending(`${label} — ${family}`)]),
  ) as Record<SpecKey, string>;
}

function pendingDownloads(family: string): Download[] {
  return [
    { id: "datasheet", label: { en: "Datasheet", ar: "النشرة الفنية" }, href: pending(`datasheet PDF — ${family}`) },
    { id: "catalogue", label: { en: "Catalogue", ar: "الكتالوج" }, href: pending(`catalogue PDF — ${family}`) },
  ];
}

export const products: ProductFamily[] = [
  {
    slug: "led-panels",
    confirm: true,
    tile: "large",
    categories: ["indoor"],
    name: { en: "LED panels & troffers", ar: "ألواح LED ووحدات التروفر" },
    descriptor: {
      en: "Recessed and suspended panels for offices, schools and clinics.",
      ar: "ألواح غائرة ومعلّقة للمكاتب والمدارس والعيادات.",
    },
    intro: {
      en: "Flat panels and troffers for grid, plaster and suspended ceilings. Built for the long operating hours of offices, classrooms and clinics, and tested in our own laboratory before dispatch.",
      ar: "ألواح ووحدات تروفر مسطّحة للأسقف الشبكية والجبسية والمعلّقة. مصمّمة لساعات التشغيل الطويلة في المكاتب والفصول الدراسية والعيادات، وتُختبر في مختبرنا قبل الشحن.",
    },
    image: assets.products["led-panels"],
    alt: { en: "LED panel luminaire", ar: "وحدة إنارة لوحية LED" },
    chips: ["efficacy", "cri"],
    specs: pendingSpecs("LED panels & troffers"),
    applications: ["commercial-offices", "education-healthcare", "retail-malls"],
    related: ["linear-batten", "downlights-spotlights", "smart-connected"],
    downloads: pendingDownloads("LED panels & troffers"),
  },
  {
    slug: "downlights-spotlights",
    confirm: true,
    tile: "medium",
    categories: ["indoor"],
    name: { en: "Downlights & spotlights", ar: "الإنارة الغائرة والكشافات الموجّهة" },
    descriptor: {
      en: "Recessed downlights and adjustable spots for general and accent light.",
      ar: "إنارة سقفية غائرة وكشافات قابلة للتوجيه للإضاءة العامة وإضاءة الإبراز.",
    },
    intro: {
      en: "Fixed, adjustable and surface-mounted downlights in a range of beam angles and colour temperatures. Used where light has to be precise: lobbies, shops, hotels and homes.",
      ar: "إنارة سقفية ثابتة وقابلة للتوجيه وسطحية بزوايا إشعاع ودرجات حرارة لونية متعددة. تُستخدم حيث تتطلب الإضاءة دقة عالية: الردهات والمتاجر والفنادق والمنازل.",
    },
    image: assets.products["downlights-spotlights"],
    alt: { en: "Recessed LED downlight", ar: "وحدة إنارة سقفية غائرة LED" },
    chips: ["cct", "cri"],
    specs: pendingSpecs("Downlights & spotlights"),
    applications: ["hospitality", "retail-malls", "residential-villas", "commercial-offices"],
    related: ["led-panels", "led-strips-profiles", "smart-connected"],
    downloads: pendingDownloads("Downlights & spotlights"),
  },
  {
    slug: "linear-batten",
    confirm: true,
    tile: "medium",
    categories: ["indoor"],
    name: { en: "Linear & batten luminaires", ar: "الإنارة الخطية ووحدات الباتن" },
    descriptor: {
      en: "Continuous lines and battens for offices, car parks and service areas.",
      ar: "خطوط إضاءة متصلة ووحدات باتن للمكاتب ومواقف السيارات ومناطق الخدمة.",
    },
    intro: {
      en: "Suspended, surface and recessed linear systems that run as continuous lines, plus sealed battens for car parks and plant rooms. Lengths and outputs are configured to the project.",
      ar: "أنظمة خطية معلّقة وسطحية وغائرة تُركَّب كخطوط ضوئية متصلة، إلى جانب وحدات باتن محكمة الإغلاق لمواقف السيارات وغرف المعدات. تُحدَّد الأطوال وشدّة الإضاءة وفق متطلبات كل مشروع.",
    },
    image: assets.products["linear-batten"],
    alt: { en: "Suspended linear LED luminaire", ar: "وحدة إنارة خطية LED معلّقة" },
    chips: ["efficacy", "power"],
    specs: pendingSpecs("Linear & batten luminaires"),
    applications: ["commercial-offices", "industrial-warehouses", "retail-malls"],
    related: ["led-panels", "high-bay-industrial", "smart-connected"],
    downloads: pendingDownloads("Linear & batten luminaires"),
  },
  {
    slug: "high-bay-industrial",
    confirm: true,
    tile: "medium",
    categories: ["indoor"],
    name: { en: "High-bay & industrial luminaires", ar: "إنارة الأسقف العالية والمنشآت الصناعية" },
    descriptor: {
      en: "High-mounting luminaires for warehouses, factories and logistics halls.",
      ar: "وحدات إنارة للتركيب على ارتفاعات عالية في المستودعات والمصانع ومراكز الخدمات اللوجستية.",
    },
    intro: {
      en: "Round and linear high-bays for mounting heights where access is costly and downtime is not an option. Thermal design and driver choice are specified for Qatar's operating temperatures.",
      ar: "وحدات إنارة دائرية وخطية للأسقف العالية، حيث تكون الصيانة مكلفة والتوقف غير مقبول. يُراعى في التصميم الحراري واختيار المشغّل درجات حرارة التشغيل في قطر.",
    },
    image: assets.products["high-bay-industrial"],
    alt: { en: "LED high-bay luminaire in a warehouse", ar: "وحدة إنارة LED للأسقف العالية في مستودع" },
    chips: ["efficacy", "ipik"],
    specs: pendingSpecs("High-bay & industrial luminaires"),
    applications: ["industrial-warehouses", "sports-outdoor", "retail-malls"],
    related: ["linear-batten", "floodlights-area", "drivers-electronics"],
    downloads: pendingDownloads("High-bay & industrial luminaires"),
  },
  {
    slug: "floodlights-area",
    confirm: true,
    tile: "medium",
    categories: ["outdoor"],
    name: { en: "Floodlights & area lighting", ar: "الكشافات وإنارة المساحات المفتوحة" },
    descriptor: {
      en: "Floodlights for yards, car parks, perimeters and building exteriors.",
      ar: "كشافات للساحات ومواقف السيارات والأسوار والواجهات الخارجية.",
    },
    intro: {
      en: "Floodlights and area luminaires with optics for yards, perimeters, car parks and building exteriors. Sealed housings are built for heat, dust and humidity.",
      ar: "كشافات ووحدات إنارة للمساحات المفتوحة بعدسات مناسبة للساحات والأسوار ومواقف السيارات والواجهات الخارجية، بهياكل محكمة الإغلاق مصمّمة لتحمّل الحرارة والغبار والرطوبة.",
    },
    image: assets.products["floodlights-area"],
    alt: { en: "LED floodlight", ar: "كشاف LED" },
    chips: ["ipik", "power"],
    specs: pendingSpecs("Floodlights & area lighting"),
    applications: ["sports-outdoor", "infrastructure-roads", "industrial-warehouses"],
    related: ["street-roadway", "facade-architectural", "high-bay-industrial"],
    downloads: pendingDownloads("Floodlights & area lighting"),
  },
  {
    slug: "street-roadway",
    confirm: true,
    tile: "large",
    categories: ["outdoor"],
    name: { en: "Street & roadway lighting", ar: "إنارة الشوارع والطرق" },
    descriptor: {
      en: "Road luminaires for highways, residential streets and compounds.",
      ar: "وحدات إنارة للطرق السريعة والشوارع السكنية والمجمعات.",
    },
    intro: {
      en: "Street and roadway luminaires with asymmetric optics for highways, local roads and residential compounds. Every batch is recorded, so each fixture on the road can be traced back to how it was made.",
      ar: "وحدات إنارة للشوارع والطرق بعدسات غير متماثلة للطرق السريعة والطرق المحلية والمجمعات السكنية. نسجّل كل دفعة إنتاج، بحيث يمكن تتبّع كل وحدة على الطريق إلى مراحل تصنيعها.",
    },
    image: assets.products["street-roadway"],
    alt: { en: "LED street light on a road at dusk", ar: "وحدة إنارة شوارع LED على طريق عند الغسق" },
    chips: ["efficacy", "ipik"],
    specs: pendingSpecs("Street & roadway lighting"),
    applications: ["infrastructure-roads", "residential-villas", "sports-outdoor"],
    related: ["floodlights-area", "smart-connected", "custom-oem"],
    downloads: pendingDownloads("Street & roadway lighting"),
  },
  {
    slug: "facade-architectural",
    confirm: true,
    tile: "small",
    categories: ["outdoor"],
    name: { en: "Façade & architectural lighting", ar: "إنارة الواجهات والإنارة المعمارية" },
    descriptor: {
      en: "Wall washers, grazers and linear accents that shape buildings at night.",
      ar: "وحدات غسل الجدران وإنارة الإبراز الخطية التي تُظهر ملامح المباني ليلاً.",
    },
    intro: {
      en: "Wall washers, grazers, linear accents and in-ground uplights for façades, minarets and landmarks. Each batch is tested in our own laboratory before it reaches site.",
      ar: "وحدات غسل الجدران والإنارة الملامسة والخطية والكشافات الأرضية للواجهات والمآذن والمعالم. تُختبر كل دفعة في مختبرنا قبل وصولها إلى الموقع.",
    },
    image: assets.products["facade-architectural"],
    alt: { en: "Building façade lit by linear LED wall washers", ar: "واجهة مبنى مضاءة بوحدات غسل جدران خطية LED" },
    chips: ["ipik", "cct"],
    specs: pendingSpecs("Façade & architectural lighting"),
    applications: ["hospitality", "mosques-public", "retail-malls"],
    related: ["led-strips-profiles", "floodlights-area", "custom-oem"],
    downloads: pendingDownloads("Façade & architectural lighting"),
  },
  {
    slug: "led-strips-profiles",
    confirm: true,
    tile: "small",
    categories: ["indoor"],
    name: { en: "LED strips & aluminium profiles", ar: "أشرطة LED ومقاطع الألمنيوم" },
    descriptor: {
      en: "Flexible strips with matching profiles and diffusers for coves and joinery.",
      ar: "أشرطة مرنة مع مقاطع وناشرات ضوء مطابقة للتجاويف السقفية وأعمال النجارة.",
    },
    intro: {
      en: "Flexible strips, aluminium profiles and diffusers supplied as matched systems for coves, shelving, joinery and signage. Cut lengths and connectors are prepared to the drawing.",
      ar: "أشرطة مرنة ومقاطع ألمنيوم وناشرات ضوء تُورَّد كأنظمة متكاملة للتجاويف السقفية والرفوف وأعمال النجارة واللوحات. تُجهَّز الأطوال والوصلات وفق المخططات.",
    },
    image: assets.products["led-strips-profiles"],
    alt: { en: "LED strip in an aluminium profile", ar: "شريط LED داخل مقطع ألمنيوم" },
    chips: ["cct", "power"],
    specs: pendingSpecs("LED strips & aluminium profiles"),
    applications: ["hospitality", "residential-villas", "retail-malls"],
    related: ["downlights-spotlights", "facade-architectural", "drivers-electronics"],
    downloads: pendingDownloads("LED strips & aluminium profiles"),
  },
  {
    slug: "drivers-electronics",
    confirm: true,
    tile: "small",
    categories: ["electronics"],
    name: { en: "LED drivers, PCBs & electronics", ar: "مشغّلات LED واللوحات والمكوّنات الإلكترونية" },
    descriptor: {
      en: "Drivers and LED boards assembled on our own SMT lines.",
      ar: "مشغّلات ولوحات LED مُجمَّعة على خطوط SMT الخاصة بنا.",
    },
    intro: {
      en: "Constant-current drivers, LED boards and control electronics assembled and tested in-house. Built into our own luminaires and available as components for OEM and replacement needs.",
      ar: "مشغّلات تيار ثابت ولوحات LED وإلكترونيات تحكّم تُجمَّع وتُختبر داخل المصنع. تدخل في وحدات الإنارة التي نصنعها، وتتوفر كمكوّنات لاحتياجات التصنيع لحساب الغير والاستبدال.",
    },
    image: assets.products["drivers-electronics"],
    alt: { en: "LED driver and printed circuit board", ar: "مشغّل LED ولوحة دوائر مطبوعة" },
    chips: ["power", "warranty"],
    specs: pendingSpecs("LED drivers, PCBs & electronics"),
    applications: ["commercial-offices", "industrial-warehouses", "infrastructure-roads"],
    related: ["smart-connected", "custom-oem", "led-strips-profiles"],
    downloads: pendingDownloads("LED drivers, PCBs & electronics"),
  },
  {
    slug: "smart-connected",
    confirm: true,
    tile: "small",
    categories: ["smart", "electronics"],
    name: { en: "Smart & connected lighting", ar: "الإضاءة الذكية والمتصلة" },
    descriptor: {
      en: "DALI, 0–10V and wireless control for dimming, scenes and scheduling.",
      ar: "تحكّم عبر DALI و0–10V والاتصال اللاسلكي للتعتيم والمشاهد الضوئية والجدولة.",
    },
    intro: {
      en: "Luminaires and drivers prepared for DALI, 0–10V and wireless control, so lighting can be dimmed, grouped and scheduled. Controls are configured and tested before the fixtures leave the factory.",
      ar: "وحدات إنارة ومشغّلات مهيّأة للتحكّم عبر DALI و0–10V والاتصال اللاسلكي، لتعتيم الإضاءة وتجميعها وجدولتها. تُضبط أنظمة التحكّم وتُختبر قبل خروج الوحدات من المصنع.",
    },
    image: assets.products["smart-connected"],
    alt: { en: "Lighting control module", ar: "وحدة تحكّم بالإضاءة" },
    chips: ["power", "cct"],
    specs: pendingSpecs("Smart & connected lighting"),
    applications: ["commercial-offices", "hospitality", "education-healthcare"],
    related: ["drivers-electronics", "led-panels", "street-roadway"],
    downloads: pendingDownloads("Smart & connected lighting"),
  },
  {
    slug: "custom-oem",
    confirm: true,
    tile: "small",
    categories: ["indoor", "outdoor", "electronics"],
    name: { en: "Custom & OEM manufacturing", ar: "التصنيع حسب الطلب وتصنيع OEM" },
    descriptor: {
      en: "Fixtures built to your drawings, specification and brand.",
      ar: "وحدات إنارة تُصنَّع وفق مخططاتكم ومواصفاتكم وعلامتكم التجارية.",
    },
    intro: {
      en: "From a modified housing to a full private-label range, we engineer, build and test luminaires to your specification. Production is planned, documented and traceable, exactly like our own range.",
      ar: "من تعديل هيكل قائم إلى مجموعة كاملة تحمل علامتكم التجارية، نصمّم وحدات الإنارة ونصنّعها ونختبرها وفق مواصفاتكم. ويُخطَّط للإنتاج ويُوثَّق ويُتتبَّع تماماً كما في منتجاتنا.",
    },
    image: assets.products["custom-oem"],
    alt: { en: "Engineer reviewing a custom luminaire prototype", ar: "مهندس يراجع نموذجاً أولياً لوحدة إنارة مخصّصة" },
    chips: ["cct", "power"],
    specs: pendingSpecs("Custom & OEM manufacturing"),
    applications: ["hospitality", "mosques-public", "infrastructure-roads"],
    related: ["drivers-electronics", "facade-architectural", "street-roadway"],
    downloads: pendingDownloads("Custom & OEM manufacturing"),
  },
];

export function getFamily(slug: string): ProductFamily | undefined {
  return products.find((family) => family.slug === slug);
}

export function familiesBySlugs(slugs: readonly FamilySlug[]): ProductFamily[] {
  return slugs
    .map((slug) => products.find((family) => family.slug === slug))
    .filter((f): f is ProductFamily => Boolean(f));
}
