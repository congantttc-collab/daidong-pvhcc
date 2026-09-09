// ===== VĂN BẢN MỚI BAN HÀNH =====

fetch("./data/vanban.json")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("vanban-list");
    if (!container) return;

    container.innerHTML = "";

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

      container.innerHTML += html;
    });
  })
  .catch(error => {
    console.error("Lỗi đọc vanban.json:", error);
  });
// ===== LỊCH CÔNG TÁC =====

fetch("./data/calendar.json")
.then(r=>r.json())
.then(data=>{

    const box=document.getElementById("calendar-list");
    if(!box) return;

    box.innerHTML="";

    data.forEach(item=>{

        box.innerHTML += `
        <div class="calendar-item">

            <div class="calendar-content">

                <div class="calendar-day">
                    ${item.thu}
                </div>

                <div class="calendar-date">
                    ${item.ngay}
                </div>

                <h4>${item.noiDung}</h4>

            </div>

            <div class="calendar-time">
                ${item.gio}
            </div>

        </div>
        `;

    });

});
