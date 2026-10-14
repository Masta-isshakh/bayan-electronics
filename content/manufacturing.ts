import { pending } from "@/lib/placeholder";
import { assets } from "./assets";
import type { Confirmable, ImageAsset, Localized } from "./types";

export type ProcessStep = {
  id: string;
  title: Localized;
  /** One sentence, used on the home page. */
  text: Localized;
  /** Longer explanation, used on /manufacturing. */
  detail: Localized;
  image: ImageAsset;
  alt: Localized;
};

export type Stage = { id: string; title: Localized; text: Localized };
export type LabCapability = Confirmable & Stage & { image?: ImageAsset; alt?: Localized };

export const processSteps: ProcessStep[] = [
  {
    id: "design",
    title: { en: "Design & engineering", ar: "التصميم والهندسة" },
    text: {
      en: "Optical, thermal and electrical design, released as a bill of materials before production is planned.",
      ar: "تصميم بصري وحراري وكهربائي يُعتمد في قائمة مواد قبل التخطيط للإنتاج.",
    },
    detail: {
      en: "Engineers define the optics, the thermal path and the electronics, then release a bill of materials. Material requirements and production plans are built from that list, with safety stock and supplier lead times taken into account.",
      ar: "يحدّد المهندسون العدسات والمسار الحراري والإلكترونيات، ثم تُعتمد قائمة المواد. وتُبنى عليها متطلبات المواد وخطط الإنتاج، مع مراعاة مخزون الأمان ومُهل التوريد لدى الموردين.",
    },
    image: assets.manufacturing.engineer,
    alt: { en: "Engineer reviewing a luminaire design", ar: "مهندس يراجع تصميم وحدة إنارة" },
  },
  {
    id: "smt",
    title: { en: "Electronics & SMT assembly", ar: "تجميع الإلكترونيات بتقنية SMT" },
    text: {
      en: "LED boards and driver electronics are populated on SMT lines and inspected before they move on.",
      ar: "تُركَّب مكوّنات لوحات LED وإلكترونيات المشغّلات على خطوط SMT وتُفحص قبل انتقالها إلى المرحلة التالية.",
    },
    detail: {
      en: "Components are issued from inspected stock against the production order. Boards are populated, reflowed and inspected, and the results are recorded against the batch.",
      ar: "تُصرف المكوّنات من المخزون المفحوص بموجب أمر الإنتاج، ثم تُركَّب على اللوحات وتُلحَم وتُفحص، وتُسجَّل النتائج على دفعة الإنتاج.",
    },
    image: assets.manufacturing.smtLine,
    alt: { en: "SMT line placing components on LED boards", ar: "خط SMT يركّب المكوّنات على لوحات LED" },
  },
  {
    id: "assembly",
    title: { en: "Luminaire assembly", ar: "تجميع وحدات الإنارة" },
    text: {
      en: "Housings, optics, boards and drivers are assembled to work instructions, with checks at each station.",
      ar: "تُجمَّع الهياكل والعدسات واللوحات والمشغّلات وفق تعليمات العمل، مع فحص في كل محطة.",
    },
    detail: {
      en: "Each station works from the current revision of its work instruction. In-process inspection catches issues where they occur, not at the end of the line.",
      ar: "تعمل كل محطة وفق أحدث إصدار من تعليمات العمل الخاصة بها، ويكشف الفحص أثناء الإنتاج أي خلل في موضع حدوثه لا في نهاية الخط.",
    },
    image: assets.manufacturing.assemblyLine,
    alt: { en: "Luminaire assembly line", ar: "خط تجميع وحدات الإنارة" },
  },
  {
    id: "testing",
    title: { en: "Testing", ar: "الاختبار" },
    text: {
      en: "Photometric, electrical, thermal and IP/IK tests in our own laboratory, recorded against the order.",
      ar: "اختبارات ضوئية وكهربائية وحرارية واختبارات IP/IK في مختبرنا، تُسجَّل على أمر الإنتاج.",
    },
    detail: {
      en: "Each production order is tested for light output and colour, electrical safety and temperature, and — where specified — ingress and impact protection. The results become part of the batch record.",
      ar: "يُختبر كل أمر إنتاج من حيث التدفق الضوئي واللون والسلامة الكهربائية ودرجة الحرارة، وكذلك الحماية من الغبار والماء والصدمات عند الحاجة. وتصبح النتائج جزءاً من سجل الدفعة.",
    },
    image: assets.home.qcLab,
    alt: { en: "Quality control laboratory", ar: "مختبر مراقبة الجودة" },
  },
  {
    id: "aging",
    title: { en: "Aging & burn-in", ar: "التعتيق والتشغيل التجريبي" },
    text: {
      en: "Finished fixtures run on aging racks before final inspection, so early failures stay in the factory.",
      ar: "تعمل الوحدات المكتملة على حوامل التعتيق قبل الفحص النهائي، لتبقى الأعطال المبكرة داخل المصنع.",
    },
    detail: {
      en: "Powered aging exposes early component failures before a fixture leaves the building. Only fixtures that pass move on to final inspection.",
      ar: "يكشف التشغيل التجريبي المتواصل أعطال المكوّنات المبكرة قبل خروج الوحدة من المصنع، ولا تنتقل إلى الفحص النهائي إلا الوحدات التي تجتاز هذه المرحلة.",
    },
    image: assets.manufacturing.agingRacks,
    alt: { en: "Luminaires running on aging racks", ar: "وحدات إنارة قيد التشغيل على حوامل التعتيق" },
  },
  {
    id: "dispatch",
    title: { en: "Packing & dispatch", ar: "التغليف والشحن" },
    text: {
      en: "Final inspection, batch labelling, packing and dispatch to your project.",
      ar: "فحص نهائي ووسم بيانات الدفعة، ثم التغليف والشحن إلى مشروعكم.",
    },
    detail: {
      en: "Every fixture passes final inspection, is labelled with its batch identity, then packed and dispatched against your order — with the delivery recorded for traceability.",
      ar: "تخضع كل وحدة للفحص النهائي وتُوسَم ببيانات دفعتها، ثم تُغلَّف وتُشحن بموجب طلبكم، مع تسجيل عملية التسليم لأغراض التتبّع.",
    },
    image: assets.manufacturing.warehouse,
    alt: { en: "Packed fixtures ready for dispatch", ar: "وحدات مغلّفة جاهزة للشحن" },
  },
];

