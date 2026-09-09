# 📱 منصة Mobilya | موبيليا — سوق الموبايلات في قضاء أبو غريب
### Dynamic Full-Stack Web Application (Node.js + Express + PostgreSQL)

منصة رقمية متكاملة لربط محلات ومكاتب الموبايل في قضاء أبو غريب بالزبائن مباشرة. تم تحويل المشروع بالكامل من واجهة ثابتة (Static) إلى تطبيق ويب تفاعلي حقيقي (Dynamic Web Application) مربوط بقاعدة بيانات **PostgreSQL** ومحرك **RESTful API** مع نظام مصادقة وصلاحيات متعدد الأدوار (RBAC).

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **Backend**: Node.js & Express.js
- **Database**: PostgreSQL (مع دعم المحرك المضمن PGlite ومحرك PostgreSQL Server القياسي)
- **Frontend**: HTML5, CSS3 (Luxury Dark Tech System & Glassmorphism), Vanilla JavaScript ES6+
- **Security & Auth**: JWT (JSON Web Tokens), bcryptjs لتشفير كلمات المرور، Role-Based Access Control (RBAC)
- **Architecture**: Modular MVC-inspired Structure (Routes, Controllers, Middleware, Config, Database)

---

## 📁 بنية المشروع (Project Structure)

```text
mobilya-platform/
├── package.json               # تبعيات المشروع وأوامر التشغيل
├── .env.example               # نموذج المتغيرات البيئية
├── .env                       # إعدادات البيئة المحلية وقاعدة البيانات
├── README.md                  # دليل التثبيت والتشغيل
├── database/
│   ├── schema.sql             # هيكل الجداول والعلاقات والقيود والفهارس
│   ├── seed.sql               # البيانات الأولية الحقيقية لقضاء أبو غريب
│   ├── seedRunner.js          # سكربت تهيئة واستيراد قاعدة البيانات
│   └── pgdata/                # مسار التخزين الدائم للبيانات
├── backend/
│   ├── server.js              # المدخل الرئيسي لخادم Express
│   ├── testApi.js             # اختبارات برمجية تلقائية لجميع الـ Endpoints
│   ├── config/
│   │   └── db.js              # إدارة اتصال قاعدة بيانات PostgreSQL
│   ├── middleware/
│   │   ├── auth.js            # التحقق من توكن JWT
│   │   └── roles.js           # التحقق من الصلاحيات وعزل المتاجر
│   ├── controllers/
│   │   ├── authController.js  # تسجيل الدخول وإنشاء الحسابات
│   │   ├── storesController.js# المحلات المعتمدة وإدارتها
│   │   ├── productsController.js # المنتجات والبحث المباشر
│   │   ├── servicesController.js # خدمات وأسعار الصيانة
│   │   ├── offersController.js   # عروض اليوم والتخفيضات
│   │   ├── favoritesController.js# قائمة المفضلة للزبون
│   │   └── adminController.js    # لوحة تحكم المدير والموافقات والتوثيق
│   └── routes/
│       ├── authRoutes.js
│       ├── storesRoutes.js
│       ├── productsRoutes.js
│       ├── servicesRoutes.js
│       ├── offersRoutes.js
│       ├── favoritesRoutes.js
│       ├── adminRoutes.js
│       └── categoriesRoutes.js
└── frontend/
    ├── index.html             # الواجهة الرئيسية التفاعلية
    ├── css/
    │   └── style.css          # نظام التنسيقات الفاخر Luxury Dark Tech
    └── js/
        ├── api.js             # موصل الـ API وإدارة الـ Token محلياً
        ├── data.js            # مصفوفات البيانات الاحتياطية
        └── app.js             # محرك التفاعل الديناميكي وتحديث الشاشة
```

---

## 🚀 طريقة التشغيل السريع (Quick Start)

