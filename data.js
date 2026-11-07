const hero = "hero.jpg";
const socotra = "socotra.jpg";
const shibam = "shibam.jpg";
const sanaa = "sanaa.jpg";
const aden = "aden.jpg";
const waterfall = "waterfall.jpg";
const marib = "marib.jpg";
const souq = "souq.jpg";

const images = { hero, socotra, shibam, sanaa, aden, waterfall, marib, souq };

const categories = [
  { id: "nature", ar: "طبيعية", en: "Nature", titleAr: "الأماكن الطبيعية", titleEn: "Natural places", q: "منتزهات ومحميات طبيعية", hero: waterfall,
    descAr: "شلالات ومحميات وينابيع ومدرجات خضراء، من أجمل ما وهبه الله لليمن.", descEn: "Waterfalls, reserves, springs and green terraces." },
  { id: "historic", ar: "تاريخية", en: "Historic", titleAr: "الأماكن التاريخية", titleEn: "Historic places", q: "معالم تاريخية وأثرية", hero: shibam,
    descAr: "مدن وقلاع ومعابد وجوامع تحكي آلاف السنين من حضارات سبأ وحمير وحضرموت.", descEn: "Cities, forts, temples and mosques spanning thousands of years." },
  { id: "leisure", ar: "ترفيهية", en: "Leisure", titleAr: "الأماكن الترفيهية", titleEn: "Leisure & entertainment", q: "متنزهات وترفيه", hero: aden,
    descAr: "كورنيشات وحدائق ومتنزهات للعائلة والأصدقاء.", descEn: "Corniches, parks and family outings." },
  { id: "beach", ar: "شواطئ", en: "Beaches", titleAr: "الشواطئ", titleEn: "Beaches", q: "شواطئ", hero: aden,
    descAr: "أكثر من 2000 كم من السواحل على البحر الأحمر وخليج عدن وبحر العرب.", descEn: "Over 2,000 km of coast on the Red Sea, Gulf of Aden and Arabian Sea." },
  { id: "mountain", ar: "جبال", en: "Mountains", titleAr: "الجبال", titleEn: "Mountains", q: "جبال", hero: hero,
    descAr: "قمم شاهقة وقرى معلّقة ومدرجات زراعية تعلو السحاب.", descEn: "High peaks, hanging villages and terraced slopes." },
  { id: "valley", ar: "أودية", en: "Valleys", titleAr: "الأودية", titleEn: "Valleys", q: "أودية", hero: shibam,
    descAr: "أودية خصبة تصطف على جوانبها القرى والمزارع والنخيل.", descEn: "Fertile valleys lined with villages, farms and palms." },
  { id: "island", ar: "جزر", en: "Islands", titleAr: "الجزر", titleEn: "Islands", q: "جزر", hero: socotra,
    descAr: "جزر نائية بتنوع حيوي فريد وشواطئ بكر.", descEn: "Remote islands with unique biodiversity and pristine shores." },
  { id: "museum", ar: "متاحف", en: "Museums", titleAr: "المتاحف", titleEn: "Museums", q: "متاحف", hero: sanaa,
    descAr: "متاحف وقصور تحفظ آثار اليمن ومخطوطاته وتراثه.", descEn: "Museums and palaces preserving Yemen's artefacts and heritage." },
  { id: "market", ar: "أسواق", en: "Markets", titleAr: "الأسواق", titleEn: "Markets", q: "أسواق", hero: souq,
    descAr: "أسواق شعبية بالبهارات والبن والعسل والفضة والجنابي.", descEn: "Traditional souqs of spices, coffee, honey and silver." },
  { id: "restaurant", ar: "مطاعم", en: "Restaurants", titleAr: "المطاعم والمأكولات", titleEn: "Restaurants & food", q: "مطاعم", hero: souq,
    descAr: "السلتة والمندي والمعصوب والفحسة وأطباق البحر في كل محافظة.", descEn: "Saltah, mandi, ma'asoub and fresh seafood in every governorate." },
  { id: "hotel", ar: "فنادق", en: "Hotels", titleAr: "الفنادق والإقامة", titleEn: "Hotels & stays", q: "فنادق", hero: sanaa,
    descAr: "فنادق ونُزل ومخيمات بيئية تناسب كل رحلة.", descEn: "Hotels, guesthouses and eco-camps for every trip." },
  { id: "desert", ar: "صحراء", en: "Desert", titleAr: "الصحراء", titleEn: "Desert", q: "صحراء ومخيمات", hero: marib,
    descAr: "كثبان ذهبية وآفاق ممتدة وليالٍ مليئة بالنجوم.", descEn: "Golden dunes, endless horizons and starry nights." },
];

