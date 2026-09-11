/* ==========================================================
   TRỢ LÝ AI PVHCC XÃ ĐẠI ĐỒNG
   AI 5.0 PRO - MODULE 5
   Chuyên viên tiếp nhận hồ sơ
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const aiChat = document.getElementById("ai-chat");
  const aiToggle = document.getElementById("ai-toggle");
  const aiClose = document.getElementById("ai-close");
  const aiBody = document.getElementById("ai-body");
  const aiInput = document.getElementById("ai-input");
  const aiSend = document.getElementById("ai-send");

  let DATA = {};
  let INTENTS = {};
  let READY = false;

  // Bộ nhớ hội thoại
  let CONTEXT = null;

  // ======================================
  // ĐỌC DỮ LIỆU
  // ======================================
  Promise.all([
    fetch("./data/ai_local.json?v=80").then(r => r.json()),
    fetch("./data/ai_intents.json?v=80").then(r => r.json())
  ])
  .then(([local,intents])=>{
      DATA = local;
      INTENTS = intents;
      READY = true;
      console.log("AI 5.0 MODULE 5 READY");
  })
  .catch(err=>console.error(err));

  // ======================================
  // MỞ / ĐÓNG
  // ======================================
  aiToggle.onclick = ()=> aiChat.classList.add("active");
  aiClose.onclick = ()=> aiChat.classList.remove("active");

  // ======================================
  // HIỂN THỊ
  // ======================================
  function addMessage(html, me=false){

      const div=document.createElement("div");
      div.className = me ? "ai-message user":"ai-message bot";
      div.innerHTML = html;

      aiBody.appendChild(div);
      aiBody.scrollTop = aiBody.scrollHeight;
  }

  // ======================================
  // CHUẨN HÓA
  // ======================================
  function normalize(str){

      return str.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g,"")
      .replace(/đ/g,"d");

  }

  // ======================================
  // LINK DVC
  // ======================================
  function dvc(keyword){

      return "https://dichvucong.gov.vn/p/home/dvc-tthc-category.html?keyword="
      + encodeURIComponent(keyword);

  }

  // ======================================
  // TÌM Ý ĐỊNH
  // ======================================
  function detect(question){

      const q=normalize(question);

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

  // ======================================
  // TÌM CÁN BỘ
  // ======================================
  function officers(field){

      if(!DATA.officers) return [];

      return DATA.officers.filter(o=>
          normalize(o.field).includes(normalize(field))
      );

  }

  // ======================================
  // HIỂN THỊ CÁN BỘ
  // ======================================
  function renderOfficer(field){

      const list=officers(field);

      if(!list.length) return "";

      let html=`<div style="margin-top:14px"><b>👨‍💼 Cán bộ phụ trách</b></div>`;

      list.forEach(o=>{

          html+=`
          <div style="margin-top:8px;padding:10px;border:1px solid #eee;border-radius:10px;background:#fafafa">
              <b>${o.name}</b><br>
              ${o.position}<br>
              📋 ${o.field}<br>
              ☎ <a href="tel:${o.phone}">${o.phone}</a>
          </div>`;

      });

      return html;

  }

  // ======================================
  // HIỂN THỊ THỦ TỤC
  // ======================================
  function renderProcedure(id){

      const info=INTENTS[id];

      if(!info){

          return `
          Tôi sẽ chuyển bà con sang Cổng Dịch vụ công Quốc gia.

          <a class="ai-link-btn" target="_blank" href="${dvc(id)}">
          🔗 TRA CỨU THỦ TỤC
          </a>
          `;

      }

      const p=DATA.procedures?.[id];

      let html=`
      <div style="font-size:18px;font-weight:bold;color:#d70018">
      📌 ${info.search}
      </div>
      `;

      if(p){

          html+=`
          <div style="margin-top:10px;line-height:1.8">
          💰 <b>Lệ phí:</b> ${p.fee}<br>
          ⏱ <b>Thời hạn:</b> ${p.time}<br>
          🌐 <b>DVC:</b> ${p.level}
          </div>

          <div style="margin-top:10px"><b>📄 Hồ sơ cần chuẩn bị</b></div>
          <ul style="padding-left:20px">
          `;

          p.documents.forEach(i=>{
              html+=`<li>${i}</li>`;
          });

          html+=`</ul>`;

      }

      html+=renderOfficer(info.field);

      html+=`
      <a class="ai-link-btn"
         target="_blank"
         href="${dvc(info.search)}"
         style="display:block;text-align:center;margin-top:14px">
      🔗 MỞ TRÊN CỔNG DVC QUỐC GIA
      </a>
      `;

      return html;

  }

  // ======================================
  // HỘI THOẠI NHIỀU BƯỚC
  // ======================================
  function handleContext(text){

      const q=normalize(text);

      // -------- ĐẤT ĐAI --------
      if(CONTEXT==="land"){

          CONTEXT=null;

          if(q.includes("tach"))
              return renderProcedure("tach thua");

          if(q.includes("sang")||q.includes("chuyen"))
              return renderProcedure("chuyen nhuong");

          if(q.includes("cap"))
              return renderProcedure("cap so");

          return `
          Bà con vui lòng chọn:

          • Tách thửa

          • Sang tên

          • Cấp sổ lần đầu
          `;

      }

      // -------- HỘ KINH DOANH --------
      if(CONTEXT==="business"){

          CONTEXT=null;

          if(q.includes("dang"))
              return renderProcedure("hộ kinh doanh");

          if(q.includes("tam"))
              return renderProcedure("tam ngung kinh doanh");

          if(q.includes("cham"))
              return renderProcedure("cham dut kinh doanh");

          return `
          Bà con chọn:

          • Đăng ký

          • Tạm ngừng

          • Chấm dứt
          `;

      }

      // -------- HỘ TỊCH --------
      if(CONTEXT==="civil"){

          CONTEXT=null;

          if(q.includes("khai sinh")) return renderProcedure("khai sinh");
          if(q.includes("khai tu")) return renderProcedure("khai tử");
          if(q.includes("ket hon")) return renderProcedure("kết hôn");
          if(q.includes("doc than")) return renderProcedure("doc than");

          return `
          Bà con chọn:

          • Khai sinh

          • Khai tử

          • Kết hôn

          • Độc thân
          `;

      }

      // -------- BẢO TRỢ --------
      if(CONTEXT==="social"){

          CONTEXT=null;

          return renderProcedure("bảo trợ xã hội");

      }

      return null;

  }

  // ======================================
  // AI CHUYÊN VIÊN
  // ======================================
  function reply(question){

      if(!READY){

          addMessage("⏳ Hệ thống đang khởi tạo dữ liệu...");

          return;

      }

      if(CONTEXT){

          const html=handleContext(question);

          if(html){

              addMessage(html);

              return;

          }

      }

      const q=normalize(question);

      // ===== THÔNG TIN CHUNG =====

      if(q.includes("gio lam")){

          addMessage(`<b>🕒 Giờ làm việc</b><br><br>${DATA.center.working_hours}`);

          return;

      }

      if(q.includes("dien thoai")||q.includes("lien he")){

          addMessage(`<b>☎ Điện thoại</b><br><br>${DATA.center.phone}`);

          return;

      }

      if(q.includes("dia chi")){

          addMessage(`<b>📍 Địa chỉ</b><br><br>${DATA.center.address}`);

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

      // ===== CHUYÊN VIÊN TIẾP NHẬN =====

      if(q.includes("dat")||q.includes("so do")||q.includes("so hong")){

          CONTEXT="land";

          addMessage(`
          🏡 Để xác định đúng thủ tục đất đai, bà con muốn:

          • Tách thửa

          • Sang tên / Chuyển nhượng

          • Cấp sổ lần đầu

          Trả lời một lựa chọn.
          `);

          return;

      }

      if(q.includes("kinh doanh")||q.includes("mo quan")||q.includes("cua hang")){

          CONTEXT="business";

          addMessage(`
          🏪 Bà con cần thực hiện:

          • Đăng ký hộ kinh doanh

          • Tạm ngừng

          • Chấm dứt

          Trả lời một lựa chọn.
          `);

          return;

      }

      if(
          q.includes("ho tich")||
          q.includes("khai sinh")||
          q.includes("ket hon")||
          q.includes("doc than")
      ){

          CONTEXT="civil";

          addMessage(`
          📑 Lĩnh vực Hộ tịch gồm:

          • Khai sinh

          • Khai tử

          • Kết hôn

          • Xác nhận độc thân

          Bà con chọn nội dung cần thực hiện.
          `);

          return;

      }

      if(q.includes("tro cap")||q.includes("khuyet tat")||q.includes("nguoi gia")){

          CONTEXT="social";

          addMessage(`
          ❤️ Bà con thuộc nhóm nào?

          • Người cao tuổi

          • Người khuyết tật

          • Hộ nghèo / Cận nghèo

          Trả lời một lựa chọn.
          `);

          return;

      }

      // ===== NHẬN DIỆN NHANH =====

      const id=detect(question);

      if(id){

          addMessage(renderProcedure(id));

          return;

      }

      // ===== MẶC ĐỊNH =====

      addMessage(`
      <b>🔎 Tôi chưa xác định chính xác tên thủ tục.</b><br><br>

      Tôi sẽ chuyển bà con sang Cổng Dịch vụ công Quốc gia với đúng nội dung vừa hỏi.

      <a class="ai-link-btn"
         target="_blank"
         href="${dvc(question)}"
         style="display:block;text-align:center;margin-top:14px">
      🔗 TRA CỨU TRÊN CỔNG DVC QUỐC GIA
      </a>
      `);

  }

  // ======================================
  // GỬI TIN
  // ======================================
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
