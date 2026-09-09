// ===== VĂN BẢN MỚI BAN HÀNH =====
fetch("data/vanban.json")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("vanban-list");
    if (!container) return;

    container.innerHTML = "";

    data.forEach(item => {
      container.innerHTML += `
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
  .catch(error => console.error("Lỗi vanban:", error));