const g = (slug, ar, en, capitalAr, descAr, descEn, image, lat, lng) =>
  ({ slug, ar, en, capitalAr, descAr, descEn, image, lat, lng });

const governorates = [
  g("amanat-al-asimah", "أمانة العاصمة", "Amanat Al-Asimah", "صنعاء", "قلب اليمن النابض، مدينة صنعاء القديمة المدرجة في قائمة التراث العالمي.", "The beating heart of Yemen and its UNESCO-listed Old City.", sanaa, 15.3547, 44.2067),
  g("sanaa", "صنعاء", "Sana'a", "صنعاء", "جبال شاهقة وقرى معلّقة ووديان خضراء تحيط بالعاصمة.", "Towering mountains, hanging villages and green valleys.", waterfall, 15.37, 44.0),
  g("aden", "عدن", "Aden", "عدن", "ثغر اليمن الباسم، شواطئ فيروزية وصهاريج تاريخية.", "Yemen's smiling port, turquoise beaches and ancient cisterns.", aden, 12.7855, 45.0187),
  g("taiz", "تعز", "Taiz", "تعز", "عاصمة الثقافة وجبل صبر الأخضر وقلعة القاهرة.", "Cultural capital, green Mount Sabir and Al-Qahira castle.", hero, 13.5795, 44.0209),
  g("hodeidah", "الحديدة", "Hodeidah", "الحديدة", "سهل تهامة الدافئ وسواحل البحر الأحمر ومدينة زبيد التاريخية.", "Warm Tihama plains, Red Sea coast and historic Zabid.", aden, 14.7978, 42.9545),
  g("hadramawt", "حضرموت", "Hadramawt", "المكلا", "وادٍ أسطوري ومدن الطين الشاهقة وسواحل المكلا.", "A legendary valley, mud-brick skyscrapers and Mukalla's coast.", shibam, 15.9283, 48.6258),
  g("ibb", "إب", "Ibb", "إب", "اللواء الأخضر، أمطار وشلالات ومدرجات زراعية خلابة.", "The Green Province of rains, waterfalls and terraces.", waterfall, 13.9667, 44.1833),
  g("dhamar", "ذمار", "Dhamar", "ذمار", "هضاب مرتفعة وينابيع حارة وآثار حميرية.", "High plateaus, hot springs and Himyarite ruins.", hero, 14.5427, 44.4051),
  g("raymah", "ريمة", "Raymah", "الجبين", "جبال خضراء وضباب دائم وقرى على القمم.", "Green peaks wrapped in fog and summit villages.", waterfall, 14.6, 43.6),
  g("al-mahwit", "المحويت", "Al-Mahwit", "المحويت", "عروس الجبال، مدرجات وقرى معلّقة كشبام كوكبان.", "Bride of the mountains, home of Shibam Kawkaban.", hero, 15.47, 43.55),
  g("hajjah", "حجة", "Hajjah", "حجة", "جبال كحلان وقلاع شامخة تطل على تهامة.", "Kuhlan mountains and proud forts over Tihama.", hero, 15.6943, 43.6058),
  g("saada", "صعدة", "Saada", "صعدة", "مدينة طينية مسوّرة وبساتين رمان وعنب.", "A walled mud city amid pomegranate orchards.", shibam, 16.9402, 43.7639),
  g("amran", "عمران", "Amran", "عمران", "مدينة ثلا الحصينة ومعمار حجري فريد.", "Fortified Thula and unique stone architecture.", sanaa, 15.6594, 43.9439),
  g("al-jawf", "الجوف", "Al-Jawf", "الحزم", "صحراء ممتدة ومدن معينية عريقة.", "Vast desert and ancient Minaean cities.", marib, 16.6, 45.5),
  g("marib", "مأرب", "Marib", "مأرب", "مملكة سبأ، عرش بلقيس وسد مأرب العظيم.", "Kingdom of Sheba, Arsh Bilqis and the Great Dam.", marib, 15.4542, 45.3266),
  g("shabwah", "شبوة", "Shabwah", "عتق", "شبوة القديمة وشواطئ بلحاف وبئر علي.", "Ancient Shabwa and the beaches of Bir Ali.", marib, 14.53, 46.83),
  g("abyan", "أبين", "Abyan", "زنجبار", "دلتا خضراء وشواطئ هادئة على خليج عدن.", "A green delta and calm Gulf of Aden beaches.", aden, 13.13, 45.38),
  g("lahij", "لحج", "Lahij", "الحوطة", "بساتين الحسيني وفن الغناء اللحجي.", "Al-Husseini gardens and Lahji song.", waterfall, 13.0567, 44.8819),
  g("ad-dali", "الضالع", "Ad-Dali'", "الضالع", "جبال جحاف ووديان زراعية خصبة.", "Jahaf mountains and fertile valleys.", hero, 13.6957, 44.7314),
  g("al-bayda", "البيضاء", "Al-Bayda", "البيضاء", "قلاع تاريخية ومرتفعات معتدلة.", "Historic forts and temperate highlands.", hero, 13.9852, 45.5727),
  g("al-mahrah", "المهرة", "Al-Mahrah", "الغيضة", "سواحل بكر وموسم خريف أخضر.", "Pristine coasts and a green monsoon season.", aden, 16.2079, 52.1761),
  g("socotra", "سقطرى", "Socotra", "حديبو", "جزيرة من عالم آخر، أشجار دم الأخوين وشواطئ بيضاء.", "An otherworldly island of dragon blood trees.", socotra, 12.4634, 53.8237),
];

