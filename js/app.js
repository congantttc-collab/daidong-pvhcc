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

            <div class="calendar-left">

                <div class="calendar-date-box">
                    <small>${item.thu}</small>
                    <div class="day">${item.ngay}</div>
                    <span>${item.thang}</span>
                </div>

                <div class="calendar-content">

                    <h4>${item.noiDung}</h4>

                    <div class="calendar-location">
                        📍 ${item.diaDiem}
                    </div>

                </div>

            </div>

            <div class="calendar-right">

                <div class="calendar-status">
                    ${item.trangThai}
                </div>

                <div class="calendar-time">
                    ${item.gio}
                </div>

            </div>

        </div>
        `;

    });

});
