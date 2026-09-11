// ======================================================
// TRỢ LÝ AI PVHCC XÃ ĐẠI ĐỒNG - AI 4.0 PRO
// Tác giả: ChatGPT
// Hoạt động trực tiếp với Cổng DVC Quốc gia
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    const aiChat   = document.getElementById("ai-chat");
    const aiToggle = document.getElementById("ai-toggle");
    const aiClose  = document.getElementById("ai-close");
    const aiBody   = document.getElementById("ai-body");
    const aiInput  = document.getElementById("ai-input");
    const aiSend   = document.getElementById("ai-send");

    let DATA = {};
    let READY = false;

    // ==================================================
    // ĐỌC DỮ LIỆU JSON
    // ==================================================

    fetch("./data/ai_local.json?v=40")
        .then(r => r.json())
        .then(json => {
            DATA = json;
            READY = true;
            console.log("AI 4.0 PRO READY");
        })
        .catch(err => {
            console.error("AI ERROR:", err);
        });

    // ==================================================
    // MỞ / ĐÓNG CHAT
    // ==================================================

    if(aiToggle){
        aiToggle.onclick = () => aiChat.classList.add("active");
    }

    if(aiClose){
        aiClose.onclick = () => aiChat.classList.remove("active");
    }

    // ==================================================
    // HIỂN THỊ TIN NHẮN
    // ==================================================

    function addMessage(html, me=false){

        const div = document.createElement("div");
        div.className = me ? "ai-message user" : "ai-message bot";
        div.innerHTML = html;

        aiBody.appendChild(div);
        aiBody.scrollTop = aiBody.scrollHeight;
    }

    // ==================================================
    // CHUẨN HÓA TIẾNG VIỆT
    // ==================================================

    function normalize(str){

        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g,"")
            .replace(/đ/g,"d");
    }

    // ==================================================
    // LINK TÌM KIẾM CỔNG DVC QUỐC GIA
    // ==================================================

    function createDVCSearchUrl(keyword){

        return "https://dichvucong.gov.vn/p/home/dvc-tthc-category.html?keyword="
            + encodeURIComponent(keyword);
    }

    // ==================================================
    // NHẬN DIỆN THỦ TỤC
    // ==================================================

    function detectProcedure(question){

        if(!DATA.intents) return null;

        const q = normalize(question);

        let best = null;
        let score = 0;

        Object.entries(DATA.intents).forEach(([name,obj])=>{

            let point = 0;

            obj.keywords.forEach(k=>{

                if(q.includes(normalize(k))){
                    point += k.length;
                }

            });

            if(point > score){
                score = point;
                best = name;
            }

        });

        return best;
    }

    // ==================================================
    // TÌM CÁN BỘ
    // ==================================================

    function findOfficers(procedure){

        if(!DATA.intents || !DATA.officers) return [];

        const field = DATA.intents[procedure].field.toLowerCase();

        return DATA.officers.filter(o =>
            o.field.toLowerCase().includes(field)
        );
    }

    // ==================================================
    // HIỂN THỊ THỦ TỤC
    // ==================================================

    function renderProcedure(procedure){

        const p = DATA.procedures[procedure];
        const officers = findOfficers(procedure);

        const url = createDVCSearchUrl(p.name);

        let html = `
        <div style="font-size:18px;font-weight:700;color:#d70018">
            📌 ${p.name}
        </div>

        <div style="margin-top:10px;line-height:1.7">
            💰 <b>Lệ phí:</b> ${p.fee}<br>
            ⏱ <b>Thời hạn:</b> ${p.time}<br>
            🌐 <b>DVC:</b> ${p.level}
        </div>

        <div style="margin-top:12px">
            <b>📄 Thành phần hồ sơ</b>
            <ul style="padding-left:18px;margin:8px 0">
        `;

        p.documents.forEach(doc=>{
            html += `<li>${doc}</li>`;
        });

        html += `</ul></div>`;

        if(officers.length){

            html += `<div style="margin-top:12px"><b>👨‍💼 Cán bộ phụ trách</b></div>`;

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
        <a href="${url}"
           target="_blank"
           class="ai-link-btn"
           style="display:block;text-align:center;margin-top:14px">
           🔗 MỞ TRÊN CỔNG DỊCH VỤ CÔNG QUỐC GIA
        </a>`;

        return html;
    }

    // ==================================================
    // TRẢ LỜI
    // ==================================================

    function reply(question){

        if(!READY){

            addMessage("⏳ Hệ thống đang tải dữ liệu, vui lòng thử lại sau vài giây.");
            return;
        }

        const q = normalize(question);

        // ------------------------
        // Giờ làm việc
        // ------------------------

        if(q.includes("gio lam") || q.includes("lam viec")){

            addMessage(`
            <b>🕒 Giờ làm việc</b><br><br>
            ${DATA.center.working_hours}
            `);

            return;
        }

        // ------------------------
        // Điện thoại
        // ------------------------

        if(q.includes("dien thoai") || q.includes("lien he")){

            addMessage(`
            <b>☎ Đường dây nóng</b><br><br>
            ${DATA.center.phone}
            `);

            return;
        }

        // ------------------------
        // Địa chỉ
        // ------------------------

        if(q.includes("dia chi") || q.includes("o dau")){

            addMessage(`
            <b>📍 Địa chỉ Trung tâm</b><br><br>
            ${DATA.center.address}
            `);

            return;
        }

        // ------------------------
        // Tiếp công dân
        // ------------------------

        if(q.includes("tiep cong dan")){

            addMessage(`
            <b>📅 Lịch tiếp công dân</b><br><br>
            ${DATA.citizen_reception.day}<br>
            🕗 ${DATA.citizen_reception.time}<br>
            📍 ${DATA.citizen_reception.location}
            `);

            return;
        }

        // ------------------------
        // Tra cứu thủ tục
        // ------------------------

        const procedure = detectProcedure(question);

        if(procedure && DATA.procedures && DATA.procedures[procedure]){

            addMessage(renderProcedure(procedure));
            return;
        }

        // ------------------------
        // Không nhận diện được
        // ------------------------

        const searchUrl = createDVCSearchUrl(question);

        addMessage(`
        <b>🔎 Tôi chưa xác định chính xác thủ tục.</b><br><br>

        Tôi sẽ mở Cổng Dịch vụ công Quốc gia với đúng nội dung bà con vừa hỏi để tra cứu tất cả kết quả chính thức.

        <a href="${searchUrl}"
           target="_blank"
           class="ai-link-btn"
           style="display:block;text-align:center;margin-top:14px">
           🔗 TRA CỨU TRÊN CỔNG DVC QUỐC GIA
        </a>
        `);
    }

    // ==================================================
    // GỬI TIN NHẮN
    // ==================================================

    function send(){

        const txt = aiInput.value.trim();

        if(!txt) return;

        addMessage(txt,true);

        aiInput.value = "";

        reply(txt);
    }

    if(aiSend){
        aiSend.onclick = send;
    }

    if(aiInput){

        aiInput.addEventListener("keydown",e=>{

            if(e.key==="Enter"){
                send();
            }

        });

    }

    // ==================================================
    // CHIP GỢI Ý
    // ==================================================

    document.querySelectorAll(".ai-chip").forEach(chip=>{

        chip.onclick = ()=>{

            aiInput.value = chip.innerText;

            send();
        };

    });

});