// اسم المحافظة كما يُكتب في بحث Google Maps (يُستخدم لعرض المطاعم والفنادق وغيرها مباشرة من الخريطة)
const govMapQ = {
  "amanat-al-asimah": "صنعاء", "sanaa": "محافظة صنعاء", "aden": "عدن", "taiz": "تعز", "hodeidah": "الحديدة",
  "hadramawt": "حضرموت", "ibb": "إب", "dhamar": "ذمار", "raymah": "ريمة", "al-mahwit": "المحويت", "hajjah": "حجة",
  "saada": "صعدة", "amran": "عمران", "al-jawf": "الجوف", "marib": "مأرب", "shabwah": "شبوة", "abyan": "أبين",
  "lahij": "لحج", "ad-dali": "الضالع", "al-bayda": "البيضاء", "al-mahrah": "المهرة", "socotra": "سقطرى",
};
governorates.forEach((x) => { x.mapQ = govMapQ[x.slug] || x.ar; });

const d = (o) =>
  ({ ...o, gallery: o.gallery ?? [o.image] });

const destinations = [
  d({ id: "old-sanaa", ar: "صنعاء القديمة", en: "Old Sana'a", gov: "amanat-al-asimah", category: "historic", rating: 4.9, reviews: 342, image: sanaa, gallery: [sanaa, souq, hero],
    descAr: "مدينة حيّة عمرها أكثر من 2500 عام ببيوتها البرجية المزخرفة.", longAr: "تُعد صنعاء القديمة من أقدم المدن المأهولة في العالم، وتضم أكثر من ستة آلاف منزل برجي مزيّن بالجص الأبيض والقمريات الملوّنة. تجوّل في أزقتها، زر الجامع الكبير، وتذوّق القهوة اليمنية في أسواقها العتيقة.",
    lat: 15.3532, lng: 44.2149, visitors: "+50 ألف سنويًا", hours: "مفتوحة طوال اليوم", fee: "مجانًا", bestTime: "أكتوبر – مارس", access: "سهل بالسيارة وسيرًا", stay: "فنادق تراثية داخل المدينة" }),
  d({ id: "souq-al-milh", ar: "سوق الملح", en: "Souq Al-Milh", gov: "amanat-al-asimah", category: "market", rating: 4.7, reviews: 188, image: souq, gallery: [souq, sanaa],
    descAr: "أشهر أسواق صنعاء للبهارات والبن والفضة والجنابي.", longAr: "يضم السوق عشرات الأسواق المتخصصة: البن، الزبيب، الفضة، العقيق، والجنابي. تجربة حسية كاملة من الروائح والألوان.",
    lat: 15.3545, lng: 44.2156, visitors: "+30 ألف سنويًا", hours: "8 ص – 9 م", fee: "مجانًا", bestTime: "صباحًا وقبل المغرب", access: "سيرًا من باب اليمن", stay: "فنادق صنعاء القديمة" }),
  d({ id: "bani-matar-falls", ar: "شلال بني مطر", en: "Bani Matar Falls", gov: "sanaa", category: "nature", rating: 4.8, reviews: 126, image: waterfall, gallery: [waterfall, hero],
    descAr: "شلالات تنساب بين المدرجات الخضراء في مواسم الأمطار.", longAr: "تقع في مديرية بني مطر غرب صنعاء، وتتدفق مياهها بقوة في موسم الأمطار الصيفي بين مدرجات زراعية وقرى حجرية معلّقة. مكان مثالي للتنزه العائلي والتصوير.",
    lat: 15.28, lng: 43.92, visitors: "+12 ألف سنويًا", hours: "طوال النهار", fee: "مجانًا", bestTime: "يوليو – سبتمبر", access: "سيارة دفع رباعي يُفضّل", stay: "فنادق صنعاء (40 كم)" }),
  d({ id: "dar-al-hajar", ar: "دار الحجر", en: "Dar Al-Hajar", gov: "sanaa", category: "historic", rating: 4.9, reviews: 410, image: hero, gallery: [hero, sanaa],
    descAr: "قصر الإمام المبني فوق صخرة في وادي ظهر، أيقونة اليمن.", longAr: "قصر من خمسة طوابق شُيّد فوق صخرة شاهقة في وادي ظهر، ويُعد من أشهر المعالم المعمارية في اليمن. يحيط به وادٍ أخضر مليء بأشجار الفاكهة.",
    lat: 15.4294, lng: 44.1225, visitors: "+40 ألف سنويًا", hours: "8 ص – 5 م", fee: "رسوم رمزية", bestTime: "طوال العام", access: "سهل بالسيارة (15 كم)", stay: "فنادق صنعاء" }),
  d({ id: "shibam", ar: "مدينة شبام", en: "Shibam", gov: "hadramawt", category: "historic", rating: 4.9, reviews: 389, image: shibam, gallery: [shibam, marib],
    descAr: "منهاتن الصحراء، ناطحات سحاب طينية منذ القرن السادس عشر.", longAr: "مدينة مسوّرة تضم نحو 500 برج طيني يصل ارتفاع بعضها إلى ثمانية طوابق، وهي مدرجة على قائمة التراث العالمي لليونسكو. شاهد الغروب من التلة المقابلة.",
    lat: 15.9266, lng: 48.6266, visitors: "+25 ألف سنويًا", hours: "طوال النهار", fee: "رسوم رمزية", bestTime: "نوفمبر – فبراير", access: "عبر سيئون (20 كم)", stay: "فنادق سيئون" }),
  d({ id: "wadi-doan", ar: "وادي دوعن", en: "Wadi Do'an", gov: "hadramawt", category: "valley", rating: 4.8, reviews: 154, image: shibam,
    descAr: "وادٍ عميق تصطف على جوانبه القرى الطينية ومناحل العسل.", longAr: "يشتهر بأجود أنواع العسل في العالم (عسل السدر الدوعني)، وبقراه الطينية الملوّنة المتسلقة على سفوح الجبال.",
    lat: 15.2, lng: 48.2, visitors: "+8 آلاف سنويًا", hours: "طوال النهار", fee: "مجانًا", bestTime: "أكتوبر – مارس", access: "سيارة دفع رباعي", stay: "نُزل محلية في الوادي" }),
  d({ id: "mukalla-corniche", ar: "كورنيش المكلا", en: "Mukalla Corniche", gov: "hadramawt", category: "leisure", rating: 4.6, reviews: 201, image: aden,
    descAr: "واجهة بحرية حيوية تحت جبال المكلا البيضاء.", longAr: "مكان مثالي للتنزه المسائي وتذوّق المأكولات البحرية الحضرمية.",
    lat: 14.5425, lng: 49.1242, visitors: "+60 ألف سنويًا", hours: "طوال اليوم", fee: "مجانًا", bestTime: "نوفمبر – أبريل", access: "سهل", stay: "فنادق المكلا" }),
  d({ id: "detwah", ar: "بحيرة ديطوح", en: "Detwah Lagoon", gov: "socotra", category: "beach", rating: 5.0, reviews: 276, image: socotra, gallery: [socotra, aden],
    descAr: "بحيرة فيروزية ورمال بيضاء ناعمة في قلنسية.", longAr: "من أجمل الشواطئ في العالم؛ بحيرة ضحلة بلون الفيروز تحيط بها كثبان بيضاء. خيّم تحت النجوم وراقب الطيور.",
    lat: 12.7, lng: 53.5, visitors: "+3 آلاف سنويًا", hours: "طوال اليوم", fee: "مجانًا", bestTime: "أكتوبر – أبريل", access: "سيارة دفع رباعي من حديبو", stay: "مخيمات بيئية" }),
  d({ id: "dixam", ar: "هضبة ديكسم", en: "Dixam Plateau", gov: "socotra", category: "nature", rating: 4.9, reviews: 198, image: socotra,
    descAr: "غابة أشجار دم الأخوين الفريدة في العالم.", longAr: "هضبة مرتفعة تنتشر عليها أشجار دم الأخوين المظلية التي لا توجد إلا في سقطرى.",
    lat: 12.48, lng: 54.0, visitors: "+3 آلاف سنويًا", hours: "طوال النهار", fee: "مجانًا", bestTime: "أكتوبر – أبريل", access: "سيارة دفع رباعي", stay: "مخيمات بيئية" }),
  d({ id: "gold-mohur", ar: "شاطئ جولدمور", en: "Gold Mohur Beach", gov: "aden", category: "beach", rating: 4.7, reviews: 233, image: aden,
    descAr: "خليج ذهبي هادئ بمياه صافية للسباحة والغوص.", longAr: "يقع في التواهي، محاط بجبال بركانية ويعد من أجمل شواطئ عدن.",
    lat: 12.7703, lng: 44.9621, visitors: "+80 ألف سنويًا", hours: "6 ص – 10 م", fee: "رسوم رمزية", bestTime: "نوفمبر – مارس", access: "سهل", stay: "فنادق خور مكسر" }),
  d({ id: "aden-tanks", ar: "صهاريج الطويلة", en: "Aden Tanks", gov: "aden", category: "historic", rating: 4.6, reviews: 167, image: aden,
    descAr: "صهاريج مياه قديمة محفورة في الصخر البركاني.", longAr: "منظومة هندسية مذهلة لحصاد مياه الأمطار يعود تاريخها لقرون.",
    lat: 12.7797, lng: 45.0367, visitors: "+20 ألف سنويًا", hours: "8 ص – 6 م", fee: "رسوم رمزية", bestTime: "شتاءً", access: "سهل من كريتر", stay: "فنادق عدن" }),
  d({ id: "arsh-bilqis", ar: "عرش بلقيس", en: "Arsh Bilqis", gov: "marib", category: "historic", rating: 4.8, reviews: 145, image: marib,
    descAr: "أعمدة معبد سبئي شامخة منذ ثلاثة آلاف عام.", longAr: "معبد برّان السبئي، أحد أبرز شواهد حضارة مملكة سبأ.",
    lat: 15.4, lng: 45.35, visitors: "+5 آلاف سنويًا", hours: "8 ص – 5 م", fee: "رسوم رمزية", bestTime: "نوفمبر – فبراير", access: "سهل من مأرب", stay: "فنادق مأرب" }),
  d({ id: "jabal-sabir", ar: "جبل صبر", en: "Mount Sabir", gov: "taiz", category: "mountain", rating: 4.7, reviews: 189, image: hero,
    descAr: "جبل أخضر شاهق يطل على مدينة تعز.", longAr: "يرتفع 3000 متر وتكسوه المدرجات والقرى، وإطلالته على تعز ليلًا ساحرة.",
    lat: 13.53, lng: 44.03, visitors: "+15 ألف سنويًا", hours: "طوال النهار", fee: "مجانًا", bestTime: "طوال العام", access: "طريق جبلي", stay: "فنادق تعز" }),
  d({ id: "jibla", ar: "مدينة جبلة", en: "Jibla", gov: "ibb", category: "historic", rating: 4.7, reviews: 112, image: waterfall,
    descAr: "مدينة الملكة أروى الحجرية بين الجبال الخضراء.", longAr: "عاصمة الدولة الصليحية، وتضم جامع الملكة أروى وقصورًا حجرية متدرجة.",
    lat: 13.9214, lng: 44.1394, visitors: "+10 آلاف سنويًا", hours: "طوال النهار", fee: "مجانًا", bestTime: "يوليو – أكتوبر", access: "سهل من إب", stay: "فنادق إب" }),
];

