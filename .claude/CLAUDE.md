# Workspace Hub — Context cho Claude Code

File này load tự động vào mọi Claude session khi mở repo. Mục đích: cho Claude tương lai biết project là gì, conventions, và task ưu tiên — đỡ phải explain lại.

---

## TL;DR — project là gì

**Đồ án Fullstack ASP.NET 10 tuần, nhóm 6 người (3 BE + 3 FE), 60/40 BE-FE.**
App aggregator: gom Gmail / Outlook / GCal / Outlook Cal / Drive / OneDrive / Jira / Telegram về 1 nơi.
Concept: `Item` (5 type: email/event/file/ticket/note) → kéo thả vào `Folder` (context) → Kanban 3 cột.
Cộng thêm: **RBAC** (Admin/User) + **Folder Share** (Viewer-only) qua `IAuthorizationHandler`.

Tech stack:
- BE: **ASP.NET Core 8** + EF Core 8 + JWT + FluentValidation + AutoMapper + Serilog + Swagger
- FE: **Vite + React 19 + TypeScript** + Tailwind + Router + TanStack Query + axios + react-hot-toast
- Integration (chưa làm): Nango Cloud (3 OAuth) + Telegram Bot + cron-job.org

---

## Cấu trúc repo

```
/                                # ← root (Netlify deploy static từ đây)
├── index.html                   # Plan đầy đủ (12 sections)
├── prototype.html / .css / .js  # Clickable demo prototype
├── timeline.html / .css / .js   # Tracker 10 tuần với drag-drop checklist
├── script.js, styles.css        # CSS chung cho plan
├── backend/                     # ASP.NET Core 8 Web API
│   ├── WorkspaceHub.slnx
│   └── WorkspaceHub.Api/
│       ├── Controllers/         # HealthController.cs (hiện chỉ có 1)
│       ├── Services/, Repositories/, DTOs/  # rỗng — tạo khi cần
│       ├── Entities/            # User, Role, UserRole, RoleNames (static)
│       ├── Data/AppDbContext.cs # EF Core context + seed 2 role
│       ├── Middlewares/ExceptionMiddleware.cs
│       ├── Validators/, Mappings/  # rỗng
│       ├── Program.cs           # composition root (JWT + Policy + Swagger + ...)
│       ├── appsettings.json
│       └── WorkspaceHub.Api.csproj  # net8.0 target
└── frontend/                    # Vite React TS
    ├── src/
    │   ├── pages/{LoginPage,RegisterPage,InboxPage}.tsx
    │   ├── components/{AppLayout,ProtectedRoute}.tsx
    │   ├── lib/api.ts           # axios instance + JWT interceptor
    │   ├── App.tsx              # router + QueryClient + Toaster
    │   └── main.tsx
    ├── tailwind.config.js       # brand colors
    └── package.json
```

---

## Conventions

### Backend
- Namespace: `WorkspaceHub.Api.{Controllers|Services|Entities|...}`
- Route prefix: `/api/[controller]` (lowercase)
- DTO: hậu tố `Dto` (LoginDto, ItemDto)
- Validator: hậu tố `Validator` (LoginValidator inheriting `AbstractValidator<LoginDto>`)
- Authorize: dùng `[Authorize]` (any logged-in) hoặc `[Authorize(Policy="AdminOnly")]` cho admin endpoint
- Resource-based auth: `IAuthorizationHandler<FolderPermissionRequirement, Folder>` (chưa làm — Tuần 4)
- Migration: dùng EF Core CLI, tạo trong `Data/Migrations/`
- DB dev: SQLite (`workspacehub.db` ở root project). Prod: PostgreSQL — set connection string trong `appsettings.json`.

### Frontend
- Page component đặt trong `src/pages/`, hậu tố `Page` (LoginPage, InboxPage)
- Reusable component đặt trong `src/components/`, không hậu tố
- API call gọi qua `api` instance từ `lib/api.ts` (đã có JWT interceptor + 401 redirect)
- State server dùng **TanStack Query** (`useQuery`, `useMutation`). KHÔNG dùng `useEffect + fetch` thủ công.
- State client (form, modal) dùng `useState` hoặc `react-hook-form` cho form phức tạp.
- Style: **Tailwind utility classes**. Tránh inline style trừ giá trị dynamic.
- Toast: `toast.success(...)` / `toast.error(...)` từ `react-hot-toast`.

### Git
- Default branch: `develop` (Netlify deploy preview)
- Production: `main`
- Feature branch: `feature/<short-name>`, vd `feature/jwt-login`
- Commit: prefix `feat:` / `fix:` / `refactor:` / `docs:` / `chore:`
- PR review: ≥1 approval từ teammate, hoặc owner bypass nếu solo task

