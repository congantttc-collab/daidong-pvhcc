
/* ==========================================================
   TRỢ LÝ AI PVHCC XÃ ĐẠI ĐỒNG
   AI 5.0 PRO - MODULE 1
   Tác dụng:
   - Hiểu ngôn ngữ tự nhiên
   - Mở đúng Cổng DVC Quốc gia
   - Hiển thị cán bộ phụ trách
   - Không cần lưu hàng nghìn thủ tục
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const aiChat   = document.getElementById("ai-chat");
  const aiToggle = document.getElementById("ai-toggle");
  const aiClose  = document.getElementById("ai-close");
  const aiBody   = document.getElementById("ai-body");
  const aiInput  = document.getElementById("ai-input");
  const aiSend   = document.getElementById("ai-send");

  let DATA = {};
  let INTENTS = {};
  let READY = false;

  // ===============================
  // ĐỌC DỮ LIỆU
  // ===============================
  Promise.all([
    fetch("./data/ai_local.json?v=50").then(r => r.json()),
    fetch("./data/ai_intents.json?v=50").then(r => r.json())
  ])
  .then(([local, intents]) => {
    DATA = local;
    INTENTS = intents;
    READY = true;
    console.log("AI 5.0 PRO READY");
  })
  .catch(err => console.error("AI ERROR:", err));

  // ===============================
  // MỞ / ĐÓNG CHAT
  // ===============================
  if (aiToggle) aiToggle.onclick = () => aiChat.classList.add("active");
  if (aiClose) aiClose.onclick = () => aiChat.classList.remove("active");

  // ===============================
  // HIỂN THỊ TIN NHẮN
  // ===============================
  function addMessage(html, me = false) {

    const div = document.createElement("div");
    div.className = me ? "ai-message user" : "ai-message bot";
    div.innerHTML = html;

    aiBody.appendChild(div);
    aiBody.scrollTop = aiBody.scrollHeight;
  }

  // ===============================
  // CHUẨN HÓA TIẾNG VIỆT
  // ===============================
  function normalize(str) {

    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d");

  }

  // ===============================
  // LINK TÌM KIẾM CỔNG DVC QUỐC GIA
  // ===============================
  function createDVCSearchUrl(keyword) {

    return "https://dichvucong.gov.vn/p/home/dvc-tthc-category.html?keyword=" +
      encodeURIComponent(keyword);

  }

  // ===============================
  // HIỂU Ý ĐỊNH NGƯỜI DÂN
  // ===============================
  function detectProcedure(question) {

    const text = normalize(question);

    let best = null;
    let score = 0;

    Object.entries(INTENTS).forEach(([id, obj]) => {

      let point = 0;

      obj.keywords.forEach(k => {

        if (text.includes(normalize(k))) {
          point += k.length;
        }

      });

      if (point > score) {
        score = point;
        best = id;
      }

    });

    return score > 0 ? best : null;

  }

  // ===============================
  // TÌM CÁN BỘ
  // ===============================
  function findOfficers(procedure) {

    const field = INTENTS[procedure]?.field;

    if (!field || !DATA.officers) return [];

    return DATA.officers.filter(o =>
      o.field.toLowerCase().includes(field.toLowerCase())
    );

  }

  // ===============================
  // HIỂN THỊ KẾT QUẢ
  // ===============================
  function renderResult(procedure) {

    const officers = findOfficers(procedure);

    const keyword = INTENTS[procedure]?.search || procedure;

    const url = createDVCSearchUrl(keyword);

    let html = `
      <div style="font-size:18px;font-weight:bold;color:#d70018">
        📌 ${keyword}
      </div>

      <div style="margin-top:8px;line-height:1.6">
        Thủ tục được tra cứu trên <b>Cổng Dịch vụ công Quốc gia</b>.
      </div>
    `;

    if (officers.length) {

      html += `
        <div style="margin-top:14px;font-weight:bold">
          👨‍💼 Cán bộ phụ trách
        </div>
      `;

      officers.forEach(o => {

        html += `
          <div style="
              margin-top:8px;
              padding:10px;
              border:1px solid #ececec;
              border-radius:10px;
              background:#fafafa">

              <b>${o.name}</b><br>
              ${o.position}<br>
              📋 ${o.field}<br>
              ☎ <a href="tel:${o.phone}"
                    style="color:#d70018;text-decoration:none">
                    ${o.phone}
                 </a>
          </div>
        `;

      });

    }

    html += `
      <a href="${url}"
         target="_blank"
         class="ai-link-btn"
         style="display:block;text-align:center;margin-top:14px">
         🔗 TRA CỨU TRÊN CỔNG DVC QUỐC GIA
      </a>
    `;

    return html;

  }

  // ===============================
  // TRẢ LỜI
  // ===============================
  function reply(question) {

    if (!READY) {
      addMessage("⏳ Hệ thống đang tải dữ liệu, vui lòng thử lại sau vài giây.");
      return;
    }

    const q = normalize(question);

    // Giờ làm việc
    if (q.includes("gio lam") || q.includes("lam viec")) {

      addMessage(`
        <b>🕒 Giờ làm việc</b><br><br>
        ${DATA.center.working_hours}
      `);

      return;
    }

    // Điện thoại
    if (q.includes("dien thoai") || q.includes("lien he")) {

      addMessage(`
        <b>☎ Đường dây nóng</b><br><br>
        ${DATA.center.phone}
      `);

      return;
    }

    // Địa chỉ
    if (q.includes("dia chi") || q.includes("o dau")) {

      addMessage(`
        <b>📍 Địa chỉ Trung tâm</b><br><br>
        ${DATA.center.address}
      `);

      return;
    }

    // Tiếp công dân
    if (q.includes("tiep cong dan")) {

      addMessage(`
        <b>📅 Lịch tiếp công dân</b><br><br>
        ${DATA.citizen_reception.day}<br>
        🕗 ${DATA.citizen_reception.time}<br>
        📍 ${DATA.citizen_reception.location}
      `);

      return;
    }

    // Hiểu thủ tục
    const procedure = detectProcedure(question);

    if (procedure) {

      addMessage(renderResult(procedure));
      return;
    }

    // Không nhận diện → mở tìm kiếm chính thức
    const url = createDVCSearchUrl(question);

    addMessage(`
      <b>🔎 Tôi chưa xác định chính xác tên thủ tục.</b><br><br>

      Tôi sẽ mở <b>Cổng Dịch vụ công Quốc gia</b> với đúng nội dung bà con vừa hỏi để tra cứu kết quả chính thức.

      <a href="${url}"
         target="_blank"
         class="ai-link-btn"
         style="display:block;text-align:center;margin-top:14px">
         🔗 TRA CỨU TRÊN CỔNG DVC QUỐC GIA
      </a>
    `);

  }

  // ===============================
  // GỬI TIN NHẮN
  // ===============================
  function send() {

    const txt = aiInput.value.trim();

    if (!txt) return;

    addMessage(txt, true);

    aiInput.value = "";

    reply(txt);

  }

  if (aiSend) aiSend.onclick = send;

  if (aiInput) {

    aiInput.addEventListener("keydown", e => {

      if (e.key === "Enter") {
        send();
      }

    });

  }

  // Chip gợi ý
  document.querySelectorAll(".ai-chip").forEach(chip => {

    chip.onclick = () => {

      aiInput.value = chip.innerText;
      send();

    };

  });

});
