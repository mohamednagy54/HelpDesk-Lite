# HelpDesk Lite — تفصيل الباك اند كامل (Endpoints + Schema + Business Logic)

> Stack: Node.js + Express + PostgreSQL (أو SQLite) + JWT
> الـ Base URL: `/api`
> شكل الـ Response الموحد في كل الـ endpoints:
> ```json
> { "success": true, "message": "...", "data": {...} }
> ```
> وفي حالة الخطأ:
> ```json
> { "success": false, "message": "...", "errors": [ ... ] }
> ```

---

## 0. البنية المعمارية المقترحة (Architecture)

```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.js
│   │   ├── auth.service.js
│   │   ├── auth.repository.js
│   │   └── auth.routes.js
│   └── tickets/
│       ├── tickets.controller.js
│       ├── tickets.service.js
│       ├── tickets.repository.js
│       └── tickets.routes.js
├── middlewares/
│   ├── authenticate.js       // يتحقق من الـ JWT
│   ├── authorize.js          // يتحقق من الـ Role
│   └── errorHandler.js       // Global error handler
├── db/
│   ├── schema.sql
│   └── connection.js
└── utils/
    └── validators.js
```

**القاعدة الأساسية:** Controller بيستقبل الـ request وبيرجع الـ response بس، الـ Service فيه كل الـ Business Logic (زي التحقق من ترتيب الحالات، صلاحية الإغلاق)، والـ Repository هو الوحيد اللي بيكلم الـ ORM/DB مباشرة. الـ Service منعرفش يعمل query مباشر — لازم يعدي على الـ Repository.

---

## 1. Database Schema

### جدول `users`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| name | VARCHAR | |
| email | VARCHAR UNIQUE | |
| password_hash | VARCHAR | bcrypt hash |
| role | ENUM('requester','staff','manager') | |
| created_at | TIMESTAMP | default now() |

### جدول `tickets`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| requester_id | INT FK → users.id | |
| category | ENUM('Access','Software','Hardware','Other') | |
| description | TEXT | |
| status | ENUM('New','In Progress','Resolved','Closed') | default 'New' |
| owner_id | INT FK → users.id, NULLABLE | |
| created_at | TIMESTAMP | default now() |
| updated_at | TIMESTAMP | auto-update on change |

> ملحوظة قابلية التوسع: سيب الـ status و الـ category كـ ENUM أو Lookup Table بسيط عشان تقدر تضيف حالة/تصنيف جديد بسهولة من غير ما تكسر الداتا القديمة.

---

## 2. Middlewares

### `authenticate.js`
- بيقرا الـ Header `Authorization: Bearer <token>`.
- بيعمل `jwt.verify`، لو التوكن غلط/منتهي → `401 Unauthorized`.
- لو صح: بيحط `req.user = { id, role }` عشان يتستخدم في أي controller جاي.

### `authorize(...roles)`
- Middleware بارامتر (roles مسموح بيها للـ route).
- بيتشيك `req.user.role` موجود في القائمة، لو لأ → `403 Forbidden`.
- مثال استخدام: `router.patch('/:id/status', authenticate, authorize('staff','manager'), ...)`

### `errorHandler.js`
- Global middleware في آخر الـ chain، بيمسك أي Exception ويرجعه بشكل موحد `{ success:false, message, errors }` مع الـ status code المناسب (400/401/403/404/409/500).

---

## 3. Auth Module

### 3.1 `POST /api/auth/login`
**Access:** Public

**Request Body:**
```json
{ "email": "user@example.com", "password": "123456" }
```

**Validation:**
- `email`: required, صيغة إيميل صحيحة
- `password`: required, string

