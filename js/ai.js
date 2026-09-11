// ======================================================
// TRỢ LÝ AI PVHCC XÃ ĐẠI ĐỒNG 2.0
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    // ===== LẤY PHẦN TỬ =====
    const aiChat   = document.getElementById("ai-chat");
    const aiToggle = document.getElementById("ai-toggle");
    const aiClose  = document.getElementById("ai-close");
    const aiBody   = document.getElementById("ai-body");
    const aiInput  = document.getElementById("ai-input");
    const aiSend   = document.getElementById("ai-send");

    let DATA = {};
    let READY = false;

    // ===== ĐỌC DỮ LIỆU JSON =====
    fetch("data/ai_local.json")
        .then(r => r.json())
        .then(json => {
            DATA = json;
            READY = true;
            console.log("AI 2.0 READY");
        })
        .catch(err => {
            console.error("Lỗi đọc ai_local.json", err);
        });

    // ===== MỞ / ĐÓNG CHAT =====
    aiToggle.onclick = () => aiChat.classList.add("active");
    aiClose.onclick  = () => aiChat.classList.remove("active");

    // ===== THÊM TIN NHẮN =====
    function addMessage(html, me = false){

        const div = document.createElement("div");
        div.className = me ? "ai-message user" : "ai-message bot";
        div.innerHTML = html;

        aiBody.appendChild(div);
        aiBody.scrollTop = aiBody.scrollHeight;
    }

    // ===== NÚT ĐỎ MỞ DVC =====
    function dvcButton(url){

        return `
        <a href="${url}"
           target="_blank"
           class="ai-link-btn"
           style="
              display:block;
              margin-top:14px;
              text-align:center;
              background:#d70018;
              color:#fff;
              padding:13px;
              border-radius:12px;
              text-decoration:none;
              font-weight:700;">
           🔗 MỞ THỦ TỤC TRÊN CỔNG DVC
        </a>`;
    }

    // ===== TÌM THỦ TỤC =====
    function detectProcedure(question){

        if(!DATA.synonyms) return null;

        const q = question.toLowerCase();

        for(const proc in DATA.synonyms){

            const words = DATA.synonyms[proc];

            for(const w of words){

                if(q.includes(w.toLowerCase())){
                    return proc;
                }

            }

        }

        return null;
    }

    // ===== TRẢ LỜI =====
    function reply(question){

        if(!READY){

            addMessage("⏳ Hệ thống đang tải dữ liệu, vui lòng thử lại sau 1 giây.");
            return;
        }

        const q = question.toLowerCase();

        // ---------- Giờ làm ----------
        if(q.includes("giờ") || q.includes("làm việc")){

            addMessage(`
                🕒 <b>Giờ làm việc</b><br><br>
                ${DATA.center.working_hours}
            `);

            return;
        }

        // ---------- Điện thoại ----------
        if(q.includes("điện thoại") || q.includes("liên hệ")){

            addMessage(`
                ☎ <b>Điện thoại Trung tâm</b><br><br>
                ${DATA.center.phone}
            `);

            return;
        }

        // ---------- Địa chỉ ----------
        if(q.includes("địa chỉ") || q.includes("ở đâu")){

            addMessage(`
                📍 <b>Địa chỉ Trung tâm PVHCC</b><br><br>
                ${DATA.center.address}
            `);

            return;
        }

        // ---------- Tiếp công dân ----------
        if(q.includes("tiếp công dân")){

            addMessage(`
                📅 <b>Lịch tiếp công dân</b><br><br>

                • ${DATA.citizen_reception.day}<br>
                • ${DATA.citizen_reception.time}<br>
                • ${DATA.citizen_reception.location}
            `);

            return;
        }

        // ---------- Nhận diện thủ tục ----------
        const proc = detectProcedure(q);

        if(proc){

            const url = DATA.dvc_links[proc];

            addMessage(`
                📌 <b>${proc.toUpperCase()}</b><br><br>

                Thủ tục này được thực hiện trên Cổng Dịch vụ công Quốc gia.

                ${dvcButton(url)}
            `);

            return;
        }

        // ---------- Không hiểu ----------
        addMessage(`
            Xin chào bà con!

            Tôi có thể hỗ trợ:

            • Tra cứu thủ tục hành chính

            • Giờ làm việc

            • Tiếp công dân

            • Điện thoại liên hệ

            • Địa chỉ Trung tâm PVHCC
        `);

    }

    // ===== GỬI =====
    function send(){

        const text = aiInput.value.trim();

        if(text === "") return;

        addMessage(text, true);

        aiInput.value = "";

        setTimeout(() => reply(text), 150);

    }

    aiSend.onclick = send;

    aiInput.addEventListener("keydown", e => {

        if(e.key === "Enter"){
            send();
        }

    });

    // ===== CHIP GỢI Ý =====
    document.querySelectorAll(".ai-chip").forEach(chip => {

        chip.onclick = () => {

            aiInput.value = chip.innerText;

            send();

        };

    });

});
