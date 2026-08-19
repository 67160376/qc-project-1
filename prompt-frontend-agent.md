# Prompt สำหรับใช้กับ Coding Agent (Claude Code / Cursor / อื่นๆ)

คัดลอกข้อความด้านล่างทั้งหมดไปวางใน agent ได้เลย

---

บทบาทของคุณ: คุณเป็นนักพัฒนา Full-stack Frontend ที่กำลังช่วยทีม QC โรงงานสร้างเว็บแอป
เชื่อมต่อกับ REST API ที่มีอยู่แล้ว (Node.js/Express + PostgreSQL, รันด้วย Docker Compose ที่ `http://localhost:4000/api/v1`)

## บริบทของระบบ

**อุตสาหกรรมการผลิต — QC: ระบบควบคุมคุณภาพสินค้า (Incoming → In-process → Final → Decision)**

**Persona:** "พี่หมู" อายุ 32 ปี เจ้าหน้าที่ QC ประจำไลน์ผลิต ทำงานกะเช้า-บ่าย ใช้แท็บเล็ต/เครื่องสแกนหน้างานเป็นหลัก ไม่ถนัดเทคโนโลยีที่ซับซ้อน ต้องตัดสินใจเร็วเพราะไลน์ผลิตเดินตลอดเวลา

**เป้าหมาย:** ตรวจสอบคุณภาพสินค้าในแต่ละขั้นตอนได้ครบถ้วน บันทึกผลได้ทันที และแจ้งเตือนเมื่อพบของเสียก่อนที่จะไหลไปขั้นตอนถัดไป

**Pain Points:**
- ไม่รู้ว่าต้องตรวจตามเกณฑ์ไหนของแต่ละ SKU
- บันทึกผลด้วยกระดาษ/มือ ทำให้ข้อมูลตกหล่นหรือย้อนกลับดูยาก
- ค่าพารามิเตอร์ผิดปกติแต่รู้ตัวช้าเพราะไม่มีแจ้งเตือนแบบเรียลไทม์
- ไม่รู้สถานะว่าสินค้าล็อตนี้ถูกปล่อยหรือถูกกักไว้

## User Journey → ต้องมีหน้าจอเหล่านี้

1. **หน้าแรกแอป QC** (ก่อนเริ่มกะ) — กดปุ่ม "เริ่มตรวจ QC" เลือกไลน์ผลิต/ล็อตที่จะตรวจ → แสดงรายการงานตรวจที่ต้องทำในกะนี้
2. **หน้าตรวจวัตถุดิบขาเข้า** — สแกน/กรอกรหัสล็อตวัตถุดิบ, ถ่ายรูปตัวอย่าง → ระบบดึงสเปค AQL ของ SKU มาเทียบให้อัตโนมัติ
3. **หน้าบันทึกผลตรวจขาเข้า** — กรอกผลตรวจ (ผ่าน/ไม่ผ่าน) แนบเอกสาร CoA/CoC → ระบบตรวจสอบความครบถ้วน validate แบบเรียลไทม์
4. **หน้าตรวจระหว่างผลิต (in-process QC)** — กรอกค่าพารามิเตอร์ตามรอบเวลาที่กำหนด → ระบบเทียบกับ control limit (SPC) ทันที
5. **หน้าแจ้งเตือนค่าออกนอกเกณฑ์** — กดยืนยันรับทราบ หรือสั่งหยุดไลน์ (stop-line) → ระบบแจ้งเตือนหัวหน้างานผ่าน Push Notification
6. **หน้าตรวจสินค้าสำเร็จรูป** — สุ่มตัวอย่างตามแผน ทดสอบตามมาตรฐานผลิตภัณฑ์ → ระบบคำนวณผลสรุปว่าผ่านเกณฑ์ AQL หรือไม่
7. **หน้าตัดสินใจผ่าน/ไม่ผ่าน** — เลือก "ผ่าน" เพื่อปล่อยสินค้า หรือ "ไม่ผ่าน" เพื่อกักสินค้า → ระบบออกใบ COA หรือใบ NCR ให้อัตโนมัติ
8. **หน้าติดตาม NCR** (กรณีไม่ผ่าน) — ระบุสาเหตุเบื้องต้น มอบหมายผู้รับผิดชอบแก้ไข → ระบบสร้าง case ติดตาม root cause พร้อมกำหนดเวลา
9. **หน้าสรุปผล / Dashboard** — ตรวจสอบสถานะล็อตทั้งหมดในกะ → ระบบแสดงสรุปแบบเรียลไทม์ พร้อมออกรายงานประจำวัน

## Edge Cases ที่ต้องออกแบบ UI/UX รองรับ

- เครื่องมือวัด/เกจสอบเทียบหมดอายุระหว่างใช้งาน
- เครือข่ายหลุดระหว่างบันทึกผลตรวจ (ต้องมีกลไก sync ภายหลังโดยไม่ให้ข้อมูลซ้ำ — ใช้ header `Idempotency-Key` ที่ API รองรับอยู่แล้ว)
- พบของเสียกลางไลน์แต่หัวหน้างานไม่อยู่หน้างาน (ต้องมี fallback แจ้งเตือนสำรอง)
- SKU ใหม่ที่ยังไม่มีสเปค AQL อยู่ในระบบ
- ผลตรวจสองรอบขัดแย้งกัน (ต้องมีกลไก re-test / escalation)

