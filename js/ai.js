// ======================================================
// TRỢ LÝ AI PVHCC XÃ ĐẠI ĐỒNG - VERSION 3.1
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

    // ===== Đọc dữ liệu =====
    fetch("./data/ai_local.json?v=31")
        .then(r => r.json())
        .then(json => {
            DATA = json;
            READY = true;
            console.log("AI 3.1 READY");
        })
        .catch(err => console.error(err));

    // ===== Mở / đóng =====
    aiToggle.onclick = () => aiChat.classList.add("active");
    aiClose.onclick  = () => aiChat.classList.remove("active");

    // ===== Hiển thị tin nhắn =====
    function addMessage(html, me=false){

        const div = document.createElement("div");
        div.className = me ? "ai-message user" : "ai-message bot";
        div.innerHTML = html;

        aiBody.appendChild(div);
        aiBody.scrollTop = aiBody.scrollHeight;

    }

    // ===== Chuẩn hóa =====
    function normalize(str){

        return str.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g,"")
            .replace(/đ/g,"d");

    }

    // ===== Hiểu ý định =====
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

    // ===== Tìm cán bộ =====
    function findOfficers(procedure){

        const intent = DATA.intents?.[procedure];
        if(!intent) return [];

        const field = normalize(intent.field);

        return DATA.officers.filter(o =>
            normalize(o.field).includes(field)
        );

    }

    // ===== Trả lời thủ tục =====
    function renderProcedure(procedure){

        const p = DATA.procedures?.[procedure];
        const officers = findOfficers(procedure);
        const url = DATA.dvc_links?.[procedure] || "#";

        let html = `
<div style="font-size:20px;font-weight:bold;color:#d70018;margin-bottom:8px">
📌 ${p.name}
</div>

<div style="margin-bottom:8px">
<b>💰 Lệ phí:</b> ${p.fee}
</div>

<div style="margin-bottom:8px">
<b>⏱ Thời hạn:</b> ${p.time}
</div>

<div style="margin-bottom:12px">
<b>🌐 Dịch vụ công:</b> ${p.level}
</div>

<b>📄 Hồ sơ cần chuẩn bị</b>
<ul style="padding-left:18px;margin-top:6px">
`;

        p.documents.forEach(d=>{
            html += `<li>${d}</li>`;
        });

        html += `</ul>`;

        if(officers.length){

            html += `<br><b>👨‍💼 Cán bộ phụ trách</b>`;

            officers.forEach(o=>{

                html += `
<div style="margin-top:8px;padding:10px;border:1px solid #eee;border-radius:10px;background:#fafafa">
<b>${o.name}</b><br>
${o.position}<br>
📋 ${o.field}<br>
☎ <a href="tel:${o.phone}" style="color:#d70018;text-decoration:none">${o.phone}</a>
</div>`;

            });

        }

        html += `
<br>
<a href="${url}" target="_blank"
style="display:block;background:#d70018;color:#fff;text-decoration:none;text-align:center;padding:12px;border-radius:10px;font-weight:bold;margin-top:12px">
🔗 MỞ THỦ TỤC TRÊN CỔNG DVC
</a>`;

        return html;

    }

    // ===== Trả lời =====
    function reply(question){

        if(!READY){
            addMessage("⏳ Hệ thống đang tải dữ liệu...");
            return;
        }

        const q = normalize(question);

        // Thông tin chung
        if(q.includes("gio lam")){
            addMessage(`<b>🕒 Giờ làm việc</b><br><br>${DATA.center.working_hours}`);
            return;
        }

        if(q.includes("dien thoai") || q.includes("lien he")){
            addMessage(`<b>☎ Đường dây nóng</b><br><br>${DATA.center.phone}`);
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

        // Thủ tục
        const procedure = detectProcedure(question);

        if(procedure && DATA.procedures?.[procedure]){
            addMessage(renderProcedure(procedure));
            return;
        }

        // Mặc định
        addMessage(`
👋 <b>Xin chào bà con!</b><br><br>

Tôi có thể hỗ trợ:

• Tra cứu thủ tục hành chính<br>
• Thành phần hồ sơ<br>
• Lệ phí và thời hạn<br>
• Cán bộ phụ trách<br>
• Lịch tiếp công dân<br>
• Giờ làm việc
`);

    }

    // ===== Gửi =====
    function send(){

        const txt = aiInput.value.trim();
        if(!txt) return;

        addMessage(txt,true);
        aiInput.value="";
        reply(txt);

    }

    aiSend.onclick = send;

    aiInput.addEventListener("keydown",e=>{
        if(e.key==="Enter") send();
    });

    document.querySelectorAll(".ai-chip").forEach(chip=>{
        chip.onclick=()=>{
            aiInput.value=chip.innerText;
            send();
        }
    });

});
