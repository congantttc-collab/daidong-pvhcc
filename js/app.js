// ===== VĂN BẢN MỚI BAN HÀNH =====
fetch("data/vanban.json")
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("vanban-list");
    if (!list) return;

    list.innerHTML = "";

    data.forEach(item => {
      list.innerHTML += `
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
    });
  })
  .catch(err => console.error("Lỗi đọc vanban.json:", err));