---

## Tasks ưu tiên (status hiện tại — Tuần 3 init)

**Đã làm:**
- ✅ BE skeleton compile được (`dotnet build` pass, `net8.0` target trên .NET 10 SDK)
- ✅ Entity User/Role/UserRole + seed Admin/User role
- ✅ JWT + Policy `AdminOnly` configured
- ✅ ExceptionMiddleware, Swagger UI ở `/swagger`
- ✅ `GET /api/health` để verify BE ↔ FE
- ✅ FE Vite + Tailwind + Router + TanStack + axios với JWT interceptor
- ✅ Login/Register/Inbox page placeholder (gọi `/api/auth/login` — chưa làm BE)

**Việc kế (Tuần 3):**
1. **BE-1**: `dotnet ef migrations add InitialCreate` → tạo migration đầu. Implement `POST /api/auth/register` (BCrypt hash, gán role User) và `POST /api/auth/login` (return JWT có claim `role`). Endpoint `/api/auth/me` cho FE check token.
2. **BE-2**: Tạo Entity `IntegrationAccount`, `ServiceConnection`, `TelegramBinding` + migration thứ 2. Skeleton repository pattern (`IUserRepository`, `UserRepository`).
3. **BE-3**: Setup Nango account + cấu hình 3 provider. Endpoint nhận callback từ FE: `POST /api/integrations/connect` lưu `connection_id`.
4. **FE-1**: Login form đã wire vào `/api/auth/login` — chỉ cần BE ready là chạy.
5. **FE-2**: Layout đã có skeleton — thêm navigation items khi có thêm pages.
6. **FE-3**: Toast/loading state đã có — chờ feature mới để wire.

---

## Lệnh hay dùng

### Backend
```bash
cd backend/WorkspaceHub.Api

# Run dev
dotnet run                       # https://localhost:5001

# Migration
dotnet ef migrations add <Name>
dotnet ef database update
dotnet ef migrations remove

# Restore + build
dotnet restore
dotnet build

# Test (chưa có project test — sẽ tạo Tuần 4)
dotnet test
```

### Frontend
```bash
cd frontend

# Dev
npm run dev                      # http://localhost:5173

# Build
npm run build
npm run preview

# Lint
npm run lint
```

---

## Gotchas

1. **`Roles` conflict**: ban đầu em đặt `public static class Roles` chứa hằng số, conflict với `DbSet<Role> Roles` trong DbContext. Đổi tên class thành `RoleNames` để tránh.
2. **`.NET 8 SDK` không có máy**, dùng `.NET 10 SDK` build target `net8.0` — works fine vì SDK forward-compatible. Khi anh cài `.NET 8 SDK` thật thì không cần đổi gì.
3. **AutoMapper 13.0.1 có CVE high severity** (`GHSA-rvv3-g6hj-g44x`). Đã upgrade lên 14.0.0.
4. **Frontend gọi API qua HTTPS dev**: nếu cert chưa trust, chạy `dotnet dev-certs https --trust` 1 lần.
5. **Netlify deploy**: chỉ deploy static file ở root (index/prototype/timeline). `backend/` và `frontend/` bị `netlify.toml` redirect 404 — không build trên Netlify. BE deploy Render free + PostgreSQL, FE deploy Vercel (Tuần 9).
6. **Demo vs Plan**: `prototype.html` là clickable mockup (không có data thật), `timeline.html` là tool tracking ae điền tên + tick task, `index.html` là plan đầy đủ. Khác **app thật** đang code trong `backend/` + `frontend/`.

---

## Khi user yêu cầu code

- Nếu task có trong **timeline** (xem `timeline.js` → `COMPACT` array): note lại task ID/text để user tick.
- Tuân thủ convention BE/FE ở trên (route prefix, namespace, Tailwind, TanStack Query, ...).
- BE: implement theo pattern Controller → Service → Repository → DbContext.
- FE: page → component → hook → axios call.
- Test build sau mỗi nhóm thay đổi lớn (`dotnet build` cho BE, `npm run build` cho FE).
- Commit message dùng prefix Vietnamese-friendly: `feat:` / `fix:` / `docs:` / ...

## Khi user hỏi về plan / timeline

- `index.html` = plan tổng thể, 12 sections, không sửa code thật chỉ doc.
- `timeline.html` = tracker với 199 task có drag-drop, lưu localStorage.
- `prototype.html` = mockup UI để show demo, không phải code thật.

## Mở rộng skill

Nếu cần skill chuyên dụng, tạo file `.claude/skills/<name>.md` với format:
```markdown
---
description: "ngữ cảnh khi nên invoke skill này"
---
[nội dung skill]
```
