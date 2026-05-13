// ============ Kanban drag/drop (mockup 3.1) ============
(function () {
  const items = document.querySelectorAll('#kanban .item-card');
  const cols = document.querySelectorAll('#kanban [data-droppable]');
  let dragged = null;

  items.forEach((item) => {
    item.addEventListener('dragstart', (e) => {
      dragged = item;
      setTimeout(() => item.classList.add('dragging'), 0);
      e.dataTransfer.effectAllowed = 'move';
    });
    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      dragged = null;
      cols.forEach((c) => c.classList.remove('drag-over'));
    });
  });

  cols.forEach((col) => {
    col.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      col.classList.add('drag-over');
    });
    col.addEventListener('dragleave', (e) => {
      if (!col.contains(e.relatedTarget)) {
        col.classList.remove('drag-over');
      }
    });
    col.addEventListener('drop', (e) => {
      e.preventDefault();
      col.classList.remove('drag-over');
      if (!dragged) return;
      col.appendChild(dragged);
      const status = col.getAttribute('data-droppable');
      if (status === 'done') dragged.classList.add('done');
      else dragged.classList.remove('done');
      updateKanbanCounts();
    });
  });

  function updateKanbanCounts() {
    ['todo', 'doing', 'done'].forEach((s) => {
      const col = document.querySelector(`#kanban [data-droppable="${s}"]`);
      if (!col) return;
      const count = col.querySelectorAll('.item-card').length;
      const el = document.getElementById(`count-${s}`);
      if (el) el.textContent = count;
    });
  }
})();

// ============ Tab view switch (mockup 3.4) ============
(function () {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach((t) => {
    t.addEventListener('click', () => {
      tabs.forEach((x) => x.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));
      t.classList.add('active');
      const id = t.getAttribute('data-tab');
      const content = document.querySelector(`[data-content="${id}"]`);
      if (content) content.classList.add('active');
    });
  });
})();

// ============ 3-pane: integration filter + drag to folder (mockup 3.5) ============
(function () {
  const intRows = document.querySelectorAll('.int-row');
  const intItemsList = document.querySelectorAll('.int-items');
  const activeIntLabel = document.getElementById('active-int');
  const intLabelMap = {
    gmail: 'Gmail', outlook: 'Outlook', drive: 'Drive',
    calendar: 'Calendar', jira: 'Jira'
  };

  intRows.forEach((r) => {
    r.addEventListener('click', () => {
      intRows.forEach((x) => x.classList.remove('active'));
      intItemsList.forEach((x) => x.classList.remove('active'));
      r.classList.add('active');
      const id = r.getAttribute('data-int');
      const list = document.querySelector(`[data-int-items="${id}"]`);
      if (list) list.classList.add('active');
      if (activeIntLabel) activeIntLabel.textContent = intLabelMap[id] || id;
    });
  });

  const dragItems = document.querySelectorAll('.drag-item');
  const folderDrops = document.querySelectorAll('.folder-drop');
  let dragged3p = null;

  dragItems.forEach((d) => {
    d.addEventListener('dragstart', (e) => {
      dragged3p = d;
      setTimeout(() => d.classList.add('dragging'), 0);
      e.dataTransfer.effectAllowed = 'copy';
    });
    d.addEventListener('dragend', () => {
      d.classList.remove('dragging');
      dragged3p = null;
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
      if (!dragged3p) return;
      const fid = f.getAttribute('data-folder');
      const countEl = document.querySelector(`[data-fc="${fid}"]`);
      if (countEl) {
        const n = parseInt(countEl.textContent || '0', 10) + 1;
        countEl.textContent = n;
      }
      const title = dragged3p.querySelector('.li-title')?.textContent || 'Item';
      const folderName = f.querySelector('strong')?.textContent || 'Folder';
      const shortTitle = title.length > 35 ? title.slice(0, 35) + '...' : title;
      showToast(`Đã thêm "${shortTitle}" vào "${folderName}"`);
    });
  });

  function showToast(msg) {
    let toast = document.getElementById('toast-pop');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-pop';
      toast.className = 'toast-pop';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2200);
  }
})();
