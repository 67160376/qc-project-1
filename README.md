# 🏭 QC System - Quality Control Management System

ระบบจัดการและควบคุมคุณภาพสินค้า (Quality Control Management System)
พัฒนาขึ้นเพื่อช่วยจัดการข้อมูลสินค้า การตรวจสอบคุณภาพ
Non-Conformance Report (NCR) และการแจ้งเตือนภายในระบบ

ระบบถูกพัฒนาในรูปแบบ Full Stack Application
โดยใช้ React สำหรับ Frontend, Node.js + Express สำหรับ Backend
และ PostgreSQL สำหรับจัดเก็บข้อมูล พร้อมใช้งานผ่าน Docker และ Docker Compose

---

## 📌 Features

ระบบประกอบด้วยฟังก์ชันหลักดังนี้

### 👤 User Authentication

- สมัครสมาชิก
- เข้าสู่ระบบ
- ออกจากระบบ
- JWT Authentication
- เปลี่ยนรหัสผ่าน
- ตรวจสอบ Username
- ดูข้อมูลผู้ใช้งาน

### 📦 Product Management

- เพิ่มสินค้า
- ดูรายการสินค้า
- ดูรายละเอียดสินค้า
- แก้ไขสินค้า
- ลบสินค้า
- ตรวจสอบ Product Code ซ้ำ

### 🔍 Inspection Management

- สร้างข้อมูลการตรวจสอบสินค้า
- ดูรายการ Inspection
- ดูรายละเอียด Inspection
- แก้ไขข้อมูล
- ลบข้อมูล
- บันทึกผลการตรวจสอบ

### ⚠️ NCR Management

ระบบจัดการ Non-Conformance Report

- สร้าง NCR
- ดูรายการ NCR
- ดูรายละเอียด NCR
- แก้ไขสถานะ NCR
- ลบ NCR

### 🚨 Alert Management

- สร้าง Alert
- ดูรายการ Alert
- Acknowledge Alert
- ลบ Alert

### 📊 Dashboard

แสดงข้อมูลสรุปของระบบ เช่น

- จำนวนสินค้าทั้งหมด
- จำนวนการตรวจสอบ
- จำนวนสินค้าที่ผ่านการตรวจสอบ
- จำนวนสินค้าที่ไม่ผ่านการตรวจสอบ
- จำนวน NCR ที่ยังเปิดอยู่
- จำนวน Alert ที่ยังไม่ได้ดำเนินการ

---

# 🛠️ Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

## Backend

- Node.js
- Express.js
- JWT
- bcryptjs

## Database

- PostgreSQL 14

## DevOps

- Docker
- Docker Compose
- Nginx

---

# 📁 Project Structure

```text
qc-project-main/
│
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   │
│   │   ├── routes/
│   │   │   ├── alerts.js
│   │   │   ├── auth.js
│   │   │   ├── dashboard.js
│   │   │   ├── inspections.js
│   │   │   ├── ncrs.js
│   │   │   ├── products.js
│   │   │   └── users.js
│   │   │
│   │   ├── db.js
│   │   └── server.js
│   │
│   ├── Dockerfile
│   └── package.json
│
├── database/
│   └── init.sql
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── README.md
└── .gitignore
