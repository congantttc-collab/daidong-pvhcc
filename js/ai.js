// ======================================================
// TRỢ LÝ AI PVHCC XÃ ĐẠI ĐỒNG - VERSION 2.1
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

  // ================= ĐỌC JSON =================
fetch("./data/ai_local.json?v=3")
    .then(res => {
        if (!res.ok) throw new Error("Không tìm thấy ai_local.json");
        return res.json();
    })
    .then(json => {
        DATA = json;
        READY = true;
        console.log("AI 3.0 READY", DATA);
    })
    .catch(err => {
        console.error("Lỗi AI:", err);
        READY = false;
    });
    // ================= MỞ / ĐÓNG =================
    aiToggle.onclick = () => aiChat.classList.add("active");
    aiClose.onclick  = () => aiChat.classList.remove("active");

    // ================= HIỂN THỊ TIN NHẮN =================
    function addMessage(text, me = false){
        const div = document.createElement("div");
        div.className = me ? "ai-message user" : "ai-message bot";
        div.innerHTML = text;
        aiBody.appendChild(div);
        aiBody.scrollTop = aiBody.scrollHeight;
    }

    // ================= TÌM CÁN BỘ =================
    function findOfficers(question){

        if(!DATA.officers) return [];

        const q = question.toLowerCase();

        return DATA.officers.filter(o => {

            const f = o.field.toLowerCase();

            return (
                f.includes(q) ||

                (q.includes("khai sinh") && f.includes("hộ tịch")) ||
                (q.includes("con mới sinh") && f.includes("hộ tịch")) ||
                (q.includes("giấy khai sinh") && f.includes("hộ tịch")) ||

                (q.includes("khai tử") && f.includes("hộ tịch")) ||
                (q.includes("qua đời") && f.includes("hộ tịch")) ||
                (q.includes("người mất") && f.includes("hộ tịch")) ||

                (q.includes("kết hôn") && f.includes("hộ tịch")) ||

                (q.includes("chứng thực") && f.includes("hộ tịch")) ||
                (q.includes("công chứng") && f.includes("hộ tịch")) ||
                (q.includes("sao y") && f.includes("hộ tịch")) ||

                (q.includes("đất") && f.includes("đất")) ||
                (q.includes("sổ đỏ") && f.includes("đất")) ||
                (q.includes("tách thửa") && f.includes("đất")) ||
                (q.includes("chuyển nhượng") && f.includes("đất")) ||

                (q.includes("hộ kinh doanh") && f.includes("hộ kinh doanh")) ||
                (q.includes("an toàn thực phẩm") && f.includes("an toàn")) ||

                (q.includes("bảo trợ") && f.includes("bảo trợ")) ||
                (q.includes("người có công") && f.includes("người có công")) ||
                (q.includes("giáo dục") && f.includes("giáo dục")) ||
                (q.includes("y tế") && f.includes("y tế")) ||

                (q.includes("văn thư") && f.includes("văn thư")) ||
                (q.includes("trình ký") && f.includes("trình ký")) ||
                (q.includes("trả kết quả") && f.includes("trả kết quả")) ||

                (q.includes("kỹ năng số") && f.includes("hạ tầng số")) ||
                (q.includes("chuyển đổi số") && f.includes("hạ tầng số"))
            );

        });

    }

    // ================= AI 3.0 - NHẬN DIỆN THỦ TỤC =================
function detectProcedure(question){

    if(!DATA.synonyms) return null;

    const q = question.toLowerCase();

    let best = null;
    let score = 0;

    for(const procedure in DATA.synonyms){

        let point = 0;

        DATA.synonyms[procedure].forEach(word=>{

            const w = word.toLowerCase();

            if(q.includes(w)){
                point += w.length;
            }

        });

        if(point > score){
            score = point;
            best = procedure;
        }

    }

    return score > 0 ? best : null;
}
    // ================= TRẢ LỜI =================
    function reply(question){

        if(!READY){
            addMessage("⏳ Hệ thống đang khởi tạo dữ liệu, bà con vui lòng thử lại sau vài giây.");
            return;
        }

        const q = question.toLowerCase();

        // -------- Giờ làm việc --------
        if(q.includes("giờ làm") || q.includes("làm việc")){
            addMessage(`🕒 <b>Giờ làm việc</b><br><br>${DATA.center.working_hours}`);
            return;
        }

        // -------- Điện thoại --------
        if(q.includes("điện thoại") || q.includes("liên hệ")){
            addMessage(`☎ <b>Đường dây nóng</b><br><br>${DATA.center.phone}`);
            return;
        }

        // -------- Địa chỉ --------
        if(q.includes("địa chỉ") || q.includes("ở đâu")){
            addMessage(`📍 <b>Địa chỉ Trung tâm</b><br><br>${DATA.center.address}`);
            return;
        }

        // -------- Tiếp công dân --------
        if(q.includes("tiếp công dân")){
            addMessage(`
📅 <b>Lịch tiếp công dân</b><br><br>
<b>${DATA.citizen_reception.day}</b><br>
🕗 ${DATA.citizen_reception.time}<br>
📍 ${DATA.citizen_reception.location}
`);
            return;
        }

        // -------- Thủ tục --------
        const procedure = detectProcedure(question);

        if(procedure){

            const officers = findOfficers(procedure);
            const url = DATA.dvc_links[procedure];

            let html = `
📌 <b style="font-size:18px">${procedure.toUpperCase()}</b><br><br>

Thủ tục được thực hiện trên Cổng Dịch vụ công Quốc gia.<br><br>

<a href="${url}" target="_blank" class="ai-link-btn">
🔗 MỞ THỦ TỤC TRÊN CỔNG DVC
</a>
`;

            if(officers.length){

                html += `<br><br><b>👨‍💼 CÁN BỘ PHỤ TRÁCH</b>`;

                officers.forEach(o=>{

                    html += `
<div style="margin-top:10px;padding:10px;border:1px solid #ececec;border-radius:10px;background:#fafafa">
<b>${o.name}</b><br>
${o.position}<br>
📋 ${o.field}<br>
☎ <a href="tel:${o.phone}" style="color:#d70018;text-decoration:none">${o.phone}</a>
</div>
`;

                });

            }

            addMessage(html);
            return;
        }

        // -------- Hỏi lĩnh vực --------
        const officers = findOfficers(question);

        if(officers.length){

            let html = `<b>👨‍💼 Cán bộ phụ trách lĩnh vực này</b><br>`;

            officers.forEach(o=>{

                html += `
<div style="margin-top:10px;padding:10px;border:1px solid #ececec;border-radius:10px;background:#fafafa">
<b>${o.name}</b><br>
${o.position}<br>
📋 ${o.field}<br>
☎ <a href="tel:${o.phone}" style="color:#d70018;text-decoration:none">${o.phone}</a>
</div>
`;

            });

            addMessage(html);
            return;
        }

        // -------- Mặc định --------
        addMessage(`
👋 <b>Xin chào bà con!</b><br><br>

Tôi là trợ lý AI của Trung tâm PVHCC xã Đại Đồng.

Tôi có thể hỗ trợ:

• Tra cứu thủ tục hành chính<br>
• Mở đúng thủ tục trên Cổng DVC Quốc gia<br>
• Cán bộ phụ trách từng lĩnh vực<br>
• Giờ làm việc<br>
• Lịch tiếp công dân<br>
• Số điện thoại liên hệ
`);

    }

    // ================= GỬI =================
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

    // ================= CHIP =================
    document.querySelectorAll(".ai-chip").forEach(chip=>{

        chip.onclick = ()=>{

            aiInput.value = chip.innerText;

            send();

        };

    });

});
