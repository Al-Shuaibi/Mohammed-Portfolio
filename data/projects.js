/*
  ملف المشاريع
  ------------
  لإضافة مشروع جديد: انسخ أي كتلة { ... } كاملة، الصقها داخل القائمة، وعدّل الحقول.
  - id: اسم قصير بالإنجليزي بدون مسافات (مثال: "pmo-dashboard")
  - sectors: القطاعات التي يظهر فيها المشروع: "consulting" | "tech"
  - size: حجم البطاقة: "wide" (عريضة) أو "regular" (عادية) أو "full" (صف كامل)
  - visual: نوع الصورة:
      { type: "image", src: "assets/اسم-الصورة.webp", alt: {...} }   ← ضع الصورة داخل مجلد assets
      { type: "audio", tracks: [...] }                                  ← عينات صوتية داخل assets/audio
      { type: "mock", name: "..." }                                     ← رسومات توضيحية جاهزة (للمشاريع الحالية فقط)
  - note: (اختياري) وسم صغير بجانب اسم الجهة، مثل "نسخة عرض ببيانات وهمية"
  - phases: (اختياري) مراحل العمل تظهر داخل نافذة المشروع
  - links: (اختياري) أزرار تفتح النظام أو الموقع
  كل نص له نسختان: ar (عربي) و en (إنجليزي).
  - own / roadmap / cta / labels: حقول خاصة بمشروع ذمة (منتجك الخاص)
*/