export const qcStages: Stage[] = [
  {
    id: "incoming",
    title: { en: "Incoming inspection", ar: "فحص المواد الواردة" },
    text: {
      en: "Materials and components are checked against specification and supplier records before they enter stock. Rejected lots are held and returned.",
      ar: "تُفحص المواد والمكوّنات مقابل المواصفات وسجلات الموردين قبل دخولها المخزون، وتُحجز الدفعات المرفوضة وتُعاد.",
    },
  },
  {
    id: "in-process",
    title: { en: "In-process inspection", ar: "الفحص أثناء الإنتاج" },
    text: {
      en: "Checks at each assembly station catch defects where they happen, against the current work instruction.",
      ar: "تكشف الفحوصات في كل محطة تجميع العيوب في موضع حدوثها، وفق أحدث تعليمات العمل.",
    },
  },
  {
    id: "final",
    title: { en: "Final inspection", ar: "الفحص النهائي" },
    text: {
      en: "Every finished fixture is inspected and tested before packing. Results are recorded against the production order.",
      ar: "تُفحص كل وحدة مكتملة وتُختبر قبل التغليف، وتُسجَّل النتائج على أمر الإنتاج.",
    },
  },
];

/** Non-conformance and corrective-action workflow, in plain words. */
export const correctiveAction: Stage[] = [
  {
    id: "record",
    title: { en: "Record", ar: "التسجيل" },
    text: { en: "Any deviation is logged in a non-conformance report.", ar: "يُسجَّل أي انحراف في تقرير عدم مطابقة." },
  },
  {
    id: "contain",
    title: { en: "Contain", ar: "الاحتواء" },
    text: {
      en: "Affected parts or fixtures are isolated so they cannot ship.",
      ar: "تُعزل القطع أو الوحدات المتأثرة حتى لا تُشحن.",
    },
  },
  {
    id: "investigate",
    title: { en: "Investigate", ar: "التحقيق" },
    text: { en: "The root cause is traced through the batch record.", ar: "يُتتبَّع السبب الجذري عبر سجل الدفعة." },
  },
  {
    id: "correct",
    title: { en: "Correct", ar: "التصحيح" },
    text: {
      en: "A corrective action is assigned, carried out and tracked to closure.",
      ar: "يُحدَّد إجراء تصحيحي ويُنفَّذ ويُتابَع حتى الإغلاق.",
    },
  },
  {
    id: "verify",
    title: { en: "Verify", ar: "التحقّق" },
    text: {
      en: "The fix is checked. Customer complaints follow the same route.",
      ar: "يُتحقَّق من فاعلية الإجراء، وتسلك شكاوى العملاء المسار نفسه.",
    },
  },
];

