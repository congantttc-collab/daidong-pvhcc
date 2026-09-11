// ===== TRỢ LÝ AI PVHCC XÃ ĐẠI ĐỒNG =====

document.addEventListener("DOMContentLoaded", () => {

    const aiChat   = document.getElementById("ai-chat");
    const aiToggle = document.getElementById("ai-toggle");
    const aiClose  = document.getElementById("ai-close");
    const aiBody   = document.getElementById("ai-body");
    const aiInput  = document.getElementById("ai-input");
    const aiSend   = document.getElementById("ai-send");

    let localData = null;

    // ===== ĐỌC DỮ LIỆU ĐỊA PHƯƠNG =====
    fetch("data/ai_local.json")
        .then(res => {
            if (!res.ok) throw new Error("Không tìm thấy ai_local.json");
            return res.json();
        })
        .then(data => {
            localData = data;
            console.log("AI LOCAL READY");
        })
        .catch(err => {
            console.error(err);
        });

    // ===== MỞ / ĐÓNG =====
    aiToggle.onclick = () => aiChat.classList.add("active");
    aiClose.onclick  = () => aiChat.classList.remove("active");

    // ===== HIỂN THỊ TIN NHẮN =====
    function addMessage(text, me = false){

        const div = document.createElement("div");
        div.className = me ? "ai-message user" : "ai-message bot";
        div.innerHTML = text.replace(/\n/g,"<br>");
        aiBody.appendChild(div);
        aiBody.scrollTop = aiBody.scrollHeight;
    }

    // ===== TRẢ LỜI =====
    function reply(question){

        const t = question.toLowerCase();

        if(localData === null){
            addMessage("⏳ Hệ thống đang khởi tạo dữ liệu, bà con vui lòng thử lại sau vài giây.");
            return;
        }

        // ===== THÔNG TIN TRUNG TÂM =====
        if(t.includes("giờ làm") || t.includes("làm việc")){
            addMessage("🕒 " + localData.center.working_hours);
            return;
        }

        if(t.includes("điện thoại") || t.includes("liên hệ") || t.includes("số điện thoại")){
            addMessage("☎ " + localData.center.phone);
            return;
        }

        if(t.includes("địa chỉ") || t.includes("ở đâu")){
            addMessage("📍 " + localData.center.address);
            return;
        }

        if(t.includes("email")){
            addMessage("📧 " + localData.center.email);
            return;
        }

        if(t.includes("tiếp công dân")){
            addMessage(
`📅 ${localData.citizen_reception.day}

🕗 ${localData.citizen_reception.time}

📍 ${localData.citizen_reception.location}`);
            return;
        }

        // ===== NHẬN DIỆN THỦ TỤC =====
        let procedure = null;

        if(localData.synonyms){

            for(const [name, words] of Object.entries(localData.synonyms)){

                if(words.some(w => t.includes(w.toLowerCase()))){
                    procedure = name;
                    break;
                }

            }

        }

        // ===== MỞ ĐÚNG THỦ TỤC =====
        if(procedure && localData.dvc_links[procedure]){

            const url = localData.dvc_links[procedure];

            addMessage(
`📌 <b>${procedure.toUpperCase()}</b>

Thủ tục này được thực hiện trên Cổng Dịch vụ công Quốc gia.

<a href="${url}" target="_blank" class="ai-link-btn">
🔗 MỞ THỦ TỤC TRÊN CỔNG DVC
</a>`);
            return;
        }

        // ===== KHÔNG NHẬN DIỆN =====
        addMessage(
`Xin chào bà con!

Tôi có thể hỗ trợ:

• Tra cứu thủ tục hành chính

• Giờ làm việc

• Tiếp công dân

• Điện thoại liên hệ

• Địa chỉ Trung tâm PVHCC

Bà con hãy đặt câu hỏi nhé!`);
    }

    // ===== GỬI =====
    function send(){

        const txt = aiInput.value.trim();

        if(txt === "") return;

        addMessage(txt, true);

        aiInput.value = "";

        setTimeout(() => reply(txt), 200);
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