**منطق العمل (Service):**
1. جيب المستخدم بالـ email من الـ Repository.
2. لو مش موجود → `401` برسالة عامة "بيانات الدخول غير صحيحة" (من غير ما تحدد إن الإيميل غلط تحديدًا، لأسباب أمان).
3. قارن الباسورد بـ `bcrypt.compare`.
4. لو تمام: اعمل `jwt.sign({ id, role }, SECRET, { expiresIn: '8h' })`.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "jwt...",
    "user": { "id": 1, "name": "Ahmed", "role": "staff" }
  }
}
```

**Errors:**
- `400` — بيانات ناقصة
- `401` — بيانات دخول غلط

---

### 3.2 (اختياري خارج نطاق الـ MVP الصريح لكن غالبًا محتاجه لسييد المستخدمين) `POST /api/auth/register`
> الوثيقة الأصلية ما ذكرتش Register صراحة (بتفترض إن المستخدمين متسجلين مسبقًا)، بس عمليًا هتحتاج طريقة لإنشاء أول Manager/Staff. الاختيارين:
> - **Seed Script** يدوي (INSERT مباشر في الداتا بيز وقت الإعداد) — الأنسب لو عايزين نلتزم 100% بالـ MVP.
> - أو endpoint بسيط `POST /api/auth/register` بس يتقفل بعد أول استخدام أو يتحمي بصلاحية Manager بس.

**Request Body (لو هتعمله):**
```json
{ "name": "Ahmed", "email": "...", "password": "...", "role": "staff" }
```
**منطق العمل:** Hash الباسورد بـ bcrypt قبل الحفظ، تحقق إن الإيميل مش مكرر (`409 Conflict` لو مكرر).

---

## 4. Tickets Module

### 4.1 `POST /api/tickets` — إنشاء تذكرة جديدة
**Access:** Requester (أو أي دور فعليًا، بس الـ MVP بيركز على Requester)

**Middleware:** `authenticate`

**Request Body:**
```json
{ "category": "Software", "description": "الجهاز مش شغال" }
```

**Validation:**
- `category`: required, لازم تكون واحدة من الـ ENUM المحدد
- `description`: required, string, حد أدنى مثلاً 10 حروف

**منطق العمل (Service):**
1. `requester_id` بياخده من `req.user.id` (مش من الـ Body — عشان محدش يقدر يبعت طلب باسم حد تاني).
2. `status` بيتحط تلقائي `New`.
3. `owner_id` بيتحط `null` (Unassigned).
4. Insert في الجدول عن طريق الـ Repository.

**Response (201):**
```json
{
  "success": true,
  "message": "تم استلام الطلب",
  "data": { "id": 45, "status": "New", "created_at": "2026-07-28T10:00:00Z" }
}
```

**Errors:**
- `400` — category غير صحيحة أو description فاضي/قصير جدًا
- `401` — مش مسجل دخول

---

### 4.2 `GET /api/tickets/my` — تذاكر المستخدم الحالي
**Access:** أي مستخدم مسجل (بيرجع تذاكره هو بس)

**Middleware:** `authenticate`

**منطق العمل:** فلترة `WHERE requester_id = req.user.id`، Sort بالـ `created_at DESC` افتراضيًا.

**Query Params (اختياري):**
- `?status=New` — فلترة بالحالة

**Response (200):**
```json
{
  "success": true,
  "data": [
    { "id": 12, "category": "Software", "description": "...", "status": "In Progress", "created_at": "..." }
  ]
}
```

---

### 4.3 `GET /api/tickets` — كل التذاكر (Staff / Manager)
**Access:** Staff, Manager فقط

**Middleware:** `authenticate`, `authorize('staff','manager')`

**Query Params:**
- `status` — `New` | `In Progress` | `Resolved` | `Closed` | `all` (افتراضي)
- `open` — boolean، لو `true` بيرجع كل حاجة ما عدا `Closed` (مفيد لصفحة الـ Manager Queue)

**منطق العمل:** بناء الـ query ديناميكيًا حسب الـ params، مع `JOIN` على جدول `users` مرتين (مرة لـ requester ومرة لـ owner) عشان ترجع الأسماء مش الـ IDs بس.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 45,
      "requester": { "id": 3, "name": "Mona" },
      "category": "Hardware",
      "status": "New",
      "owner": null,
      "created_at": "..."
    }
  ]
}
```