// معارض الصور للوجهات المضمّنة. أول صورة هي الغلاف، والبقية تُعرض بالتقليب التلقائي.
// عند الربط مع Supabase تُدار الصور من لوحة التحكم (تبويب «صور المواقع»).
const galleries = {
  "old-sanaa": [sanaa, souq, hero, shibam],
  "souq-al-milh": [souq, sanaa, hero],
  "bani-matar-falls": [waterfall, hero, sanaa],
  "dar-al-hajar": [hero, sanaa, waterfall],
  "shibam": [shibam, marib, sanaa],
  "wadi-doan": [shibam, hero, marib],
  "mukalla-corniche": [aden, shibam, souq],
  "detwah": [socotra, aden, waterfall],
  "dixam": [socotra, hero, aden],
  "gold-mohur": [aden, socotra, hero],
  "aden-tanks": [aden, sanaa, marib],
  "arsh-bilqis": [marib, shibam, sanaa],
  "jabal-sabir": [hero, waterfall, sanaa],
  "jibla": [waterfall, hero, sanaa],
};
destinations.forEach((x) => { if (galleries[x.id]) { x.gallery = galleries[x.id]; x.image = x.gallery[0]; } });

// صور الصفحة الرئيسية (تُقلَّب تلقائيًا). تُدار من لوحة التحكم > «صور الصفحة الرئيسية».
const heroSlides = [
  { image: hero,     title: "جبال اليمن وقراها المعلّقة", titleEn: "Yemen's mountains and hanging villages" },
  { image: socotra,  title: "سقطرى — جزيرة دم الأخوين", titleEn: "Socotra — island of dragon's blood trees" },
  { image: shibam,   title: "شبام حضرموت — منهاتن الصحراء", titleEn: "Shibam Hadramawt — Manhattan of the desert" },
  { image: aden,     title: "شواطئ عدن", titleEn: "Beaches of Aden" },
  { image: waterfall,title: "مدرجات إب وشلالاتها", titleEn: "Ibb's terraces and waterfalls" },
  { image: sanaa,    title: "صنعاء القديمة", titleEn: "Old Sana'a" },
];

