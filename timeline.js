// =============================================================
// Workspace Hub — Timeline 10 tuần (flexible)
// Mỗi tuần có 6 slot (BE-1..BE-3 + FE-1..FE-3) — placeholder
// Task có thể KÉO THẢ giữa các slot trong tuần + giữa các tuần
// Mỗi task có TAG (BE/FE/DB/Doc/Auth/Sync/Telegram/Admin/Share...)
// Persistence: localStorage (mỗi máy 1 bản)
// =============================================================

const Timeline = (() => {

  const STORAGE_KEY = 'wsh.timeline.v2';
  const SLOT_IDS = ['BE-1', 'BE-2', 'BE-3', 'FE-1', 'FE-2', 'FE-3'];

  // -----------------------------------------------------------
  // TAG metadata — màu + nhãn
  // -----------------------------------------------------------
  const TAGS = {
    'BE':        { color: '#6366F1', label: 'BE' },
    'FE':        { color: '#EC4899', label: 'FE' },
    'DB':        { color: '#8B5CF6', label: 'DB' },
    'Doc':       { color: '#6B7280', label: 'Doc' },
    'Wireframe': { color: '#F472B6', label: 'Wireframe' },
    'Setup':     { color: '#3B82F6', label: 'Setup' },
    'Test':      { color: '#10B981', label: 'Test' },
    'Deploy':    { color: '#F59E0B', label: 'Deploy' },
    'Auth':      { color: '#DC2626', label: 'Auth' },
    'OAuth':     { color: '#EA580C', label: 'OAuth' },
    'Sync':      { color: '#14B8A6', label: 'Sync' },
    'Telegram':  { color: '#0EA5E9', label: 'Telegram' },
    'Schedule':  { color: '#06B6D4', label: 'Schedule' },
    'Admin':     { color: '#9F1239', label: 'Admin' },
    'Share':     { color: '#A855F7', label: 'Share' },
    'Review':    { color: '#65A30D', label: 'Review' },
    'Slide':     { color: '#84CC16', label: 'Slide' },
    'Demo':      { color: '#FACC15', label: 'Demo' },
    'API':       { color: '#0284C7', label: 'API' },
    'UX':        { color: '#DB2777', label: 'UX' },
  };

  // -----------------------------------------------------------
  // 10 tuần — meta info
  // -----------------------------------------------------------
  const WEEKS_META = [
    { week: 1,  theme: 'Đề tài + Phân tích yêu cầu',                        deliverable: 'Proposal PDF + Use Case + ERD draft + Sitemap (User + Admin)' },
    { week: 2,  theme: 'DB design + API spec + 3 OAuth POC',                deliverable: 'DB diagram + API doc + Wireframe + 3 OAuth POC + Authorization Matrix' },
    { week: 3,  theme: 'BE skeleton + Auth + RBAC + Integration foundation', deliverable: 'Auth + RBAC + Connect 3 provider + Toggle service + Admin stub 403' },
    { week: 4,  theme: 'BE Workspace + Folder Share + IAuthorizationHandler', deliverable: 'Workspace API + Share endpoints + Handler test pass (Viewer kéo → 403)' },
    { week: 5,  theme: 'BE Mail + Calendar (4 wrapper) — FE Foundation',     deliverable: 'Connect Google + Microsoft → email + event xuất hiện trong Inbox' },
    { week: 6,  theme: 'BE Drive + OneDrive + Jira (3 wrapper) — FE Compose', deliverable: 'Đủ 7 wrapper sync + FE Settings + Compose + Telegram wizard UI' },
    { week: 7,  theme: 'BE Schedule + Telegram + Notification + Admin API',  deliverable: 'Schedule mail · Telegram noti · Admin lock/unlock · Notification flow' },
    { week: 8,  theme: 'FE Admin Page + Share modal + Polish + bug fix',     deliverable: 'FE hoàn chỉnh + Admin page + Share modal + Shared-with-me + responsive' },
    { week: 9,  theme: 'Deploy + Finalize',                                   deliverable: 'Public URL + 3 demo account + Deploy guide + README' },
    { week: 10, theme: 'Presentation + Defense',                              deliverable: 'Defense thành công' },
  ];

  // -----------------------------------------------------------
  // TASKS — flat list. Mỗi row: [defaultWeek, defaultSlot, text, ...tags]
  // Có thể di chuyển task qua slot/tuần khác (lưu vào state.moved)
  // -----------------------------------------------------------
  const COMPACT = [

    // ============= TUẦN 1 =============
    [1, 'BE-1', 'Viết Problem Statement (1-2 trang) — vấn đề & giải pháp', 'Doc'],
    [1, 'BE-1', 'Phân tích 2 role Admin/User — define scope mỗi role làm được gì', 'Doc', 'Auth'],
    [1, 'BE-1', 'List functional + non-functional requirements (bao gồm auth)', 'Doc'],
    [1, 'BE-2', 'Vẽ ERD sơ bộ 15 bảng (chưa cần chi tiết field)', 'DB', 'Doc'],
    [1, 'BE-2', 'Use case: Folder Share + Drag/drop Item', 'Doc', 'Share'],
    [1, 'BE-2', 'Phân tích privacy model: Owner=body, Viewer=metadata', 'Doc', 'Auth'],
    [1, 'BE-3', 'Research scope OAuth 3 provider (Google/Microsoft/Atlassian)', 'Doc', 'OAuth'],
    [1, 'BE-3', 'Use case: Connect Provider × 3 + Schedule Send + Telegram', 'Doc'],
    [1, 'BE-3', 'Đánh giá Nango Cloud free tier có đủ scope không', 'Doc', 'OAuth'],
    [1, 'FE-1', 'Sitemap UI tổng quan (User flow)', 'Wireframe'],
    [1, 'FE-1', 'Wireframe Auth pages (login/register)', 'Wireframe', 'Auth'],
    [1, 'FE-1', 'Wireframe layout chính (sidebar + main + topbar)', 'Wireframe'],
    [1, 'FE-2', 'Wireframe Inbox view (list đa nguồn)', 'Wireframe'],
    [1, 'FE-2', 'Wireframe Folder Kanban (3 cột)', 'Wireframe'],
    [1, 'FE-2', 'Wireframe Workspace 3-pane (Integration → Folder)', 'Wireframe'],
    [1, 'FE-3', 'Sitemap Admin flow (riêng route /admin)', 'Wireframe', 'Admin'],
    [1, 'FE-3', 'Wireframe Admin Page (stats + user table + action)', 'Wireframe', 'Admin'],
    [1, 'FE-3', 'Wireframe Folder Share modal + Read-only state', 'Wireframe', 'Share'],

    // ============= TUẦN 2 =============
    [2, 'BE-1', 'Authorization Matrix: bảng endpoint × role × permission', 'Doc', 'Auth'],
    [2, 'BE-1', 'API spec Auth (login/register/refresh)', 'API', 'Auth', 'Doc'],
    [2, 'BE-1', 'API spec Admin endpoints (list/lock/stats/webhook-logs)', 'API', 'Admin', 'Doc'],
    [2, 'BE-2', 'ERD chi tiết 15 bảng (field, type, FK, UNIQUE, index)', 'DB', 'Doc'],
    [2, 'BE-2', 'API spec Workspace (Item/Folder/Tag CRUD + drag/drop)', 'API', 'Doc'],
    [2, 'BE-2', 'API spec Folder Share (invite/accept/revoke/shared-with-me)', 'API', 'Share', 'Doc'],
    [2, 'BE-3', 'Đăng ký Google Cloud OAuth app + chọn scope', 'OAuth', 'Setup'],
    [2, 'BE-3', 'Đăng ký Azure AD App Registration + permission MS Graph', 'OAuth', 'Setup'],
    [2, 'BE-3', 'Đăng ký Atlassian Developer Console OAuth 2.0 (3LO)', 'OAuth', 'Setup'],
    [2, 'BE-3', 'Setup Nango Cloud free + POC connect 1 message Gmail', 'OAuth', 'Setup', 'Test'],
    [2, 'FE-1', 'Wireframe Settings (Integrations toggle UI)', 'Wireframe'],
    [2, 'FE-1', 'Wireframe Telegram bot setup wizard 5 bước', 'Wireframe', 'Telegram'],
    [2, 'FE-1', 'Chọn design system: shadcn/ui hoặc Tailwind only', 'Doc', 'Setup'],
    [2, 'FE-2', 'Wireframe Compose modal + Account selector + Schedule picker', 'Wireframe', 'Schedule'],
    [2, 'FE-2', 'Wireframe Item Detail panel (drawer)', 'Wireframe'],
    [2, 'FE-2', 'Design dnd-kit interactions cho Kanban', 'Wireframe', 'UX'],
    [2, 'FE-3', 'Wireframe Admin Page chi tiết (4 stat + table user)', 'Wireframe', 'Admin'],
    [2, 'FE-3', 'Wireframe Share modal: invite + list + revoke + privacy', 'Wireframe', 'Share'],
    [2, 'FE-3', 'Wireframe Notification center + Dashboard', 'Wireframe'],

    // ============= TUẦN 3 =============
    [3, 'BE-1', 'Setup solution: Controller / Service / Repository / DTO / Entity', 'BE', 'Setup'],
    [3, 'BE-1', 'Migration đầu: User + Role + UserRole + seed Admin từ env vars', 'BE', 'DB', 'Auth'],
    [3, 'BE-1', 'JWT login/register + BCrypt; payload có claim "role"', 'BE', 'Auth'],
    [3, 'BE-1', 'AddAuthorization + policy "AdminOnly"; AdminController stub trả 403', 'BE', 'Auth', 'Admin'],
    [3, 'BE-1', 'Auto gán role "User" khi register; refresh token endpoint', 'BE', 'Auth'],
    [3, 'BE-2', 'Migration: IntegrationAccount + ServiceConnection + TelegramBinding', 'BE', 'DB'],
    [3, 'BE-2', 'FluentValidation setup + base validator chung', 'BE', 'Setup'],
    [3, 'BE-2', 'Exception middleware + global error handler (RFC 7807)', 'BE', 'Setup'],
    [3, 'BE-2', 'Swagger config + Bearer auth schema', 'BE', 'Setup', 'API'],
    [3, 'BE-3', 'Nango BE side: lưu connection_id, callback handler', 'BE', 'OAuth'],
    [3, 'BE-3', 'OAuth flow: FE → Nango popup → BE nhận connection_id', 'BE', 'OAuth'],
    [3, 'BE-3', 'API CRUD IntegrationAccount (list/get/delete)', 'BE', 'API'],
    [3, 'BE-3', 'API toggle ServiceConnection (enable/disable per service)', 'BE', 'API'],
    [3, 'FE-1', 'Setup Vite + React + TS + Router + TanStack Query', 'FE', 'Setup'],
    [3, 'FE-1', 'Setup Tailwind + shadcn/ui hoặc Tailwind only', 'FE', 'Setup'],
    [3, 'FE-1', 'Auth pages (login + register) với react-hook-form + zod', 'FE', 'Auth'],
    [3, 'FE-1', 'Token storage; ProtectedRoute HOC; redirect khi 401', 'FE', 'Auth'],
    [3, 'FE-2', 'Layout chính: sidebar + main + topbar (App Shell)', 'FE'],
    [3, 'FE-2', 'Brand + navigation skeleton + side-section heading', 'FE'],
    [3, 'FE-2', 'Avatar + user info dropdown ở sidebar', 'FE'],
    [3, 'FE-3', 'Toast helper (react-hot-toast hoặc tự build)', 'FE', 'Setup'],
    [3, 'FE-3', 'Loading state component + skeleton screens', 'FE', 'UX'],
    [3, 'FE-3', 'Error boundary + 404/500 page', 'FE'],
    [3, 'FE-3', 'Notification dropdown skeleton (chưa wire API)', 'FE'],

    // ============= TUẦN 4 =============
    [4, 'BE-1', 'API CRUD ImportantContact', 'BE', 'API'],
    [4, 'BE-1', 'Review auth code của BE-2 (FolderAuthorizationHandler logic)', 'Review', 'Auth'],
    [4, 'BE-1', 'Unit test policy "AdminOnly" với xUnit (basic)', 'Test', 'Auth'],
    [4, 'BE-2', 'Migration 6 bảng workspace: Item/Folder/ItemFolder/Tag/TagAssignment + FolderShare', 'BE', 'DB', 'Share'],
    [4, 'BE-2', 'CRUD Item/Folder/Tag — full validation + pagination + search', 'BE', 'API'],
    [4, 'BE-2', 'API drag/drop: PATCH /items/:id/folders, :id/position, :id/status', 'BE', 'API'],
    [4, 'BE-2', 'FolderPermissionRequirement + FolderAuthorizationHandler', 'BE', 'Auth', 'Share'],
    [4, 'BE-2', 'API share: POST/DELETE /folders/:id/shares + accept', 'BE', 'API', 'Share'],
    [4, 'BE-2', 'API GET /folders/shared-with-me', 'BE', 'API', 'Share'],
    [4, 'BE-3', 'Interface ISyncProvider (định nghĩa contract chung)', 'BE', 'Sync'],
    [4, 'BE-3', 'Sync orchestrator stub (chưa có wrapper concrete)', 'BE', 'Sync'],
    [4, 'BE-3', 'Dedupe helper: UNIQUE(source, source_id, user_id)', 'BE', 'Sync', 'DB'],
    [4, 'FE-1', 'Inbox view list Item từ API + filter theo source', 'FE'],
    [4, 'FE-1', 'Item card component cho 5 type (email/event/file/ticket/note)', 'FE'],
    [4, 'FE-1', 'Nango Frontend SDK setup + connect 3 provider qua popup', 'FE', 'OAuth'],
    [4, 'FE-2', 'Workspace 3-pane view UI (chưa drag)', 'FE'],
    [4, 'FE-2', 'Sidebar Folder list + active state + folder color', 'FE'],
    [4, 'FE-2', 'Folder color + icon picker khi tạo Folder mới', 'FE'],
    [4, 'FE-3', 'Item detail panel (drawer) — metadata + body live', 'FE'],
    [4, 'FE-3', 'Tag selector multi-select + tag CRUD UI', 'FE'],
    [4, 'FE-3', 'Important Contact CRUD UI skeleton', 'FE'],

    // ============= TUẦN 5 =============
    [5, 'BE-1', 'Important Contact match logic (case-insensitive, partial domain) khi sync', 'BE', 'Sync'],
    [5, 'BE-1', 'Auto tạo Notification khi match Important Contact', 'BE'],
    [5, 'BE-1', 'JWT TTL tuning (1h access + 7d refresh)', 'BE', 'Auth'],
    [5, 'BE-2', 'Sync orchestrator: gọi wrapper → upsert Item', 'BE', 'Sync'],
    [5, 'BE-2', 'Dedupe enforce UNIQUE constraint khi upsert', 'BE', 'Sync', 'DB'],
    [5, 'BE-2', 'Review wrapper output từ BE-3 (Item field đúng schema)', 'Review', 'Sync'],
    [5, 'BE-3', 'Wrapper Gmail (list, get, send) — template đầu tiên', 'BE', 'Sync'],
    [5, 'BE-3', 'Wrapper Google Calendar (list events, create event)', 'BE', 'Sync'],
    [5, 'BE-3', 'Wrapper Outlook Mail qua MS Graph (/me/messages)', 'BE', 'Sync'],
    [5, 'BE-3', 'Wrapper Outlook Calendar qua MS Graph (/me/events)', 'BE', 'Sync'],
    [5, 'FE-1', 'Auth flow E2E test (login → protected route → logout)', 'FE', 'Test', 'Auth'],
    [5, 'FE-1', 'Inbox view hoàn thiện + pagination + infinite scroll', 'FE'],
    [5, 'FE-1', 'Settings Integrations card skeleton (3 provider)', 'FE'],
    [5, 'FE-2', 'Folder Kanban view + @dnd-kit drag/drop', 'FE'],
    [5, 'FE-2', 'Drag Item giữa cột + call API update status', 'FE'],
    [5, 'FE-2', 'Reorder bằng position field', 'FE'],
    [5, 'FE-3', 'Filter bar (source + tag + status + is_important)', 'FE'],
    [5, 'FE-3', 'Search input toàn cục (debounce 300ms)', 'FE'],
    [5, 'FE-3', 'Important Contact CRUD UI hoàn thiện', 'FE'],

    // ============= TUẦN 6 =============
    [6, 'BE-1', 'Code review wrapper của BE-3 (Drive/OneDrive/Jira)', 'Review', 'Sync'],
    [6, 'BE-1', 'Refactor sync orchestrator nếu thấy pattern lặp', 'BE', 'Sync'],
    [6, 'BE-1', 'xUnit test cho ImportantContact match logic', 'Test'],
    [6, 'BE-2', 'Item.mime_type + web_url + preview_url cho type=file', 'BE', 'DB'],
    [6, 'BE-2', 'Item.status mapping cho Jira (To Do / In Progress / Done)', 'BE', 'Sync'],
    [6, 'BE-2', 'Integration test FolderShare E2E (Viewer kéo Kanban → 403)', 'Test', 'Share', 'Auth'],
    [6, 'BE-3', 'Wrapper Google Drive (list file + filter mime Doc/Sheet)', 'BE', 'Sync'],
    [6, 'BE-3', 'Wrapper OneDrive qua MS Graph + SharePoint docs', 'BE', 'Sync'],
    [6, 'BE-3', 'Wrapper Jira (list assigned + project tickets, status mapping)', 'BE', 'Sync'],
    [6, 'FE-1', 'Settings Integrations card cho 3 provider — toggle 7 service', 'FE'],
    [6, 'FE-1', 'Status indicator (last_synced_at, last_error)', 'FE', 'UX'],
    [6, 'FE-1', 'Re-authorize + Disconnect button per provider', 'FE', 'OAuth'],
    [6, 'FE-2', 'Compose modal: Account selector (Gmail/Outlook)', 'FE', 'Schedule'],
    [6, 'FE-2', 'Compose: Schedule picker (date/time)', 'FE', 'Schedule'],
    [6, 'FE-2', 'Item detail enhance: open original link, file preview', 'FE'],
    [6, 'FE-3', 'Dashboard skeleton: 4 stat cards', 'FE'],
    [6, 'FE-3', 'Telegram setup wizard 5 bước UI (chưa wire BE)', 'FE', 'Telegram'],
    [6, 'FE-3', 'Notification center dropdown UI', 'FE'],

    // ============= TUẦN 7 =============
    [7, 'BE-1', 'Telegram OUT: sendMessage helper, gọi khi Important Contact match', 'BE', 'Telegram'],
    [7, 'BE-1', 'Telegram IN: webhook handler, parse /task + /start <link_token>', 'BE', 'Telegram'],
    [7, 'BE-1', 'Notification CRUD + auto-create khi share invite', 'BE', 'API'],
    [7, 'BE-1', 'Admin endpoints: GET /admin/users + /users/:id + /stats + /webhook-logs', 'BE', 'Admin', 'API'],
    [7, 'BE-1', 'Admin: POST lock/unlock/force-disconnect; middleware is_locked (423)', 'BE', 'Admin', 'Auth'],
    [7, 'BE-2', 'Tạo Notification type=share_invite khi POST /folders/:id/shares', 'BE', 'Share'],
    [7, 'BE-2', 'Refine share accept flow + cascade revoke', 'BE', 'Share'],
    [7, 'BE-2', 'Integration test grep: endpoint folder/item → check có [Authorize]', 'Test', 'Auth'],
    [7, 'BE-3', 'ScheduledEmail CRUD (sent_via: gmail/outlook)', 'BE', 'Schedule', 'API'],
    [7, 'BE-3', 'Endpoint POST /api/internal/process-scheduled (idempotent)', 'BE', 'Schedule'],
    [7, 'BE-3', 'Multi-provider send logic (Gmail API vs MS Graph theo sent_via)', 'BE', 'Schedule', 'Sync'],
    [7, 'BE-3', 'Cấu hình cron-job.org gọi mỗi 5 phút (dev env)', 'Setup', 'Schedule'],
    [7, 'FE-1', 'Settings Telegram wizard 5 bước hoàn thiện (wire BE)', 'FE', 'Telegram'],
    [7, 'FE-1', 'Important Contact CRUD UI hoàn thiện', 'FE'],
    [7, 'FE-1', 'Settings polish: toast + loading + error state', 'FE', 'UX'],
    [7, 'FE-2', 'Compose modal + Schedule picker hoàn thiện + send qua API', 'FE', 'Schedule'],
    [7, 'FE-2', 'Tag UI polish (multi-select + color picker)', 'FE'],
    [7, 'FE-2', 'Folder Kanban polish (animation drop, optimistic update, rollback)', 'FE', 'UX'],
    [7, 'FE-3', 'Notification center: list + unread badge + mark as read', 'FE'],
    [7, 'FE-3', 'Dashboard charts (activity 7 ngày + source stats)', 'FE'],
    [7, 'FE-3', 'Recent activity feed', 'FE'],

    // ============= TUẦN 8 =============
    [8, 'BE-1', 'Bug fix Auth + Admin flow (test 3 demo account)', 'BE', 'Auth', 'Admin'],
    [8, 'BE-1', 'Integration test E2E: User vào /admin → 403; User locked → 423', 'Test', 'Auth'],
    [8, 'BE-1', 'Hỗ trợ FE-3 với Admin API contract (sample response)', 'Review', 'Admin'],
    [8, 'BE-2', 'Bug fix Folder Share (race condition khi 2 share song song)', 'BE', 'Share'],
    [8, 'BE-2', 'Integration test: Viewer kéo Kanban → 403; xoá folder → cascade gỡ share', 'Test', 'Share'],
    [8, 'BE-2', 'Performance: add index cho shared_with_user_id + composite UNIQUE', 'DB', 'Share'],
    [8, 'BE-3', 'Bug fix Sync + Schedule (test 7 wrapper)', 'BE', 'Sync', 'Schedule'],
    [8, 'BE-3', 'Exponential backoff cho MS Graph 429 throttling', 'BE', 'Sync'],
    [8, 'BE-3', 'Serilog log rõ ràng (filter level Info/Warning/Error)', 'BE', 'Setup'],
    [8, 'FE-1', 'Settings + Telegram wizard UX polish (smooth transition)', 'FE', 'UX', 'Telegram'],
    [8, 'FE-1', 'Loading state + skeleton screen toàn app', 'FE', 'UX'],
    [8, 'FE-1', 'Error toast khi sync fail + retry button', 'FE', 'UX'],
    [8, 'FE-2', 'Folder Share modal: invite input + list người + revoke action', 'FE', 'Share'],
    [8, 'FE-2', 'Read-only banner + disable drag khi Viewer', 'FE', 'Share', 'UX'],
    [8, 'FE-2', 'Privacy notice UI ("Viewer thấy/không thấy" rõ ràng)', 'FE', 'Share', 'UX'],
    [8, 'FE-3', 'Admin Page UI hoàn thiện (stats + table + lock/unlock + View detail)', 'FE', 'Admin'],
    [8, 'FE-3', 'Protected route check role; sidebar render mục Admin theo role', 'FE', 'Admin', 'Auth'],
    [8, 'FE-3', 'Sidebar "Shared with me" section + RO badge', 'FE', 'Share'],
    [8, 'FE-3', 'Responsive Tailwind cho tablet + mobile', 'FE', 'UX'],

    // ============= TUẦN 9 =============
    [9, 'BE-1', 'Deploy BE Render free + PostgreSQL', 'Deploy'],
    [9, 'BE-1', 'Migration trên prod + seed 3 demo account', 'Deploy', 'DB', 'Auth'],
    [9, 'BE-1', 'README + Setup guide + .env.example', 'Doc', 'Deploy'],
    [9, 'BE-1', 'Test auth flow + admin flow trên prod', 'Test', 'Deploy'],
    [9, 'BE-2', 'Test folder share E2E trên prod (3 account)', 'Test', 'Share'],
    [9, 'BE-2', 'Bug fix khi deploy (CORS, env var, connection string)', 'Deploy'],
    [9, 'BE-2', 'API doc Swagger public + export OpenAPI spec', 'Doc', 'API'],
    [9, 'BE-3', 'Cấu hình cron-job.org cho prod URL', 'Deploy', 'Schedule'],
    [9, 'BE-3', 'Cấu hình Telegram setWebhook trên prod (HTTPS + secret_token)', 'Deploy', 'Telegram'],
    [9, 'BE-3', 'Test Schedule mail E2E trên prod (tới hộp giám khảo)', 'Test', 'Schedule'],
    [9, 'BE-3', 'Test 7 wrapper sync với account thật', 'Test', 'Sync'],
    [9, 'FE-1', 'Deploy FE Vercel + env config (API_URL, NANGO_PUBLIC_KEY)', 'Deploy'],
    [9, 'FE-1', 'Custom domain (optional) + HTTPS check', 'Deploy'],
    [9, 'FE-1', 'Bug fix Auth UX trên prod (token expire, refresh)', 'FE', 'Auth', 'Deploy'],
    [9, 'FE-2', 'Bug fix UI cross-browser (Safari, Chrome, Firefox)', 'FE', 'Test'],
    [9, 'FE-2', 'Final responsive check (mobile drag-drop alternative)', 'FE', 'UX'],
    [9, 'FE-2', 'Test Compose + Schedule trên prod', 'Test', 'Schedule'],
    [9, 'FE-3', 'Test Admin Page trên prod', 'Test', 'Admin'],
    [9, 'FE-3', 'Test Folder Share + Shared-with-me trên prod (3 account)', 'Test', 'Share'],
    [9, 'FE-3', 'Final QA pass: chạy đủ demo flow 13 bước', 'Test', 'Demo'],
    [9, 'FE-3', 'Backup demo recording (Loom hoặc OBS) — phòng demo live fail', 'Demo'],

    // ============= TUẦN 10 =============
    [10, 'BE-1', 'Slide Authentication model: JWT + RBAC + Policy', 'Slide', 'Auth'],
    [10, 'BE-1', 'Slide Admin scope (privacy: không xem body email)', 'Slide', 'Admin'],
    [10, 'BE-1', 'Q&A prep: JWT vs Session, Policy vs hard-code if-else', 'Slide', 'Auth'],
    [10, 'BE-2', 'Slide Folder Share + IAuthorizationHandler architecture', 'Slide', 'Share'],
    [10, 'BE-2', 'Q&A prep: vì sao Viewer-only không có Editor, race condition', 'Slide', 'Share'],
    [10, 'BE-2', 'Slide Privacy split (Owner body vs Viewer metadata)', 'Slide', 'Share'],
    [10, 'BE-3', 'Slide 7 wrapper + ISyncProvider polymorphic', 'Slide', 'Sync'],
    [10, 'BE-3', 'Slide Schedule Send via external cron-job.org', 'Slide', 'Schedule'],
    [10, 'BE-3', 'Q&A prep: vì sao Nango, Schedule Send retry logic', 'Slide', 'OAuth'],
    [10, 'FE-1', 'Slide UX flow (Inbox → Folder → Compose → Telegram)', 'Slide', 'UX'],
    [10, 'FE-1', 'Demo recording user flow (5 phút)', 'Demo'],
    [10, 'FE-1', 'Q&A prep: TanStack Query cache, Vite vs CRA', 'Slide'],
    [10, 'FE-2', 'Slide Workspace UI + Kanban dnd-kit', 'Slide'],
    [10, 'FE-2', 'Demo Folder Kanban drag + Compose Schedule', 'Demo'],
    [10, 'FE-2', 'Q&A prep: dnd-kit accessibility, Schedule UX', 'Slide', 'UX'],
    [10, 'FE-3', 'Slide Admin Page + Folder Share modal', 'Slide', 'Admin', 'Share'],
    [10, 'FE-3', 'Demo Admin flow + Share flow (3 account)', 'Demo', 'Admin'],
    [10, 'FE-3', 'Q&A prep: Read-only state UX, render UI theo role', 'Slide', 'UX'],
    [10, 'FE-3', 'Run-through full demo flow 13 bước × 3 lần với cả nhóm', 'Demo'],
  ];

  // Convert compact → TASKS[]
  const TASKS = COMPACT.map((row, i) => ({
    id: 't' + (i + 1),
    defaultWeek: row[0],
    defaultSlot: row[1],
    text: row[2],
    tags: row.slice(3),
  }));

  // -----------------------------------------------------------
  // State management (localStorage)
  // -----------------------------------------------------------
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { slotNames: {}, moved: {}, checks: {} };
      const p = JSON.parse(raw);
      return {
        slotNames: p.slotNames || {},
        moved: p.moved || {},
        checks: p.checks || {},
      };
    } catch (e) {
      return { slotNames: {}, moved: {}, checks: {} };
    }
  }
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Save state error:', e);
    }
  }
  let state = loadState();

  // -----------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function slotKey(week, slot) { return `w${week}/${slot}`; }
  function getTaskLocation(task) {
    const moved = state.moved[task.id];
    if (moved) return { week: moved.week, slot: moved.slot };
    return { week: task.defaultWeek, slot: task.defaultSlot };
  }
  function getTasksAt(week, slot) {
    return TASKS.filter((t) => {
      const loc = getTaskLocation(t);
      return loc.week === week && loc.slot === slot;
    });
  }
  function totalTasks() { return TASKS.length; }
  function checkedTasks() { return TASKS.filter((t) => !!state.checks[t.id]).length; }
  function weekProgress(week) {
    const inWeek = TASKS.filter((t) => getTaskLocation(t).week === week);
    const done = inWeek.filter((t) => !!state.checks[t.id]).length;
    return { done, total: inWeek.length, pct: inWeek.length ? Math.round(done / inWeek.length * 100) : 0 };
  }

  // -----------------------------------------------------------
  // Render: tag legend
  // -----------------------------------------------------------
  function renderTagLegend() {
    const wrap = document.getElementById('tag-legend');
    if (!wrap) return;
    wrap.innerHTML = Object.keys(TAGS).map((tag) => {
      const t = TAGS[tag];
      return `<span class="tag-chip" style="background:${t.color}">${escapeHtml(t.label)}</span>`;
    }).join('');
  }

  // -----------------------------------------------------------
  // Render: weeks
  // -----------------------------------------------------------
  function renderWeeks() {
    const wrap = document.getElementById('weeks');
    if (!wrap) return;
    // Preserve open state
    const openWeeks = Array.from(document.querySelectorAll('.week-card.open'))
      .map((c) => parseInt(c.dataset.week, 10));
    wrap.innerHTML = '';
    WEEKS_META.forEach((w) => {
      const prog = weekProgress(w.week);
      const isOpen = openWeeks.includes(w.week);
      const card = document.createElement('div');
      card.className = 'week-card' + (isOpen ? ' open' : '');
      card.dataset.week = String(w.week);

      // 6 slots
      const slotsHtml = SLOT_IDS.map((slotId) => renderSlot(w.week, slotId)).join('');

      card.innerHTML = `
        <div class="week-head" data-week-toggle="${w.week}">
          <div class="week-num-box">
            <span class="week-num">${w.week}</span>
            <span class="week-num-lbl">Tuần</span>
          </div>
          <div class="week-info">
            <div class="week-theme">${escapeHtml(w.theme)}</div>
            <div class="week-deliv"><strong>Cuối tuần:</strong> ${escapeHtml(w.deliverable)}</div>
          </div>
          <div class="week-prog">
            <span class="week-prog-pct">${prog.pct}%</span>
            <div class="week-mini-bar"><div style="width:${prog.pct}%"></div></div>
            <span class="week-prog-count">${prog.done} / ${prog.total}</span>
          </div>
          <svg class="week-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="week-body">
          <div class="week-toolbar">
            <button class="week-bulk-btn" data-week-bulk="${w.week}">
              ${(prog.done === prog.total && prog.total > 0) ? '↺ Bỏ tick toàn bộ tuần' : '✓ Tick hoàn thành cả tuần'}
            </button>
            <span class="week-hint">Kéo thẻ task để đổi qua slot khác hoặc tuần khác</span>
          </div>
          <div class="slot-grid">${slotsHtml}</div>
        </div>
      `;
      wrap.appendChild(card);
    });
    bindWeekToggles();
    bindBulkButtons();
    bindCheckboxes();
    bindNameInputs();
    bindDragDrop();
  }

  function renderSlot(week, slotId) {
    const tasks = getTasksAt(week, slotId);
    const sk = slotKey(week, slotId);
    const name = state.slotNames[sk] || '';
    const slotSlug = slotId.toLowerCase().replace('-', '');
    const doneCount = tasks.filter((t) => state.checks[t.id]).length;
    const taskHtml = tasks.map((t) => renderTaskCard(t)).join('');
    return `
      <div class="slot slot-${slotSlug}" data-slot-drop data-week="${week}" data-slot="${slotId}">
        <div class="slot-head">
          <span class="slot-label slot-${slotSlug}">${slotId}</span>
          <input
            type="text"
            class="slot-name-input"
            placeholder="Tên người làm..."
            data-slot-key="${sk}"
            value="${escapeHtml(name)}"
          />
          <span class="slot-count" title="Đã xong / Tổng">${doneCount}/${tasks.length}</span>
        </div>
        <div class="slot-tasks">${taskHtml || '<div class="slot-empty">Kéo task vào đây</div>'}</div>
      </div>
    `;
  }

  function renderTaskCard(t) {
    const checked = !!state.checks[t.id];
    const tagsHtml = t.tags.map((tagName) => {
      const tag = TAGS[tagName] || { color: '#9CA3AF', label: tagName };
      return `<span class="tag-chip mini" style="background:${tag.color}">${escapeHtml(tag.label)}</span>`;
    }).join('');
    return `
      <div class="task-card${checked ? ' checked' : ''}" draggable="true" data-task-id="${t.id}">
        <div class="task-grip" title="Kéo để di chuyển">⋮⋮</div>
        <label class="task-main">
          <input type="checkbox" data-task-id="${t.id}" ${checked ? 'checked' : ''} />
          <span class="task-text">${escapeHtml(t.text)}</span>
        </label>
        <div class="task-tags">${tagsHtml}</div>
      </div>
    `;
  }

  // -----------------------------------------------------------
  // Binds
  // -----------------------------------------------------------
  function bindWeekToggles() {
    document.querySelectorAll('[data-week-toggle]').forEach((h) => {
      h.addEventListener('click', (e) => {
        // Avoid toggling when clicking inside controls
        if (e.target.closest('input, button, .task-card, .slot')) return;
        const card = h.closest('.week-card');
        card.classList.toggle('open');
      });
    });
  }
  function bindBulkButtons() {
    document.querySelectorAll('[data-week-bulk]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const weekNum = parseInt(btn.dataset.weekBulk, 10);
        toggleWeek(weekNum);
      });
    });
  }
  function bindCheckboxes() {
    document.querySelectorAll('.slot-tasks input[type="checkbox"][data-task-id]').forEach((cb) => {
      cb.addEventListener('change', () => {
        const id = cb.dataset.taskId;
        state.checks[id] = cb.checked;
        saveState();
        const card = cb.closest('.task-card');
        if (card) card.classList.toggle('checked', cb.checked);
        updateProgress();
        updateSlotCounts();
      });
    });
  }
  function bindNameInputs() {
    document.querySelectorAll('.slot-name-input').forEach((inp) => {
      inp.addEventListener('input', () => {
        state.slotNames[inp.dataset.slotKey] = inp.value.trim();
        saveState();
      });
    });
  }

  // -----------------------------------------------------------
  // Drag-and-drop: task → slot
  // -----------------------------------------------------------
  let dragTaskId = null;
  function bindDragDrop() {
    document.querySelectorAll('.task-card[draggable]').forEach((card) => {
      card.addEventListener('dragstart', (e) => {
        dragTaskId = card.dataset.taskId;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', dragTaskId);
      });
      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        dragTaskId = null;
        document.querySelectorAll('.slot.drop-over').forEach((s) => s.classList.remove('drop-over'));
      });
    });
    document.querySelectorAll('.slot[data-slot-drop]').forEach((slot) => {
      slot.addEventListener('dragover', (e) => {
        if (!dragTaskId) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        slot.classList.add('drop-over');
      });
      slot.addEventListener('dragleave', (e) => {
        if (!slot.contains(e.relatedTarget)) slot.classList.remove('drop-over');
      });
      slot.addEventListener('drop', (e) => {
        e.preventDefault();
        slot.classList.remove('drop-over');
        const id = dragTaskId || e.dataTransfer.getData('text/plain');
        if (!id) return;
        const targetWeek = parseInt(slot.dataset.week, 10);
        const targetSlot = slot.dataset.slot;
        moveTask(id, targetWeek, targetSlot);
      });
    });
  }
  function moveTask(taskId, toWeek, toSlot) {
    const t = TASKS.find((x) => x.id === taskId);
    if (!t) return;
    // If returning to default, clear from moved
    if (t.defaultWeek === toWeek && t.defaultSlot === toSlot) {
      delete state.moved[taskId];
    } else {
      state.moved[taskId] = { week: toWeek, slot: toSlot };
    }
    saveState();
    renderWeeks();
    updateProgress();
  }

  // -----------------------------------------------------------
  // Bulk toggle week
  // -----------------------------------------------------------
  function toggleWeek(weekNum) {
    const inWeek = TASKS.filter((t) => getTaskLocation(t).week === weekNum);
    const allChecked = inWeek.length > 0 && inWeek.every((t) => state.checks[t.id]);
    const target = !allChecked;
    inWeek.forEach((t) => {
      state.checks[t.id] = target;
    });
    saveState();
    renderWeeks();
    updateProgress();
  }

  // -----------------------------------------------------------
  // Progress
  // -----------------------------------------------------------
  function updateProgress() {
    const total = totalTasks();
    const done = checkedTasks();
    const pct = total ? Math.round(done / total * 100) : 0;
    const pctEl = document.getElementById('overall-pct');
    const fillEl = document.getElementById('overall-fill');
    const countEl = document.getElementById('overall-count');
    if (pctEl) pctEl.textContent = pct + '%';
    if (fillEl) fillEl.style.width = pct + '%';
    if (countEl) countEl.textContent = done + ' / ' + total + ' tasks';

    WEEKS_META.forEach((w) => {
      const prog = weekProgress(w.week);
      const card = document.querySelector(`.week-card[data-week="${w.week}"]`);
      if (!card) return;
      const pctEl = card.querySelector('.week-prog-pct');
      const barFill = card.querySelector('.week-mini-bar > div');
      const cntEl = card.querySelector('.week-prog-count');
      if (pctEl) pctEl.textContent = prog.pct + '%';
      if (barFill) barFill.style.width = prog.pct + '%';
      if (cntEl) cntEl.textContent = prog.done + ' / ' + prog.total;
    });
  }
  function updateSlotCounts() {
    document.querySelectorAll('.slot[data-slot-drop]').forEach((slot) => {
      const week = parseInt(slot.dataset.week, 10);
      const slotId = slot.dataset.slot;
      const tasks = getTasksAt(week, slotId);
      const done = tasks.filter((t) => state.checks[t.id]).length;
      const cnt = slot.querySelector('.slot-count');
      if (cnt) cnt.textContent = done + '/' + tasks.length;
    });
  }

  // -----------------------------------------------------------
  // Backup file / Export-Import / Reset
  // -----------------------------------------------------------
  function downloadBackup() {
    const payload = {
      v: 2,
      exportedAt: new Date().toISOString(),
      slotNames: state.slotNames,
      moved: state.moved,
      checks: state.checks,
    };
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workspace-hub-progress-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  function uploadBackup() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.style.display = 'none';
    input.onchange = () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const p = JSON.parse(String(reader.result || ''));
          if (typeof p !== 'object' || !p) throw new Error('Bad format');
          // Backward-compat: v1 had `names` (per role) — ignore, start fresh slotNames
          state.slotNames = p.slotNames || {};
          state.moved = p.moved || {};
          state.checks = p.checks || {};
          saveState();
          renderWeeks();
          updateProgress();
          alert(`✅ Đã khôi phục từ ${file.name}`);
        } catch (err) {
          alert('❌ File JSON lỗi: ' + err.message);
        }
        document.body.removeChild(input);
      };
      reader.readAsText(file);
    };
    document.body.appendChild(input);
    input.click();
  }
  function exportJSON() {
    const payload = {
      v: 2,
      exportedAt: new Date().toISOString(),
      slotNames: state.slotNames,
      moved: state.moved,
      checks: state.checks,
    };
    const json = JSON.stringify(payload, null, 2);
    navigator.clipboard.writeText(json).then(
      () => alert('✅ Đã copy JSON vào clipboard. Paste vào chat team để chia sẻ.'),
      () => alert('Copy thất bại — dùng nút Tải backup .json thay vì copy.')
    );
  }
  function importJSON() {
    const input = prompt('Paste JSON tiến độ team vào đây:');
    if (!input) return;
    try {
      const p = JSON.parse(input);
      if (typeof p !== 'object' || !p) throw new Error('Bad format');
      state.slotNames = p.slotNames || {};
      state.moved = p.moved || {};
      state.checks = p.checks || {};
      saveState();
      renderWeeks();
      updateProgress();
      alert('✅ Đã import tiến độ.');
    } catch (e) {
      alert('❌ JSON không hợp lệ: ' + e.message);
    }
  }
  function reset() {
    if (!confirm('Xoá hết tên đã điền + tiến độ + vị trí task đã kéo? Không undo được.')) return;
    state = { slotNames: {}, moved: {}, checks: {} };
    saveState();
    renderWeeks();
    updateProgress();
  }
  function resetMoved() {
    if (!confirm('Trả tất cả task về vị trí mặc định ban đầu? (giữ nguyên tên + checkbox)')) return;
    state.moved = {};
    saveState();
    renderWeeks();
    updateProgress();
  }
  function expandAll() {
    document.querySelectorAll('.week-card').forEach((c) => c.classList.add('open'));
  }
  function collapseAll() {
    document.querySelectorAll('.week-card').forEach((c) => c.classList.remove('open'));
  }

  // -----------------------------------------------------------
  // Init
  // -----------------------------------------------------------
  function init() {
    renderTagLegend();
    renderWeeks();
    updateProgress();

    const bind = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', fn);
    };
    bind('btn-download', downloadBackup);
    bind('btn-upload', uploadBackup);
    bind('btn-export', exportJSON);
    bind('btn-import', importJSON);
    bind('btn-reset', reset);
    bind('btn-reset-moved', resetMoved);
    bind('btn-expand', expandAll);
    bind('btn-collapse', collapseAll);

    // Open first 2 weeks by default
    const cards = document.querySelectorAll('.week-card');
    if (cards[0]) cards[0].classList.add('open');
    if (cards[1]) cards[1].classList.add('open');
  }

  return { init, downloadBackup, uploadBackup, exportJSON, importJSON, reset, resetMoved };
})();

document.addEventListener('DOMContentLoaded', Timeline.init);
