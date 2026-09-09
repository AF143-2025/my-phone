/**
 * Mobilya Data - سوق الموبايلات في قضاء أبو غريب
 * المنصة مخصصة حصرياً لأبو غريب ومحلاتها وشوارعها التجارية (أبو منيصير)
 * جميع الأسعار بالدينار العراقي (د.ع)
 * متطابقة 100% مع قاعدة بيانات PostgreSQL والخادم
 */

window.MobilyaData = {
  currentRegion: "أبو غريب - أبو منيصير",
  availableRegions: [
    { id: "ag-mneysir", name: "أبو غريب - أبو منيصير", count: "3 محلات معتمدة", active: true }
  ],

  // أقسام المنصة
  categories: [
    {
      id: 1,
      name: "الهواتف والأجهزة",
      subName: "أحدث هواتف Apple, Samsung, Xiaomi",
      badge: "جديد ومستعمل",
      icon: "📱",
      gradient: "from-blue-600/20 via-indigo-600/10 to-transparent",
      borderColor: "border-blue-500/30",
      accentColor: "text-blue-400",
      count: "8 هواتف متوفرة",
      products_count: 8
    },
    {
      id: 2,
      name: "الخطوط والأرقام",
      subName: "أرقام مميزة VIP وشبكات 5G",
      badge: "أرقام مميزة",
      icon: "💳",
      gradient: "from-emerald-600/20 via-teal-600/10 to-transparent",
      borderColor: "border-emerald-500/30",
      accentColor: "text-emerald-400",
      count: "خطوط VIP",
      products_count: 2
    },
    {
      id: 3,
      name: "الإكسسوارات والشواحن",
      subName: "سماعات وكفرات وشواحن GaN معتمدة",
      badge: "أصلية 100%",
      icon: "🎧",
      gradient: "from-rose-600/20 via-pink-600/10 to-transparent",
      borderColor: "border-rose-500/30",
      accentColor: "text-rose-400",
      count: "إكسسوارات أصلية",
      products_count: 4
    },
    {
      id: 4,
      name: "الساعات الذكية",
      subName: "Apple Watch & Galaxy Watch",
      badge: "Smartwatches",
      icon: "⌚",
      gradient: "from-purple-600/20 via-indigo-600/10 to-transparent",
      borderColor: "border-purple-500/30",
      accentColor: "text-purple-400",
      count: "ساعات ذكية",
      products_count: 2
    },
    {
      id: 5,
      name: "الصيانة الفورية",
      subName: "تبديل شاشات، بطاريات وضمان بورد",
      badge: "صيانة معتمدة",
      icon: "🛠️",
      gradient: "from-cyan-600/20 via-sky-600/10 to-transparent",
      borderColor: "border-cyan-500/30",
      accentColor: "text-cyan-400",
      count: "5 خدمات معتمدة",
      products_count: 5
    },
    {
      id: 6,
      name: "الخدمات والبرمجة",
      subName: "برمجة، نقل بيانات، وفحص ما قبل الشراء",
      badge: "خدمات شاملة",
      icon: "⚙️",
      gradient: "from-slate-700/20 via-slate-800/10 to-transparent",
      borderColor: "border-slate-700/40",
      accentColor: "text-slate-300",
      count: "خدمات فورية",
      products_count: 3
    }
  ],

  // المحلات المعتمدة في قضاء أبو غريب (أبو منيصير) - متطابقة 100% مع قاعدة بيانات PostgreSQL
  stores: [
    {
      id: 1,
      store_id: 1,
      owner_id: 2,
      name: "مركز الرافدين للموبايل",
      subTitle: "للهواتف والإكسسوارات والصيانة المعتمدة",
      badgeType: "featured",
      badgeText: "👑 مميز",
      verified: true,
      status: "approved",
      avg_rating: 5.0,
      rating: 5.0,
      reviews_count: 3,
      reviewCount: 3,
      products_count: 5,
      services_count: 0,
      location: "أبو غريب - أبو منيصير",
      region: "أبو غريب - أبو منيصير",
      address: "أبو غريب - حي أبو منيصير (الشارع التجاري)",
      phone: "07701112233",
      whatsapp: "9647701112233",
      opening_hours: "9:00 ص - 11:00 م",
      workingHours: "يومياً من 9:00 ص - 11:00 م",
      statusText: "مفتوح الآن حتى 11:00 م",
      description: "أكبر صالة عرض لهواتف آبل وسامسونج وشاومي مع قسم صيانة معتمد وقطع غيار أصلية 100%.",
      about: "أكبر صالة عرض لهواتف آبل وسامسونج وشاومي في قضاء أبو غريب (أبو منيصير) مع قسم صيانة معتمد وقطع غيار أصلية 100%. نوفر أحدث أجهزة Apple و Samsung و Xiaomi مع ضمان حقيقي واستبدال معتمد.",
      logo: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=200",
      cover_image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1000",
      cover: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1000",
      tags: ["هواتف رائدة", "إكسسوارات أصلية", "Apple & Samsung", "ضمان وكالة"],
      featureChips: ["الشارع التجاري - أبو منيصير", "أجهزة أصلية 100%", "ضمان سنة كاملة"],
      servicesOffered: [
        "بيع وشراء كافة أنواع الأجهزة الذكية الأصلية",
        "تبديل شاشات OLED أصلية",
        "تبديل بطاريات مع المحافظة على نسبة الصحة 100%",
        "إكسسوارات وشواحن GaN معتمدة عالمياً"
      ],
      products: [
        {
          id: 1,
          store_id: 1,
          category_id: 1,
          category_name: "الهواتف والأجهزة",
          category_icon: "📱",
          name: "iPhone 16 Pro Max (256GB)",
          description: "نسخة الشرق الأوسط شريحتين، ضمان وكالة Apple الرسمي سنة كاملة، التيتانيوم الصحراوي.",
          price: 1740000,
          old_price: 1850000,
          availability: "available",
          image_url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600"
        },
        {
          id: 3,
          store_id: 1,
          category_id: 1,
          category_name: "الهواتف والأجهزة",
          category_icon: "📱",
          name: "iPhone 15 Pro (128GB)",
          description: "تيتانيوم طبيعي، معالج A17 Pro، كاميرا احترافية بدقة 48MP، حالة الجهاز: جديد بكرتونته.",
          price: 1325000,
          old_price: 1450000,
          availability: "available",
          image_url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600"
        },
        {
          id: 5,
          store_id: 1,
          category_id: 3,
          category_name: "الإكسسوارات والشواحن",
          category_icon: "🎧",
          name: "سماعات Apple AirPods Pro 2 (USB-C)",
          description: "إلغاء الضوضاء النشط المتطور، صوت مكاني مخصص، ومقاومة للماء والعرق بمعيار IP54.",
          price: 285000,
          old_price: 365000,
          availability: "available",
          image_url: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600"
        },
        {
          id: 6,
          store_id: 1,
          category_id: 3,
          category_name: "الإكسسوارات والشواحن",
          category_icon: "🎧",
          name: "شاحن Anker 65W GaN Prime السريع",
          description: "شاحن جداري 3 منافذ يدعم أحدث بروتوكولات الشحن السريع للآيفون والسامسونج واللابتوب.",
          price: 45000,
          old_price: 60000,
          availability: "available",
          image_url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600"
        },
        {
          id: 8,
          store_id: 1,
          category_id: 4,
          category_name: "الساعات الذكية",
          category_icon: "⌚",
          name: "Apple Watch Series 10 (46mm)",
          description: "شاشة OLED واسعة بزوايا رؤية محسنة، مستشعرات صحية متقدمة وتخطيط نبضات القلب ECG.",
          price: 560000,
          old_price: 620000,
          availability: "available",
          image_url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600"
        }
      ],
      services: [],
      offers: [
        {
          id: 1,
          store_id: 1,
          product_id: 5,
          product_name: "سماعات Apple AirPods Pro 2 (USB-C)",
          title: "سماعات Apple AirPods Pro 2 (USB-C)",
          old_price: 365000,
          new_price: 285000,
          discount_percentage: 22,
          image_url: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600"
        }
      ],
      reviews: [
        {
          id: 1,
          store_id: 1,
          customer_name: "كرار الحيدري",
          rating: 5,
          comment: "عاشت ايدكم على التعامل الراقي، اشتريت آيفون 16 برو ماكس أصلي ومضمون مع بكج حماية كامل.",
          created_at: "منذ يومين"
        },
        {
          id: 2,
          store_id: 1,
          customer_name: "مصطفى كامل الجميلي",
          rating: 5,
          comment: "أفضل محل بالشارع التجاري بأبو منيصير، أسعارهم مناسبة جداً وأجهزتهم كلها وكالة.",
          created_at: "منذ 4 أيام"
        },
        {
          id: 3,
          store_id: 1,
          customer_name: "سرمد الكرخي",
          rating: 5,
          comment: "خدمة ممتازة وضمان حقيقي، أنصح بالتعامل وياهم بأبو غريب.",
          created_at: "منذ 6 أيام"
        }
      ]
    },
    {
      id: 2,
      store_id: 2,
      owner_id: 3,
      name: "أبو غريب فون (Abu Ghraib Phone)",
      subTitle: "موزع رسمي للأجهزة بضمان الوكالة العراقية",
      badgeType: "verified",
      badgeText: "✅ موثق",
      verified: true,
      status: "approved",
      avg_rating: 4.7,
      rating: 4.7,
      reviews_count: 3,
      reviewCount: 3,
      products_count: 3,
      services_count: 0,
      location: "أبو غريب - أبو منيصير",
      region: "أبو غريب - أبو منيصير",
      address: "أبو غريب - حي أبو منيصير (قرب السوق)",
      phone: "07702223344",
      whatsapp: "9647702223344",
      opening_hours: "9:30 ص - 10:30 م",
      workingHours: "يومياً من 9:30 ص - 10:30 م",
      statusText: "مفتوح الآن حتى 10:30 م",
      description: "موزع رسمي للأجهزة بضمان الوكالة العراقية، عروض تقسيط ميسرة وخدمة تبديل الأجهزة القديمة.",
      about: "أبو غريب فون - صالة العرض المتكاملة في حي أبو منيصير قرب السوق. موزع معتمد لأجهزة سامسونج وشاومي وآبل، مع خطوط دفع مسبق VIP وتسهيلات تبديل الهواتف القديمة.",
      logo: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=200",
      cover_image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1000",
      cover: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1000",
      tags: ["Samsung Ultra", "Xiaomi", "خطوط مميزة", "استبدال أجهزة"],
      featureChips: ["قرب السوق - أبو منيصير", "عروض تقسيط ميسرة", "تبديل الأجهزة"],
      servicesOffered: [
        "بيع أجهزة سامسونج وشاومي بضمان الوكالة",
        "خطوط مميزة VIP وتفعيل فوري بالهوية",
        "تبديل الهواتف القديمة بالجديدة مع دفع الفرق",
        "إكسسوارات وكابلات شحن أصلية"
      ],
      products: [
        {
          id: 2,
          store_id: 2,
          category_id: 1,
          category_name: "الهواتف والأجهزة",
          category_icon: "📱",
          name: "Samsung Galaxy S24 Ultra (256GB)",
          description: "شاشة مسطحة مذهلة، معالج Snapdragon 8 Gen 3 وقلم S-Pen مدمج مع ضمان سامسونج العراق.",
          price: 1420000,
          old_price: 1550000,
          availability: "available",
          image_url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600"
        },
        {
          id: 4,
          store_id: 2,
          category_id: 1,
          category_name: "الهواتف والأجهزة",
          category_icon: "📱",
          name: "Xiaomi 14T Pro (512GB)",
          description: "عدسات Leica احترافية، شحن فائق السرعة 120W، رام 12GB، تصميم زجاجي أنيق.",
          price: 760000,
          old_price: 820000,
          availability: "limited",
          image_url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600"
        },
        {
          id: 7,
          store_id: 2,
          category_id: 2,
          category_name: "الخطوط والأرقام",
          category_icon: "💳",
          name: "خط آسيا سيل مميز VIP (0770 777 99XX)",
          description: "خط دفع مسبق جاهز للتنازل الفوري في حي أبو منيصير، رصيد افتتاحي وباقة إنترنت مجانية.",
          price: 150000,
          old_price: 180000,
          availability: "limited",
          image_url: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600"
        }
      ],
      services: [],
      offers: [
        {
          id: 3,
          store_id: 2,
          product_id: 4,
          product_name: "Xiaomi 14T Pro (512GB)",
          title: "Xiaomi 14T Pro (512GB)",
          old_price: 820000,
          new_price: 760000,
          discount_percentage: 7,
          image_url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600"
        }
      ],
      reviews: [
        {
          id: 4,
          store_id: 2,
          customer_name: "أحمد العبيدي",
          rating: 5,
          comment: "توفر جميع الإكسسوارات والشواحن الأصلية مع كفالة، كادر محترم ومتعاون جداً.",
          created_at: "منذ يوم واحد"
        },
        {
          id: 5,
          store_id: 2,
          customer_name: "سيف علي",
          rating: 4,
          comment: "محل مرتب وتعامل ممتاز، اشتريت جهاز من عدهم وتجربتي وياهم جانت ممتازة.",
          created_at: "منذ 3 أيام"
        },
        {
          id: 6,
          store_id: 2,
          customer_name: "محمد جاسم",
          rating: 5,
          comment: "أحسن محل في أبو منيصير لتجهيز الهواتف والاكسسوارات.",
          created_at: "منذ 5 أيام"
        }
      ]
    },
    {
      id: 3,
      store_id: 3,
      owner_id: 4,
      name: "قمة التقنية للصيانة السريعة",
      subTitle: "مختبر تخصصي متقدم لصيانة بوردات وشاشات الهواتف",
      badgeType: "featured",
      badgeText: "👑 مميز",
      verified: true,
      status: "approved",
      avg_rating: 5.0,
      rating: 5.0,
      reviews_count: 3,
      reviewCount: 3,
      products_count: 0,
      services_count: 5,
      location: "أبو غريب - أبو منيصير",
      region: "أبو غريب - أبو منيصير",
      address: "أبو غريب - حي أبو منيصير (الشارع العام)",
      phone: "07703334455",
      whatsapp: "9647703334455",
      opening_hours: "10:00 ص - 10:00 م",
      workingHours: "السبت - الخميس: 10:00 ص - 10:00 م",
      statusText: "مفتوح الآن حتى 10:00 م",
      description: "مختبر تخصصي متقدم لصيانة بوردات الآيفون والآندرويد، تبديل شاشات أصلية، وتبديل بطاريات بأحدث أجهزة الليزر.",
      about: "قمة التقنية للصيانة السريعة في أبو منيصير (الشارع العام). المركز الأول المتخصص بهندسة صيانة الهواتف المتقدمة، أجهزة الليزر لفصل الزجاج، وبرمجة True Tone، وتصليح أعطال البورد المستعصية مع ضمان فحص مكتوب.",
      logo: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200",
      cover_image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1000",
      cover: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1000",
      tags: ["صيانة ليزر", "تبديل شاشات", "صيانة بورد", "ضمان معتمد"],
      featureChips: ["الشارع العام - أبو منيصير", "صيانة فورية خلال ساعة", "قطع وكالة مضمونة"],
      servicesOffered: [
        "تبديل شاشات iPhone و Samsung أصلية وكالة مع ضمان",
        "تبديل بطاريات أصلية مع المحافظة على نسبة الصحة 100%",
        "تبديل الظهر الزجاجي بجهاز الليزر دون فتح الهاتف",
        "تصليح أعطال IC الشحن والباور ومعالجة أجهزة الموت المفاجئ"
      ],
      products: [],
      services: [
        {
          id: 1,
          store_id: 3,
          name: "تبديل شاشة iPhone 16 Pro Max أصلية OLED",
          description: "شاشة وكالة مسحوبة من جهاز، مع برمجة True Tone ونقل فلكس الحساسات خلال 45 دقيقة مع ضمان 6 أشهر.",
          price: 185000,
          availability: "available"
        },
        {
          id: 2,
          store_id: 3,
          name: "تبديل بطارية iPhone 15 Pro أصلية",
          description: "بطارية أصلية صحة 100% بدون ظهور رسالة قطعة غير معروفة مع كفالة 6 أشهر.",
          price: 55000,
          availability: "available"
        },
        {
          id: 3,
          store_id: 3,
          name: "تبديل شاشة Samsung S24 Ultra أصلية Dynamic AMOLED",
          description: "شاشة فريم كامل أصلية من وكالة سامسونج العراق، صيانة فورية وضمان 6 أشهر.",
          price: 190000,
          availability: "available"
        },
        {
          id: 4,
          store_id: 3,
          name: "تصليح وتبديل مدخل الشحن Type-C / Lightning",
          description: "تبديل فلكس الشحن الأصلي مع فحص المايك والشبكة خلال 30 دقيقة.",
          price: 25000,
          availability: "available"
        },
        {
          id: 5,
          store_id: 3,
          name: "تبديل الظهر الزجاجي بالليزر للآيفون",
          description: "إزالة الزجاج الخلفي المكسور بجهاز الليزر دون فتح الجهاز وإعادة تركيب زجاج أصلي بمطابقة 100%.",
          price: 35000,
          availability: "available"
        }
      ],
      offers: [
        {
          id: 2,
          store_id: 3,
          product_id: 6,
          product_name: "شاحن Anker 65W GaN Prime السريع",
          title: "شاحن Anker 65W GaN Prime السريع",
          old_price: 60000,
          new_price: 45000,
          discount_percentage: 25,
          image_url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600"
        }
      ],
      reviews: [
        {
          id: 7,
          store_id: 3,
          customer_name: "عمر الدليمي",
          rating: 5,
          comment: "بدلت شاشة جهازي بوقت قياسي وشغل نظيف ومضبوط مع ضمان فحص.",
          created_at: "منذ يوم واحد"
        },
        {
          id: 8,
          store_id: 3,
          customer_name: "علي الجميلي",
          rating: 5,
          comment: "أحسن فني صيانة بأبو غريب كلها، أمانة وسرعة بالعمل وقطع أصلية 100%.",
          created_at: "منذ 3 أيام"
        },
        {
          id: 9,
          store_id: 3,
          customer_name: "حسام الزيدي",
          rating: 5,
          comment: "سويت صيانة لآي سي الشحن وتم إصلاحه باحترافية عالية بنفس اليوم.",
          created_at: "منذ 5 أيام"
        }
      ]
    }
  ],

  // عروض اليوم في محلات أبو غريب - أبو منيصير
  flashDeals: [
    {
      id: 1,
      name: "سماعات Apple AirPods Pro 2 الأصلية (USB-C)",
      category: "سماعات",
      price: 285000,
      oldPrice: 365000,
      discountBadge: "-22% خصم فوري",
      storeName: "مركز الرافدين للموبايل",
      storeId: 1,
      store_id: 1,
      storeRegion: "أبو غريب - أبو منيصير",
      image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80",
      claimedPercent: 85,
      claimedText: "تم حجز 17 من أصل 20 قطعة في أبو منيصير"
    },
    {
      id: 2,
      name: "شاحن Anker 65W GaN Prime السريع",
      category: "شواحن",
      price: 45000,
      oldPrice: 60000,
      discountBadge: "-25% توفير كبير",
      storeName: "قمة التقنية للصيانة السريعة",
      storeId: 3,
      store_id: 3,
      storeRegion: "أبو غريب - أبو منيصير",
      image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80",
      claimedPercent: 70,
      claimedText: "أفضل سعر شاحن أصلي في قضاء أبو غريب"
    },
    {
      id: 3,
      name: "Xiaomi 14T Pro - 512GB مع كاميرات Leica",
      category: "هواتف",
      price: 760000,
      oldPrice: 820000,
      discountBadge: "-60,000 د.ع",
      storeName: "أبو غريب فون (Abu Ghraib Phone)",
      storeId: 2,
      store_id: 2,
      storeRegion: "أبو غريب - أبو منيصير",
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80",
      claimedPercent: 80,
      claimedText: "متوفر للتسليم الفوري في أبو منيصير"
    }
  ],

  // أحدث الأجهزة المعروضة في محلات أبو غريب - أبو منيصير
  products: [
    {
      id: 1,
      store_id: 1,
      store_name: "مركز الرافدين للموبايل",
      store_location: "أبو غريب - أبو منيصير",
      category_id: 1,
      category_name: "الهواتف والأجهزة",
      category_icon: "📱",
      name: "iPhone 16 Pro Max (256GB)",
      description: "نسخة الشرق الأوسط شريحتين، ضمان وكالة Apple الرسمي سنة كاملة، التيتانيوم الصحراوي.",
      price: 1740000,
      old_price: 1850000,
      availability: "available",
      image_url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600",
      tag: "الأكثر طلباً في أبو منيصير 🔥"
    },
    {
      id: 2,
      store_id: 2,
      store_name: "أبو غريب فون (Abu Ghraib Phone)",
      store_location: "أبو غريب - أبو منيصير",
      category_id: 1,
      category_name: "الهواتف والأجهزة",
      category_icon: "📱",
      name: "Samsung Galaxy S24 Ultra (256GB)",
      description: "شاشة مسطحة مذهلة، معالج Snapdragon 8 Gen 3 وقلم S-Pen مدمج مع ضمان سامسونج العراق.",
      price: 1420000,
      old_price: 1550000,
      availability: "available",
      image_url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600",
      tag: "Galaxy AI ⚡"
    },
    {
      id: 3,
      store_id: 1,
      store_name: "مركز الرافدين للموبايل",
      store_location: "أبو غريب - أبو منيصير",
      category_id: 1,
      category_name: "الهواتف والأجهزة",
      category_icon: "📱",
      name: "iPhone 15 Pro (128GB)",
      description: "تيتانيوم طبيعي، معالج A17 Pro، كاميرا احترافية بدقة 48MP، جديد بكرتونته.",
      price: 1325000,
      old_price: 1450000,
      availability: "available",
      image_url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600",
      tag: "جديد وكالة"
    },
    {
      id: 4,
      store_id: 2,
      store_name: "أبو غريب فون (Abu Ghraib Phone)",
      store_location: "أبو غريب - أبو منيصير",
      category_id: 1,
      category_name: "الهواتف والأجهزة",
      category_icon: "📱",
      name: "Xiaomi 14T Pro (512GB)",
      description: "عدسات Leica احترافية، شحن فائق السرعة 120W، رام 12GB، تصميم زجاجي أنيق.",
      price: 760000,
      old_price: 820000,
      availability: "limited",
      image_url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600",
      tag: "عدسات Leica 📷"
    },
    {
      id: 5,
      store_id: 1,
      store_name: "مركز الرافدين للموبايل",
      store_location: "أبو غريب - أبو منيصير",
      category_id: 3,
      category_name: "الإكسسوارات والشواحن",
      category_icon: "🎧",
      name: "سماعات Apple AirPods Pro 2 (USB-C)",
      description: "إلغاء الضوضاء النشط المتطور، صوت مكاني مخصص، ومقاومة للماء والعرق بمعيار IP54.",
      price: 285000,
      old_price: 365000,
      availability: "available",
      image_url: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600",
      tag: "خصم 22% 🔥"
    },
    {
      id: 6,
      store_id: 1,
      store_name: "مركز الرافدين للموبايل",
      store_location: "أبو غريب - أبو منيصير",
      category_id: 3,
      category_name: "الإكسسوارات والشواحن",
      category_icon: "🎧",
      name: "شاحن Anker 65W GaN Prime السريع",
      description: "شاحن جداري 3 منافذ يدعم أحدث بروتوكولات الشحن السريع للآيفون والسامسونج واللابتوب.",
      price: 45000,
      old_price: 60000,
      availability: "available",
      image_url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600",
      tag: "GaN 3.0 ⚡"
    },
    {
      id: 7,
      store_id: 2,
      store_name: "أبو غريب فون (Abu Ghraib Phone)",
      store_location: "أبو غريب - أبو منيصير",
      category_id: 2,
      category_name: "الخطوط والأرقام",
      category_icon: "💳",
      name: "خط آسيا سيل مميز VIP (0770 777 99XX)",
      description: "خط دفع مسبق جاهز للتنازل الفوري في حي أبو منيصير، رصيد افتتاحي وباقة إنترنت مجانية.",
      price: 150000,
      old_price: 180000,
      availability: "limited",
      image_url: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600",
      tag: "رقم ذهبي VIP 👑"
    },
    {
      id: 8,
      store_id: 1,
      store_name: "مركز الرافدين للموبايل",
      store_location: "أبو غريب - أبو منيصير",
      category_id: 4,
      category_name: "الساعات الذكية",
      category_icon: "⌚",
      name: "Apple Watch Series 10 (46mm)",
      description: "شاشة OLED واسعة بزوايا رؤية محسنة، مستشعرات صحية متقدمة وتخطيط نبضات القلب ECG.",
      price: 560000,
      old_price: 620000,
      availability: "available",
      image_url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600",
      tag: "أحدث إصدار ⌚"
    }
  ],

  // خدمات الصيانة في قضاء أبو غريب
  services: [
    {
      id: 1,
      store_id: 3,
      store_name: "قمة التقنية للصيانة السريعة",
      store_location: "أبو غريب - أبو منيصير",
      name: "تبديل شاشة iPhone 16 Pro Max أصلية OLED",
      description: "شاشة وكالة مسحوبة من جهاز، مع برمجة True Tone ونقل فلكس الحساسات خلال 45 دقيقة مع ضمان 6 أشهر.",
      price: 185000,
      availability: "available"
    },
    {
      id: 2,
      store_id: 3,
      store_name: "قمة التقنية للصيانة السريعة",
      store_location: "أبو غريب - أبو منيصير",
      name: "تبديل بطارية iPhone 15 Pro أصلية",
      description: "بطارية أصلية صحة 100% بدون ظهور رسالة قطعة غير معروفة مع كفالة 6 أشهر.",
      price: 55000,
      availability: "available"
    },
    {
      id: 3,
      store_id: 3,
      store_name: "قمة التقنية للصيانة السريعة",
      store_location: "أبو غريب - أبو منيصير",
      name: "تبديل شاشة Samsung S24 Ultra أصلية Dynamic AMOLED",
      description: "شاشة فريم كامل أصلية من وكالة سامسونج العراق، صيانة فورية وضمان 6 أشهر.",
      price: 190000,
      availability: "available"
    },
    {
      id: 4,
      store_id: 3,
      store_name: "قمة التقنية للصيانة السريعة",
      store_location: "أبو غريب - أبو منيصير",
      name: "تصليح وتبديل مدخل الشحن Type-C / Lightning",
      description: "تبديل فلكس الشحن الأصلي مع فحص المايك والشبكة خلال 30 دقيقة.",
      price: 25000,
      availability: "available"
    },
    {
      id: 5,
      store_id: 3,
      store_name: "قمة التقنية للصيانة السريعة",
      store_location: "أبو غريب - أبو منيصير",
      name: "تبديل الظهر الزجاجي بالليزر للآيفون",
      description: "إزالة الزجاج الخلفي المكسور بجهاز الليزر دون فتح الجهاز وإعادة تركيب زجاج أصلي بمطابقة 100%.",
      price: 35000,
      availability: "available"
    }
  ],

  // العروض النشطة
  offers: [
    {
      id: 1,
      store_id: 1,
      store_name: "مركز الرافدين للموبايل",
      product_id: 5,
      product_name: "سماعات Apple AirPods Pro 2 (USB-C)",
      title: "سماعات Apple AirPods Pro 2 (USB-C)",
      old_price: 365000,
      new_price: 285000,
      discount_percentage: 22,
      image_url: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600"
    },
    {
      id: 2,
      store_id: 3,
      store_name: "قمة التقنية للصيانة السريعة",
      product_id: 6,
      product_name: "شاحن Anker 65W GaN Prime السريع",
      title: "شاحن Anker 65W GaN Prime السريع",
      old_price: 60000,
      new_price: 45000,
      discount_percentage: 25,
      image_url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600"
    },
    {
      id: 3,
      store_id: 2,
      store_name: "أبو غريب فون (Abu Ghraib Phone)",
      product_id: 4,
      product_name: "Xiaomi 14T Pro (512GB)",
      title: "Xiaomi 14T Pro (512GB)",
      old_price: 820000,
      new_price: 760000,
      discount_percentage: 7,
      image_url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600"
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
      avgPrice: 1740000,
      maxPrice: 1850000,
      storesCount: 3,
      trend: "down",
      trendLabel: "انخفاض طفيف (-25,000 د.ع)"
    },
    {
      name: "Samsung Galaxy S24 Ultra (256GB)",
      icon: "📱",
      minPrice: 1390000,
      avgPrice: 1420000,
      maxPrice: 1550000,
      storesCount: 3,
      trend: "down",
      trendLabel: "عروض تنافسية نشطة"
    },
    {
      name: "Xiaomi 14T Pro (512GB)",
      icon: "📱",
      minPrice: 750000,
      avgPrice: 760000,
      maxPrice: 820000,
      storesCount: 3,
      trend: "stable",
      trendLabel: "أفضل قيمة مقابل المواصفات"
    },
    {
      name: "AirPods Pro 2 (USB-C)",
      icon: "🎧",
      minPrice: 280000,
      avgPrice: 285000,
      maxPrice: 365000,
      storesCount: 3,
      trend: "stable",
      trendLabel: "سعر منافس في أبو منيصير"
    }
  ],

  // آراء وتجارب الزبائن الحقيقية في قضاء أبو غريب
  customerReviews: [
    {
      author: "كرار الحيدري",
      role: "زبون من حي أبو منيصير - الشارع التجاري",
      rating: 5,
      comment: "عاشت ايدكم على التعامل الراقي، اشتريت آيفون 16 برو ماكس أصلي ومضمون مع بكج حماية كامل من مركز الرافدين.",
      store: "مركز الرافدين للموبايل",
      date: "منذ يومين"
    },
    {
      author: "أحمد العبيدي",
      role: "متسوق من حي أبو منيصير",
      rating: 5,
      comment: "توفر جميع الإكسسوارات والشواحن الأصلية مع كفالة، كادر محترم ومتعاون جداً في متجر أبو غريب فون.",
      store: "أبو غريب فون (Abu Ghraib Phone)",
      date: "منذ يوم واحد"
    },
    {
      author: "عمر الدليمي",
      role: "زبون صيانة من الشارع العام",
      rating: 5,
      comment: "بدلت شاشة جهازي بقمة التقنية بوقت قياسي وشغل نظيف ومضبوط مع ضمان فحص، أحسن فني صيانة بأبو غريب.",
      store: "قمة التقنية للصيانة السريعة",
      date: "منذ يوم واحد"
    }
  ]
};