// بيانات التواصل
const contact = {
  phone: "+967780788105",
  phoneDisplay: "+967 780 788 105",
  whatsapp: "967780788105",
  email: "info@msar-ye.com",
};

const govBySlug = (s) => governorates.find((x) => x.slug === s);
const destById = (id) => destinations.find((x) => x.id === id);
const destCountForGov = (s) => destinations.filter((x) => x.gov === s).length;
const catLabel = (c, lang) => categories.find((x) => x.id === c)?.[lang] ?? c;

const mapsDirections = (lat, lng) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
const mapsEmbed = (lat, lng, z = 12) =>
  `https://maps.google.com/maps?q=${lat},${lng}&z=${z}&output=embed`;

const tripTypes = [
  { emoji: "🏔", ar: "المغامرات والجبال", en: "Adventure & Mountains", cats: ["mountain"] },
  { emoji: "🏖", ar: "الشواطئ والجزر", en: "Beaches & Islands", cats: ["beach", "island"] },
  { emoji: "🏛", ar: "التاريخ والتراث", en: "History & Heritage", cats: ["historic", "museum"] },
  { emoji: "🌿", ar: "الطبيعة والوديان", en: "Nature & Valleys", cats: ["nature", "valley"] },
  { emoji: "🏜", ar: "الصحراء", en: "Desert", cats: ["desert"] },
  { emoji: "🏙", ar: "المدن والأسواق", en: "Cities & Markets", cats: ["market"] },
  { emoji: "🍽", ar: "المطاعم والمأكولات", en: "Food", cats: ["restaurant"] },
  { emoji: "🏨", ar: "الفنادق والإقامة", en: "Hotels", cats: ["hotel"] },
  { emoji: "🎯", ar: "الأنشطة والترفيه", en: "Activities", cats: ["leisure"] },
];