export const labCapabilities: LabCapability[] = [
  {
    id: "sphere",
    confirm: true,
    title: { en: "Integrating-sphere photometry", ar: "القياس الضوئي بالكرة التكاملية" },
    text: {
      en: "Luminous flux, efficacy, colour temperature and colour rendering, measured for each production order.",
      ar: "قياس التدفق الضوئي والكفاءة ودرجة حرارة اللون ومؤشر تجسيد الألوان لكل أمر إنتاج.",
    },
    image: assets.home.qcLab,
    alt: { en: "Integrating sphere in the laboratory", ar: "كرة تكاملية في المختبر" },
  },
  {
    id: "goniophotometer",
    confirm: true,
    title: { en: "Goniophotometer", ar: "قياس توزيع الضوء (غونيوفوتومتر)" },
    text: {
      en: "Light distribution curves for optics development and lighting design files.",
      ar: "منحنيات توزيع الضوء لتطوير العدسات وإعداد ملفات تصميم الإضاءة.",
    },
  },
  {
    id: "electrical",
    confirm: true,
    title: { en: "Electrical safety", ar: "السلامة الكهربائية" },
    text: {
      en: "Insulation, earth continuity and withstand tests on finished fixtures.",
      ar: "اختبارات العزل واستمرارية التأريض وتحمّل الجهد على الوحدات المكتملة.",
    },
  },
  {
    id: "thermal",
    confirm: true,
    title: { en: "Thermal imaging", ar: "التصوير الحراري" },
    text: {
      en: "Hot-spot checks on boards, drivers and housings under load.",
      ar: "رصد النقاط الساخنة في اللوحات والمشغّلات والهياكل أثناء التشغيل.",
    },
    image: assets.manufacturing.thermalImaging,
    alt: { en: "Thermal image of a luminaire under load", ar: "صورة حرارية لوحدة إنارة أثناء التشغيل" },
  },
  {
    id: "ip-ik",
    confirm: true,
    title: { en: "IP and IK testing", ar: "اختبارات IP وIK" },
    text: {
      en: "Dust, water and impact protection checks for outdoor and industrial fixtures.",
      ar: "اختبارات الحماية من الغبار والماء والصدمات لوحدات الإنارة الخارجية والصناعية.",
    },
    image: assets.manufacturing.ipTest,
    alt: { en: "Ingress protection test chamber", ar: "حجرة اختبار الحماية من الغبار والماء" },
  },
  {
    id: "aging",
    confirm: true,
    title: { en: "Aging racks", ar: "حوامل التعتيق" },
    text: {
      en: "Powered burn-in of finished fixtures before final inspection.",
      ar: "تشغيل تجريبي متواصل للوحدات المكتملة قبل الفحص النهائي.",
    },
    image: assets.manufacturing.agingRacks,
    alt: { en: "Aging racks with fixtures switched on", ar: "حوامل تعتيق عليها وحدات قيد التشغيل" },
  },
  {
    id: "calibration",
    confirm: true,
    title: { en: "Calibration and test certificates", ar: "المعايرة وشهادات الاختبار" },
    text: {
      en: "Instruments follow a calibration schedule, and test certificates are issued from recorded results.",
      ar: "تخضع الأجهزة لجدول معايرة، وتصدر شهادات الاختبار استناداً إلى النتائج المسجّلة.",
    },
    image: assets.manufacturing.calibrationBench,
    alt: { en: "Calibration bench with measuring instruments", ar: "طاولة معايرة عليها أجهزة قياس" },
  },
];

