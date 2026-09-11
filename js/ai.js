/* ==========================================================
   TRỢ LÝ AI PVHCC XÃ ĐẠI ĐỒNG
   AI 6.0 PRO
   PHẦN 1/4
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

const aiChat   = document.getElementById("ai-chat");
const aiToggle = document.getElementById("ai-toggle");
const aiClose  = document.getElementById("ai-close");
const aiBody   = document.getElementById("ai-body");
const aiInput  = document.getElementById("ai-input");
const aiSend   = document.getElementById("ai-send");

let DATA={};
let INTENTS={};
let FLOWS={};
let READY=false;

// Bộ nhớ hội thoại
let SESSION={
    flow:null,
    step:0,
    answers:{}
};

// ================================
// ĐỌC DỮ LIỆU
// ================================
Promise.all([
 fetch("./data/ai_local.json?v=600").then(r=>r.json()),
 fetch("./data/ai_intents.json?v=600").then(r=>r.json()),
 fetch("./data/ai_flows.json?v=600").then(r=>r.json())
])
.then(([local,intents,flows])=>{

 DATA=local;
 INTENTS=intents;
 FLOWS=flows;
 READY=true;

 console.log("AI 6.0 READY");

})
.catch(err=>console.error(err));

// ================================
// MỞ / ĐÓNG
// ================================
aiToggle.onclick=()=>aiChat.classList.add("active");
aiClose.onclick=()=>aiChat.classList.remove("active");

// ================================
// HIỂN THỊ
// ================================
function addMessage(html,me=false){

 const div=document.createElement("div");
 div.className=me?"ai-message user":"ai-message bot";
 div.innerHTML=html;

 aiBody.appendChild(div);
 aiBody.scrollTop=aiBody.scrollHeight;

}

// ================================
// CHUẨN HÓA
// ================================
function normalize(str){

 return str.toLowerCase()
 .normalize("NFD")
 .replace(/[\u0300-\u036f]/g,"")
 .replace(/đ/g,"d");

}

// ================================
// LINK DVCQG
// ================================
function dvc(keyword){

 return "https://dichvucong.gov.vn/p/home/dvc-tthc-category.html?keyword="
 + encodeURIComponent(keyword);

}

// ================================
// NHẬN DIỆN Ý ĐỊNH
// ================================
function detectIntent(text){

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

// ================================
// TÌM CÁN BỘ
// ================================
function getOfficers(field){

 if(!DATA.officers) return [];

 return DATA.officers.filter(o=>
    normalize(o.field).includes(normalize(field))
 );

}
   // ================================
// LẤY FLOW PHÙ HỢP
// ================================
function getFlow(intent){

    if(!FLOWS) return null;

    switch(intent){

        case "đất đai":
        case "tach thua":
        case "chuyen nhuong":
        case "cap so":
            return FLOWS.land;

        case "hộ kinh doanh":
        case "tam ngung kinh doanh":
        case "cham dut kinh doanh":
            return FLOWS.business;

        case "khai sinh":
        case "khai tử":
        case "kết hôn":
        case "doc than":
            return FLOWS.civil;

        case "bảo trợ xã hội":
        case "người có công":
            return FLOWS.social;

        case "xây dựng":
            return FLOWS.construction;

        case "an toàn thực phẩm":
            return FLOWS.food;

        case "giáo dục":
            return FLOWS.education;

        case "y tế":
            return FLOWS.health;

        case "hạ tầng số":
            return FLOWS.digital;

        case "văn thư":
            return FLOWS.office;

        default:
            return null;

    }

}

// ================================
// BẮT ĐẦU HỘI THOẠI
// ================================
function startFlow(flow){

    SESSION.flow=flow;
    SESSION.step=0;
    SESSION.answers={};

    askStep();

}

// ================================
// HỎI TỪNG BƯỚC
// ================================
function askStep(){

    const flow=SESSION.flow;

    const step=flow.steps[SESSION.step];

    if(!step){

        finishFlow();

        return;

    }

    let html=`
    <div style="font-weight:bold;color:#d70018;margin-bottom:8px">
    ${flow.title}
    </div>

    ${step.question}

    <div style="margin-top:10px">
    `;

    step.options.forEach(opt=>{

        html+=`
        <div style="
        padding:8px 10px;
        margin:6px 0;
        border:1px solid #e5e5e5;
        border-radius:8px;
        background:#fafafa;">
        • ${opt}
        </div>
        `;

    });

    html+=`
    </div>

    <div style="margin-top:8px;font-size:13px;color:#666">
    Trả lời đúng một lựa chọn ở trên.
    </div>
    `;

    addMessage(html);

}

// ================================
// XỬ LÝ CÂU TRẢ LỜI
// ================================
function nextStep(answer){

    const flow=SESSION.flow;

    const step=flow.steps[SESSION.step];

    SESSION.answers[step.id]=answer;

    SESSION.step++;

    if(SESSION.step>=flow.steps.length){

        finishFlow();

    }else{

        askStep();

    }

}
   // ================================
// TẠO PHIẾU HƯỚNG DẪN HỒ SƠ
// ================================
function finishFlow(){

    const flow=SESSION.flow;
    const ans=SESSION.answers;

    let keyword=flow.title;

    // ===== ĐẤT ĐAI =====
    if(flow.title==="Thủ tục đất đai"){

        const action=normalize(ans.action||"");

        if(action.includes("tach"))
            keyword="Tách thửa";

        else if(action.includes("sang"))
            keyword="Đăng ký biến động đất đai";

        else if(action.includes("cho tang"))
            keyword="Đăng ký biến động do cho tặng quyền sử dụng đất";

        else if(action.includes("thua ke"))
            keyword="Đăng ký biến động do thừa kế quyền sử dụng đất";

        else
            keyword="Cấp Giấy chứng nhận quyền sử dụng đất";

    }

    // ===== HỘ KINH DOANH =====
    if(flow.title==="Hộ kinh doanh"){

        const t=normalize(ans.type||"");

        if(t.includes("tam"))
            keyword="Tạm ngừng hộ kinh doanh";

        else if(t.includes("cham"))
            keyword="Chấm dứt hộ kinh doanh";

        else
            keyword="Đăng ký hộ kinh doanh";

    }

    // ===== HỘ TỊCH =====
    if(flow.title==="Hộ tịch"){

        const t=normalize(ans.type||"");

        if(t.includes("khai sinh"))
            keyword="Đăng ký khai sinh";

        else if(t.includes("khai tu"))
            keyword="Đăng ký khai tử";

        else if(t.includes("ket hon"))
            keyword="Đăng ký kết hôn";

        else
            keyword="Xác nhận tình trạng hôn nhân";

    }

    // ===== BẢO TRỢ =====
    if(flow.title==="Bảo trợ xã hội"){

        keyword="Giải quyết trợ cấp bảo trợ xã hội";

    }

    const officers=getOfficers(flow.field);

    let html=`
    <div style="
      background:#fff8e8;
      border:1px solid #f5d27a;
      border-radius:12px;
      padding:14px;
      margin-bottom:10px">

      <div style="
        font-size:18px;
        font-weight:bold;
        color:#c62828;
        margin-bottom:8px">
        📋 PHIẾU HƯỚNG DẪN HỒ SƠ
      </div>

      <b>Thủ tục:</b><br>
      ${keyword}
    </div>
    `;

    // ===== THÔNG TIN NGƯỜI DÂN ĐÃ TRẢ LỜI =====
    html+=`
    <div style="margin-top:8px">
    <b>📝 Thông tin đã xác nhận</b>
    </div>
    `;

    Object.entries(ans).forEach(([k,v])=>{

        html+=`
        <div style="margin-top:4px">
        • ${v}
        </div>
        `;

    });

    // ===== HỒ SƠ =====
    const proc=Object.values(DATA.procedures||{}).find(p=>
        normalize(p.name).includes(normalize(keyword))
    );

    if(proc){

        html+=`
        <div style="margin-top:12px">
        <b>📄 Hồ sơ cần chuẩn bị</b>
        </div>
        <ul style="padding-left:20px;margin-top:6px">
        `;

        proc.documents.forEach(i=>{
            html+=`<li>${i}</li>`;
        });

        html+=`</ul>`;

        html+=`
        <div style="margin-top:10px;line-height:1.8">
        💰 <b>Lệ phí:</b> ${proc.fee}<br>
        ⏱ <b>Thời hạn:</b> ${proc.time}<br>
        🌐 <b>DVC:</b> ${proc.level}
        </div>
        `;

    }

    // ===== CÁN BỘ =====
    if(officers.length){

        html+=`
        <div style="margin-top:14px">
        <b>👨‍💼 Cán bộ phụ trách</b>
        </div>
        `;

        officers.forEach(o=>{

            html+=`
            <div style="
              margin-top:8px;
              padding:10px;
              border:1px solid #ececec;
              border-radius:10px;
              background:#fafafa">

              <b>${o.name}</b><br>
              ${o.position}<br>
              📋 ${o.field}<br>
              ☎ <a href="tel:${o.phone}" style="color:#d70018;text-decoration:none">${o.phone}</a>
            </div>
            `;

        });

    }

    html+=`
    <a href="${dvc(keyword)}"
       target="_blank"
       class="ai-link-btn"
       style="
       display:block;
       text-align:center;
       margin-top:16px">

       🔗 MỞ TRÊN CỔNG DVC QUỐC GIA
    </a>
    `;

    addMessage(html);

    SESSION.flow=null;
    SESSION.step=0;
    SESSION.answers={};

}
   // ================================
// AI TRẢ LỜI CHÍNH
// ================================
function reply(question){

    if(!READY){
        addMessage("⏳ Hệ thống đang khởi tạo dữ liệu, vui lòng thử lại sau vài giây.");
        return;
    }

    // Nếu đang trong hội thoại nhiều bước
    if(SESSION.flow){
        nextStep(question);
        return;
    }

    const q = normalize(question);

    // ===== THÔNG TIN CHUNG =====

    if(q.includes("gio lam") || q.includes("lam viec")){
        addMessage(`
        <b>🕒 Giờ làm việc</b><br><br>
        ${DATA.center.working_hours}
        `);
        return;
    }

    if(q.includes("dien thoai") || q.includes("lien he")){
        addMessage(`
        <b>☎ Điện thoại Trung tâm</b><br><br>
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

    // ===== NHẬN DIỆN Ý ĐỊNH =====

    const intent = detectIntent(question);

    if(intent){

        const flow = getFlow(intent);

        if(flow){
            startFlow(flow);
            return;
        }

        addMessage(renderProcedure(intent));
        return;
    }

    // ===== KHÔNG NHẬN DIỆN =====

    addMessage(`
    <b>🔎 Tôi chưa xác định chính xác thủ tục.</b><br><br>

    Tôi sẽ chuyển bà con sang Cổng Dịch vụ công Quốc gia với đúng nội dung vừa hỏi.

    <a href="${dvc(question)}"
       target="_blank"
       class="ai-link-btn"
       style="display:block;text-align:center;margin-top:14px">
       🔗 TRA CỨU TRÊN CỔNG DVC QUỐC GIA
    </a>
    `);

}

// ================================
// GỬI TIN NHẮN
// ================================
function send(){

    const txt = aiInput.value.trim();

    if(!txt) return;

    addMessage(txt,true);

    aiInput.value = "";

    reply(txt);

}

aiSend.onclick = send;

aiInput.addEventListener("keydown",e=>{

    if(e.key==="Enter") send();

});

// ================================
// CHIP GỢI Ý
// ================================
document.querySelectorAll(".ai-chip").forEach(chip=>{

    chip.onclick = ()=>{

        aiInput.value = chip.innerText;

        send();

    };

});

// ===== KẾT THÚC FILE =====
});