---

### 4.4 `GET /api/tickets/:id` — تفاصيل تذكرة واحدة
**Access:** أي مستخدم مسجل، بس بشرط:
- لو الدور `Requester` → لازم يكون هو صاحب التذكرة (`requester_id === req.user.id`)، غير كده `403 Forbidden`.
- لو `Staff` أو `Manager` → مسموح يشوف أي تذكرة.

**Middleware:** `authenticate`

**منطق العمل (Service):** جيب التذكرة، تحقق من الصلاحية زي فوق، لو مش موجودة `404 Not Found`.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 45,
    "category": "Software",
    "description": "...",
    "status": "In Progress",
    "requester": { "id": 3, "name": "Mona" },
    "owner": { "id": 7, "name": "Sara" },
    "created_at": "...",
    "updated_at": "..."
  }
}
```

**Errors:**
- `403` — Requester بيحاول يشوف تذكرة مش بتاعته
- `404` — التذكرة مش موجودة

---

### 4.5 `PATCH /api/tickets/:id/status` — تغيير حالة التذكرة
**Access:** Staff, Manager

**Middleware:** `authenticate`, `authorize('staff','manager')`

**Request Body:**
```json
{ "status": "Resolved" }
```

**Validation:**
- `status`: required, لازم تكون من الـ ENUM

**منطق العمل (Service) — أهم جزء في المشروع كله:**
1. جيب التذكرة الحالية.
2. رتب الحالات: `New(0) → In Progress(1) → Resolved(2) → Closed(3)`.
3. **قاعدة الترتيب:** الحالة الجديدة لازم تكون بالظبط الحالة اللي بعد الحالة الحالية (`newIndex === currentIndex + 1`). أي حاجة تانية (رجوع للخلف، أو قفز حالتين) → `409 Conflict` برسالة "لا يمكن الانتقال من X إلى Y مباشرة".
4. **قاعدة صلاحية الإغلاق:** لو الحالة الجديدة `Closed` والدور مش `Manager` → `403 Forbidden` "فقط المدير يقدر يقفل التذكرة".
5. لو كل حاجة تمام: Update في الـ DB + تحديث `updated_at` تلقائي.

**Response (200):**
```json
{ "success": true, "data": { "id": 45, "status": "Resolved" } }
```

**Errors:**
- `400` — status مش من ضمن القيم المسموحة
- `403` — Staff بيحاول يقفل تذكرة
- `404` — التذكرة مش موجودة
- `409` — انتقال حالة غير مسموح بترتيبه

---

### 4.6 `PATCH /api/tickets/:id/assign` — تعيين/إعادة تعيين Owner
**Access:** Staff, Manager

**Middleware:** `authenticate`, `authorize('staff','manager')`

**Request Body:**
```json
{ "owner_id": 7 }
```

**Validation:**
- `owner_id`: required, لازم يكون رقم موجود فعلاً في جدول `users` وله role `staff` أو `manager` (مينفعش تعين Requester كـ Owner).

**منطق العمل (Service):**
1. تحقق إن `owner_id` موجود وصالح.
2. Update عمود `owner_id` في التذكرة.
3. (اختياري MVP+) سجل الفعل ده في تاريخ التذكرة لو هتضيف Audit Log بعدين.

**Response (200):**
```json
{ "success": true, "data": { "id": 45, "owner": { "id": 7, "name": "Sara" } } }
```

**Errors:**
- `400` — `owner_id` مش موجود في الـ Body
- `404` — التذكرة أو المستخدم المعين مش موجود
- `422` — الـ owner_id بتاع مستخدم دوره Requester (مش مسموح)

---

### 4.7 `GET /api/tickets/summary` — ملخص عدد التذاكر لكل حالة
**Access:** Manager فقط (أو Staff+Manager لو حبيت توسعها)

**Middleware:** `authenticate`, `authorize('manager')`

**منطق العمل:** `SELECT status, COUNT(*) FROM tickets GROUP BY status`، وتتأكد إن كل الحالات الأربعة ترجع حتى لو عددها صفر (COALESCE بالـ 0).

**Response (200):**
```json
{
  "success": true,
  "data": { "New": 5, "In Progress": 3, "Resolved": 2, "Closed": 10 }
}
```

---

## 5. جدول تجميعي لكل الـ Endpoints

| Method | Endpoint | Auth | Roles المسموحة | الوصف |
|---|---|---|---|---|
| POST | `/api/auth/login` | ❌ | الكل | تسجيل الدخول |
| POST | `/api/tickets` | ✅ | أي مستخدم | إنشاء تذكرة جديدة |
| GET | `/api/tickets/my` | ✅ | أي مستخدم | تذاكر المستخدم الحالي |
| GET | `/api/tickets` | ✅ | Staff, Manager | كل التذاكر (بفلاتر) |
| GET | `/api/tickets/:id` | ✅ | الكل (بقيود) | تفاصيل تذكرة واحدة |
| PATCH | `/api/tickets/:id/status` | ✅ | Staff, Manager | تغيير الحالة |
| PATCH | `/api/tickets/:id/assign` | ✅ | Staff, Manager | تعيين/إعادة تعيين Owner |
| GET | `/api/tickets/summary` | ✅ | Manager | ملخص عدد التذاكر لكل حالة |

---

## 6. قواعد الـ Business Logic المُلزمة (لازم تتاخد بجدية في الـ Service Layer)

1. **ترتيب الحالات صارم وفي اتجاه واحد فقط:**
   `New → In Progress → Resolved → Closed`، مفيش رجوع للخلف، ومفيش قفز حالة.
2. **الإغلاق (Closed) حكر على الـ Manager بس.** أي محاولة من Staff تتقفل بـ 403.
3. **الـ Requester Read-Only تمامًا** على أي endpoint بيغير بيانات (status/assign) — الـ Route نفسه أصلاً محمي بـ `authorize('staff','manager')` فمينفعش يوصل له.
4. **الـ Requester يشوف بس تذاكره** — أي محاولة يفتح `GET /:id` لتذكرة مش بتاعته لازم ترجع 403.
5. **owner_id لازم يبقى Staff أو Manager بس**، مينفعش تتعين Requester كـ Owner.
6. **كل حقول الإجباري (category, description) بيتم التحقق منها Server-side** مش بس Client-side (الفرونت مش مصدر موثوق).

---

## 7. Non-Functional (لازم تتطبق في الكود مش بس في الوثيقة)

- **Password Hashing:** `bcrypt` بـ salt rounds 10-12، أبدًا متسيبش الباسورد plain text.
- **JWT Expiry:** مثلاً 8 ساعات، وممكن تضيف Refresh Token لاحقًا لو احتجت.
- **Response Time:** استعلامات بسيطة بـ Indexes مناسبة على `requester_id`, `owner_id`, `status` عشان الأداء يفضل تحت الثانية حتى مع بيانات أكبر.
- **Error Handling موحد:** كل الأخطاء بترجع نفس الشكل `{ success:false, message, errors }` عن طريق الـ Global Error Handler، مش try/catch متبعثر في كل Controller.

---

## 8. مثال على شكل الـ Postman Collection (عشان تتفق عليه الفريق من البداية)

```
HelpDesk Lite API
├── Auth
│   └── Login
└── Tickets
    ├── Create Ticket
    ├── Get My Tickets
    ├── Get All Tickets (Staff/Manager)
    ├── Get Ticket By Id
    ├── Update Status
    ├── Assign Owner
    └── Get Status Summary
```

> استخدم Environment Variables في Postman زي `{{base_url}}` و `{{token}}` عشان أي عضو في الفريق يقدر يجرب أي Request فورًا من غير ما يعدل حاجة يدوي.
