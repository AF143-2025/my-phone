-- ==============================================================================
-- Mobilya Platform - PostgreSQL Initial Seed Data
-- بيانات تمهيدية حقيقية لقضاء أبو غريب
-- كلمة المرور لجميع الحسابات التجريبية هي: Password123!
-- Hashed with bcrypt (10 rounds): $2a$10$sP12nfeFzI47V4x0B9XgMe395g12i9H2eFqB28U4VvP3l0H6cZz2e
-- ==============================================================================

-- 1. USERS (Admin, Store Owners, Customer)
INSERT INTO users (id, name, email, phone, password_hash, role) VALUES
(1, 'المدير العام للمنصة', 'admin@mobilya.iq', '07700001122', '$2a$10$Gfcr/RrM/1SgDezsTGIUkus1WvSwLAp/iWE3Zfjw91TBudo/K3adu', 'admin'),
(2, 'حيدر الرافدين (صاحب متجر)', 'rafidain@mobilya.iq', '07701112233', '$2a$10$Gfcr/RrM/1SgDezsTGIUkus1WvSwLAp/iWE3Zfjw91TBudo/K3adu', 'store_owner'),
(3, 'عمر أبو غريب فون (صاحب متجر)', 'abughraibphone@mobilya.iq', '07702223344', '$2a$10$Gfcr/RrM/1SgDezsTGIUkus1WvSwLAp/iWE3Zfjw91TBudo/K3adu', 'store_owner'),
(4, 'مهندس مصطفى - قمة التقنية', 'qimma@mobilya.iq', '07703334455', '$2a$10$Gfcr/RrM/1SgDezsTGIUkus1WvSwLAp/iWE3Zfjw91TBudo/K3adu', 'store_owner'),
(5, 'أحمد ركن الاتصالات', 'rokn@mobilya.iq', '07704445566', '$2a$10$Gfcr/RrM/1SgDezsTGIUkus1WvSwLAp/iWE3Zfjw91TBudo/K3adu', 'store_owner'),
(6, 'علي الكرخي (زبون)', 'customer@mobilya.iq', '07705556677', '$2a$10$Gfcr/RrM/1SgDezsTGIUkus1WvSwLAp/iWE3Zfjw91TBudo/K3adu', 'customer');

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- 2. CATEGORIES
INSERT INTO categories (id, name, icon) VALUES
(1, 'الهواتف والأجهزة', '📱'),
(2, 'الخطوط والأرقام', '💳'),
(3, 'الإكسسوارات والشواحن', '🎧'),
(4, 'الساعات الذكية', '⌚'),
(5, 'الصيانة الفورية', '🛠️'),
(6, 'الخدمات والبرمجة', '⚙️');

SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- 3. STORES IN ABU GHRAIB (أبو منيصير)
INSERT INTO stores (id, owner_id, name, description, logo, cover_image, location, address, phone, whatsapp, opening_hours, status, verified) VALUES
(1, 2, 'مركز الرافدين للموبايل', 'أكبر صالة عرض لهواتف آبل وسامسونج وشاومي مع قسم صيانة معتمد وقطع غيار أصلية 100%.', 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=200', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1000', 'أبو غريب - أبو منيصير', 'أبو غريب - حي أبو منيصير (الشارع التجاري)', '07701112233', '9647701112233', '9:00 ص - 11:00 م', 'approved', true),
(2, 3, 'أبو غريب فون (Abu Ghraib Phone)', 'موزع رسمي للأجهزة بضمان الوكالة العراقية، عروض تقسيط ميسرة وخدمة تبديل الأجهزة القديمة.', 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=200', 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1000', 'أبو غريب - أبو منيصير', 'أبو غريب - حي أبو منيصير (قرب السوق)', '07702223344', '9647702223344', '9:30 ص - 10:30 م', 'approved', true),
(3, 4, 'قمة التقنية للصيانة السريعة', 'مختبر تخصصي متقدم لصيانة بوردات الآيفون والآندرويد، تبديل شاشات أصلية، وتبديل بطاريات بأحدث أجهزة الليزر.', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1000', 'أبو غريب - أبو منيصير', 'أبو غريب - حي أبو منيصير (الشارع العام)', '07703334455', '9647703334455', '10:00 ص - 10:00 م', 'approved', true);

SELECT setval('stores_id_seq', (SELECT MAX(id) FROM stores));

-- 4. PRODUCTS
INSERT INTO products (id, store_id, category_id, name, description, price, availability) VALUES
(1, 1, 1, 'iPhone 16 Pro Max (256GB)', 'نسخة الشرق الأوسط شريحتين، ضمان وكالة Apple الرسمي سنة كاملة، التيتانيوم الصحراوي.', 1740000, 'available'),
(2, 2, 1, 'Samsung Galaxy S24 Ultra (256GB)', 'شاشة مسطحة مذهلة، معالج Snapdragon 8 Gen 3 وقلم S-Pen مدمج مع ضمان سامسونج العراق.', 1420000, 'available'),
(3, 1, 1, 'iPhone 15 Pro (128GB)', 'تيتانيوم طبيعي، معالج A17 Pro، كاميرا احترافية بدقة 48MP، حالة الجهاز: جديد بكرتونته.', 1325000, 'available'),
(4, 2, 1, 'Xiaomi 14T Pro (512GB)', 'عدسات Leica احترافية، شحن فائق السرعة 120W، رام 12GB، تصميم زجاجي أنيق.', 760000, 'limited'),
(5, 1, 3, 'سماعات Apple AirPods Pro 2 (USB-C)', 'إلغاء الضوضاء النشط المتطور، صوت مكاني مخصص، ومقاومة للماء والعرق بمعيار IP54.', 285000, 'available'),
(6, 1, 3, 'شاحن Anker 65W GaN Prime السريع', 'شاحن جداري 3 منافذ يدعم أحدث بروتوكولات الشحن السريع للآيفون والسامسونج واللابتوب.', 45000, 'available'),
(7, 2, 2, 'خط آسيا سيل مميز VIP (0770 777 99XX)', 'خط دفع مسبق جاهز للتنازل الفوري في حي أبو منيصير، رصيد افتتاحي وباقة إنترنت مجانية.', 150000, 'limited'),
(8, 1, 4, 'Apple Watch Series 10 (46mm)', 'شاشة OLED واسعة بزوايا رؤية محسنة، مستشعرات صحية متقدمة وتخطيط نبضات القلب ECG.', 560000, 'available');

SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));

