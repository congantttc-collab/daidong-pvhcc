// ===== VĂN BẢN MỚI BAN HÀNH =====

fetch("data/vanban.json")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("vanban-list");
    if (!container) return;

    container.innerHTML = "";

    data.slice(0, 5).forEach(item => {
      const html = `
        <div class="document-item">
          <div class="document-info">
            <small>${item.ngay} • ${item.so}</small>
            <h4>${item.tieuDe}</h4>
          </div>
          <div class="doc-tag">${item.loai}</div>
        </div>
      `;
      container.innerHTML += html;
    });
  })
  .catch(error => {
    console.error("Lỗi đọc vanban.json:", error);
  });
