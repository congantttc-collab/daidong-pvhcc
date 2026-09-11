
document.addEventListener("DOMContentLoaded", () => {

  // ==========================
  // KHAI BÁO
  // ==========================
  const aiChat   = document.getElementById("ai-chat");
  const aiToggle = document.getElementById("ai-toggle");
  const aiClose  = document.getElementById("ai-close");
  const aiBody   = document.getElementById("ai-body");
  const aiInput  = document.getElementById("ai-input");
  const aiSend   = document.getElementById("ai-send");

  let DATA = {};
  let READY = false;

  // ==========================
  // ĐỌC JSON
  // ==========================
  fetch("./data/ai_local.json?v=31")
    .then(r => r.json())
    .then(json => {
      DATA = json;
      READY = true;
      console.log("AI 3.1 READY");
    })
    .catch(err => {
      console.error("Lỗi JSON:", err);
    });

  // ==========================
  // MỞ / ĐÓNG CHAT
  // ==========================
  aiToggle.onclick = () => aiChat.classList.add("active");
  aiClose.onclick  = () => aiChat.classList.remove("active");

  // ==========================
  // HIỂN THỊ TIN NHẮN
  // ==========================
  function addMessage(html, me = false){

    const div = document.createElement("div");
    div.className = me ? "ai-message user" : "ai-message bot";
    div.innerHTML = html;

    aiBody.appendChild(div);
    aiBody.scrollTop = aiBody.scrollHeight;
  }

  // ==========================
  // CHUẨN HÓA TIẾNG VIỆT
  // ==========================
  function normalize(str){

    return str.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g,"")
      .replace(/đ/g,"d");

  }

  // ==========================
  // NHẬN DIỆN THỦ TỤC
  // ==========================
  function detectProcedure(question){

    if(!DATA.intents) return null;

    const text = normalize(question);

    let best = null;
    let score = 0;

    Object.entries(DATA.intents).forEach(([name,obj])=>{

      let s = 0;

      obj.keywords.forEach(k=>{

        if(text.includes(normalize(k))){
          s += k.length;
        }

      });

      if(s > score){
        score = s;
        best = name;
      }

    });

    return best;
  }

  // ==========================
  // TÌM CÁN BỘ
  // ==========================
  function findOfficers(procedure){

    if(!DATA.officers || !DATA.intents) return [];

    const field = normalize(DATA.intents[procedure].field);

    return DATA.officers.filter(o =>
      normalize(o.field).includes(field)
    );

  }

  // ==========================
  // HIỂN THỊ THỦ TỤC
  // ==========================
  function renderProcedure(procedure){

    const p = DATA.procedures[procedure];
    const officers = findOfficers(procedure);
    const url = DATA.dvc_links[procedure];

    let html = `
      <div style="font-size:19px;font-weight:bold;color:#d70018;margin-bottom:10px">
        📌 ${p.name}
      </div>

      <div style="line-height:1.8">
        💰 <b>Lệ phí:</b> ${p.fee}<br>
        ⏱ <b>Thời hạn:</b> ${p.time}<br>
        🌐 <b>Dịch vụ công:</b> ${p.level}
      </div>

      <div style="margin-top:12px">
        <b>📄 Thành phần hồ sơ</b>
        <ul style="padding-left:18px;margin-top:8px">
    `;

    p.documents.forEach(doc=>{
      html += `<li>${doc}</li>`;
    });

    html += `</ul></div>`;

    if(officers.length){

      html += `<div style="margin-top:14px"><b>👨‍💼 Cán bộ phụ trách</b></div>`;

      officers.forEach(o=>{

        html += `
          <div style="margin-top:8px;padding:10px;border:1px solid #ececec;border-radius:10px;background:#fafafa">
            <b>${o.name}</b><br>
            ${o.position}<br>
            📋 ${o.field}<br>
            ☎ <a href="tel:${o.phone}" style="color:#d70018;text-decoration:none">${o.phone}</a>
          </div>
        `;

      });

    }

    html += `
      <a href="${url}" target="_blank"
         class="ai-link-btn"
         style="display:block;text-align:center;margin-top:14px">
         🔗 MỞ THỦ TỤC TRÊN CỔNG DVC
      </a>
    `;

    return html;
  }

  // ==========================
  // AI TRẢ LỜI
  // ==========================
  function reply(question){

    if(!READY){
      addMessage("⏳ Hệ thống đang tải dữ liệu, vui lòng thử lại sau vài giây.");
      return;
    }

    const q = normalize(question);

    // Giờ làm việc
    if(q.includes("gio lam") || q.includes("lam viec")){
      addMessage(`
        <b>🕒 Giờ làm việc</b><br><br>
        ${DATA.center.working_hours}
      `);
      return;
    }

    // Điện thoại
    if(q.includes("dien thoai") || q.includes("lien he")){
      addMessage(`
        <b>☎ Đường dây nóng</b><br><br>
        ${DATA.center.phone}
      `);
      return;
    }

    // Địa chỉ
    if(q.includes("dia chi") || q.includes("o dau")){
      addMessage(`
        <b>📍 Địa chỉ Trung tâm</b><br><br>
        ${DATA.center.address}
      `);
      return;
    }

    // Tiếp công dân
    if(q.includes("tiep cong dan")){
      addMessage(`
        <b>📅 Lịch tiếp công dân</b><br><br>
        ${DATA.citizen_reception.day}<br>
        🕗 ${DATA.citizen_reception.time}<br>
        📍 ${DATA.citizen_reception.location}
      `);
      return;
    }

    // Thủ tục hành chính
    const procedure = detectProcedure(question);

    if(procedure && DATA.procedures[procedure]){
      addMessage(renderProcedure(procedure));
      return;
    }

    // Mặc định
    addMessage(`
      👋 <b>Xin chào bà con!</b><br><br>

      Tôi có thể hỗ trợ:

      • Tra cứu thủ tục hành chính<br>
      • Thành phần hồ sơ<br>
      • Lệ phí và thời hạn giải quyết<br>
      • Cán bộ phụ trách từng lĩnh vực<br>
      • Giờ làm việc<br>
      • Lịch tiếp công dân
    `);

  }

  // ==========================
  // GỬI TIN NHẮN
  // ==========================
  function send(){

    const txt = aiInput.value.trim();

    if(!txt) return;

    addMessage(txt, true);

    aiInput.value = "";

    reply(txt);
  }

  aiSend.onclick = send;

  aiInput.addEventListener("keydown", e => {
    if(e.key === "Enter") send();
  });

  // Chip gợi ý
  document.querySelectorAll(".ai-chip").forEach(chip=>{
    chip.onclick = ()=>{
      aiInput.value = chip.innerText;
      send();
    };
  });

});
