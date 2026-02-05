# Full Stack User Management (Vue 3 + NestJS + Firebase)

โปรเจกต์นี้เป็นตัวอย่าง **Full Stack CRUD Application** สำหรับการจัดการผู้ใช้งาน (User Management) โดยใช้

* **Frontend:** Vue 3 (Vite + TypeScript)
* **Backend:** NestJS (TypeScript)
* **Database:** Firebase Firestore (ผ่าน firebase-admin)

เป็นแบบทดสอบของทางบริษัท อิเลคทรอนิกส์ เชลล์ จำกัด ที่มอบมาให้ผมทำการพัฒนาเพื่อเป็นแบบทดสอบ

---

## Features

### Backend (NestJS)

* โครงสร้างแบบ Module / Controller / Service
* REST API สำหรับจัดการผู้ใช้งาน

  * สร้างผู้ใช้
  * ดึงรายการผู้ใช้ทั้งหมด
  * แก้ไขข้อมูลผู้ใช้
  * ลบผู้ใช้
* เชื่อมต่อ Firebase Firestore ด้วย Service Account
* Validation ด้วย class-validator

### Frontend (Vue 3)

* Dark Theme สไตล์โมเดิร์น
* Dashboard แสดงสถิติผู้ใช้แบบอัปเดตตามข้อมูล
* ตารางแสดงผู้ใช้ (ไม่แสดง ID)
* เพิ่ม / แก้ไข / ลบ ผู้ใช้ผ่าน Modal
* Avatar สีหลากหลาย (สุ่มตามชื่อผู้ใช้)
* สถานะ Active / Inactive พร้อม animation
* Responsive รองรับ Desktop / Tablet / Mobile

---

## Project Structure

```
fullstack-users/
│
├─ backend/
│  ├─ src/
│  │  ├─ config/
│  │  │  └─ firebase.ts
│  │  ├─ users/
│  │  │  ├─ dto/
│  │  │  │  ├─ create-user.dto.ts
│  │  │  │  └─ update-user.dto.ts
│  │  │  ├─ user.entity.ts
│  │  │  ├─ users.controller.ts
│  │  │  ├─ users.service.ts
│  │  │  └─ users.module.ts
│  │  ├─ app.module.ts
│  │  └─ main.ts
│  ├─ serviceAccountKey.json   
│  ├─ .env                     
│  └─ package.json
│
├─ frontend/
│  ├─ index.html
│  ├─ src/
│  │  ├─ lib/
│  │  │  └─ api.ts
│  │  ├─ types/
│  │  │  └─ user.ts
│  │  ├─ App.vue
│  │  └─ main.ts
│  └─ package.json
│
└─ README.md
```

---

## Backend Setup (NestJS)

### 1. ติดตั้ง dependencies

```bash
cd backend
npm install
```

### 2. ตั้งค่า Firebase Service Account

1. ไปที่ Firebase Console
2. Project Settings → Service accounts
3. Generate new private key
4. ดาวน์โหลดไฟล์ `serviceAccountKey.json`
5. วางไฟล์ไว้ที่ `backend/serviceAccountKey.json`

สร้างไฟล์ `.env`

```env
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

> หมายเหตุ: ห้าม commit `serviceAccountKey.json` และ `.env`

### 3. รัน Backend

```bash
npm run start:dev
```

Backend จะรันที่

```
http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint   | Description      |
| ------ | ---------- | ---------------- |
| GET    | /users     | ดึงผู้ใช้ทั้งหมด |
| GET    | /users/:id | ดึงผู้ใช้ตาม id  |
| POST   | /users     | เพิ่มผู้ใช้ใหม่  |
| PATCH  | /users/:id | แก้ไขผู้ใช้      |
| DELETE | /users/:id | ลบผู้ใช้         |

ตัวอย่าง payload (POST /users)

```json
{
  "email": "test@example.com",
  "displayName": "Test User",
  "role": "user",
  "isActive": true
}
```

---

## Frontend Setup (Vue 3)

### 1. ติดตั้ง dependencies

```bash
cd frontend
npm install
```

### 2. รัน Frontend

```bash
npm run dev
```

เปิดเว็บที่

```
http://localhost:5173
```

Frontend จะเชื่อมต่อ Backend ที่

```
http://localhost:3000
```

---

## Notes

* โปรเจกต์นี้ยัง **ไม่มีระบบ Authentication / Authorization**
* role (user / admin) ใช้เพื่อแสดงข้อมูลและรองรับการขยายระบบในอนาคต
* เหมาะสำหรับใช้เป็นตัวอย่าง CRUD + Full Stack Architecture

---

## Possible Extensions

* เพิ่ม Login ด้วย Firebase Auth
* ใช้ JWT + Role Guard ใน NestJS
* Real-time update ด้วย WebSocket / SSE
* Pagination และ Sorting ในตารางผู้ใช้

---

## Author

Full Stack CRUD Demo using Vue 3, NestJS, and Firebase Firestore
