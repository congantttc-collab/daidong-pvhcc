/* ==========================================================
   TRỢ LÝ AI PVHCC XÃ ĐẠI ĐỒNG
   AI 5.0 PRO - MODULE 4
   - Hiểu ngôn ngữ tự nhiên
   - Hội thoại nhiều bước
   - Tự chọn cán bộ phụ trách
   - Mở đúng Cổng DVC Quốc gia
   - Gợi ý hồ sơ, lệ phí, thời hạn (nếu có)
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
  let CONTEXT = null;

  // =========================
  // ĐỌC DỮ LIỆU
  // =========================
  Promise.all([
    fetch("./data/ai_local.json?v=70").then(r=>r.json()),
    fetch("./data/ai_intents.json?v=70").then(r=>r.json())
  ])
  .then(([local,intents])=>{
      DATA = local;
      INTENTS = intents;
      READY = true;
      console.log("AI 5.0 PRO MODULE 4 READY");
  })
  .catch(err=>console.error(err));

  // =========================
  // GIAO DIỆN
  // =========================
  aiToggle.onclick = ()=> aiChat.classList.add("active");
  aiClose.onclick  = ()=> aiChat.classList.remove("active");

  function addMessage(html, me=false){

      const div=document.createElement("div");
      div.className= me ? "ai-message user":"ai-message bot";
      div.innerHTML=html;

      aiBody.appendChild(div);
      aiBody.scrollTop=aiBody.scrollHeight;
  }

  function normalize(str){
      return str.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g,"")
          .replace(/đ/g,"d");
  }

  function dvc(keyword){
      return "https://dichvucong.gov.vn/p/home/dvc-tthc-category.html?keyword="
      + encodeURIComponent(keyword);
  }

  // =========================
  // NHẬN DIỆN Ý ĐỊNH
  // =========================
  function detect(text){

      const q=normalize(text);

      let best=null;
      let score=0;

      Object.entries(INTENTS).forEach(([id,obj])=>{

          let s=0;

          obj.keywords.forEach(k=>{
              if(q.includes(normalize(k))) s+=k.length;
          });

          if(s>score){
              score=s;
              best=id;
          }

      });

      return best;
  }

  // =========================
  // CÁN BỘ
  // =========================
  function officers(field){

      if(!DATA.officers) return [];

      return DATA.officers.filter(o=>
          normalize(o.field).includes(normalize(field))
      );

  }

  // =========================
  // THẺ CÁN BỘ
  // =========================
  function renderOfficer(field){

      const list=officers(field);

      if(!list.length) return "";

      let html=`<div class="ai-title">👨‍💼 Cán bộ phụ trách</div>`;

      list.forEach(o=>{

          html+=`
          <div class="ai-card">
            <b>${o.name}</b><br>
            ${o.position}<br>
            📋 ${o.field}<br>
            ☎ <a href="tel:${o.phone}">${o.phone}</a>
          </div>`;

      });

      return html;

  }

  // =========================
  // THỦ TỤC
  // =========================
  function renderProcedure(id){

      const info=INTENTS[id];
      const p=DATA.procedures?.[id];

      let html=`<div class="ai-head">📌 ${info.search}</div>`;

      if(p){

          html+=`
          <div class="ai-info">
          💰 <b>Lệ phí:</b> ${p.fee}<br>
          ⏱ <b>Thời hạn:</b> ${p.time}<br>
          🌐 <b>DVC:</b> ${p.level}
          </div>

          <div class="ai-title">📄 Hồ sơ cần chuẩn bị</div>
          <ul>`;

          p.documents.forEach(i=>{
              html+=`<li>${i}</li>`;
          });

          html+=`</ul>`;
      }

      html+=renderOfficer(info.field);

      html+=`
      <a class="ai-link-btn"
         target="_blank"
         href="${dvc(info.search)}">
         🔗 TRA CỨU TRÊN CỔNG DVC QUỐC GIA
      </a>`;

      return html;
  }

  // =========================
  // HỘI THOẠI NHIỀU BƯỚC
  // =========================
  function contextReply(text){

      const q=normalize(text);

      // ĐẤT ĐAI
      if(CONTEXT==="dat"){

          CONTEXT=null;

          if(q.includes("tach")) return renderProcedure("tach thua");
          if(q.includes("sang") || q.includes("chuyen")) return renderProcedure("chuyen nhuong");
          if(q.includes("cap")) return renderProcedure("cap so");

          return `
          Bà con vui lòng chọn:

          • Tách thửa

          • Sang tên

          • Cấp sổ
          `;
      }

      // HỘ KINH DOANH
      if(CONTEXT==="hkd"){

          CONTEXT=null;

          if(q.includes("dang")) return renderProcedure("hộ kinh doanh");
          if(q.includes("tam")) return renderProcedure("tam ngung kinh doanh");
          if(q.includes("cham")) return renderProcedure("cham dut kinh doanh");

          return `
          Bà con chọn:

          • Đăng ký

          • Tạm ngừng

          • Chấm dứt
          `;
      }

      // BẢO TRỢ
      if(CONTEXT==="baotro"){

          CONTEXT=null;

          return renderProcedure("bảo trợ xã hội");
      }

      return null;
  }

  // =========================
  // AI TRẢ LỜI
  // =========================
  function reply(question){

      if(!READY){
          addMessage("⏳ Hệ thống đang khởi tạo dữ liệu...");
          return;
      }

      if(CONTEXT){

          const html=contextReply(question);

          if(html){
              addMessage(html);
              return;
          }

      }

      const q=normalize(question);

      // THÔNG TIN CHUNG
      if(q.includes("gio lam")){

          addMessage(`
          <b>🕒 Giờ làm việc</b><br><br>
          ${DATA.center.working_hours}
          `);

          return;
      }

      if(q.includes("dien thoai") || q.includes("lien he")){

          addMessage(`
          <b>☎ Liên hệ Trung tâm</b><br><br>
          ${DATA.center.phone}
          `);

          return;
      }

      if(q.includes("dia chi")){

          addMessage(`
          <b>📍 Địa chỉ</b><br><br>
          ${DATA.center.address}
          `);

          return;
      }

      if(q.includes("tiep cong dan")){

          addMessage(`
          <b>📅 Lịch tiếp công dân</b><br><br>
          ${DATA.citizen_reception.day}<br>
          🕗 ${DATA.citizen_reception.time}<br>
          📍 ${DATA.citizen_reception.location}
          `);

          return;
      }

      // ===== CHUYÊN VIÊN MỘT CỬA =====

      if(q.includes("so do") || q.includes("dat")){

          CONTEXT="dat";

          addMessage(`
          🏡 Để hướng dẫn chính xác, bà con muốn:

          • Tách thửa

          • Sang tên / Chuyển nhượng

          • Cấp sổ lần đầu

          Chỉ cần trả lời một lựa chọn.
          `);

          return;
      }

      if(q.includes("kinh doanh") || q.includes("mo quan")){

          CONTEXT="hkd";

          addMessage(`
          🏪 Bà con cần:

          • Đăng ký hộ kinh doanh

          • Tạm ngừng

          • Chấm dứt

          Trả lời một lựa chọn.
          `);

          return;
      }

      if(q.includes("tro cap") || q.includes("nguoi gia") || q.includes("khuyet tat")){

          CONTEXT="baotro";

          addMessage(`
          ❤️ Bà con thuộc nhóm nào?

          • Người cao tuổi

          • Người khuyết tật

          • Hộ nghèo / Cận nghèo
          `);

          return;
      }

      // NHẬN DIỆN NHANH
      const id=detect(question);

      if(id){

          addMessage(renderProcedure(id));
          return;
      }

      // MẶC ĐỊNH
      addMessage(`
      <b>🔎 Tôi chưa xác định chính xác thủ tục.</b><br><br>

      Tôi sẽ chuyển bà con sang Cổng Dịch vụ công Quốc gia với đúng nội dung vừa hỏi.

      <a class="ai-link-btn"
         target="_blank"
         href="${dvc(question)}">
         🔗 TRA CỨU TRÊN CỔNG DVC QUỐC GIA
      </a>
      `);

  }

  // =========================
  // GỬI
  // =========================
  function send(){

      const txt=aiInput.value.trim();

      if(!txt) return;

      addMessage(txt,true);

      aiInput.value="";

      reply(txt);
  }

  aiSend.onclick=send;

  aiInput.addEventListener("keydown",e=>{
      if(e.key==="Enter") send();
  });

  document.querySelectorAll(".ai-chip").forEach(c=>{
      c.onclick=()=>{
          aiInput.value=c.innerText;
          send();
      };
  });

});
