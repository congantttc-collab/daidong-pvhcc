
document.addEventListener("DOMContentLoaded", () => {

  const aiChat = document.getElementById("ai-chat");
  const aiToggle = document.getElementById("ai-toggle");
  const aiClose = document.getElementById("ai-close");
  const aiBody = document.getElementById("ai-body");
  const aiInput = document.getElementById("ai-input");
  const aiSend = document.getElementById("ai-send");

  let DATA = {};
  let READY = false;

  // ===========================
  // ĐỌC DỮ LIỆU
  // ===========================
  fetch("./data/ai_local.json?v=50")
    .then(r => r.json())
    .then(json => {
      DATA = json;
      READY = true;
      console.log("AI 5.0 PRO READY");
    })
    .catch(err => console.error("AI ERROR:", err));

  // ===========================
  // MỞ / ĐÓNG CHAT
  // ===========================
  if (aiToggle) aiToggle.onclick = () => aiChat.classList.add("active");
  if (aiClose) aiClose.onclick = () => aiChat.classList.remove("active");

  // ===========================
  // HIỂN THỊ TIN NHẮN
  // ===========================
  function addMessage(html, me = false) {
    const div = document.createElement("div");
    div.className = me ? "ai-message user" : "ai-message bot";
    div.innerHTML = html;
    aiBody.appendChild(div);
    aiBody.scrollTop = aiBody.scrollHeight;
  }

  // ===========================
  // CHUẨN HÓA TIẾNG VIỆT
  // ===========================
  function normalize(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d");
  }

  // ===========================
  // LINK TÌM KIẾM DVCQG
  // ===========================
  function createDVCSearchUrl(keyword) {
    return "https://dichvucong.gov.vn/p/home/dvc-tthc-category.html?keyword=" +
      encodeURIComponent(keyword);
  }

  // =====================================================
  // MODULE 1 - HIỂU NGÔN NGỮ TỰ NHIÊN
  // =====================================================
  function detectProcedure(question) {

    const text = normalize(question);

    const intents = [
      {
        id: "khai sinh",
        words: [
          "khai sinh", "dang ky khai sinh", "giay khai sinh",
          "con moi sinh", "con toi moi sinh", "em be moi sinh",
          "tre moi sinh", "sinh con", "lam giay cho con"
        ]
      },
      {
        id: "khai tử",
        words: [
          "khai tu", "dang ky khai tu", "giay khai tu",
          "bo mat", "me mat", "ong mat", "ba mat",
          "qua doi", "nguoi mat", "nguoi chet"
        ]
      },
      {
        id: "kết hôn",
        words: [
          "ket hon", "dang ky ket hon", "giay ket hon",
          "dang ky cuoi", "lam giay cuoi", "cuoi"
        ]
      },
      {
        id: "chứng thực",
        words: [
          "chung thuc", "cong chung", "sao y",
          "photo cong chung", "photo cccd",
          "cong chung cccd", "ban sao"
        ]
      },
      {
        id: "đất đai",
        words: [
          "so do", "so hong", "dat", "dat dai",
          "tach thua", "tach so", "chia dat",
          "sang ten", "ban dat", "mua dat",
          "chuyen nhuong", "cap so"
        ]
      },
      {
        id: "hộ kinh doanh",
        words: [
          "ho kinh doanh", "mo quan", "mo tiem",
          "mo cua hang", "kinh doanh",
          "quan cafe", "quan an"
        ]
      },
      {
        id: "an toàn thực phẩm",
        words: [
          "an toan thuc pham", "vsattp",
          "giay attp", "ve sinh an toan"
        ]
      },
      {
        id: "bảo trợ xã hội",
        words: [
          "tro cap", "bao tro", "nguoi cao tuoi",
          "khuyet tat", "ho ngheo", "nguoi gia"
        ]
      },
      {
        id: "người có công",
        words: [
          "thuong binh", "liet si",
          "nguoi co cong", "chinh sach"
        ]
      }
    ];

    let best = null;
    let score = 0;

    intents.forEach(item => {

      let point = 0;

      item.words.forEach(w => {
        if (text.includes(w)) point += w.length;
      });

      if (point > score) {
        score = point;
        best = item.id;
      }

    });

    return score > 0 ? best : null;
  }

  // ===========================
  // TÌM CÁN BỘ
  // ===========================
  function findOfficers(procedure) {

    if (!DATA.intents || !DATA.officers) return [];

    const field = DATA.intents[procedure]?.field;

    if (!field) return [];

    return DATA.officers.filter(o =>
      o.field.toLowerCase().includes(field.toLowerCase())
    );
  }

  // ===========================
  // HIỂN THỊ THỦ TỤC
  // ===========================
  function renderProcedure(procedure) {

    const p = DATA.procedures?.[procedure];

    if (!p) {
      const url = createDVCSearchUrl(procedure);
      return `
        <b>🔎 Tra cứu thủ tục</b><br><br>
        <a href="${url}" target="_blank" class="ai-link-btn">
          🔗 MỞ TRÊN CỔNG DVC QUỐC GIA
        </a>`;
    }

    const officers = findOfficers(procedure);
    const url = createDVCSearchUrl(p.name);

    let html = `
      <div style="font-size:18px;font-weight:bold;color:#d70018">
        📌 ${p.name}
      </div>

      <div style="margin-top:10px;line-height:1.7">
        💰 <b>Lệ phí:</b> ${p.fee}<br>
        ⏱ <b>Thời hạn:</b> ${p.time}<br>
        🌐 <b>Dịch vụ công:</b> ${p.level}
      </div>

      <div style="margin-top:12px">
        <b>📄 Thành phần hồ sơ</b>
        <ul style="padding-left:18px;margin:8px 0">`;

    p.documents.forEach(d => {
      html += `<li>${d}</li>`;
    });

    html += `</ul></div>`;

    if (officers.length) {

      html += `<div style="margin-top:12px"><b>👨‍💼 Cán bộ phụ trách</b></div>`;

      officers.forEach(o => {

        html += `
          <div style="margin-top:8px;padding:10px;border:1px solid #ececec;border-radius:10px;background:#fafafa">
            <b>${o.name}</b><br>
            ${o.position}<br>
            📋 ${o.field}<br>
            ☎ <a href="tel:${o.phone}" style="color:#d70018;text-decoration:none">${o.phone}</a>
          </div>`;

      });
    }

    html += `
      <a href="${url}" target="_blank" class="ai-link-btn"
         style="display:block;text-align:center;margin-top:14px">
         🔗 MỞ TRÊN CỔNG DỊCH VỤ CÔNG QUỐC GIA
      </a>`;

    return html;
  }

  // ===========================
  // TRẢ LỜI
  // ===========================
  function reply(question) {

    if (!READY) {
      addMessage("⏳ Hệ thống đang tải dữ liệu, vui lòng thử lại sau vài giây.");
      return;
    }

    const q = normalize(question);

    if (q.includes("gio lam") || q.includes("lam viec")) {
      addMessage(`<b>🕒 Giờ làm việc</b><br><br>${DATA.center.working_hours}`);
      return;
    }

    if (q.includes("dien thoai") || q.includes("lien he")) {
      addMessage(`<b>☎ Đường dây nóng</b><br><br>${DATA.center.phone}`);
      return;
    }

    if (q.includes("dia chi") || q.includes("o dau")) {
      addMessage(`<b>📍 Địa chỉ Trung tâm</b><br><br>${DATA.center.address}`);
      return;
    }

    if (q.includes("tiep cong dan")) {
      addMessage(`
        <b>📅 Lịch tiếp công dân</b><br><br>
        ${DATA.citizen_reception.day}<br>
        🕗 ${DATA.citizen_reception.time}<br>
        📍 ${DATA.citizen_reception.location}`);
      return;
    }

    const procedure = detectProcedure(question);

    if (procedure) {
      addMessage(renderProcedure(procedure));
      return;
    }

    const url = createDVCSearchUrl(question);

    addMessage(`
      <b>🔎 Tôi chưa xác định chính xác thủ tục.</b><br><br>

      Tôi sẽ mở Cổng Dịch vụ công Quốc gia với đúng nội dung bà con vừa hỏi để tra cứu tất cả kết quả chính thức.

      <a href="${url}" target="_blank" class="ai-link-btn"
         style="display:block;text-align:center;margin-top:14px">
         🔗 TRA CỨU TRÊN CỔNG DVC QUỐC GIA
      </a>`);
  }

  // ===========================
  // GỬI
  // ===========================
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
      if (e.key === "Enter") send();
    });
  }

  document.querySelectorAll(".ai-chip").forEach(chip => {
    chip.onclick = () => {
      aiInput.value = chip.innerText;
      send();
    };
  });

});
