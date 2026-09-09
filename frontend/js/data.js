/**
 * Mobilya Data - سوق الموبايلات في قضاء أبو غريب
 * المنصة مخصصة حصرياً لأبو غريب ومحلاتها وشوارعها التجارية
 * جميع الأسعار بالدينار العراقي (د.ع)
 */

window.MobilyaData = {
  currentRegion: "أبو غريب - أبو منيصير",
  availableRegions: [
    { id: "ag-mneysir", name: "أبو غريب - أبو منيصير", count: "3 محلات معتمدة", active: true }
  ],

  // أقسام المنصة
  categories: [
    {
      id: "phones",
      name: "الهواتف والأجهزة",
      subName: "أحدث هواتف Apple, Samsung, Xiaomi",
      badge: "جديد ومستعمل",
      icon: "📱",
      gradient: "from-blue-600/20 via-indigo-600/10 to-transparent",
      borderColor: "border-blue-500/30",
      accentColor: "text-blue-400",
      count: "195 هاتف متوفر"
    },
    {
      id: "numbers",
      name: "الخطوط والأرقام",
      subName: "أرقام مميزة VIP وشبكات 5G",
      badge: "أرقام مميزة",
      icon: "💳",
      gradient: "from-emerald-600/20 via-teal-600/10 to-transparent",
      borderColor: "border-emerald-500/30",
      accentColor: "text-emerald-400",
      count: "48 رقم VIP"
    },
    {
      id: "accessories",
      name: "الإكسسوارات والشواحن",
      subName: "سماعات وكفرات وشواحن GaN معتمدة",
      badge: "أصلية 100%",
      icon: "🎧",
      gradient: "from-rose-600/20 via-pink-600/10 to-transparent",
      borderColor: "border-rose-500/30",
      accentColor: "text-rose-400",
      count: "310 ملحق"
    },
    {
      id: "watches",
      name: "الساعات الذكية",
      subName: "Apple Watch & Galaxy Watch",
      badge: "Smartwatches",
      icon: "⌚",
      gradient: "from-purple-600/20 via-indigo-600/10 to-transparent",
      borderColor: "border-purple-500/30",
      accentColor: "text-purple-400",
      count: "64 ساعة"
    },
    {
      id: "maintenance",
      name: "الصيانة الفورية",
      subName: "تبديل شاشات، بطاريات وضمان بورد",
      badge: "صيانة معتمدة",
      icon: "🛠️",
      gradient: "from-cyan-600/20 via-sky-600/10 to-transparent",
      borderColor: "border-cyan-500/30",
      accentColor: "text-cyan-400",
      count: "52 خدمة"
    },
    {
      id: "more",
      name: "الخدمات التقنية",
      subName: "برمجة، نقل بيانات، وفحص ما قبل الشراء",
      badge: "خدمات شاملة",
      icon: "⚙️",
      gradient: "from-slate-700/20 via-slate-800/10 to-transparent",
      borderColor: "border-slate-700/40",
      accentColor: "text-slate-300",
      count: "26 خدمة"
    }
  ],

  // عروض اليوم في محلات أبو غريب
  flashDeals: [
    {
      id: "deal-1",
      name: "سماعات Apple AirPods Pro 2 الأصلية (USB-C)",
      category: "سماعات",
      price: 249000,
      oldPrice: 320000,
      discountBadge: "-22% خصم فوري",
      storeName: "مركز المستقبل للموبايل",
      storeId: "store-1",
      storeRegion: "أبو غريب - الشارع العام",
      image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80",
      claimedPercent: 85,
      claimedText: "تم حجز 17 من أصل 20 قطعة في أبو غريب"
    },
    {
      id: "deal-2",
      name: "Apple iPhone 15 - 128GB تايتانيوم أزرق (وكالة)",
      category: "هواتف",
      price: 1390000,
      oldPrice: 1550000,
      discountBadge: "-160,000 د.ع",
      storeName: "الرافدين ستور أبو غريب",
      storeId: "store-2",
      storeRegion: "أبو غريب - شارع الزيتون",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=80",
      claimedPercent: 90,
      claimedText: "متبقي قطعتان فقط بهذا السعر"
    },
    {
      id: "deal-3",
      name: "Samsung Galaxy S24 Ultra - 256GB تايتانيوم رمادي",
      category: "هواتف",
      price: 1380000,
      oldPrice: 1490000,
      discountBadge: "-11% عرض خاص",
      storeName: "القمة للإلكترونيات",
      storeId: "store-3",
      storeRegion: "أبو غريب - حي الشهداء",
      image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&auto=format&fit=crop&q=80",
      claimedPercent: 75,
      claimedText: "متوفر للتسليم الفوري في أبو غريب"
    },
    {
      id: "deal-4",
      name: "شاحن Anker 65W GaNPrime ثلاثي المنافذ فائق السرعة",
      category: "شواحن",
      price: 35000,
      oldPrice: 55000,
      discountBadge: "-36% توفير كبير",
      storeName: "ديجيتال زون",
      storeId: "store-4",
      storeRegion: "أبو غريب - خان ضاري",
      image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80",
      claimedPercent: 70,
      claimedText: "أفضل سعر شاحن أصلي في القضاء"
    }
  ],

  // المحلات المميزة في قضاء أبو غريب
  stores: [
    {
      id: "store-1",
      name: "مركز المستقبل للموبايل",
      subTitle: "للهواتف والإكسسوارات والصيانة المعتمدة",
      badgeType: "featured",
      badgeText: "👑 مميز",
      verified: true,
      rating: 4.9,
      reviewCount: 218,
      region: "أبو غريب - أبو منيصير",
      address: "أبو غريب - حي أبو منيصير (الشارع التجاري)",
      phone: "+964 770 123 4567",
      whatsapp: "9647701234567",
      workingHours: "يومياً من 8:30 صباحاً - 11:00 مساءً",
      statusText: "مفتوح الآن حتى 11:00 م",
      about: "أكبر مركز موبايل وصيانة متقدمة في قضاء أبو غريب (أبو منيصير). نوفر أحدث أجهزة Apple و Samsung و Xiaomi مع ضمان حقيقي واستبدال معتمد.",
      tags: ["هواتف رائدة", "إكسسوارات أصلية", "صيانة فورية", "خطوط مميزة"],
      featureChips: ["أسعار منافسة في أبو منيصير", "قطع غيار وكالة", "صيانة فورية خلال ساعة"],
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
      cover: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=1200&auto=format&fit=crop&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=400&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&auto=format&fit=crop&q=80"
      ],
      servicesOffered: [
        "بيع وشراء كافة أنواع الأجهزة الذكية",
        "تبديل شاشات OLED و Dynamic AMOLED أصلية",
        "تبديل بطاريات مع المحافظة على نسبة الصحة 100%",
        "صيانة بورد متقدمة وتبديل IC الشحن والباور",
        "خطوط مميزة وتفعيل فوري بالهوية",
        "برامج استبدال الأجهزة القديمة بالجديدة"
      ]
    },
    {
      id: "store-2",
      name: "الرافدين ستور | Al-Rafidain Store",
      subTitle: "أجهزة آبل وسامسونج وضمان رسمي",
      badgeType: "verified",
      badgeText: "✅ موثق",
      verified: true,
      rating: 4.8,
      reviewCount: 165,
      region: "أبو غريب - أبو منيصير",
      address: "أبو غريب - حي أبو منيصير (قرب السوق)",
      phone: "+964 780 987 6543",
      whatsapp: "9647809876543",
      workingHours: "يومياً من 9 صباحاً - 10:30 مساءً",
      statusText: "مفتوح الآن حتى 10:30 م",
      about: "متجر متخصص بكل ما يخص منظومة أجهزة iPhone وساعات Apple Watch وهواتف الفئة الرائدة في أبو منيصير.",
      tags: ["Apple iPhone", "Samsung Ultra", "ساعات ذكية", "صيانة سريعة"],
      featureChips: ["أجهزة مختومة", "ضمان معتمد", "استبدال فوري"],
      logo: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&auto=format&fit=crop&q=80",
      cover: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=80",
      gallery: [],
      servicesOffered: ["فحص أجهزة ما قبل الشراء", "تبديل شاشات أصلية", "نقل بيانات آمن"]
    },
    {
      id: "store-3",
      name: "القمة للإلكترونيات والصيانة",
      subTitle: "صيانة معتمدة وهواتف رائدة",
      badgeType: "featured",
      badgeText: "👑 مميز",
      verified: true,
      rating: 4.7,
      reviewCount: 198,
      region: "أبو غريب - أبو منيصير",
      address: "أبو غريب - حي أبو منيصير (الشارع العام)",
      phone: "+964 771 555 1234",
      whatsapp: "9647715551234",
      workingHours: "السبت - الخميس: 9:00 ص - 11:00 م",
      statusText: "مفتوح الآن حتى 11:00 م",
      about: "مختبر تخصصي متقدم لصيانة بوردات الآيفون والآندرويد، تبديل شاشات أصلية، وتبديل بطاريات في أبو منيصير.",
      tags: ["Samsung Galaxy", "Xiaomi & Redmi", "جيمنج", "صيانة فورية"],
      featureChips: ["أفضل أسعار أبو منيصير", "ضمان حقيقي", "صيانة فورية"],
      logo: "https://images.unsplash.com/photo-1629752187687-3d3c7ea4a21d?w=200&auto=format&fit=crop&q=80",
      cover: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&auto=format&fit=crop&q=80",
      gallery: [],
      servicesOffered: ["تبديل شاشات وكالة", "صيانة أجهزة", "شواحن سريعة"]
    }
  ],

  // أحدث الأجهزة المعروضة في محلات أبو غريب
  products: [
    {
      id: "p-1",
      name: "Apple iPhone 16 Pro Max - 256GB تايتانيوم صحراوي",
      category: "phones",
      price: 1740000,
      oldPrice: 1850000,
      storeName: "مركز المستقبل للموبايل",
      storeId: "store-1",
      inStock: true,
      condition: "جديد وكالة (ضمان سنة)",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
      tag: "الأكثر طلباً في أبو غريب 🔥"
    },
    {
      id: "p-2",
      name: "Samsung Galaxy S24 Ultra - 512GB تايتانيوم أسود",
      category: "phones",
      price: 1540000,
      oldPrice: 1650000,
      storeName: "القمة للإلكترونيات",
      storeId: "store-3",
      inStock: true,
      condition: "جديد أصلي وكالة",
      image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80",
      tag: "Galaxy AI ⚡"
    },
    {
      id: "p-3",
      name: "Xiaomi 14T Pro - 512GB مع كاميرات Leica الاحترافية",
      category: "phones",
      price: 940000,
      oldPrice: 1050000,
      storeName: "مركز المستقبل",
      storeId: "store-1",
      inStock: true,
      condition: "جديد رسمي",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80",
      tag: "أفضل قيمة 💎"
    },
    {
      id: "p-4",
      name: "Apple Watch Ultra 2 تيتانيوم 49mm مع سوار أوشن",
      category: "watches",
      price: 1020000,
      oldPrice: 1140000,
      storeName: "الرافدين ستور",
      storeId: "store-2",
      inStock: true,
      condition: "جديد أصلي",
      image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
      tag: "ضمان وكالة"
    },
    {
      id: "p-5",
      name: "سماعات AirPods Pro 2 الأصلية منفذ Type-C",
      category: "accessories",
      price: 249000,
      oldPrice: 320000,
      storeName: "مركز المستقبل",
      storeId: "store-1",
      inStock: true,
      condition: "جديد أصلي",
      image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80",
      tag: "خصم 22% 🔥"
    },
    {
      id: "p-6",
      name: "شاحن Anker 65W GaNPrime ثلاثي المنافذ فائق السرعة",
      category: "accessories",
      price: 35000,
      oldPrice: 55000,
      storeName: "ديجيتال زون",
      storeId: "store-4",
      inStock: true,
      condition: "جديد وكالة",
      image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
      tag: "GaN 3.0 ⚡"
    }
  ],

  // حاسبة أسعار الصيانة الفورية في محلات أبو غريب
  maintenanceCalculator: {
    devices: [
      { id: "ip16pm", name: "iPhone 16 Pro Max", brand: "apple" },
      { id: "ip16p", name: "iPhone 16 Pro", brand: "apple" },
      { id: "ip15pm", name: "iPhone 15 Pro Max", brand: "apple" },
      { id: "ip14pm", name: "iPhone 14 Pro Max", brand: "apple" },
      { id: "s24u", name: "Samsung Galaxy S24 Ultra", brand: "samsung" },
      { id: "s23u", name: "Samsung Galaxy S23 Ultra", brand: "samsung" },
      { id: "mi14t", name: "Xiaomi 14T Pro", brand: "xiaomi" }
    ],
    issues: [
      { id: "screen_orig", name: "تبديل شاشة أصلية وكالة (OLED)", basePrice: 185000, time: "45 دقيقة", warranty: "ضمان 6 أشهر" },
      { id: "battery_orig", name: "تبديل بطارية أصلية (صحة 100%)", basePrice: 45000, time: "30 دقيقة", warranty: "ضمان 3 أشهر" },
      { id: "charging_ic", name: "تصليح مدخل الشحن / IC باور", basePrice: 35000, time: "ساعة واحدة", warranty: "ضمان شهرين" },
      { id: "back_glass", name: "تبديل زجاج خلفي ليزري فخم", basePrice: 28000, time: "ساعتان", warranty: "فحص جودة" },
      { id: "protection_nano", name: "تركيب درع حماية نانو حراري 360", basePrice: 10000, time: "10 دقائق", warranty: "ضمان عدم التقشير" }
    ]
  },

  // مؤشر أسعار السوق في قضاء أبو غريب
  marketPriceIndex: [
    {
      name: "iPhone 16 Pro Max (256GB)",
      icon: "📱",
      minPrice: 1720000,
      avgPrice: 1750000,
      maxPrice: 1810000,
      storesCount: 18,
      trend: "down",
      trendLabel: "انخفاض طفيف (-25,000 د.ع)"
    },
    {
      name: "iPhone 16 Pro (128GB)",
      icon: "📱",
      minPrice: 1470000,
      avgPrice: 1520000,
      maxPrice: 1580000,
      storesCount: 15,
      trend: "stable",
      trendLabel: "مستقر ومطلوب جداً"
    },
    {
      name: "Samsung S24 Ultra (256GB)",
      icon: "📱",
      minPrice: 1370000,
      avgPrice: 1420000,
      maxPrice: 1480000,
      storesCount: 12,
      trend: "down",
      trendLabel: "عروض تنافسية نشطة"
    },
    {
      name: "AirPods Pro 2 (USB-C)",
      icon: "🎧",
      minPrice: 245000,
      avgPrice: 265000,
      maxPrice: 310000,
      storesCount: 20,
      trend: "stable",
      trendLabel: "أفضل قيمة مقابل السعر"
    }
  ],

  // آراء وتجارب الزبائن الحقيقية في قضاء أبو غريب
  customerReviews: [
    {
      author: "علي الزوبعي",
      role: "زبون من قضاء أبو غريب - الشارع العام",
      rating: 5,
      comment: "بدلت شاشة iPhone 15 Pro عند مركز المستقبل في الشارع العام بـ 40 دقيقة فقط، والسعر كان أوضح وأرخص من أي مكان، منصة موبيليا اختصرت علينا عناء الذهاب لمركز بغداد!",
      store: "مركز المستقبل للموبايل",
      date: "منذ يومين"
    },
    {
      author: "حسين الدليمي",
      role: "متسوق من حي الشهداء",
      rating: 5,
      comment: "قارنت أسعار الـ S24 Ultra بين كل محلات أبو غريب واشتريت من القمة بضمان وكالة رسمي وتوصيل بنفس الساعة لبيتي.",
      store: "القمة للإلكترونيات",
      date: "منذ أسبوع"
    },
    {
      author: "سعد العيساوي",
      role: "مشتري خط من خان ضاري",
      rating: 5,
      comment: "أخذت رقم آسيا سيل ذهبي مميز مع تثبيت ملكية بالهوية فوري خلال ربع ساعة، خدمة راقية جداً من ركن الاتصالات.",
      store: "ركن الاتصالات",
      date: "منذ أسبوعين"
    }
  ]
};
