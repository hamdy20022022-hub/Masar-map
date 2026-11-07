/* مواقع سياحية إضافية لكل محافظة (طبيعية، تاريخية، ترفيهية، شواطئ، جبال، أودية، جزر، متاحف، أسواق، فنادق، صحراء).
   كل موقع مرتبط بـ Google Maps عن طريق اسمه (الحقل gq)، فتفتح الخريطة على المكان الحقيقي حتى لو كانت الإحداثيات تقريبية.
   الصور هنا مؤقتة من صور الموقع الحالية؛ استبدلها أو أضف صورًا حقيقية من لوحة التحكم (صور المواقع).
   لإضافة موقع جديد هنا: انسخ سطرًا واحدًا من الجدول أدناه وعدّله. المطاعم والفنادق وغيرها تُعرض أيضًا مباشرة من Google Maps لكل محافظة. */
(function () {
  const D = window.MASAR_DATA, I = D.images;
  const IMG = { hero: I.hero, socotra: I.socotra, shibam: I.shibam, sanaa: I.sanaa, aden: I.aden, waterfall: I.waterfall, marib: I.marib, souq: I.souq };

  const tail = {
    historic: "يُنصح بالتجول فيه برفقة دليل محلي، وبالزيارة صباحًا أو قبيل الغروب للاستمتاع بأجمل ضوء.",
    nature: "المكان مناسب للتنزه والتصوير، ويُنصح بالتأكد من حالة الطريق والطقس قبل التوجه إليه.",
    beach: "أفضل أوقات الزيارة في الأجواء المعتدلة، ويُنصح بالتأكد من حالة الطريق والبحر قبل السفر.",
    mountain: "يُنصح بالزيارة في الأجواء الصافية مع ملابس مناسبة وحذاء للمشي.",
    valley: "مكان مثالي للتصوير والتنزه بين المزارع والقرى، ويُفضّل الذهاب في الصباح.",
    island: "الوصول إليه يحتاج تخطيطًا مسبقًا، ويُفضّل التنسيق مع مرشد أو مكتب سياحي محلي.",
    museum: "تحقّق من أوقات الدوام قبل الزيارة، وخصّص ساعة على الأقل للتجول بين المعروضات.",
    market: "أفضل أوقات الزيارة صباحًا وقبيل المغرب، وجرّب المنتجات المحلية وتفاوض بلطف على الأسعار.",
    hotel: "تحقّق من الحجز والأسعار والحالة الحالية عبر Google Maps قبل الوصول.",
    leisure: "مكان مناسب للعائلة والأصدقاء، وأجمل أوقاته في المساء.",
    desert: "يُنصح بالسفر مع مرشد محلي وسيارة دفع رباعي وتزويد الرحلة بالماء الكافي.",
  };

  // [id, المحافظة, الفئة, الاسم, English, بحث Google Maps, lat, lng, الصور, وصف مختصر, English, وصف إضافي (اختياري)]
  const rows = [
    /* ───────────── أمانة العاصمة ───────────── */
    ["bab-al-yemen", "amanat-al-asimah", "historic", "باب اليمن", "Bab Al-Yemen", "باب اليمن، صنعاء", 15.3537, 44.2077, "sanaa,souq,hero",
      "البوابة التاريخية لصنعاء القديمة وبداية الجولة في أسواقها العتيقة.", "The historic gate of Old Sana'a and the start of the souq tour."],
    ["great-mosque-sanaa", "amanat-al-asimah", "historic", "الجامع الكبير بصنعاء", "Great Mosque of Sana'a", "الجامع الكبير، صنعاء القديمة", 15.3547, 44.2089, "sanaa,souq",
      "من أقدم المساجد في العالم الإسلامي، يقع في قلب صنعاء القديمة.", "One of the oldest mosques in the Islamic world, in the heart of Old Sana'a."],
    ["national-museum-sanaa", "amanat-al-asimah", "museum", "المتحف الوطني — صنعاء", "National Museum — Sana'a", "المتحف الوطني، صنعاء", 15.3566, 44.2012, "sanaa,marib,shibam",
      "يحفظ آثارًا من حضارات سبأ ومعين وقتبان وحمير وحضرموت.", "Antiquities from the Sabaean, Minaean, Qatabanian, Himyarite and Hadrami kingdoms."],
    ["jabal-nuqum", "amanat-al-asimah", "mountain", "جبل نقم", "Jabal Nuqum", "جبل نقم، صنعاء", 15.3478, 44.2750, "hero,sanaa",
      "جبل يطل على العاصمة من الشرق بإطلالة واسعة على صنعاء.", "A mountain east of the capital with sweeping views over Sana'a."],
    ["al-sabeen-park", "amanat-al-asimah", "leisure", "حديقة السبعين", "Al-Sabeen Park", "حديقة السبعين، صنعاء", 15.3370, 44.2000, "sanaa,hero",
      "متنزه عائلي كبير في جنوب العاصمة بمساحات خضراء وألعاب للأطفال.", "A large family park in southern Sana'a with green spaces and playgrounds."],
    ["taj-talha-hotel", "amanat-al-asimah", "hotel", "فندق تاج طلحة", "Taj Talha Hotel", "فندق تاج طلحة، صنعاء", 15.3548, 44.2064, "sanaa,souq",
      "فندق تراثي في صنعاء القديمة بطابع معماري يمني أصيل.", "A heritage hotel in Old Sana'a with authentic Yemeni architecture."],
    ["movenpick-sanaa", "amanat-al-asimah", "hotel", "فندق موفنبيك صنعاء", "Mövenpick Hotel Sana'a", "فندق موفنبيك صنعاء", 15.3694, 44.1910, "sanaa,hero",
      "فندق دولي بخدمات إقامة متكاملة في العاصمة.", "An international-standard hotel in the capital."],

    /* ───────────── صنعاء ───────────── */
    ["wadi-dhahr", "sanaa", "valley", "وادي ظهر", "Wadi Dhahr", "وادي ظهر، صنعاء", 15.4400, 44.1200, "hero,waterfall,sanaa",
      "وادٍ أخضر شمال غرب العاصمة تتوسطه صخرة دار الحجر وتحيط به البساتين.", "A green valley northwest of the capital, home of Dar Al-Hajar rock palace."],
    ["jabal-nabi-shuaib", "sanaa", "mountain", "جبل النبي شعيب", "Jabal An-Nabi Shu'ayb", "جبل النبي شعيب", 15.2741, 43.9778, "hero,waterfall",
      "أعلى قمة جبلية في شبه الجزيرة العربية.", "The highest peak on the Arabian Peninsula."],
    ["haraz-mountains", "sanaa", "mountain", "جبال حراز (مناخة)", "Haraz Mountains (Manakhah)", "مناخة، جبال حراز", 15.0833, 43.7500, "hero,waterfall,sanaa",
      "سلسلة جبلية تضم قرى حجرية معلّقة ومدرجات البن، وأشهر بلداتها مناخة.", "Mountains of hanging stone villages and coffee terraces; Manakhah is its best-known town."],

    /* ───────────── عدن ───────────── */
    ["jabal-shamsan", "aden", "mountain", "جبل شمسان", "Jabal Shamsan", "جبل شمسان، عدن", 12.7753, 45.0328, "aden,hero",
      "بركان خامد تقع مدينة كريتر داخل فوهته، ورمز من رموز عدن.", "An extinct volcano whose crater holds the Crater district — a symbol of Aden."],
    ["sira-fortress", "aden", "historic", "قلعة صيرة", "Sira Fortress", "قلعة صيرة، عدن", 12.7812, 45.0408, "aden,sanaa",
      "قلعة تاريخية فوق صخرة بركانية تطل على ميناء عدن وخليجها.", "A historic fortress on a volcanic rock overlooking Aden's harbour."],
    ["aidrus-mosque", "aden", "historic", "مسجد العيدروس", "Al-Aidrus Mosque", "مسجد العيدروس، عدن", 12.7799, 45.0362, "aden,sanaa",
      "مسجد تاريخي في كريتر ومن أبرز معالم عدن الدينية والمعمارية.", "A historic mosque in Crater and one of Aden's landmark buildings."],
    ["aden-national-museum", "aden", "museum", "متحف عدن الوطني", "Aden National Museum", "المتحف الوطني، عدن", 12.7806, 45.0365, "aden,marib,sanaa",
      "يعرض مقتنيات وآثارًا تروي تاريخ عدن وجنوب اليمن.", "Artefacts that tell the story of Aden and southern Yemen."],
    ["crater-market", "aden", "market", "سوق كريتر", "Crater Market", "سوق كريتر، عدن", 12.7790, 45.0370, "souq,aden",
      "السوق الشعبي الأشهر في عدن القديمة بشوارعه وأسواقه التقليدية.", "Aden's best-known traditional market in the old town."],
    ["movenpick-aden", "aden", "hotel", "فندق موفنبيك عدن", "Mövenpick Hotel Aden", "فندق موفنبيك عدن", 12.7738, 44.9689, "aden,socotra",
      "فندق عالمي مطل على البحر في عدن.", "An international seafront hotel in Aden."],

    /* ───────────── تعز ───────────── */
    ["qahira-castle-taiz", "taiz", "historic", "قلعة القاهرة", "Al-Qahira Castle", "قلعة القاهرة، تعز", 13.5760, 44.0405, "hero,waterfall,sanaa",
      "قلعة تاريخية على سفح جبل صبر تشرف على مدينة تعز.", "A historic castle on the slopes of Mount Sabir overlooking Taiz."],
    ["ashrafiya-mosque", "taiz", "historic", "مسجد ومدرسة الأشرفية", "Al-Ashrafiya Mosque", "مسجد الأشرفية، تعز", 13.5780, 44.0215, "sanaa,marib",
      "من أبرز مساجد تعز التاريخية بقبابه الملوّنة ومعماره الرسولي.", "One of Taiz's most notable historic mosques, with colourful domes and Rasulid architecture."],
    ["mocha-port", "taiz", "historic", "ميناء المخا التاريخي", "Port of Mocha", "ميناء المخا", 13.3199, 43.2514, "aden,souq",
      "ميناء عريق ارتبط اسمه بتجارة البن اليمني عبر القرون.", "An ancient port whose name is tied to the Yemeni coffee trade."],
    ["mocha-beach", "taiz", "beach", "شاطئ المخا", "Mocha Beach", "شاطئ المخا", 13.3150, 43.2450, "aden,socotra",
      "شاطئ على البحر الأحمر في مدينة المخا الساحلية.", "A Red Sea beach in the coastal town of Mocha."],

    /* ───────────── الحديدة ───────────── */
    ["zabid", "hodeidah", "historic", "مدينة زبيد التاريخية", "Historic Town of Zabid", "مدينة زبيد", 14.1958, 43.3153, "sanaa,shibam,marib",
      "مدينة مدرجة في قائمة اليونسكو للتراث العالمي، اشتهرت بعلمائها ومساجدها.", "A UNESCO World Heritage town famed for its scholars and mosques."],
    ["hodeidah-corniche", "hodeidah", "leisure", "كورنيش الحديدة", "Hodeidah Corniche", "كورنيش الحديدة", 14.8000, 42.9400, "aden,socotra",
      "واجهة بحرية على البحر الأحمر للتنزه والمأكولات البحرية.", "A Red Sea waterfront for evening walks and seafood."],
    ["kamaran-island", "hodeidah", "island", "جزيرة كمران", "Kamaran Island", "جزيرة كمران", 15.3333, 42.6000, "socotra,aden",
      "جزيرة في البحر الأحمر تشتهر بمياهها الصافية وحياتها البحرية.", "A Red Sea island known for clear waters and marine life."],

    /* ───────────── حضرموت ───────────── */
    ["seiyun-palace", "hadramawt", "historic", "قصر سيئون", "Seiyun Palace", "قصر سيئون", 15.9419, 48.7876, "shibam,marib,sanaa",
      "قصر السلطان الكثيري المطل على مدينة سيئون، ويضم متحفًا.", "The Kathiri sultans' palace overlooking Seiyun, now housing a museum."],
    ["tarim", "hadramawt", "historic", "مدينة تريم", "Tarim", "مدينة تريم، حضرموت", 16.0535, 49.0034, "shibam,marib",
      "مدينة العلم والمساجد، تشتهر بمسجد المحضار ومئذنته الطينية الشاهقة.", "A city of scholarship and mosques, known for the Al-Mihdhar mosque and its tall mud-brick minaret."],
    ["ghuwayzi-fort", "hadramawt", "historic", "قلعة الغويزي", "Al-Ghuwayzi Fort", "قلعة الغويزي، المكلا", 14.5380, 49.1296, "aden,shibam",
      "قلعة تطل على ميناء المكلا وبحر العرب.", "A fort overlooking Mukalla's port and the Arabian Sea."],
    ["mukalla-sultan-palace", "hadramawt", "museum", "قصر السلطان القعيطي (متحف المكلا)", "Al-Qu'aiti Sultan's Palace (Mukalla Museum)", "قصر السلطان القعيطي، المكلا", 14.5360, 49.1245, "shibam,aden,sanaa",
      "قصر السلطان القعيطي في المكلا، يضم متحفًا للآثار والتراث الحضرمي.", "The Qu'aiti sultan's palace in Mukalla, home to an archaeology and heritage museum."],

    /* ───────────── إب ───────────── */
    ["ibb-old-city", "ibb", "historic", "مدينة إب القديمة", "Old City of Ibb", "مدينة إب القديمة", 13.9667, 44.1833, "waterfall,hero,sanaa",
      "مدينة حجرية فوق جبل تحيط بها المدرجات الخضراء وتشتهر بأجوائها الماطرة.", "A hilltop stone city ringed by green terraces and frequent rain."],
    ["jabal-badan", "ibb", "mountain", "جبل بعدان", "Jabal Ba'dan", "جبل بعدان، إب", 13.9000, 44.1500, "hero,waterfall",
      "جبل أخضر في إب تكسوه المدرجات والقرى.", "A green mountain in Ibb covered with terraces and villages."],
    ["zafar-himyar", "ibb", "historic", "ظفار — عاصمة حمير", "Zafar — Himyarite capital", "ظفار حمير، يريم", 14.2054, 44.3939, "marib,shibam,sanaa",
      "العاصمة القديمة لمملكة حمير قرب مدينة يريم.", "The ancient capital of the Himyarite kingdom, near Yarim."],

    /* ───────────── ذمار ───────────── */
    ["hammam-ali", "dhamar", "nature", "ينابيع حمام علي الحارة", "Hammam Ali Hot Springs", "حمام علي، ذمار", 14.5100, 44.3800, "waterfall,hero",
      "ينابيع حارة طبيعية في ذمار يقصدها الزوار للاستجمام.", "Natural hot springs in Dhamar, visited for relaxation."],
    ["dhamar-museum", "dhamar", "museum", "متحف ذمار", "Dhamar Museum", "متحف ذمار", 14.5427, 44.4051, "marib,sanaa,shibam",
      "يعرض مقتنيات أثرية من العصر الحميري وما قبله.", "Archaeological finds from the Himyarite era and before."],

    /* ───────────── ريمة ───────────── */
    ["raymah-mountains", "raymah", "mountain", "جبال ريمة", "Raymah Mountains", "جبال ريمة", 14.6000, 43.6000, "hero,waterfall",
      "جبال خضراء يلفّها الضباب وتتربع القرى على قممها.", "Green, mist-wrapped mountains with villages on the summits."],

    /* ───────────── المحويت ───────────── */
    ["shibam-kawkaban", "al-mahwit", "historic", "شبام كوكبان", "Shibam Kawkaban", "شبام كوكبان", 15.5167, 43.9167, "hero,sanaa,waterfall",
      "مدينة محصّنة على جرف جبلي شاهق تشرف على بلدة شبام وسهولها.", "A fortified town on a high cliff above the town of Shibam and its plains."],

    /* ───────────── حجة ───────────── */
    ["kuhlan-mountains", "hajjah", "mountain", "جبال كحلان عفار", "Kuhlan Affar Mountains", "كحلان عفار، حجة", 15.7000, 43.5000, "hero,waterfall",
      "مرتفعات جبلية تعلوها القلاع والحصون في محافظة حجة.", "Highlands topped with forts and castles in Hajjah."],
    ["midi-beach", "hajjah", "beach", "شاطئ ميدي", "Midi Beach", "ميدي، حجة", 16.3000, 42.8000, "aden,socotra",
      "ساحل ميدي على البحر الأحمر وميناؤه القديم.", "The Red Sea coast of Midi and its old port."],

    /* ───────────── صعدة ───────────── */
    ["saada-old-city", "saada", "historic", "مدينة صعدة القديمة", "Old City of Saada", "مدينة صعدة القديمة", 16.9402, 43.7639, "shibam,sanaa,marib",
      "مدينة طينية يحيط بها سور تاريخي وبساتين الرمان والعنب.", "A mud-brick city within a historic wall, amid pomegranate and grape orchards."],
    ["souq-al-talh", "saada", "market", "سوق الطلح", "Souq Al-Talh", "سوق الطلح، صعدة", 16.9500, 43.7700, "souq,sanaa",
      "سوق شعبي كبير في صعدة للمنتجات المحلية والحرف.", "A large traditional market in Saada for local products and crafts."],
    ["al-hadi-mosque", "saada", "historic", "جامع الهادي", "Al-Hadi Mosque", "جامع الهادي، صعدة", 16.9400, 43.7640, "shibam,sanaa",
      "من أقدم مساجد صعدة وأشهر معالمها الدينية.", "One of Saada's oldest and best-known mosques."],

    /* ───────────── عمران ───────────── */
    ["thula", "amran", "historic", "مدينة ثلا", "Thula", "مدينة ثلا", 15.5833, 43.9167, "sanaa,hero,shibam",
      "مدينة حصينة بسورها وبواباتها وبيوتها الحجرية الشاهقة.", "A fortified town of walls, gates and tall stone houses."],
    ["amran-old-city", "amran", "historic", "مدينة عمران القديمة", "Old City of Amran", "مدينة عمران القديمة", 15.6594, 43.9439, "sanaa,souq",
      "مدينة قديمة بمبانيها الحجرية وأزقتها، وبوابة الشمال.", "An old town of stone buildings and alleys, gateway to the north."],

    /* ───────────── الجوف ───────────── */
    ["baraqish", "al-jawf", "historic", "مدينة براقش الأثرية", "Baraqish (Yathill)", "براقش، الجوف", 16.0000, 44.9000, "marib,shibam",
      "مدينة معينية قديمة بسورها وأبراجها ومعبدها.", "An ancient Minaean city with walls, towers and a temple."],
    ["main-qarnaw", "al-jawf", "historic", "مدينة معين (قرناو)", "Ma'in (Qarnaw)", "معين قرناو، الجوف", 16.0000, 44.9500, "marib,shibam",
      "عاصمة مملكة معين القديمة وإحدى حواضر طريق اللبان.", "Capital of the ancient Minaean kingdom on the incense route."],

    /* ───────────── مأرب ───────────── */
    ["marib-dam", "marib", "historic", "سد مأرب", "Marib Dam", "سد مأرب", 15.4000, 45.2000, "marib,shibam,sanaa",
      "من أعظم المنجزات الهندسية في العالم القديم، بُني في عهد مملكة سبأ.", "One of the great engineering feats of the ancient world, built by the Sabaeans."],
    ["awwam-temple", "marib", "historic", "معبد أوام (محرم بلقيس)", "Awwam Temple (Mahram Bilqis)", "معبد أوام، مأرب", 15.4000, 45.3500, "marib,shibam",
      "معبد سبئي كبير للإله المقه بساحة بيضاوية وأعمدة شامخة.", "A great Sabaean temple of Almaqah with an oval enclosure and tall pillars."],
    ["old-marib", "marib", "historic", "مدينة مأرب القديمة", "Old Marib", "مأرب القديمة", 15.4343, 45.3585, "marib,shibam,sanaa",
      "آثار المدينة القديمة المبنية بالطين قرب مدينة مأرب الحديثة.", "Mud-brick remains of the old city near modern Marib."],
    ["ramlat-sabatayn", "marib", "desert", "رملة السبعتين", "Ramlat Al-Sab'atayn", "رملة السبعتين", 15.5000, 46.5000, "marib,shibam",
      "صحراء رملية شاسعة شرق مأرب على طريق قوافل اللبان القديمة.", "A vast sand desert east of Marib on the old incense caravan route."],

    /* ───────────── شبوة ───────────── */
    ["shabwa-ancient", "shabwah", "historic", "شبوة القديمة", "Ancient Shabwa", "شبوة القديمة", 14.7000, 47.0000, "marib,shibam",
      "العاصمة القديمة لمملكة حضرموت على طريق اللبان.", "The ancient capital of the Hadramawt kingdom on the incense route."],
    ["bir-ali", "shabwah", "beach", "شاطئ بير علي", "Bir Ali Beach", "بير علي، شبوة", 14.0333, 48.3333, "aden,socotra",
      "شاطئ رملي على بحر العرب قرب ميناء قنا القديم.", "A sandy Arabian Sea beach beside the ancient port of Qana."],
    ["qana-port", "shabwah", "historic", "ميناء قنا القديم", "Qana Ancient Port", "قنا بير علي", 14.0300, 48.3300, "marib,aden",
      "ميناء قديم لتصدير اللبان من حضرموت إلى العالم القديم، بجوار حصن الغراب.", "An ancient frankincense port beside Husn Al-Ghurab."],
    ["balhaf", "shabwah", "beach", "شاطئ بلحاف", "Balhaf Beach", "شاطئ بلحاف", 13.9700, 48.1800, "aden,socotra",
      "رمال بيضاء ومياه صافية على بحر العرب.", "White sand and clear water on the Arabian Sea."],

    /* ───────────── أبين ───────────── */
    ["shuqra-beach", "abyan", "beach", "شاطئ شقرة", "Shuqra Beach", "شاطئ شقرة، أبين", 13.3500, 45.7000, "aden,socotra",
      "مدينة ساحلية هادئة على خليج عدن بشاطئها ومينائها الصغير.", "A quiet Gulf of Aden coastal town with a beach and small harbour."],
    ["abyan-delta", "abyan", "valley", "دلتا أبين", "Abyan Delta", "دلتا أبين", 13.1500, 45.3800, "waterfall,hero",
      "دلتا زراعية خضراء من أخصب أراضي اليمن تغذيها مياه وادي بنا.", "A green agricultural delta, among Yemen's most fertile lands, fed by Wadi Bana."],

    /* ───────────── لحج ───────────── */
    ["husseini-gardens", "lahij", "nature", "حدائق الحسيني", "Al-Husseini Gardens", "حدائق الحسيني، لحج", 13.0600, 44.8900, "waterfall,hero",
      "بساتين خضراء في الحوطة ارتبطت بتراث لحج الفني والغنائي.", "Green orchards in Al-Hawta tied to Lahij's musical heritage."],
    ["lahj-sultan-palace", "lahij", "historic", "قصر السلطان — الحوطة", "Sultan's Palace — Al-Hawta", "قصر السلطان، الحوطة، لحج", 13.0560, 44.8830, "sanaa,shibam",
      "قصر سلاطين لحج في الحوطة، من أبرز معالمها المعمارية.", "The Lahij sultans' palace in Al-Hawta, a key architectural landmark."],
    ["radfan-mountains", "lahij", "mountain", "جبال ردفان", "Radfan Mountains", "جبال ردفان", 13.5000, 44.7000, "hero,waterfall",
      "سلسلة جبلية وعرة شمال لحج.", "A rugged mountain range north of Lahij."],

    /* ───────────── الضالع ───────────── */
    ["jahaf-mountains", "ad-dali", "mountain", "جبال جحاف", "Jahaf Mountains", "جحاف، الضالع", 13.7500, 44.8000, "hero,waterfall",
      "مرتفعات خضراء ووديان زراعية خصبة في الضالع.", "Green highlands and fertile farming valleys in Ad-Dali'."],
    ["damt-hot-springs", "ad-dali", "nature", "ينابيع حمام دمت", "Hammam Damt Hot Springs", "حمام دمت", 13.9500, 44.7200, "waterfall,hero",
      "ينابيع معدنية حارة طبيعية في منطقة دمت.", "Natural mineral hot springs in the Damt area."],

    /* ───────────── البيضاء ───────────── */
    ["rada-amiriya", "al-bayda", "historic", "المدرسة العامرية — رداع", "Al-Amiriya Madrasa — Rada'a", "المدرسة العامرية، رداع", 14.4167, 44.8333, "sanaa,shibam,marib",
      "مدرسة طاهرية فريدة بزخارفها وقبابها، من أجمل الشواهد المعمارية في اليمن.", "A Tahirid madrasa renowned for its decoration and domes, a gem of Yemeni architecture."],

    /* ───────────── المهرة ───────────── */
    ["nishtun-beach", "al-mahrah", "beach", "شاطئ نشطون", "Nishtun Beach", "نشطون، المهرة", 15.8167, 52.1833, "aden,socotra",
      "بلدة ساحلية على بحر العرب بشاطئ رملي طويل وهدوء بكر.", "A coastal town on the Arabian Sea with a long sandy beach and untouched calm."],
    ["hawf-reserve", "al-mahrah", "nature", "محمية حوف", "Hawf Protected Area", "محمية حوف، المهرة", 16.8000, 53.1000, "waterfall,hero,socotra",
      "غابة ضبابية قرب حدود عُمان تكتسي بالخضرة في موسم الخريف.", "A misty forest near the Omani border that turns green in the monsoon season."],
    ["ghaydah-corniche", "al-mahrah", "leisure", "كورنيش الغيضة", "Al-Ghaydah Corniche", "كورنيش الغيضة", 16.2079, 52.1761, "aden,socotra",
      "واجهة بحرية للتنزه في مدينة الغيضة.", "A seafront promenade in Al-Ghaydah."],

    /* ───────────── سقطرى ───────────── */
    ["socotra-island", "socotra", "island", "جزيرة سقطرى", "Socotra Island", "جزيرة سقطرى", 12.4634, 53.8237, "socotra,aden,waterfall",
      "موقع تراث عالمي لليونسكو بتنوع حيوي نادر؛ أكثر من ثلث نباتاتها لا يوجد في أي مكان آخر.", "A UNESCO World Heritage site with rare biodiversity; over a third of its plants grow nowhere else."],
    ["arher-beach", "socotra", "beach", "شاطئ أرهر", "Arher Beach", "شاطئ أرهر، سقطرى", 12.6400, 54.2800, "aden,socotra",
      "شاطئ بكثبان رملية بيضاء عالية تلتقي بمياه المحيط الهندي.", "A beach of tall white dunes meeting the Indian Ocean."],
    ["hoq-cave", "socotra", "nature", "كهف هوق", "Hoq Cave", "كهف هوق، سقطرى", 12.6200, 54.3200, "socotra,hero,aden",
      "كهف ضخم يضم نقوشًا قديمة ونتوءات كلسية.", "A huge cave with ancient inscriptions and limestone formations."],
    ["homhil-reserve", "socotra", "nature", "محمية حومهل", "Homhil Protected Area", "محمية حومهل، سقطرى", 12.5500, 54.0000, "socotra,waterfall",
      "هضبة بنباتات نادرة وإطلالات على البحر وأشجار دم الأخوين.", "A plateau of rare plants, sea views and dragon's blood trees."],
  ];

  const haveIds = new Set(D.destinations.map((x) => x.id));
  rows.forEach(([id, gov, category, ar, en, gq, lat, lng, imgs, descAr, descEn, longAr]) => {
    if (haveIds.has(id)) return;
    const gallery = imgs.split(",").map((k) => IMG[k]).filter(Boolean);
    D.destinations.push({
      id, ar, en, gov, category, gq, lat, lng,
      rating: 0, reviews: 0, image: gallery[0], gallery,
      descAr, descEn, longAr: longAr || (descAr + " " + (tail[category] || "")),
      visitors: "", hours: "", fee: "", bestTime: "", access: "", stay: "",
    });
  });
})();