### 1. المتطلبات:
- تثبيت [Node.js](https://nodejs.org/) (الإصدار 18 فما فوق).

### 2. تثبيت الحزم (إن لم تكن مثبتة):
```bash
npm install
```

### 3. تشغيل الخادم:
```bash
npm start
```
أو للتطوير مع التحديث التلقائي:
```bash
npm run dev
```

ستعمل المنصة مباشرة على الرابط:
👉 **`http://localhost:5000`**

---

## 👥 الحسابات التجريبية الجاهزة (Demo Accounts)

كلمة المرور الموحدة لجميع الحسابات التجريبية هي: **`Password123!`**

| الدور (Role) | البريد الإلكتروني (Email) | الصلاحيات |
|---|---|---|
| **👑 المدير العام (Admin)** | `admin@mobilya.iq` | إدارة المنصة، قبول أو رفض طلبات المحلات، توثيق المحلات، إدارة الأسعار والمستخدمين |
| **🏪 صاحب متجر (Store Owner)** | `rafidain@mobilya.iq` | إدارة متجر "مركز الرافدين"، إضافة منتجات جديدة، إضافة خدمات صيانة |
| **🏪 صاحب متجر (Store Owner)** | `abughraibphone@mobilya.iq` | إدارة متجر "أبو غريب فون"، إضافة وتعديل وحذف المنتجات |
| **👤 زبون (Customer)** | `customer@mobilya.iq` | تصفح وبحث، إضافة للمفضلة، حجز الصيانة وطلب الأجهزة عبر الواتساب |

*(توجد أزرار تسجيل سريع بنقرة واحدة داخل نافذة تسجيل الدخول لتسهيل المعاينة والاختبار).*

---

## 🔌 توثيق واجهات برمجة التطبيقات (REST API Endpoints)

### 1. المصادقة والمستخدمين (`/api/auth`)
- `POST /api/auth/register` — إنشاء حساب جديد (زبون أو صاحب محل).
- `POST /api/auth/login` — تسجيل الدخول والحصول على JWT Token.
- `POST /api/auth/logout` — تسجيل الخروج.
- `GET /api/auth/me` — جلب بيانات المستخدم المسجل وبيانات متجره (محمي).

### 2. المحلات (`/api/stores`)
- `GET /api/stores` — جلب المحلات المعتمدة مع إمكانية الفلترة حسب الموقع أو البحث.
- `GET /api/stores/:id` — جلب تفاصيل المحل وقائمة منتجاته وخدماته وعروضه.
- `POST /api/stores` — تسجيل محل جديد (يصبح بحالة `pending` لمراجعة الإدارة).
- `PUT /api/stores/:id` — تعديل بيانات المحل (محمي لصاحب المحل أو المدير).
- `DELETE /api/stores/:id` — حذف المحل.

### 3. المنتجات والبحث (`/api/products`)
- `GET /api/products?search=...&category_id=...` — بحث فوري وتصفية للأجهزة في أبو غريب.
- `GET /api/products/:id` — تفاصيل المنتج وصوره.
- `POST /api/products` — إضافة منتج جديد (محمي لصاحب المتجر المعتمد).
- `PUT /api/products/:id` — تعديل منتج.
- `DELETE /api/products/:id` — حذف منتج.

### 4. خدمات الصيانة (`/api/services`)
- `GET /api/services` — استعراض خدمات الصيانة وأسعارها المعتمدة في أبو غريب.
- `POST /api/services` — إضافة خدمة صيانة لمتجر.

### 5. عروض اليوم (`/api/offers`)
- `GET /api/offers` — استعراض العروض النشطة مع نسب الخصم.
- `POST /api/offers` — إنشاء عرض جديد.

### 6. المفضلة (`/api/favorites`)
- `GET /api/favorites` — جلب قائمة مفضلة المستخدم الحالي.
- `POST /api/favorites` — إضافة منتج للمفضلة.
- `DELETE /api/favorites/:id` — إزالة منتج من المفضلة.

### 7. الإدارة المركزية (`/api/admin`)
- `GET /api/admin/dashboard` — إحصائيات المنصة المركزية.
- `GET /api/admin/stores/pending` — جلب طلبات المحلات المعلقة.
- `PUT /api/admin/stores/:id/approve` — اعتماد وقبول المحل ليظهر للعامة.
- `PUT /api/admin/stores/:id/reject` — رفض طلب المحل مع إشعار السبب.
- `PUT /api/admin/stores/:id/verify` — توثيق المحل بشارة الوكالة والمصداقية.
- `PUT /api/admin/users/:id/ban` — حظر حساب مخالف.

---

## 🛡️ الحماية والأمان (Security Implementation)
1. **تشفير كلمات المرور**: استخدام خوارزمية `bcrypt` بـ 10 دورات تشفير (Salt Rounds).
2. **عزل المتاجر**: لا يستطيع أي صاحب متجر التعديل أو الحذف في منتجات متجر آخر، ويتم التحقق من ملكية السجل برمجياً في `middleware/roles.js`.
3. **حماية المدير**: يمنع منعاً باتاً التسجيل كمدير من الواجهة العامة. يتم تعيين المدير عبر قاعدة البيانات حصراً.
4. **حماية المسارات**: التحقق من صحة وصلاحية توكن JWT قبل السماح بأي عملية تعديل أو إضافة.