window.PROJECTS = [
  {
    id: "content",
    sectors: ["consulting", "tech"],
    size: "full",
    client: { ar: "Google Sheets", en: "Google Sheets" },
    note: { ar: "نسخة عرض ببيانات وهمية", en: "Demo with sample data" },
    title: { ar: "نظام إدارة مشاريع إنتاج المحتوى الإسلامي", en: "Islamic content production management system" },
    summary: {
      ar: "ملف متكامل لإدارة إنتاج مقاطع الفيديو ومونتاجها وترجمتها إلى لغات العالم، بين عدة مديرين بصلاحيات متساوية. افتحه واستعرضه هنا مباشرة.",
      en: "A complete workbook for producing, editing and translating videos into world languages, shared by several managers with equal permissions. Open it and explore it right here."
    },
    problem: {
      ar: "إنتاج مقاطع بلغات كثيرة بين محررين ومقيّمين لغويين وعدة مديرين، يصعب معه معرفة حالة كل مقطع، وتوزيع المهام بعدل دون أن يتحمل محرر أكثر من طاقته.",
      en: "Producing clips in many languages across editors, language reviewers and several managers makes it hard to know each clip's status, or to share work fairly without overloading an editor."
    },
    solution: {
      ar: "تتبّع كامل لدورة الإنتاج عبر 5 حالات واضحة، من رفع الصوت والنص إلى تكليف المحرر فالمونتاج فالتقييم اللغوي فالاعتماد النهائي. معادلات تحسب المهام النشطة لكل محرر وتحوّل حالته إلى «مشغول» عند بلوغ 3 مشاريع فيُستبعد من التكليفات الجديدة، مع قوائم منسدلة تمنع الإدخال الخاطئ.",
      en: "Full tracking of the production cycle through 5 clear statuses, from uploading audio and script to assigning an editor, editing, language review and final approval. Formulas count each editor's active tasks and switch them to “Busy” at 3 projects so they drop out of new assignments, with dropdowns that prevent bad input."
    },
    result: {
      ar: "لوحة تحكم لحظية بإجمالي المقاطع ونسبة الإنجاز والمقاعد الشاغرة، وإحصائيات أداء لكل محرر، وأرشيف للمقاطع المعتمدة بمدة تنفيذ كل مقطع ومتوسطها.",
      en: "A live dashboard with total clips, completion rate and open seats, performance stats for every editor, and an archive of approved clips with each clip's turnaround and the average."
    },
    features: {
      ar: ["توزيع آلي للأحمال بحد 3 مشاريع", "لوحة تحكم لحظية", "إحصائيات أداء المحررين", "أرشيف بمدة التنفيذ ومتوسطها", "فلترة باللغة والحالة والمحرر معًا", "قوائم منسدلة تمنع الإدخال الخاطئ"],
      en: ["Automatic load balancing, 3 projects max", "Live dashboard", "Editor performance stats", "Archive with turnaround and average", "Filter by language, status and editor together", "Dropdowns that prevent bad input"]
    },
    visual: { type: "sheet" },
    links: [
      { label: { ar: "افتحه في Google Sheets", en: "Open in Google Sheets" }, href: "https://docs.google.com/spreadsheets/d/1KnVoMXSWj8kYffUcthuSxsKolu4Aml0K0Fh233zX89U/edit?usp=sharing" },
      { label: { ar: "حمّل نسخة العرض (Excel)", en: "Download the demo (Excel)" }, href: "assets/files/content-production-demo.xlsx", download: true }
    ]
  },

  {
    id: "dhimma",
    sectors: ["consulting", "tech"],
    size: "full",
    own: true,
    status: { ar: "قبل الإطلاق", en: "Pre-launch" },
    title: { ar: "ذِمّة", en: "Dhimma" },
    summary: {
      ar: "«مستحقاتك الآجلة تحت المتابعة، لا في الذاكرة». منصة SaaS أبنيها لمتابعة التحصيل، بينما تبقى فواتيرك في نظامك المحاسبي.",
      en: "“Your receivables under follow-up, not in memory.” A SaaS platform I'm building to run collection, while your invoices stay in your accounting system."
    },
    problem: {
      ar: "الديون الآجلة تُتابع غالبًا بالذاكرة والتقدير الشخصي: لا رسالة في وقتها، ولا وعد مسجّل، ولا رقم دقيق عند أحد، فيتحول المستحق إلى متأخر دون أن ينتبه له أحد.",
      en: "Credit sales are often followed up by memory and gut feeling: no timely message, no recorded promise, no exact number anywhere, so dues turn overdue without anyone noticing."
    },
    solution: {
      ar: "ثلاث خطوات: تُدخل مستحقاتك من فواتير PDF أو Excel أو إدخال يدوي، وتمر على طابور مراجعة لا يعتمدها إلا موظف مخوّل. ثم تتابع المنصة بدلًا منك بتذكير على واتساب والرسائل النصية والبريد وفق سياسة تضبطها أنت. وأخيرًا يُسجَّل السداد ويُطابق: الإيصال يُقرأ ويؤكده المحاسب، والمبلغ يُوزَّع على الأقدم أولًا، وأرقامك تطابق نظامك المحاسبي شهريًا.",
      en: "Three steps: you bring in dues from PDF invoices, Excel or manual entry, through a review queue only an authorized employee can approve. The platform then follows up for you with WhatsApp, SMS and email reminders under a policy you set. Finally, payments are recorded and reconciled: receipts are read and confirmed by the accountant, amounts are allocated oldest first, and your figures match your accounting system monthly."
    },
    result: {
      ar: "28 ميزة جاهزة لنسخة الإطلاق، منها التصنيف الائتماني لكل مدين وشريط أعمار الديون والتصعيد المتدرج للمتأخرين، مع حزم لكل قطاع تبدأ بالجملة والتوزيع.",
      en: "28 features ready for the launch version, including a credit rating per debtor, a debt-aging bar and graduated escalation for late payers, with sector packs starting with wholesale and distribution."
    },
    labels: { solution: "dh_solution", result: "dh_goal" },
    roadmap: true,
    cta: "early",
    features: {
      ar: ["تصنيف ائتماني لكل مدين", "شريط أعمار الدين وتقريره", "تذكير آلي على واتساب الأعمال", "تصعيد متدرج للمتأخرين", "عروض السداد المبكر", "مطابقة مع النظام المحاسبي", "سجل تدقيق لكل عملية", "عزل كامل بين الشركات"],
      en: ["Credit rating per debtor", "Debt-aging bar and report", "Automated WhatsApp Business reminders", "Graduated escalation for late payers", "Early-payment offers", "Reconciliation with the accounting system", "Audit log for every action", "Full isolation between companies"]
    },
    visual: {
      type: "phone",
      src: "assets/dhimma/landing.webp",
      top: "assets/dhimma/landing-top.webp",
      alt: { ar: "الصفحة التعريفية لمنصة ذمة", en: "Dhimma landing page" }
    },
    calculator: true,
    links: []
  },

  {
    id: "mozn",
    sectors: ["consulting", "tech"],
    size: "wide",
    client: { ar: "مزن للمرطبات", en: "Mozn Beverages" },
    title: { ar: "نظام مزن المحاسبي والإداري", en: "Mozn accounting & management system" },
    summary: {
      ar: "نظام بنيته من الصفر لشركة ناشئة في قطاع المرطبات، يجمع الحسابات والمخزون والموظفين في مكان واحد.",
      en: "Built from scratch for a beverage startup, bringing accounts, inventory and staff into one place."
    },
    problem: {
      ar: "شركة جديدة تحتاج ضبط مبيعاتها ومشترياتها ومخزونها وموظفيها من اليوم الأول، دون أن تتوزع البيانات بين الجداول والدفاتر.",
      en: "A new company needed control over sales, purchasing, inventory and staff from day one, without data scattered across spreadsheets and notebooks."
    },
    solution: {
      ar: "صممت النظام حول طريقة عمل الشركة في 13 وحدة: العملاء والفواتير والمدفوعات، والموردون والمشتريات، والمنتجات والمخزون، والمصروفات والمحاسبة، والموظفون والحضور والإجازات، والتقارير.",
      en: "I designed it around how the company works, in 13 modules: customers, invoices and payments; suppliers and purchasing; products and inventory; expenses and accounting; staff, attendance and leave; and reports."
    },
    result: {
      ar: "لوحة تحكم واحدة تعرض المبيعات والمصروفات وصافي الربح ومستحقات العملاء، وتنبّه تلقائيًا عند وصول أي منتج إلى الحد الأدنى من المخزون.",
      en: "One dashboard showing sales, expenses, net profit and receivables, with automatic alerts when any product hits its minimum stock."
    },
    features: {
      ar: ["فواتير ومدفوعات مرتبطة بكل عميل", "تنبيهات المخزون المنخفض", "رسوم شهرية للمبيعات والمصروفات والأرباح", "الموظفون والحضور والإجازات"],
      en: ["Invoices and payments tied to each customer", "Low-stock alerts", "Monthly charts for sales, expenses and profit", "Staff, attendance and leave"]
    },
    visual: {
      type: "image",
      src: "assets/mozn.webp",
      alt: { ar: "لوحة تحكم نظام مزن: المبيعات والمصروفات والأرباح والمخزون المنخفض", en: "Mozn dashboard: sales, expenses, profit and low stock" }
    },
    links: [
      { label: { ar: "افتح النظام", en: "Open the system" }, href: "https://mozn-system.vercel.app/dashboard" }
    ]
  },

  {
    id: "dub",
    sectors: ["consulting", "tech"],
    size: "regular",
    client: { ar: "رواد التراجم", en: "Rowwad Translation" },
    title: { ar: "لوحة متابعة المشروع اللحظية", en: "Live project dashboard" },
    summary: {
      ar: "شاشة واحدة تعرف منها الإدارة أين يقف كل مقطع في كل لغة.",
      en: "One screen that tells management where every clip stands in every language."
    },
    problem: {
      ar: "مشروع دبلجة بلغات متعددة أشرفتُ فيه على 5 محررين و5 مشرفي لغات، وكانت الإدارة لا ترى التقدم إلا بالسؤال والمتابعة اليدوية.",
      en: "A multilingual dubbing project where I supervised 5 editors and 5 language supervisors, and management could only see progress by asking around."
    },
    solution: {
      ar: "لوحة ويب بواجهة React مرتبطة مباشرة بواجهة نظام الدبلجة (API)، وتتحدث تلقائيًا دون إعادة تحميل: حالة كل مقطع في كل لغة، والاعتمادات الشهرية والتراكمية، وأحدث الاعتمادات، وتنبيه إذا بدأت الدبلجة قبل اكتمال الترجمة.",
      en: "A React web dashboard wired directly to the dubbing system's API, updating live without reloading: each clip's status in every language, monthly and cumulative approvals, the latest approvals, and an alert when dubbing starts before translation is complete."
    },
    result: {
      ar: "مع سير العمل المرحلي (Stage-Gate) الذي صممته، انخفضت مدة التسليم من أسبوعين إلى نحو 4 أيام، واعتُمد ونُشر أكثر من 40 فيديو. واللوحة ما زالت تعمل وتتحدث لحظيًا، وتتابع اليوم 189 نسخة دبلجة.",
      en: "Together with the stage-gate workflow I designed, delivery fell from two weeks to about four days, and 40+ videos were approved and published. The dashboard still runs and updates live, tracking 189 dubbing versions today."
    },
    features: {
      ar: ["تحديث لحظي من واجهة النظام", "عرض بالأعمدة أو بالجداول", "تنبيه على المراحل المتداخلة", "نسبة إنجاز كل مشروع حسب اللغات المعتمدة"],
      en: ["Live updates from the system API", "Bar or table views", "Alerts on overlapping stages", "Per-project progress by approved languages"]
    },
    visual: {
      type: "gallery",
      images: [
        { src: "assets/dub/pipeline.webp", alt: { ar: "لوحة مسار المحتوى: أين يقف كل مقطع في كل لغة", en: "Content pipeline: where every clip stands in every language" }, caption: { ar: "مسار المحتوى: حالة كل مقطع في كل لغة، من الترجمة حتى النشر", en: "Content pipeline: each clip's status in every language, from translation to publishing" } },
        { src: "assets/dub/stats.webp", alt: { ar: "إحصائيات نظام الدبلجة: الاعتمادات الشهرية والتراكمية", en: "Dubbing stats: monthly and cumulative approvals" }, caption: { ar: "الاعتمادات الشهرية والتراكمية لكل فترة", en: "Monthly and cumulative approvals per period" } }
      ]
    },
    links: []
  },

  {
    id: "voice",
    sectors: ["consulting", "tech"],
    size: "full",
    client: { ar: "رواد التراجم", en: "Rowwad Translation" },
    title: { ar: "وكيل التعليق الصوتي العربي", en: "Arabic voice-over AI agent" },
    summary: {
      ar: "وكيل ذكاء اصطناعي درّبته وربطت أدواته حتى صار ينتج تعليقًا صوتيًا عربيًا معتمدًا بالجملة. استمع إلى عينات من إنتاجه.",
      en: "An AI agent I trained and wired to its tools until it produced approved Arabic voice-over at scale. Listen to samples it produced."
    },
    problem: {
      ar: "مئات المقاطع تحتاج تعليقًا صوتيًا عربيًا دقيق النطق، والتسجيل اليدوي بطيء ويصعب معه توحيد الجودة.",
      en: "Hundreds of clips needed accurate Arabic voice-over, and manual recording was slow and hard to keep consistent."
    },
    solution: {
      ar: "ربطت عدة أدوات في سلسلة واحدة عبر واجهات البرمجة: نموذج Claude يدقق النص، ثم منصة ElevenLabs تولّد الصوت، ثم نموذج Gemini يتحقق من الناتج، بينما يدير Google Apps Script الدفعات. بعدها أمضيت أسبوعين في تدريب الوكيل ومراجعة مخرجاته وتصحيحها حتى اعتُمدت الجودة.",
      en: "I chained several tools through APIs: Claude to proofread scripts, ElevenLabs to generate the voice, Gemini to verify the output, and Google Apps Script to manage batches. Then I spent two weeks training the agent and reviewing and correcting its output until the quality was approved."
    },
    result: {
      ar: "بعد اعتماد الجودة، صار الوكيل ينتج أكثر من 200 مقطع صوتي في يوم واحد.",
      en: "Once quality was approved, the agent produced 200+ audio clips in a single day."
    },
    phases: [
      { tag: { ar: "أسبوعان", en: "2 weeks" }, text: { ar: "تدريب الوكيل ومراجعة مخرجاته وتصحيحها", en: "Training the agent, reviewing and correcting its output" } },
      { tag: { ar: "اعتماد", en: "Approval" }, text: { ar: "اعتماد جودة المقاطع قبل التوسع", en: "Clip quality approved before scaling" } },
      { tag: { ar: "يوم واحد", en: "1 day" }, text: { ar: "إنتاج أكثر من 200 مقطع", en: "200+ clips produced" } }
    ],
    features: {
      ar: ["ربط عدة أدوات ذكاء اصطناعي عبر API", "دورة تدريب ومراجعة قبل الإنتاج", "تحقق آلي من كل مقطع", "إدارة الدفعات من جدول واحد"],
      en: ["Several AI tools connected via API", "A training and review cycle before production", "Automatic check on every clip", "Batches managed from one sheet"]
    },
    visual: {
      type: "audio",
      tracks: [
        { src: "assets/audio/voice-1.mp3", title: { ar: "ربي الله الذي رباني", en: "“My Lord is Allah” (answer)" } },
        { src: "assets/audio/voice-2.mp3", title: { ar: "تعريف الطهارة", en: "Defining purification" } },
        { src: "assets/audio/voice-3.mp3", title: { ar: "المسح على الخفين", en: "Wiping over leather socks" } }
      ]
    },
    links: []
  },

  {
    id: "leads",
    sectors: ["consulting"],
    size: "regular",
    client: { ar: "مصنع مزن", en: "Mozn Factory" },
    title: { ar: "قاعدة عملاء محتملين لفريق المبيعات", en: "Sales lead database" },
    summary: {
      ar: "من 7,000 سجل خام إلى 3,000 عميل مؤهل جاهز للتواصل.",
      en: "From 7,000 raw records to 3,000 qualified, ready-to-contact leads."
    },
    problem: {
      ar: "فريق المبيعات يحتاج قائمة واضحة بالعملاء المستهدفين في المدن الرئيسية بدل البحث العشوائي.",
      en: "The sales team needed a clear target list across major cities instead of searching at random."
    },
    solution: {
      ar: "جمعت أكثر من 7,000 سجل من 8 مدن سعودية رئيسية، ثم نظفتها من التكرار والنواقص وصنفتها حسب النشاط: المقاهي والمحامص والأسواق.",
      en: "I collected 7,000+ records from 8 major Saudi cities, removed duplicates and gaps, and segmented them by type: cafés, roasteries and markets."
    },
    result: {
      ar: "3,000 عميل مؤهل سلّمتهم لفريق المبيعات خلال شهرين.",
      en: "3,000 qualified leads handed to the sales team within two months."
    },
    features: {
      ar: ["8 مدن رئيسية", "إزالة التكرار والسجلات الناقصة", "تصنيف حسب نوع النشاط"],
      en: ["8 major cities", "Duplicates and incomplete records removed", "Segmented by business type"]
    },
    visual: { type: "mock", name: "leads" },
    links: []
  },

  {
    id: "tea",
    sectors: ["tech"],
    size: "regular",
    client: { ar: "عالم الشاي", en: "Tea World" },
    title: { ar: "موقع عالم الشاي", en: "Tea World website" },
    summary: {
      ar: "موقع تعريفي لعلامة شاي سريلانكي، يروي رحلة المنتج من الورقة إلى الكوب.",
      en: "A brand site for a Sri Lankan tea label, telling the product's journey from leaf to cup."
    },
    problem: {
      ar: "علامة جديدة تحتاج حضورًا رقميًا يعرّف بالمنتج وأصله ويبني الثقة قبل الشراء.",
      en: "A new brand needed a web presence that introduces the product and its origin and builds trust before purchase."
    },
    solution: {
      ar: "موقع عربي متجاوب مع الجوال، بنيته بأداة تطوير بالذكاء الاصطناعي في وقت قصير.",
      en: "A mobile-friendly Arabic site, built quickly with an AI development tool."
    },
    result: {
      ar: "حضور رقمي جاهز تشاركه العلامة مع عملائها برابط واحد.",
      en: "A ready web presence the brand shares with customers in one link."
    },
    features: {
      ar: ["تصميم عربي متجاوب", "قصة المنتج من مصدره", "جاهز للمشاركة برابط واحد"],
      en: ["Responsive Arabic design", "The product story from its source", "Shareable in one link"]
    },
    visual: { type: "mock", name: "tea" },
    links: [
      { label: { ar: "افتح الموقع", en: "Open the site" }, href: "https://pure-leaf-origin.base44.app/" }
    ]
  }
];
