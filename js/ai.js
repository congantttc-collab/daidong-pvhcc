/* ==========================================================
   TRỢ LÝ AI PVHCC XÃ ĐẠI ĐỒNG
   AI 5.0 PRO - MODULE 3
   AI CHUYÊN VIÊN MỘT CỬA
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

  // Bộ nhớ hội thoại
  let CONTEXT = null;

  // =========================================
  // ĐỌC DỮ LIỆU
  // =========================================
  Promise.all([
    fetch("./data/ai_local.json?v=60").then(r=>r.json()),
    fetch("./data/ai_intents.json?v=60").then(r=>r.json())
  ])
  .then(([local,intents])=>{
      DATA=local;
      INTENTS=intents;
      READY=true;
      console.log("AI 5.0 PRO MODULE 3 READY");
  })
  .catch(err=>console.error(err));

  // =========================================
  // GIAO DIỆN
  // =========================================
  if(aiToggle) aiToggle.onclick=()=>aiChat.classList.add("active");
  if(aiClose) aiClose.onclick=()=>aiChat.classList.remove("active");

  function addMessage(html,me=false){

      const div=document.createElement("div");
      div.className=me?"ai-message user":"ai-message bot";
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

  function createDVCSearchUrl(keyword){

      return "https://dichvucong.gov.vn/p/home/dvc-tthc-category.html?keyword="
          + encodeURIComponent(keyword);

  }

  // =========================================
  // HIỂU NGÔN NGỮ TỰ NHIÊN
  // =========================================
  function detectProcedure(question){

      const text=normalize(question);

      let best=null;
      let score=0;

      Object.entries(INTENTS).forEach(([id,obj])=>{

          let s=0;

          obj.keywords.forEach(k=>{
              if(text.includes(normalize(k))) s+=k.length;
          });

          if(s>score){
              score=s;
              best=id;
          }

      });

      return score>0?best:null;

  }

  // =========================================
  // TÌM CÁN BỘ
  // =========================================
  function findOfficers(field){

      if(!DATA.officers) return [];

      return DATA.officers.filter(o=>
          normalize(o.field).includes(normalize(field))
      );

  }

  // =========================================
  // HIỂN THỊ CÁN BỘ
  // =========================================
  function officerCard(field){

      const officers=findOfficers(field);

      if(!officers.length) return "";

      let html=`<div style="margin-top:12px"><b>👨‍💼 Cán bộ phụ trách</b></div>`;

      officers.forEach(o=>{

          html+=`
          <div style="margin-top:8px;padding:10px;border:1px solid #ececec;border-radius:10px;background:#fafafa">
            <b>${o.name}</b><br>
            ${o.position}<br>
            📋 ${o.field}<br>
            ☎ <a href="tel:${o.phone}" style="color:#d70018;text-decoration:none">${o.phone}</a>
          </div>`;

      });

      return html;

  }

  // =========================================
  // HIỂN THỊ THỦ TỤC
  // =========================================
  function renderProcedure(id){

      const item=INTENTS[id];

      const url=createDVCSearchUrl(item.search);

      let html=`
      <div style="font-size:18px;font-weight:bold;color:#d70018">
        📌 ${item.search}
      </div>

      <div style="margin-top:8px">
        Đây là thủ tục chính thức trên <b>Cổng Dịch vụ công Quốc gia</b>.
      </div>
      `;

      html+=officerCard(item.field);

      html+=`
      <a href="${url}" target="_blank" class="ai-link-btn"
      style="display:block;text-align:center;margin-top:14px">
      🔗 TRA CỨU TRÊN CỔNG DVC QUỐC GIA
      </a>`;

      return html;

  }

  // =========================================
  // HỘI THOẠI NHIỀU BƯỚC
  // =========================================
  function handleContext(answer){

      const q=normalize(answer);

      // ----- ĐẤT ĐAI -----
      if(CONTEXT==="dat"){

          CONTEXT=null;

          if(q.includes("tach"))
              return renderProcedure("tach thua");

          if(q.includes("sang") || q.includes("chuyen"))
              return renderProcedure("chuyen nhuong");

          if(q.includes("cap"))
              return renderProcedure("cap so");

          return `
          Tôi chưa hiểu lựa chọn.

          Bà con trả lời:

          • Tách thửa

          • Sang tên

          • Cấp sổ
          `;
      }

      // ----- HỘ KINH DOANH -----
      if(CONTEXT==="hkd"){

          CONTEXT=null;

          if(q.includes("dang"))
              return renderProcedure("hộ kinh doanh");

          if(q.includes("tam"))
              return renderProcedure("tam ngung kinh doanh");

          if(q.includes("cham"))
              return renderProcedure("cham dut kinh doanh");

          return `
          Bà con trả lời:

          • Đăng ký

          • Tạm ngừng

          • Chấm dứt
          `;
      }

      // ----- HỘ TỊCH -----
      if(CONTEXT==="hotich"){

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

          • Xác nhận độc thân
          `;
      }

      // ----- BẢO TRỢ -----
      if(CONTEXT==="baotro"){

          CONTEXT=null;

          if(q.includes("nguoi gia"))
              return renderProcedure("bảo trợ xã hội");

          if(q.includes("khuyet"))
              return renderProcedure("bảo trợ xã hội");

          if(q.includes("ngheo"))
              return renderProcedure("bảo trợ xã hội");

          return renderProcedure("bảo trợ xã hội");
      }

      return null;

  }

  // =========================================
  // AI TRẢ LỜI
  // =========================================
  function reply(question){

      if(!READY){
          addMessage("⏳ Hệ thống đang tải dữ liệu...");
          return;
      }

      // Có ngữ cảnh thì xử lý trước
      if(CONTEXT){

          const html=handleContext(question);

          if(html){
              addMessage(html);
              return;
          }

      }

      const q=normalize(question);

      // THÔNG TIN CHUNG
      if(q.includes("gio lam")){
          addMessage(`<b>🕒 Giờ làm việc</b><br><br>${DATA.center.working_hours}`);
          return;
      }

      if(q.includes("dien thoai") || q.includes("lien he")){
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
          📍 ${DATA.citizen_reception.location}`);
          return;
      }

      // ==============================
      // CHUYÊN VIÊN MỘT CỬA
      // ==============================

      // ĐẤT ĐAI
      if(
          q.includes("dat") ||
          q.includes("so do") ||
          q.includes("so hong")
      ){

          CONTEXT="dat";

          addMessage(`
          🏡 Bà con cần thực hiện nội dung nào?

          • Tách thửa

          • Sang tên / Chuyển nhượng

          • Cấp sổ lần đầu

          Trả lời đúng một lựa chọn.
          `);

          return;
      }

      // HỘ KINH DOANH
      if(
          q.includes("kinh doanh") ||
          q.includes("mo quan") ||
          q.includes("cua hang")
      ){

          CONTEXT="hkd";

          addMessage(`
          🏪 Bà con muốn thực hiện:

          • Đăng ký hộ kinh doanh

          • Tạm ngừng

          • Chấm dứt

          Trả lời một lựa chọn.
          `);

          return;
      }

      // HỘ TỊCH
      if(
          q.includes("ho tich") ||
          q.includes("khai sinh") ||
          q.includes("ket hon") ||
          q.includes("doc than")
      ){

          CONTEXT="hotich";

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

      // BẢO TRỢ
      if(
          q.includes("tro cap") ||
          q.includes("nguoi gia") ||
          q.includes("khuyet tat")
      ){

          CONTEXT="baotro";

          addMessage(`
          ❤️ Bà con thuộc nhóm nào?

          • Người cao tuổi

          • Người khuyết tật

          • Hộ nghèo / Cận nghèo

          Trả lời một lựa chọn.
          `);

          return;
      }

      // NHẬN DIỆN NHANH
      const id=detectProcedure(question);

      if(id){
          addMessage(renderProcedure(id));
          return;
      }

      // KHÔNG HIỂU
      const url=createDVCSearchUrl(question);

      addMessage(`
      Tôi chưa xác định chính xác thủ tục.

      Tôi sẽ mở Cổng Dịch vụ công Quốc gia với đúng nội dung bà con vừa hỏi.

      <a href="${url}" target="_blank"
      class="ai-link-btn"
      style="display:block;text-align:center;margin-top:14px">
      🔗 TRA CỨU TRÊN CỔNG DVC QUỐC GIA
      </a>
      `);

  }

  // =========================================
  // GỬI TIN
  // =========================================
  function send(){

      const txt=aiInput.value.trim();

      if(!txt) return;

      addMessage(txt,true);

      aiInput.value="";

      reply(txt);

  }

  if(aiSend) aiSend.onclick=send;

  if(aiInput){

      aiInput.addEventListener("keydown",e=>{
          if(e.key==="Enter") send();
      });

  }

  document.querySelectorAll(".ai-chip").forEach(chip=>{
      chip.onclick=()=>{
          aiInput.value=chip.innerText;
          send();
      };
  });

});
