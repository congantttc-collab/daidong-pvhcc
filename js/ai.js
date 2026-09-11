// ======================================================
// TRỢ LÝ AI PVHCC XÃ ĐẠI ĐỒNG - VERSION 3.0
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

    // ================= ĐỌC DỮ LIỆU JSON =================
    fetch("./data/ai_local.json?v=3")
        .then(res => {
            if (!res.ok) throw new Error("Không đọc được ai_local.json");
            return res.json();
        })
        .then(json => {
            DATA = json;
            READY = true;
            console.log("AI 3.0 READY");
        })
        .catch(err => {
            console.error("AI ERROR:", err);
            READY = false;
        });

    // ================= MỞ / ĐÓNG =================
    aiToggle.onclick = () => aiChat.classList.add("active");
    aiClose.onclick  = () => aiChat.classList.remove("active");

    // ================= HIỂN THỊ TIN NHẮN =================
    function addMessage(html, me = false){

        const div = document.createElement("div");
        div.className = me ? "ai-message user" : "ai-message bot";
        div.innerHTML = html;

        aiBody.appendChild(div);
        aiBody.scrollTop = aiBody.scrollHeight;
    }

    // ================= BỎ DẤU TIẾNG VIỆT =================
    function normalize(text){

        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g,"")
            .replace(/đ/g,"d");

    }

    // ================= AI HIỂU Ý ĐỊNH =================
    function detectProcedure(question){

        if(!DATA.intents) return null;

        const text = normalize(question);

        let best = null;
        let bestScore = 0;

        Object.entries(DATA.intents).forEach(([name,intent])=>{

            let score = 0;

            intent.keywords.forEach(word=>{

                const kw = normalize(word);

                if(text.includes(kw)){
                    score += kw.length;
                }

            });

            if(score > bestScore){
                bestScore = score;
                best = name;
            }

        });

        return best;

    }

    // ================= TÌM CÁN BỘ =================
    function findOfficers(procedure){

        if(!DATA.officers) return [];

        const intent = DATA.intents?.[procedure];

        if(!intent) return [];

        const field = normalize(intent.field);

        return DATA.officers.filter(o =>
            normalize(o.field).includes(field)
        );

    }

    // ================= THÔNG TIN CHUNG =================
    function replyGeneral(question){

        const q = normalize(question);

        if(q.includes("gio lam")){
            return `
🕒 <b>GIỜ LÀM VIỆC</b><br><br>
${DATA.center.working_hours}
`;
        }

        if(q.includes("dien thoai") || q.includes("lien he")){
            return `
☎ <b>ĐƯỜNG DÂY NÓNG</b><br><br>
<a href="tel:${DATA.center.phone}" style="color:#d70018;text-decoration:none">
${DATA.center.phone}
</a>
`;
        }

        if(q.includes("dia chi") || q.includes("o dau")){
            return `
📍 <b>ĐỊA CHỈ TRUNG TÂM</b><br><br>
${DATA.center.address}
`;
        }

        if(q.includes("tiep cong dan")){
            return `
📅 <b>LỊCH TIẾP CÔNG DÂN</b><br><br>
<b>${DATA.citizen_reception.day}</b><br>
🕗 ${DATA.citizen_reception.time}<br>
📍 ${DATA.citizen_reception.location}
`;
        }

        return null;

    }

    // ================= TRẢ LỜI THỦ TỤC =================
    function replyProcedure(procedure){

        const officers = findOfficers(procedure);

        const url = DATA.dvc_links?.[procedure] || "#";

        let html = `
📌 <b style="font-size:18px">${procedure.toUpperCase()}</b><br><br>

Thủ tục này được thực hiện trên Cổng Dịch vụ công Quốc gia.<br><br>

<a href="${url}" target="_blank"
style="
display:block;
background:#d70018;
color:#fff;
text-decoration:none;
text-align:center;
padding:12px;
border-radius:10px;
font-weight:bold;
">
🔗 MỞ THỦ TỤC TRÊN CỔNG DVC
</a>
`;

        if(officers.length){

            html += `<br><b>👨‍💼 CÁN BỘ PHỤ TRÁCH</b>`;

            officers.forEach(o=>{

                html += `
<div style="
margin-top:10px;
padding:10px;
border:1px solid #ececec;
border-radius:10px;
background:#fafafa;
">
<b>${o.name}</b><br>
${o.position}<br>
📋 ${o.field}<br>
☎ <a href="tel:${o.phone}" style="color:#d70018;text-decoration:none">
${o.phone}
</a>
</div>
`;

            });

        }

        return html;

    }

    // ================= AI TRẢ LỜI =================
    function reply(question){

        if(!READY){

            addMessage("⏳ Hệ thống đang khởi tạo dữ liệu, bà con vui lòng thử lại sau vài giây.");

            return;

        }

        // 1. Thông tin chung
        const general = replyGeneral(question);

        if(general){

            addMessage(general);

            return;

        }

        // 2. Thủ tục
        const procedure = detectProcedure(question);

        if(procedure){

            addMessage(replyProcedure(procedure));

            return;

        }

        // 3. Mặc định
        addMessage(`
👋 <b>Xin chào bà con!</b><br><br>

Tôi là trợ lý AI của Trung tâm Phục vụ Hành chính công xã Đại Đồng.

Tôi có thể hỗ trợ:

• Tra cứu thủ tục hành chính<br>
• Thành phần hồ sơ<br>
• Cán bộ phụ trách từng lĩnh vực<br>
• Giờ làm việc<br>
• Lịch tiếp công dân<br>
• Số điện thoại liên hệ
`);

    }

    // ================= GỬI TIN =================
    function send(){

        const txt = aiInput.value.trim();

        if(!txt) return;

        addMessage(txt, true);

        aiInput.value = "";

        reply(txt);

    }

    aiSend.onclick = send;

    aiInput.addEventListener("keydown", e=>{

        if(e.key==="Enter") send();

    });

    // ================= CHIP GỢI Ý =================
    document.querySelectorAll(".ai-chip").forEach(chip=>{

        chip.onclick = ()=>{

            aiInput.value = chip.innerText;

            send();

        };

    });

});