/** Supplier → … → Customer / project, from the client's RFQ. */
export const traceChain: Stage[] = [
  {
    id: "supplier",
    title: { en: "Supplier", ar: "المورّد" },
    text: {
      en: "Approved suppliers, with lead times and quality history on record.",
      ar: "موردون معتمدون، مع تسجيل مُهل التوريد وسجل الجودة.",
    },
  },
  {
    id: "purchase-order",
    title: { en: "Purchase order", ar: "أمر الشراء" },
    text: { en: "Every component is bought against a purchase order.", ar: "يُشترى كل مكوّن بموجب أمر شراء." },
  },
  {
    id: "material-batch",
    title: { en: "Material batch", ar: "دفعة المواد" },
    text: { en: "Incoming lots are inspected and stored by batch.", ar: "تُفحص الشحنات الواردة وتُخزَّن حسب الدفعة." },
  },
  {
    id: "production-order",
    title: { en: "Production order", ar: "أمر الإنتاج" },
    text: {
      en: "Batches are issued to a production order and its bill of materials.",
      ar: "تُصرف الدفعات لأمر إنتاج وفق قائمة المواد الخاصة به.",
    },
  },
  {
    id: "testing-qc",
    title: { en: "Testing & QC", ar: "الاختبار ومراقبة الجودة" },
    text: {
      en: "Inspection and test results are recorded against the order.",
      ar: "تُسجَّل نتائج الفحص والاختبار على أمر الإنتاج.",
    },
  },
  {
    id: "finished-product",
    title: { en: "Finished product", ar: "المنتج النهائي" },
    text: { en: "Each fixture is labelled with its batch identity.", ar: "تُوسَم كل وحدة ببيانات دفعتها." },
  },
  {
    id: "customer-project",
    title: { en: "Customer / project", ar: "العميل / المشروع" },
    text: { en: "Deliveries are recorded per customer and project.", ar: "تُسجَّل عمليات التسليم لكل عميل ومشروع." },
  },
];

export const documentControl: Stage[] = [
  {
    id: "sops",
    title: { en: "Standard operating procedures", ar: "إجراءات التشغيل القياسية" },
    text: {
      en: "How each process runs, approved and issued as controlled revisions.",
      ar: "طريقة تنفيذ كل عملية، معتمدة ومُصدرة كإصدارات خاضعة للرقابة.",
    },
  },
  {
    id: "work-instructions",
    title: { en: "Work instructions", ar: "تعليمات العمل" },
    text: {
      en: "Step-by-step instructions at every station, always the current revision.",
      ar: "تعليمات تفصيلية في كل محطة، وفق أحدث إصدار دائماً.",
    },
  },
  {
    id: "training",
    title: { en: "Training records", ar: "سجلات التدريب" },
    text: {
      en: "Who is qualified for which task, and when they were trained.",
      ar: "من المؤهَّل لكل مهمة، ومتى تلقّى تدريبه.",
    },
  },
  {
    id: "audits",
    title: { en: "Audits", ar: "التدقيق" },
    text: {
      en: "Internal audits check that procedures are followed, with findings tracked to closure.",
      ar: "يتحقّق التدقيق الداخلي من الالتزام بالإجراءات، وتُتابَع الملاحظات حتى إغلاقها.",
    },
  },
];

export const facility = {
  text: {
    en: "Planning, production, testing and dispatch under one roof in Qatar, with digitally managed production records from purchase order to delivery.",
    ar: "التخطيط والإنتاج والاختبار والشحن تحت سقف واحد في قطر، مع إدارة رقمية لسجلات الإنتاج من أمر الشراء حتى التسليم.",
  } satisfies Localized,
  details: {
    en: pending("facility details — location, floor area, number of production lines"),
    ar: pending("facility details (Arabic)"),
  } satisfies Localized,
};