-- 5. PRODUCT IMAGES
INSERT INTO product_images (product_id, image_url) VALUES
(1, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600'),
(2, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600'),
(3, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600'),
(4, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600'),
(5, 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600'),
(6, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600'),
(7, 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600'),
(8, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600');

-- 6. SERVICES (خدمات الصيانة المعتمدة في أبو غريب)
INSERT INTO services (id, store_id, name, description, price, availability) VALUES
(1, 3, 'تبديل شاشة iPhone 16 Pro Max أصلية OLED', 'شاشة وكالة مسحوبة من جهاز، مع برمجة True Tone ونقل فلكس الحساسات خلال 45 دقيقة مع ضمان 6 أشهر.', 185000, 'available'),
(2, 3, 'تبديل بطارية iPhone 15 Pro أصلية', 'بطارية أصلية صحة 100% بدون ظهور رسالة قطعة غير معروفة مع كفالة 6 أشهر.', 55000, 'available'),
(3, 3, 'تبديل شاشة Samsung S24 Ultra أصلية Dynamic AMOLED', 'شاشة فريم كامل أصلية من وكالة سامسونج العراق، صيانة فورية وضمان 6 أشهر.', 190000, 'available'),
(4, 3, 'تصليح وتبديل مدخل الشحن Type-C / Lightning', 'تبديل فلكس الشحن الأصلي مع فحص المايك والشبكة خلال 30 دقيقة.', 25000, 'available'),
(5, 3, 'تبديل الظهر الزجاجي بالليزر للآيفون', 'إزالة الزجاج الخلفي المكسور بجهاز الليزر دون فتح الجهاز وإعادة تركيب زجاج أصلي بمطابقة 100%.', 35000, 'available');

SELECT setval('services_id_seq', (SELECT MAX(id) FROM services));

-- 7. OFFERS (عروض اليوم الحصرية)
INSERT INTO offers (id, store_id, product_id, old_price, new_price, discount_percentage, start_date, end_date, active) VALUES
(1, 1, 5, 365000, 285000, 22, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days', true),
(2, 3, 6, 60000, 45000, 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '5 days', true),
(3, 2, 4, 820000, 760000, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '3 days', true);

SELECT setval('offers_id_seq', (SELECT MAX(id) FROM offers));

-- 8. FAVORITES
INSERT INTO favorites (user_id, product_id) VALUES
(6, 1),
(6, 5);

-- 9. NOTIFICATIONS
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
(6, 'عرض حصري في أبو منيصير 🔥', 'خصم فوري 22% على سماعات AirPods Pro 2 في مركز الرافدين - أبو منيصير.', 'offer', false),
(6, 'توثيق محل جديد ✅', 'تم اعتماد وتوثيق مركز قمة التقنية للصيانة السريعة في أبو منيصير.', 'system', false),
(1, 'منصة أبو غريب - أبو منيصير 🏪', 'تم تحديث سوق الموبايلات الموحد في قضاء أبو غريب بنجاح.', 'admin', false);

-- 10. STORE REVIEWS (تقييمات الزبائن للمحلات)
INSERT INTO store_reviews (id, store_id, user_id, customer_name, rating, comment, created_at) VALUES
(1, 1, 6, 'كرار الحيدري', 5, 'عاشت ايدكم على التعامل الراقي، اشتريت آيفون 16 برو ماكس أصلي ومضمون مع بكج حماية كامل.', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(2, 1, NULL, 'مصطفى كامل الجميلي', 5, 'أفضل محل بالشارع التجاري بأبو منيصير، أسعارهم مناسبة جداً وأجهزتهم كلها وكالة.', CURRENT_TIMESTAMP - INTERVAL '4 days'),
(3, 1, NULL, 'سرمد الكرخي', 5, 'خدمة ممتازة وضمان حقيقي، أنصح بالتعامل وياهم بأبو غريب.', CURRENT_TIMESTAMP - INTERVAL '6 days'),
(4, 2, 6, 'أحمد العبيدي', 5, 'توفر جميع الإكسسوارات والشواحن الأصلية مع كفالة، كادر محترم ومتعاون جداً.', CURRENT_TIMESTAMP - INTERVAL '1 day'),
(5, 2, NULL, 'سيف علي', 4, 'محل مرتب وتعامل ممتاز، اشتريت جهاز من عدهم وتجربتي وياهم جانت ممتازة.', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(6, 2, NULL, 'محمد جاسم', 5, 'أحسن محل في أبو منيصير لتجهيز الهواتف والاكسسوارات.', CURRENT_TIMESTAMP - INTERVAL '5 days'),
(7, 3, 6, 'عمر الدليمي', 5, 'بدلت شاشة جهازي بوقت قياسي وشغل نظيف ومضبوط مع ضمان فحص.', CURRENT_TIMESTAMP - INTERVAL '1 day'),
(8, 3, NULL, 'علي الجميلي', 5, 'أحسن فني صيانة بأبو غريب كلها، أمانة وسرعة بالعمل وقطع أصلية 100%.', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(9, 3, NULL, 'حسام الزيدي', 5, 'سويت صيانة لآي سي الشحن وتم إصلاحه باحترافية عالية بنفس اليوم.', CURRENT_TIMESTAMP - INTERVAL '5 days');

SELECT setval('store_reviews_id_seq', (SELECT MAX(id) FROM store_reviews));

