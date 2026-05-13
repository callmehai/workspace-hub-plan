// =============================================================
// Workspace Hub — Clickable Prototype
// Routing + State + Interactions (vanilla JS, no framework)
// =============================================================

const App = (() => {
  const state = {
    page: 'landing',
    subpage: 'inbox',
    folder: 'proj-a',
    source: null,
    wizardStep: 1,
    folderCounts: { 'proj-a': 9, 'khach-b': 6, 'ca-nhan': 6, 'do-an': 8 },
    role: 'user',     // 'user' | 'admin'
  };

  // Folder shared (read-only) — Owner = người khác, mình chỉ Viewer
  const sharedFolderIds = new Set(['proj-shared', 'khach-y-shared']);

  // -----------------------------------------------------------
  // Folder data — content riêng cho mỗi folder
  // -----------------------------------------------------------
  const folderData = {
    'proj-a': {
      name: 'Dự án A',
      colorClass: 'fc-c1',
      cards: {
        todo: [
          { source: 'Outlook · Important', title: '[KH] Yêu cầu thay đổi spec module thanh toán', tag: 'urgent', meta: '2h trước', icon: 'i-mail', cls: 'email' },
          { source: 'Jira · PROJ-128', title: 'Fix bug tính phí giao hàng >1000km', tag: 'High', tagCls: 'amber', meta: 'Sprint 17', icon: 'i-ticket', cls: 'ticket' },
          { source: 'Calendar', title: 'Daily standup — Dự án A', meta: 'Hằng ngày 9h', icon: 'i-cal', cls: 'event' },
          { source: 'OneDrive · Doc', title: 'Spec module thanh toán v2.docx', meta: '12 KB', icon: 'i-doc', cls: 'file' },
        ],
        doing: [
          { source: 'Jira · PROJ-125', title: 'Refactor service Order — tách responsibility', tag: 'urgent', meta: 'In Progress', icon: 'i-ticket', cls: 'ticket' },
          { source: 'Drive · Sheet', title: 'Báo cáo tiến độ tuần 17.xlsx', meta: 'Đang viết', icon: 'i-sheet', cls: 'file' },
          { source: 'Telegram · Note', title: 'Review PR #142 trước 5h chiều', tag: 'tuần-này', tagCls: 'green', meta: 'Tự note', icon: 'i-note', cls: 'note' },
        ],
        done: [
          { source: 'Gmail · Sent', title: 'Re: Xác nhận yêu cầu sprint 17', meta: 'Đã trả lời', icon: 'i-mail', cls: 'email' },
          { source: 'Jira · PROJ-120', title: 'Implement webhook signature verify', meta: 'Closed', icon: 'i-ticket', cls: 'ticket' },
        ],
      },
    },
    'khach-b': {
      name: 'Khách B',
      colorClass: 'fc-c2',
      cards: {
        todo: [
          { source: 'Outlook · Important', title: '[Khách B] Yêu cầu báo giá tháng 5', tag: 'cần-trả-lời', meta: '1h trước', icon: 'i-mail', cls: 'email' },
          { source: 'Calendar', title: 'Demo phần mềm với Khách B', meta: 'Mai 14:00', icon: 'i-cal', cls: 'event' },
          { source: 'OneDrive · PDF', title: 'Hợp đồng Khách B 2026 - bản ký.pdf', meta: '320 KB', icon: 'i-pdf', cls: 'file' },
        ],
        doing: [
          { source: 'Jira · PROJ-145', title: 'Customize dashboard cho Khách B', tag: 'High', tagCls: 'amber', meta: 'Sprint 17', icon: 'i-ticket', cls: 'ticket' },
          { source: 'Telegram · Note', title: 'Chuẩn bị slide pitch deck cho Khách B', meta: 'Tự note', icon: 'i-note', cls: 'note' },
        ],
        done: [
          { source: 'Gmail · Sent', title: 'Re: Gửi báo giá v1 — chờ phản hồi', meta: 'Đã gửi', icon: 'i-mail', cls: 'email' },
        ],
      },
    },
    'ca-nhan': {
      name: 'Cá nhân',
      colorClass: 'fc-c3',
      cards: {
        todo: [
          { source: 'Gmail', title: 'Azure for Students — Verification needed', meta: '1 ngày trước', icon: 'i-mail', cls: 'email' },
          { source: 'Calendar', title: 'Khám răng định kỳ', meta: 'Thứ 7, 9:00', icon: 'i-cal', cls: 'event' },
          { source: 'Telegram · Note', title: 'Mua quà sinh nhật mẹ — tuần sau', tag: 'tuần-này', tagCls: 'green', meta: 'Tự note', icon: 'i-note', cls: 'note' },
        ],
        doing: [
          { source: 'Telegram · Note', title: 'Học khóa Rust mỗi tối 30 phút', meta: 'Tuần 3/8', icon: 'i-note', cls: 'note' },
          { source: 'Drive · Sheet', title: 'Kế hoạch tài chính 2026.xlsx', meta: 'Sửa hằng tháng', icon: 'i-sheet', cls: 'file' },
        ],
        done: [
          { source: 'Gmail', title: 'Xác nhận đăng ký gym 6 tháng', meta: 'Đã thanh toán', icon: 'i-mail', cls: 'email' },
        ],
      },
    },
    'do-an': {
      name: 'Đồ án TN',
      colorClass: 'fc-c4',
      cards: {
        todo: [
          { source: 'Gmail · GVHD', title: '[GVHD] Phản hồi chương 2 — sửa phần 2.3 về CQRS', tag: 'urgent', meta: '2h trước', icon: 'i-mail', cls: 'email' },
          { source: 'Calendar', title: 'Họp tuần với GVHD', meta: 'Thứ 6, 14:00', icon: 'i-cal', cls: 'event' },
          { source: 'Drive · Doc', title: 'Chương 2 - bản v3.docx', meta: '45 KB', icon: 'i-doc', cls: 'file' },
          { source: 'Telegram · Note', title: 'Tìm 3 paper về CQRS làm reference', meta: 'Tự note', icon: 'i-note', cls: 'note' },
        ],
        doing: [
          { source: 'Telegram · Note', title: 'Viết chương 3 — Kiến trúc hệ thống', tag: 'tuần-này', tagCls: 'green', meta: 'Đang viết', icon: 'i-note', cls: 'note' },
          { source: 'OneDrive · PPT', title: 'Slide pitch defense.pptx', meta: '28 slides', icon: 'i-doc', cls: 'file' },
        ],
        done: [
          { source: 'Gmail · Khoa CNTT', title: 'Khoa: Lịch bảo vệ đồ án dự kiến', meta: 'Đã xem', icon: 'i-mail', cls: 'email' },
          { source: 'Calendar', title: 'Thuyết minh đề tài (tuần 1)', meta: 'Đã xong', icon: 'i-cal', cls: 'event' },
        ],
      },
    },
    'proj-shared': {
      name: 'Dự án X (chia sẻ)',
      colorClass: 'fc-c5',
      sharedReadOnly: true,
      owner: 'Tech Lead Hùng',
      cards: {
        todo: [
          { source: 'Outlook · KH', title: '[KH X] Yêu cầu deadline rút ngắn 1 tuần', tag: 'urgent', meta: '1h trước', icon: 'i-mail', cls: 'email' },
          { source: 'Jira · PRJX-22', title: 'Setup CI/CD pipeline cho project X', tag: 'High', tagCls: 'amber', meta: 'Sprint 18', icon: 'i-ticket', cls: 'ticket' },
          { source: 'Drive · Doc', title: 'Spec API project X — v1.docx', meta: '32 KB', icon: 'i-doc', cls: 'file' },
        ],
        doing: [
          { source: 'Jira · PRJX-19', title: 'Implement service Authentication', meta: 'In Progress', icon: 'i-ticket', cls: 'ticket' },
          { source: 'Calendar', title: 'Sprint planning project X', meta: 'Thứ 2, 9:00', icon: 'i-cal', cls: 'event' },
        ],
        done: [
          { source: 'Gmail · Sent', title: 'Re: Proposal Tech Stack cho KH X', meta: 'Đã gửi', icon: 'i-mail', cls: 'email' },
        ],
      },
    },
    'khach-y-shared': {
      name: 'Khách Y (chia sẻ)',
      colorClass: 'fc-c6',
      sharedReadOnly: true,
      owner: 'PM Linh',
      cards: {
        todo: [
          { source: 'Outlook · KH Y', title: '[Khách Y] Lịch demo bản v2.1', tag: 'cần-trả-lời', meta: '4h trước', icon: 'i-mail', cls: 'email' },
          { source: 'OneDrive · PDF', title: 'Hợp đồng Khách Y - phụ lục 3.pdf', meta: '210 KB', icon: 'i-pdf', cls: 'file' },
        ],
        doing: [
          { source: 'Jira · KHY-12', title: 'Customize report module cho Khách Y', tag: 'High', tagCls: 'amber', meta: 'Sprint 17', icon: 'i-ticket', cls: 'ticket' },
        ],
        done: [
          { source: 'Calendar', title: 'Họp triển khai Khách Y tuần 1', meta: 'Đã xong', icon: 'i-cal', cls: 'event' },
        ],
      },
    },
  };

  // -----------------------------------------------------------
  // Render Folder Kanban
  // -----------------------------------------------------------
  function createCardEl(c, isDone) {
    const tagHtml = c.tag
      ? `<span class="k-tag${c.tagCls ? ' ' + c.tagCls : ''}">${escapeHtml(c.tag)}</span>`
      : '<span></span>';
    const html = `
      <div class="k-card${isDone ? ' done' : ''}" draggable="true">
        <div class="k-card-head">
          <span class="k-card-icon ${c.cls}"><svg class="icon icon-sm"><use href="#${c.icon}"/></svg></span>
          <span class="k-card-source">${escapeHtml(c.source)}</span>
        </div>
        <div class="k-card-title">${escapeHtml(c.title)}</div>
        <div class="k-card-foot">
          ${tagHtml}
          <span>${escapeHtml(c.meta || '')}</span>
        </div>
      </div>
    `;
    const div = document.createElement('div');
    div.innerHTML = html.trim();
    return div.firstChild;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderFolder(folderId) {
    const data = folderData[folderId];
    if (!data) return;

    // Update title text
    const titleEl = document.getElementById('folder-title');
    if (titleEl) titleEl.textContent = data.name;

    // Update color square in title
    const titleRow = document.querySelector('.subpage[data-subpage="folder"] .page-title');
    const colorSq = titleRow ? titleRow.querySelector('.side-folder-color') : null;
    if (colorSq) {
      colorSq.className = `side-folder-color ${data.colorClass}`;
      colorSq.style.width = '14px';
      colorSq.style.height = '14px';
      colorSq.style.borderRadius = '4px';
    }

    // Update badge count
    const total = data.cards.todo.length + data.cards.doing.length + data.cards.done.length;
    const badge = titleRow ? titleRow.querySelector('.badge') : null;
    if (badge) badge.textContent = `${total} items`;

    // Re-render kanban columns
    ['todo', 'doing', 'done'].forEach((status) => {
      const body = document.querySelector(`.kc-body[data-status="${status}"]`);
      if (!body) return;
      const addBtn = body.querySelector('.kc-add');
      body.querySelectorAll('.k-card').forEach((c) => c.remove());
      data.cards[status].forEach((card) => {
        const el = createCardEl(card, status === 'done');
        if (addBtn) body.insertBefore(el, addBtn);
        else body.appendChild(el);
      });
      const countEl = document.querySelector(`[data-kcount="${status}"]`);
      if (countEl) countEl.textContent = data.cards[status].length;
    });

    // Toggle readonly mode UI for shared folder
    const isReadOnly = !!data.sharedReadOnly;
    const banner = document.getElementById('readonly-banner');
    const board = document.getElementById('kanban-board');
    const shareBtn = document.getElementById('btn-share');
    const headActions = document.getElementById('folder-head-actions');

    if (banner) {
      banner.style.display = isReadOnly ? 'flex' : 'none';
      if (isReadOnly && data.owner) {
        banner.querySelector('div').innerHTML =
          `<strong>Bạn đang xem ở chế độ Read-only.</strong> Folder này được share bởi <strong>${escapeHtml(data.owner)}</strong> với quyền Viewer. Bạn xem được metadata Item nhưng không kéo Kanban được và không xem được body email gốc.`;
      }
    }
    if (board) board.classList.toggle('readonly', isReadOnly);
    if (shareBtn) shareBtn.style.display = isReadOnly ? 'none' : 'inline-flex';
    if (headActions) headActions.dataset.readonly = isReadOnly ? '1' : '0';

    // Make k-cards non-draggable when readonly
    document.querySelectorAll('.kanban-board .k-card').forEach((c) => {
      if (isReadOnly) c.removeAttribute('draggable');
      else c.setAttribute('draggable', 'true');
    });
  }

  // -----------------------------------------------------------
  // Page navigation
  // -----------------------------------------------------------
  function go(targetPage) {
    document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
    const next = document.querySelector(`[data-page="${targetPage}"]`);
    if (next) {
      next.classList.add('active');
      state.page = targetPage;
      window.scrollTo(0, 0);
    }
  }

  function sub(targetSub, opts = {}) {
    document.querySelectorAll('.subpage').forEach((s) => s.classList.remove('active'));
    const next = document.querySelector(`[data-subpage="${targetSub}"]`);
    if (next) {
      next.classList.add('active');
      state.subpage = targetSub;
    }
    document.querySelectorAll('.side-nav').forEach((n) => n.classList.remove('active'));
    if (opts.navEl) {
      opts.navEl.classList.add('active');
    } else {
      const nav = document.querySelector(`.side-nav[data-sub="${targetSub}"]`);
      if (nav) nav.classList.add('active');
    }
    // Folder render
    if (targetSub === 'folder') {
      const fid = opts.folderId || state.folder || 'proj-a';
      state.folder = fid;
      renderFolder(fid);
    }
    if (targetSub === 'telegram-wizard') {
      state.wizardStep = 1;
      renderWizard();
    }
    if (targetSub === 'admin') {
      renderAdminGate();
      if (state.role !== 'admin') {
        toast('403 — bạn cần role Admin. Bấm "Admin" ở role switcher.');
      }
    }
    const main = document.querySelector('.main');
    if (main) main.scrollTop = 0;
  }

  // -----------------------------------------------------------
  // Role switching + Admin gate (mô phỏng [Authorize(Policy="AdminOnly")])
  // -----------------------------------------------------------
  function setRole(role) {
    state.role = role;
    document.body.classList.toggle('role-admin', role === 'admin');
    document.querySelectorAll('.role-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.role === role);
    });
    const lbl = document.getElementById('side-user-role');
    if (lbl) lbl.textContent = role === 'admin' ? 'Role: Admin' : 'Role: User';
    // Nếu đang ở admin page mà chuyển về user → re-render gate
    if (state.subpage === 'admin') renderAdminGate();
  }

  function renderAdminGate() {
    const forbidden = document.getElementById('admin-forbidden');
    const content = document.getElementById('admin-content');
    if (!forbidden || !content) return;
    if (state.role === 'admin') {
      forbidden.style.display = 'none';
      content.style.display = 'block';
    } else {
      forbidden.style.display = 'block';
      content.style.display = 'none';
    }
  }

  function lockUser(btn, name) {
    const tr = btn && btn.closest('tr');
    if (!tr) return;
    const status = tr.querySelector('.admin-status');
    if (status) {
      status.classList.remove('ok', 'warn');
      status.classList.add('locked');
      status.textContent = 'Locked';
    }
    // Swap action cell
    const actionCell = btn.parentElement;
    actionCell.innerHTML =
      `<button class="admin-act" onclick="App.unlockUser(this, '${escapeHtml(name)}')">Unlock</button>` +
      `<button class="admin-act danger" onclick="App.toast('Cần xác nhận trước khi xoá')">Xoá</button>`;
    toast(`Đã khoá user "${name}"`);
  }

  function unlockUser(btn, name) {
    const tr = btn && btn.closest('tr');
    if (!tr) return;
    const status = tr.querySelector('.admin-status');
    if (status) {
      status.classList.remove('locked', 'warn');
      status.classList.add('ok');
      status.textContent = 'Active';
    }
    const actionCell = btn.parentElement;
    actionCell.innerHTML =
      `<button class="admin-act" onclick="App.toast('Mở chi tiết user (mockup)')">View</button>` +
      `<button class="admin-act danger" onclick="App.lockUser(this, '${escapeHtml(name)}')">Khoá</button>`;
    toast(`Đã mở khoá user "${name}"`);
  }

  // -----------------------------------------------------------
  // Drawer (item detail)
  // -----------------------------------------------------------
  function openDrawer(row, opts = {}) {
    const backdrop = document.getElementById('drawer-backdrop');
    const drawer = document.getElementById('item-drawer');
    if (row) {
      const title = row.getAttribute('data-title') || 'Item detail';
      const source = row.getAttribute('data-source') || 'unknown';
      const sender = row.getAttribute('data-sender') || '';
      const titleEl = document.getElementById('drawer-title');
      const sourceEl = document.getElementById('drawer-source');
      const senderEl = document.getElementById('drawer-sender');
      const labelEl = document.getElementById('drawer-source-label');
      if (titleEl) titleEl.textContent = title;
      if (sourceEl) {
        const labelMap = {
          gmail: 'Gmail', outlook: 'Outlook', jira: 'Jira',
          gcal: 'Google Calendar', drive: 'Google Drive',
          onedrive: 'OneDrive', telegram: 'Telegram',
        };
        sourceEl.textContent = (labelMap[source] || source) + ' · 14/05/2026';
      }
      if (senderEl) senderEl.textContent = sender;
      if (labelEl) labelEl.textContent = 'Detail · ' + (source.charAt(0).toUpperCase() + source.slice(1));
    }
    // Readonly mode: nếu folder hiện tại là shared, hoặc gọi từ k-card trong readonly board
    const board = document.getElementById('kanban-board');
    const isReadOnly =
      opts.readonly === true ||
      (board && board.classList.contains('readonly') && state.subpage === 'folder');
    drawer.classList.toggle('readonly', isReadOnly);

    backdrop.classList.add('open');
    drawer.classList.add('open');
  }
  function closeDrawer() {
    document.getElementById('drawer-backdrop').classList.remove('open');
    document.getElementById('item-drawer').classList.remove('open');
  }

  // -----------------------------------------------------------
  // Compose modal
  // -----------------------------------------------------------
  function openCompose() { document.getElementById('compose-modal').classList.add('open'); }
  function closeCompose() { document.getElementById('compose-modal').classList.remove('open'); }

  // -----------------------------------------------------------
  // Folder Share modal
  // -----------------------------------------------------------
  function openShareModal() {
    // Update tên folder hiện tại vào modal
    const data = folderData[state.folder];
    const nameEl = document.getElementById('sm-folder-name');
    if (nameEl && data) nameEl.textContent = data.name;
    const colorSq = document.querySelector('.sm-h-title .side-folder-color');
    if (colorSq && data) {
      colorSq.className = `side-folder-color ${data.colorClass}`;
      colorSq.style.width = '14px';
      colorSq.style.height = '14px';
    }
    document.getElementById('share-modal-backdrop').classList.add('open');
  }
  function closeShareModal() {
    document.getElementById('share-modal-backdrop').classList.remove('open');
  }
  function inviteShare() {
    const input = document.getElementById('sm-invite-input');
    const email = (input && input.value || '').trim();
    if (!email) {
      toast('Nhập email teammate trước');
      return;
    }
    // Validate sơ
    if (!/.+@.+\..+/.test(email)) {
      toast('Email không hợp lệ');
      return;
    }
    // Check duplicate
    const existing = document.querySelectorAll('#sm-people .sm-person-sub');
    for (const el of existing) {
      if (el.textContent.toLowerCase().includes(email.toLowerCase())) {
        toast('User này đã được mời');
        return;
      }
    }
    // Append vào list
    const list = document.getElementById('sm-people');
    const shortName = email.split('@')[0];
    const initials = shortName.slice(0, 2).toUpperCase();
    const row = document.createElement('div');
    row.className = 'sm-person pending';
    row.innerHTML = `
      <div class="avatar a4">${escapeHtml(initials)}</div>
      <div class="sm-person-info">
        <div class="sm-person-name">${escapeHtml(shortName)}</div>
        <div class="sm-person-sub">${escapeHtml(email)} · <em>chờ chấp nhận</em></div>
      </div>
      <span class="sm-perm-badge viewer">Viewer</span>
      <button class="sm-revoke" onclick="App.revokeShare(this, '${escapeHtml(shortName)}')">Huỷ</button>
    `;
    list.appendChild(row);
    // Update count
    updateShareCount();
    input.value = '';
    toast(`Đã gửi lời mời share đến ${email}`);
  }
  function revokeShare(btn, name) {
    const row = btn && btn.closest('.sm-person');
    if (row) {
      row.style.transition = 'opacity .2s';
      row.style.opacity = '0';
      setTimeout(() => {
        row.remove();
        updateShareCount();
      }, 200);
    }
    toast(`Đã gỡ ${name} khỏi folder`);
  }
  function updateShareCount() {
    const count = document.querySelectorAll('#sm-people .sm-person').length;
    const el = document.getElementById('sm-count');
    if (el) el.textContent = `(${count})`;
    // Update share count badge on folder header (exclude owner)
    const headBadge = document.getElementById('share-count');
    if (headBadge) headBadge.textContent = String(Math.max(0, count - 1));
  }

  // -----------------------------------------------------------
  // Notification dropdown
  // -----------------------------------------------------------
  function toggleNotif() { document.getElementById('notif-dropdown').classList.toggle('open'); }

  // -----------------------------------------------------------
  // Toast
  // -----------------------------------------------------------
  let toastTimer = null;
  function toast(msg) {
    const t = document.getElementById('toast-pop');
    const m = document.getElementById('toast-msg');
    if (m) m.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
  }

  // -----------------------------------------------------------
  // Onboarding: connect provider
  // -----------------------------------------------------------
  function connectProvider(cardId, accountLabel) {
    const card = document.getElementById(cardId);
    if (!card) return;
    card.classList.add('connected');
    const info = card.querySelector('.onboard-info');
    if (info) {
      const name = info.querySelector('.onboard-name').textContent;
      const services = info.querySelector('.onboard-services').textContent;
      info.innerHTML = `
        <div class="onboard-name">${name}</div>
        <div class="onboard-services">${services}</div>
        <button class="btn-success">
          <svg class="icon icon-sm"><use href="#i-check"/></svg>
          Đã kết nối · ${accountLabel}
        </button>
      `;
    }
    toast('Kết nối thành công');
  }

  // -----------------------------------------------------------
  // Sidebar handlers
  // -----------------------------------------------------------
  function bindSidebar() {
    document.querySelectorAll('.side-nav[data-sub]').forEach((nav) => {
      nav.addEventListener('click', (e) => {
        e.stopPropagation();
        const sub_ = nav.dataset.sub;
        const folder = nav.dataset.folder;
        clearInboxFilter();
        if (folder) {
          sub(sub_, { navEl: nav, folderId: folder });
        } else {
          sub(sub_, { navEl: nav });
        }
      });
    });
  }
  function bindSidebarSources() {
    document.querySelectorAll('.side-nav[data-source]').forEach((nav) => {
      nav.addEventListener('click', (e) => {
        e.stopPropagation();
        const src = nav.dataset.source;
        document.querySelectorAll('.side-nav').forEach((n) => n.classList.remove('active'));
        nav.classList.add('active');
        sub('inbox', { navEl: nav });
        filterInboxBySource(src);
        toast(`Filter: ${src.charAt(0).toUpperCase() + src.slice(1)}`);
      });
    });
  }
  function filterInboxBySource(src) {
    document.querySelectorAll('#inbox-list .inbox-row').forEach((row) => {
      row.style.display = row.getAttribute('data-source') === src ? '' : 'none';
    });
  }
  function clearInboxFilter() {
    document.querySelectorAll('#inbox-list .inbox-row').forEach((row) => {
      row.style.display = '';
    });
  }

  // -----------------------------------------------------------
  // Inbox filter chips
  // -----------------------------------------------------------
  function bindFilterChips() {
    document.querySelectorAll('.filter-chip[data-filter]').forEach((chip) => {
      chip.addEventListener('click', () => {
        const filter = chip.dataset.filter;
        document.querySelectorAll('.filter-chip[data-filter]').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        document.querySelectorAll('#inbox-list .inbox-row').forEach((row) => {
          if (filter === 'all') row.style.display = '';
          else if (filter === 'important') row.style.display = row.classList.contains('important') ? '' : 'none';
          else if (filter === 'unread') row.style.display = '';
        });
      });
    });
  }

  // -----------------------------------------------------------
  // Kanban drag/drop (event delegation — chấp nhận cards mới sinh ra)
  // Readonly mode (shared folder Viewer): drag bị chặn từ Source
  // -----------------------------------------------------------
  let dragKan = null;
  function bindKanban() {
    document.addEventListener('dragstart', (e) => {
      const card = e.target.closest && e.target.closest('.k-card');
      if (!card) return;
      // Block drag in readonly board
      const board = card.closest('.kanban-board');
      if (board && board.classList.contains('readonly')) {
        e.preventDefault();
        toast('Bạn chỉ có quyền xem folder này (Read-only)');
        return;
      }
      dragKan = card;
      setTimeout(() => card.classList.add('dragging'), 0);
      e.dataTransfer.effectAllowed = 'move';
    });
    document.addEventListener('dragend', (e) => {
      const card = e.target.closest && e.target.closest('.k-card');
      if (card) card.classList.remove('dragging');
      dragKan = null;
      document.querySelectorAll('.kc-body').forEach((c) => c.classList.remove('drag-over'));
    });
    document.querySelectorAll('.kc-body').forEach((col) => {
      col.addEventListener('dragover', (e) => {
        if (!dragKan) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        col.classList.add('drag-over');
      });
      col.addEventListener('dragleave', (e) => {
        if (!col.contains(e.relatedTarget)) col.classList.remove('drag-over');
      });
      col.addEventListener('drop', (e) => {
        e.preventDefault();
        col.classList.remove('drag-over');
        if (!dragKan) return;
        const addBtn = col.querySelector('.kc-add');
        if (addBtn) col.insertBefore(dragKan, addBtn);
        else col.appendChild(dragKan);
        const status = col.getAttribute('data-status');
        if (status === 'done') dragKan.classList.add('done');
        else dragKan.classList.remove('done');
        updateKanbanCounts();
      });
    });

    // Click k-card → drawer (readonly mode auto-applied)
    document.addEventListener('click', (e) => {
      const card = e.target.closest && e.target.closest('.k-card');
      if (!card) return;
      // Tránh trigger drawer khi kéo
      if (card.classList.contains('dragging')) return;
      const titleEl = card.querySelector('.k-card-title');
      const sourceEl = card.querySelector('.k-card-source');
      const fakeRow = document.createElement('div');
      fakeRow.setAttribute('data-title', titleEl ? titleEl.textContent : 'Item');
      fakeRow.setAttribute('data-sender', sourceEl ? sourceEl.textContent : '');
      fakeRow.setAttribute('data-source',
        sourceEl && /jira/i.test(sourceEl.textContent) ? 'jira'
        : sourceEl && /outlook/i.test(sourceEl.textContent) ? 'outlook'
        : sourceEl && /gmail/i.test(sourceEl.textContent) ? 'gmail'
        : sourceEl && /calendar/i.test(sourceEl.textContent) ? 'gcal'
        : 'unknown');
      openDrawer(fakeRow);
    });
  }

  // -----------------------------------------------------------
  // Role switcher bind
  // -----------------------------------------------------------
  function bindRoleSwitcher() {
    document.querySelectorAll('.role-btn').forEach((b) => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        const r = b.dataset.role;
        setRole(r);
        if (r === 'admin') {
          toast('Đã chuyển sang Admin — vào mục "Admin" trong sidebar để xem dashboard');
        } else {
          toast('Đã chuyển sang User — vào /admin sẽ bị chặn 403');
        }
      });
    });
  }
  function updateKanbanCounts() {
    ['todo', 'doing', 'done'].forEach((s) => {
      const col = document.querySelector(`.kc-body[data-status="${s}"]`);
      if (!col) return;
      const count = col.querySelectorAll('.k-card').length;
      const el = document.querySelector(`[data-kcount="${s}"]`);
      if (el) el.textContent = count;
    });
  }

  // -----------------------------------------------------------
  // 3-pane Workspace
  // -----------------------------------------------------------
  function bindWorkspace3pane() {
    const intRows = document.querySelectorAll('.ws-int-row');
    const items = document.querySelectorAll('.ws-items-pane');
    const labelMap = {
      gmail: 'Gmail', outlook: 'Outlook', drive: 'Drive',
      gcal: 'Calendar', jira: 'Jira',
    };
    intRows.forEach((r) => {
      r.addEventListener('click', () => {
        intRows.forEach((x) => x.classList.remove('active'));
        items.forEach((x) => {
          x.classList.remove('active');
          x.style.display = 'none';
        });
        r.classList.add('active');
        const id = r.dataset.wsint;
        const pane = document.querySelector(`.ws-items-pane[data-wspane="${id}"]`);
        if (pane) {
          pane.classList.add('active');
          pane.style.display = 'block';
        }
        const label = document.getElementById('ws-active-name');
        if (label) label.textContent = labelMap[id] || id;
      });
    });

    const dragItems = document.querySelectorAll('.ws-item');
    const folderDrops = document.querySelectorAll('.ws-folder');
    let dragged = null;
    dragItems.forEach((d) => {
      d.addEventListener('dragstart', (e) => {
        dragged = d;
        setTimeout(() => d.classList.add('dragging'), 0);
        e.dataTransfer.effectAllowed = 'copy';
      });
      d.addEventListener('dragend', () => {
        d.classList.remove('dragging');
        dragged = null;
        folderDrops.forEach((f) => f.classList.remove('over'));
      });
    });
    folderDrops.forEach((f) => {
      f.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        f.classList.add('over');
      });
      f.addEventListener('dragleave', (e) => {
        if (!f.contains(e.relatedTarget)) f.classList.remove('over');
      });
      f.addEventListener('drop', (e) => {
        e.preventDefault();
        f.classList.remove('over');
        if (!dragged) return;
        const fid = f.dataset.folder;
        state.folderCounts[fid] = (state.folderCounts[fid] || 0) + 1;
        const fcEl = document.querySelector(`[data-fc="${fid}"]`);
        if (fcEl) fcEl.textContent = state.folderCounts[fid];
        const sideCount = document.querySelector(`.side-nav[data-folder="${fid}"] .count`);
        if (sideCount) sideCount.textContent = state.folderCounts[fid];
        const title = dragged.querySelector('.ws-item-title')?.textContent || 'Item';
        const folderName = f.querySelector('strong')?.textContent || 'Folder';
        const short = title.length > 32 ? title.slice(0, 32) + '...' : title;
        toast(`Đã thêm "${short}" vào ${folderName}`);
      });
    });
  }

  // -----------------------------------------------------------
  // Telegram wizard
  // -----------------------------------------------------------
  function renderWizard() {
    document.querySelectorAll('.wstep').forEach((s) => {
      const n = parseInt(s.dataset.wstep, 10);
      s.classList.remove('active', 'done');
      if (n < state.wizardStep) s.classList.add('done');
      else if (n === state.wizardStep) s.classList.add('active');
    });
    document.querySelectorAll('.wpanel').forEach((p) => p.classList.remove('active'));
    const cur = document.querySelector(`.wpanel[data-wpanel="${state.wizardStep}"]`);
    if (cur) cur.classList.add('active');
    const backBtn = document.getElementById('wbtn-back');
    const nextBtn = document.getElementById('wbtn-next');
    if (backBtn) backBtn.disabled = state.wizardStep === 1;
    if (nextBtn) nextBtn.textContent = state.wizardStep === 5 ? 'Vào app' : 'Tiếp tục';
  }
  function bindWizard() {
    const back = document.getElementById('wbtn-back');
    const next = document.getElementById('wbtn-next');
    if (back) back.addEventListener('click', () => {
      if (state.wizardStep > 1) { state.wizardStep--; renderWizard(); }
    });
    if (next) next.addEventListener('click', () => {
      if (state.wizardStep < 5) { state.wizardStep++; renderWizard(); }
      else { toast('Telegram bot đã sẵn sàng'); sub('inbox'); }
    });
    document.querySelectorAll('.wstep').forEach((s) => {
      s.addEventListener('click', () => {
        state.wizardStep = parseInt(s.dataset.wstep, 10);
        renderWizard();
      });
    });
  }

  // -----------------------------------------------------------
  // Global click handlers
  // -----------------------------------------------------------
  function bindGlobal() {
    document.addEventListener('click', (e) => {
      const goEl = e.target.closest('[data-go]');
      if (goEl) { e.preventDefault(); go(goEl.dataset.go); }
    });
    document.addEventListener('click', (e) => {
      const notif = document.getElementById('notif-dropdown');
      if (notif.classList.contains('open')) {
        if (!notif.contains(e.target) && !e.target.closest('[onclick*="toggleNotif"]')) {
          notif.classList.remove('open');
        }
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDrawer();
        closeCompose();
        closeShareModal();
        document.getElementById('notif-dropdown').classList.remove('open');
      }
    });
  }

  // -----------------------------------------------------------
  // Init
  // -----------------------------------------------------------
  function init() {
    bindGlobal();
    bindSidebar();
    bindSidebarSources();
    bindFilterChips();
    bindKanban();
    bindWorkspace3pane();
    bindWizard();
    bindRoleSwitcher();
    renderWizard();
    setRole(state.role);
    // Render default folder ngay khi load để khi click vào "Folder" lần đầu là sẵn
    renderFolder('proj-a');
  }

  return {
    go, sub, openDrawer, closeDrawer,
    openCompose, closeCompose, toggleNotif,
    toast, connectProvider, init,
    setRole, lockUser, unlockUser,
    openShareModal, closeShareModal, inviteShare, revokeShare,
  };
})();

document.addEventListener('DOMContentLoaded', App.init);
