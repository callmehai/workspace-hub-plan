# Workspace Hub

Đồ án Fullstack ASP.NET 10 tuần · Nhóm 6 người (3 BE + 3 FE) · 60% Backend / 40% Frontend.

App đa nguồn gom **Gmail · Outlook · Calendar · Drive · OneDrive · Jira · Telegram** về 1 nơi, kéo thả theo dự án.

---

## 📚 Tài liệu (đã deploy Netlify)

- **Plan đầy đủ**: https://workspace-hub-plan.netlify.app/
- **Demo prototype**: https://workspace-hub-plan.netlify.app/prototype.html
- **Timeline 10 tuần (drag-drop checklist)**: https://workspace-hub-plan.netlify.app/timeline.html

Đọc plan trước → hiểu scope → vào timeline tick task → bắt đầu code.

---

## 📁 Cấu trúc thư mục

```
workspace-hub-plan/
├── index.html, prototype.html, timeline.html   # ← Doc/plan (Netlify deploy)
├── backend/                                    # ← BE code
│   ├── WorkspaceHub.slnx
│   └── WorkspaceHub.Api/                       # ASP.NET Core 8 Web API
│       ├── Controllers/    ← endpoint
│       ├── Services/       ← business logic
│       ├── Repositories/   ← truy cập DB
│       ├── DTOs/           ← request/response
│       ├── Entities/       ← model EF Core (User, Role, ...)
│       ├── Data/           ← AppDbContext + Migrations
│       ├── Middlewares/    ← ExceptionMiddleware
│       ├── Validators/     ← FluentValidation
│       ├── Mappings/       ← AutoMapper profiles
│       └── Program.cs      ← composition root
├── frontend/                                   # ← FE code
│   ├── src/
│   │   ├── pages/          ← Login/Register/Inbox/...
│   │   ├── components/     ← AppLayout, ProtectedRoute, ...
│   │   ├── lib/            ← api.ts (axios instance)
│   │   ├── hooks/, types/
│   │   ├── App.tsx         ← router setup
│   │   └── main.tsx
│   ├── package.json, vite.config.ts, tailwind.config.js
│   └── .env.example
├── .gitignore
├── netlify.toml            ← chỉ deploy file ở root (plan/prototype/timeline)
└── README.md (file này)
```

---

## 🛠 Yêu cầu môi trường

| Tool | Version | Cài đặt |
|---|---|---|
| .NET SDK | **8.x** (hoặc 10.x — đang build target net8) | https://dotnet.microsoft.com/download/dotnet/8.0 |
| Node.js | ≥ 20.x | https://nodejs.org |
| Git | mọi version | đã có sẵn macOS/Linux |

> **Lưu ý**: Máy hiện tại đang dùng .NET SDK 10 build cho target `net8.0`. Hoạt động bình thường vì SDK 10 forward-compatible. Nếu lỗi, install thêm .NET 8 SDK riêng.

---

## 🚀 Cách chạy local

### 1. Clone repo

```bash
git clone https://github.com/callmehai/workspace-hub-plan.git
cd workspace-hub-plan
```

### 2. Backend

```bash
cd backend/WorkspaceHub.Api
dotnet restore        # cài package (chỉ chạy 1 lần)
dotnet run            # chạy API → mặc định http://localhost:5289
```

Mở trình duyệt: http://localhost:5289/swagger để xem API docs.

Health check: `GET /api/health` → trả JSON `{api:"ok", db:"ok"}`.

### 3. Frontend

Mở terminal khác:

```bash
cd frontend
cp .env.example .env.local   # tạo env file
npm install                  # cài package (chỉ chạy 1 lần)
npm run dev                  # chạy FE → mặc định http://localhost:5173
```

Mở trình duyệt: http://localhost:5173 → trang Login.

### 4. Test connect BE ↔ FE

- Vào http://localhost:5173/inbox (cần đăng nhập trước, hiện tại API auth chưa làm — bỏ qua bước này tới Tuần 3)
- Nếu thấy "✓ ok" trong card "Trạng thái Backend" → 2 service đã connect.

---

## 🗂 Tech stack

### Backend (.NET 8)
- ASP.NET Core 8 Web API
- EF Core 8 (SQLite dev / PostgreSQL prod)
- JWT Bearer + BCrypt (password hashing)
- **Policy-based Authorization** (`AdminOnly` policy)
- FluentValidation 11
- AutoMapper 14
- Serilog (structured logging)
- Swashbuckle (Swagger UI)

### Frontend (React 19)
- Vite + React + TypeScript
- React Router v6
- TanStack Query v5 (server state)
- Axios (HTTP client, auto attach JWT)
- Tailwind CSS 3
- react-hook-form + zod
- react-hot-toast

