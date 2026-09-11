
/* ==========================================================
   TRỢ LÝ AI PVHCC XÃ ĐẠI ĐỒNG
   AI 5.0 PRO - MODULE 2
   - Hiểu ngôn ngữ tự nhiên
   - Hội thoại nhiều bước
   - Hỏi lại khi thiếu thông tin
   - Mở đúng Cổng DVC Quốc gia
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

  // Bộ nhớ hội thoại 1 lượt
  let CONTEXT = null;

  // ===============================
  // ĐỌC DỮ LIỆU
  // ===============================
  Promise.all([
    fetch("./data/ai_local.json?v=52").then(r=>r.json()),
    fetch("./data/ai_intents.json?v=52").then(r=>r.json())
  ])
  .then(([local,intents])=>{
      DATA = local;
      INTENTS = intents;
      READY = true;
      console.log("AI 5.0 PRO READY");
  })
  .catch(err=>console.error("AI ERROR:",err));

  // ===============================
  // MỞ / ĐÓNG CHAT
  // ===============================
  if(aiToggle) aiToggle.onclick=()=>aiChat.classList.add("active");
  if(aiClose) aiClose.onclick=()=>aiChat.classList.remove("active");

  // ===============================
  // HIỂN THỊ TIN NHẮN
  // ===============================
  function addMessage(html,me=false){

      const div=document.createElement("div");
      div.className=me?"ai-message user":"ai-message bot";
      div.innerHTML=html;

      aiBody.appendChild(div);
      aiBody.scrollTop=aiBody.scrollHeight;
  }

  // ===============================
  // CHUẨN HÓA TIẾNG VIỆT
  // ===============================
  function normalize(str){

      return str.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g,"")
          .replace(/đ/g,"d");

  }

  // ===============================
  // LINK CỔNG DVC QUỐC GIA
  // ===============================
  function createDVCSearchUrl(keyword){

      return "https://dichvucong.gov.vn/p/home/dvc-tthc-category.html?keyword="
          + encodeURIComponent(keyword);

  }

  // ===============================
  // HIỂU Ý ĐỊNH
  // ===============================
  function detectProcedure(question){

      const text=normalize(question);

      let best=null;
      let score=0;

      Object.entries(INTENTS).forEach(([id,obj])=>{

          let s=0;

          obj.keywords.forEach(k=>{

              if(text.includes(normalize(k))){
                  s+=k.length;
              }

          });

          if(s>score){
              score=s;
              best=id;
          }

      });

      return score>0?best:null;

  }

  // ===============================
  // TÌM CÁN BỘ
  // ===============================
  function findOfficers(procedure){

      const field=INTENTS[procedure]?.field;

      if(!field || !DATA.officers) return [];

      return DATA.officers.filter(o=>
          o.field.toLowerCase().includes(field.toLowerCase())
      );

  }

  // ===============================
  // KẾT QUẢ THỦ TỤC
  // ===============================
  function renderProcedure(procedure){

      const keyword=INTENTS[procedure].search;
      const url=createDVCSearchUrl(keyword);
      const officers=findOfficers(procedure);

      let html=`
      <div style="font-size:18px;font-weight:bold;color:#d70018">
        📌 ${keyword}
      </div>

      <div style="margin-top:8px">
        Đây là thủ tục chính thức trên <b>Cổng Dịch vụ công Quốc gia</b>.
      </div>
      `;

      if(officers.length){

          html+=`<div style="margin-top:14px;font-weight:bold">
            👨‍💼 Cán bộ phụ trách
          </div>`;

          officers.forEach(o=>{

              html+=`
              <div style="margin-top:8px;padding:10px;border:1px solid #ececec;border-radius:10px;background:#fafafa">
                <b>${o.name}</b><br>
                ${o.position}<br>
                📋 ${o.field}<br>
                ☎ <a href="tel:${o.phone}" style="color:#d70018;text-decoration:none">${o.phone}</a>
              </div>`;

          });

      }

      html+=`
      <a href="${url}" target="_blank"
         class="ai-link-btn"
         style="display:block;text-align:center;margin-top:14px">
         🔗 TRA CỨU TRÊN CỔNG DVC QUỐC GIA
      </a>`;

      return html;

  }

  // ===============================
  // TRẢ LỜI
  // ===============================
  function reply(question){

      if(!READY){
          addMessage("⏳ Hệ thống đang tải dữ liệu, vui lòng thử lại sau vài giây.");
          return;
      }

      const q=normalize(question);

      // ==================================
      // HỘI THOẠI BƯỚC 2
      // ==================================

      if(CONTEXT==="datdai"){

          CONTEXT=null;

          let keyword="Thủ tục đất đai";

          if(q.includes("tach")) keyword="Tách thửa";
          else if(q.includes("sang ten") || q.includes("chuyen nhuong")) keyword="Đăng ký biến động đất đai";
          else if(q.includes("cap")) keyword="Cấp Giấy chứng nhận quyền sử dụng đất";

          const url=createDVCSearchUrl(keyword);

          addMessage(`
          <b>📌 Đã xác định thủ tục</b><br><br>
          ${keyword}

          <a href="${url}" target="_blank"
             class="ai-link-btn"
             style="display:block;text-align:center;margin-top:14px">
             🔗 TRA CỨU TRÊN CỔNG DVC QUỐC GIA
          </a>
          `);

          return;
      }

      if(CONTEXT==="hkd"){

          CONTEXT=null;

          let keyword="Đăng ký hộ kinh doanh";

          if(q.includes("tam")) keyword="Tạm ngừng hộ kinh doanh";
          else if(q.includes("cham dut")) keyword="Chấm dứt hộ kinh doanh";

          const url=createDVCSearchUrl(keyword);

          addMessage(`
          <b>📌 Đã xác định thủ tục</b><br><br>
          ${keyword}

          <a href="${url}" target="_blank"
             class="ai-link-btn"
             style="display:block;text-align:center;margin-top:14px">
             🔗 TRA CỨU TRÊN CỔNG DVC QUỐC GIA
          </a>
          `);

          return;
      }

      // ==================================
      // THÔNG TIN CHUNG
      // ==================================

      if(q.includes("gio lam") || q.includes("lam viec")){

          addMessage(`
          <b>🕒 Giờ làm việc</b><br><br>
          ${DATA.center.working_hours}
          `);

          return;
      }

      if(q.includes("dien thoai") || q.includes("lien he")){

          addMessage(`
          <b>☎ Đường dây nóng</b><br><br>
          ${DATA.center.phone}
          `);

          return;
      }

      if(q.includes("dia chi") || q.includes("o dau")){

          addMessage(`
          <b>📍 Địa chỉ Trung tâm</b><br><br>
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

      // ==================================
      // HỎI LẠI THÔNG MINH
      // ==================================

      if(q.includes("so do") || q.includes("dat")){

          CONTEXT="datdai";

          addMessage(`
          🏡 Bà con muốn thực hiện nội dung nào?

          • Tách thửa

          • Sang tên / Chuyển nhượng

          • Cấp sổ lần đầu

          Chỉ cần trả lời một lựa chọn.
          `);

          return;
      }

      if(q.includes("kinh doanh") || q.includes("mo quan") || q.includes("cua hang")){

          CONTEXT="hkd";

          addMessage(`
          🏪 Bà con muốn thực hiện nội dung nào?

          • Đăng ký hộ kinh doanh

          • Tạm ngừng kinh doanh

          • Chấm dứt hộ kinh doanh

          Chỉ cần trả lời một lựa chọn.
          `);

          return;
      }

      // ==================================
      // NHẬN DIỆN THỦ TỤC
      // ==================================

      const procedure=detectProcedure(question);

      if(procedure){

          addMessage(renderProcedure(procedure));
          return;
      }

      // ==================================
      // KHÔNG HIỂU -> MỞ DVC
      // ==================================

      const url=createDVCSearchUrl(question);

      addMessage(`
      <b>🔎 Tôi chưa xác định chính xác tên thủ tục.</b><br><br>

      Tôi sẽ mở Cổng Dịch vụ công Quốc gia với đúng nội dung bà con vừa hỏi.

      <a href="${url}" target="_blank"
         class="ai-link-btn"
         style="display:block;text-align:center;margin-top:14px">
         🔗 TRA CỨU TRÊN CỔNG DVC QUỐC GIA
      </a>
      `);

  }

  // ===============================
  // GỬI
  // ===============================
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

  // ===============================
  // CHIP GỢI Ý
  // ===============================
  document.querySelectorAll(".ai-chip").forEach(chip=>{

      chip.onclick=()=>{

          aiInput.value=chip.innerText;

          send();

      };

  });

});
