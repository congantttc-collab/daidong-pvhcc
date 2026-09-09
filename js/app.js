// ===== Văn bản mới ban hành =====
fetch("data/vanban.json")
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("document-list");
    if (!list) return;

    list.innerHTML = "";

    data.forEach(item => {
      const html = `
        <a class="document-item" href="${item.pdf}" target="_blank">
          <div class="document-info">
            <small>${item.ngay} • ${item.so}</small>
            <h4>${item.tieuDe}</h4>
          </div>

          <div style="display:flex;align-items:center;gap:12px">
            <div class="pdf-icon">PDF</div>
            <div class="doc-tag">${item.loai}</div>
          </div>
        </a>
      `;
      list.innerHTML += html;
    });
  });