const articles = [
  { slug: "best-places-yemen", title: "أفضل الأماكن السياحية في اليمن", summary: "جولة على أجمل عشر وجهات من صنعاء إلى سقطرى.", date: "2026-09-12", image: hero,
    body: ["اليمن بلد التنوع المذهل؛ من الجبال الشاهقة إلى الشواطئ الفيروزية والصحاري الذهبية.", "ابدأ رحلتك من صنعاء القديمة، ثم اتجه إلى دار الحجر، فشبام حضرموت، واختم بسحر سقطرى.", "خطط لرحلتك في الفترة بين أكتوبر ومارس للاستمتاع بطقس معتدل."], related: ["old-sanaa", "dar-al-hajar", "shibam", "detwah"] },
  { slug: "best-of-sanaa", title: "أفضل الأماكن في صنعاء", summary: "من الأسواق العتيقة إلى القصور المعلّقة.", date: "2026-08-30", image: sanaa,
    body: ["صنعاء متحف مفتوح، كل زقاق فيها يحكي قصة.", "لا تفوّت سوق الملح ودار الحجر وشلالات بني مطر."], related: ["old-sanaa", "souq-al-milh", "dar-al-hajar", "bani-matar-falls"] },
  { slug: "best-of-hadramawt", title: "أفضل الأماكن في حضرموت", summary: "وادٍ من الطين والعسل والتاريخ.", date: "2026-08-14", image: shibam,
    body: ["حضرموت أرض الحضارة والتجارة.", "زر شبام ووادي دوعن وكورنيش المكلا."], related: ["shibam", "wadi-doan", "mukalla-corniche"] },
  { slug: "best-of-socotra", title: "أفضل الأماكن في سقطرى", summary: "جزيرة من كوكب آخر.", date: "2026-07-22", image: socotra,
    body: ["سقطرى موطن لمئات الأنواع النباتية المتوطنة.", "خيّم في ديطوح وتجول بين أشجار ديكسم."], related: ["detwah", "dixam"] },
  { slug: "best-beaches", title: "أفضل الشواطئ اليمنية", summary: "أكثر من 2000 كم من السواحل الساحرة.", date: "2026-07-05", image: aden,
    body: ["من عدن إلى المهرة وسقطرى، شواطئ اليمن من الأجمل في المنطقة."], related: ["gold-mohur", "detwah", "mukalla-corniche"] },
  { slug: "traveler-guide", title: "دليل المسافر إلى اليمن", summary: "كل ما تحتاج معرفته قبل السفر.", date: "2026-06-18", image: souq,
    body: ["أفضل وقت للسفر من أكتوبر إلى مارس.", "احترم العادات المحلية، وجرّب المأكولات الشعبية كالسلتة والمندي.", "استخدم مسار للوصول المباشر لكل وجهة عبر Google Maps."], related: ["old-sanaa", "souq-al-milh"] },
];

window.MASAR_DATA={images,categories,governorates,destinations,tripTypes,articles,heroSlides,contact,catLabel,destById,govBySlug,destCountForGov,mapsDirections,mapsEmbed};