### Integration (sẽ làm Tuần 5-7)
- **Nango Cloud** (OAuth + proxy 3 provider)
- Google APIs (Gmail / Calendar / Drive)
- Microsoft Graph (Outlook / Calendar / OneDrive)
- Atlassian (Jira Cloud)
- Telegram Bot API
- cron-job.org (external cron cho ScheduledEmail)

---

## 👥 Phân chia nhóm 6 người (gợi ý ban đầu — có thể đổi qua lại)

| Slot | Mảng | Module chính |
|---|---|---|
| **BE-1** | Auth + Admin + Telegram | JWT, Role/UserRole, Policy AdminOnly, Admin API, Telegram in/out, Notification |
| **BE-2** | Workspace + Share + Handler | Item/Folder/Tag, FolderShare, IAuthorizationHandler, API shared-with-me |
| **BE-3** | 7 Integration + Schedule | Wrapper Gmail/GCal/GDrive/Outlook/OutlookCal/OneDrive/Jira, ScheduledEmail, cron |
| **FE-1** | Foundation + Settings | Vite setup, Auth pages, Inbox, Settings (Integration toggle), Telegram wizard |
| **FE-2** | Workspace UI + Compose | Layout, Folder Kanban + dnd-kit, Compose modal + Schedule picker, Share modal |
| **FE-3** | Admin + Dashboard + Polish | Admin Page, Shared-with-me sidebar, Notification center, Dashboard, Responsive |

→ Vào https://workspace-hub-plan.netlify.app/timeline.html, mở từng tuần, **điền tên vào slot** mình nhận, tick task khi xong. Task có thể **kéo qua slot khác** hoặc **kéo qua tuần khác** để cân bằng workload.

---

## 🌿 Git workflow (đề xuất)

```
main      ← branch chính, code đã review xong
develop   ← branch tích hợp, dev hằng ngày
feature/* ← branch tính năng riêng của mỗi người
```

### Pull request flow
1. Tạo branch từ `develop`: `git checkout -b feature/jwt-login`
2. Code + commit
3. Push: `git push origin feature/jwt-login`
4. Tạo PR vào `develop` trên GitHub
5. ≥1 ae approve → merge

### Commit message format
```
<type>: <mô tả ngắn>

Type:
  feat     - tính năng mới
  fix      - sửa bug
  refactor - đổi code không đổi behavior
  docs     - update document
  test     - thêm test
  chore    - misc (config, dep update)
```

Ví dụ:
- `feat: add JWT login endpoint`
- `fix: handle null email in register flow`
- `docs: update README run instructions`

---

## 📋 Trạng thái hiện tại (cập nhật tới Tuần 3 init)

### ✅ Đã làm
- BE: solution + project skeleton (`net8.0`, folder structure, gói NuGet, Program.cs config)
- BE: Entity `User` + `Role` + `UserRole` + `RoleNames` (Admin/User)
- BE: `AppDbContext` + seed 2 role mặc định
- BE: JWT Bearer + Policy `AdminOnly` setup
- BE: ExceptionMiddleware + Serilog + Swagger + FluentValidation + AutoMapper
- BE: `GET /api/health` để check kết nối
- FE: Vite + React 19 + TS skeleton
- FE: Tailwind config + brand colors
- FE: React Router + ProtectedRoute + AppLayout + Login/Register/Inbox page
- FE: TanStack Query setup + axios với JWT interceptor
- FE: react-hot-toast notification

### ⏳ Việc tiếp theo (Tuần 3 — xem timeline)
- BE-1: Migration đầu (`User + Role + UserRole`), JWT login/register endpoint
- BE-2: Migration `IntegrationAccount + ServiceConnection + TelegramBinding`
- BE-3: Nango BE setup + OAuth flow + CRUD IntegrationAccount
- FE-1: Wire login form vào API thật (hiện đang gọi `/api/auth/login` chưa tồn tại)
- FE-2: Build sidebar + brand
- FE-3: Toast/loading/error polish

---

## ❓ Gặp vấn đề?

### BE không build
```bash
cd backend/WorkspaceHub.Api
dotnet clean
dotnet restore --force
dotnet build
```

### FE lỗi `Module not found`
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Port đã bị chiếm (5001 / 5173)
```bash
# Tìm và kill process
lsof -ti:5001 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### Migration EF Core
```bash
cd backend/WorkspaceHub.Api
dotnet ef migrations add InitialCreate
dotnet ef database update
```
(Cần cài: `dotnet tool install --global dotnet-ef`)

---

## 📞 Liên hệ nhóm

- Repo: https://github.com/callmehai/workspace-hub-plan
- PR review: tag ae trong nhóm
- Standup hằng ngày: tự tick task trong [timeline](https://workspace-hub-plan.netlify.app/timeline.html), tải JSON backup gửi nhóm cuối ngày