## Acceptance Criteria

- เจ้าหน้าที่ QC บันทึกผลตรวจแต่ละรายการได้ภายใน 2 นาที (UI ต้องเรียบง่าย ไม่กี่คลิก)
- ระบบแจ้งเตือนหัวหน้างานภายใน 30 วินาที เมื่อค่าพารามิเตอร์ออกนอกเกณฑ์
- ทุกล็อตที่ถูกปล่อยต้องมีใบ COA อ้างอิงย้อนกลับได้ (traceability)
- ทุกล็อตที่ไม่ผ่านต้องมีใบ NCR พร้อมผู้รับผิดชอบและกำหนดเวลาแก้ไข
- ระบบป้องกันการบันทึกผลซ้ำ (idempotency) เมื่อเครือข่ายหลุดแล้วเชื่อมต่อใหม่
- มีรายงานสรุปประจำวันที่ตรวจสอบผ่านแล้ว และสามารถ export ได้ (PDF/Excel)

## API ที่มีอยู่แล้ว (ใช้เชื่อมต่อ ไม่ต้องสร้างใหม่)

Base URL: `http://localhost:4000/api/v1`, auth ด้วย `Authorization: ******`

- Auth: `POST /register`, `POST /login`, `POST /logout`, `POST /change-password`
- User: `GET /me`, `PUT /me`, `GET /users`, `GET /users/:id`, `PUT /users/:id`, `DELETE /users/:id`, `GET /check-username/:name`
- Catalog: `GET|POST /lines`, `GET|POST /skus`, `GET|POST /skus/:id/aql-spec`
- Lots: `POST /lots`, `GET /lots`, `GET /lots/:id`, `PUT /lots/:id/status`
- Incoming: `POST /lots/:id/incoming-inspection` (multipart: photo, coa, coc), `GET /lots/:id/incoming-inspection`
- In-process: `POST /lots/:id/inprocess-readings`, `GET /lots/:id/inprocess-readings`, `GET /lots/:id/inprocess-readings/spc-check`
- Alerts: `GET /alerts`, `POST /alerts/:id/acknowledge`, `POST /alerts/:id/stop-line`, `POST /alerts/:id/escalate`
- Final: `POST /lots/:id/final-inspection`, `GET /lots/:id/final-inspection`
- Decision: `POST /lots/:id/decision`, `GET /lots/:id/coa`, `GET /lots/:id/ncr`
- NCR: `GET /ncr`, `GET /ncr/:id`, `PUT /ncr/:id`, `POST /ncr/:id/retest`
- Dashboard: `GET /dashboard/summary`, `GET /reports/daily`, `GET /reports/daily/export`

## สิ่งที่ต้องการให้สร้าง

สร้าง frontend project ที่พร้อม deploy ครอบคลุมทุกหน้าจอใน User Journey ข้างต้น โดย:

1. ใช้ **React 18 + Vite + TypeScript + TailwindCSS** (mobile-first, เหมาะกับแท็บเล็ต/เครื่องสแกนหน้างาน ปุ่มใหญ่ กดง่าย)
2. ใช้ **React Router** สำหรับ routing ตามหน้าจอทั้ง 9 ขั้นตอน
3. ใช้ **React Query (TanStack Query)** จัดการ data fetching + cache + retry สำหรับกรณีเน็ตหลุด (ส่ง `Idempotency-Key` แบบ UUID ที่สร้างฝั่ง client ก่อนบันทึกทุกครั้ง แล้ว retry ด้วย key เดิมถ้า request ล้มเหลว)
4. เก็บ JWT token ไว้ใน memory + refresh ผ่าน context, ไม่ใช้ localStorage สำหรับข้อมูล sensitive
5. ทำ role-based UI: `qc_staff` เห็นเฉพาะบันทึกผลตรวจ, `supervisor`/`admin` เห็นหน้า acknowledge/stop-line/decision/dashboard เพิ่ม
6. ทำ real-time-ish polling หรือ WebSocket mock สำหรับหน้า dashboard และหน้าแจ้งเตือน (ให้ auto-refresh ทุก 10-15 วินาที เป็นอย่างน้อย)
7. เพิ่ม offline-friendly UX: banner แจ้งเตือนเมื่อ network หลุด, queue การบันทึกไว้แล้ว sync อัตโนมัติเมื่อกลับมาออนไลน์
8. สร้าง `Dockerfile` (multi-stage build, serve ด้วย nginx) และเพิ่ม service `frontend` เข้าไปใน `docker-compose.yml` เดิม (ให้รันคู่กับ `api` และ `db` ได้ด้วยคำสั่งเดียว `docker compose up --build`)
9. เขียน README อธิบายวิธีรัน วิธีตั้งค่า `VITE_API_BASE_URL`

เริ่มจากวางโครงสร้างโปรเจกต์ (folder structure, routing, API client layer) ก่อน แล้วค่อยลงรายละเอียดทีละหน้าจอตามลำดับ Step 1 → 9
