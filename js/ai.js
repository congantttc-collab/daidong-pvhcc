// ===== TRỢ LÝ AI PVHCC XÃ ĐẠI ĐỒNG =====
document.addEventListener("DOMContentLoaded", () => {

  const aiChat   = document.getElementById("ai-chat");
  const aiToggle = document.getElementById("ai-toggle");
  const aiClose  = document.getElementById("ai-close");
  const aiBody   = document.getElementById("ai-body");
  const aiInput  = document.getElementById("ai-input");
  const aiSend   = document.getElementById("ai-send");

  let localData = {};

  // Đọc dữ liệu địa phương
  fetch("./data/ai_local.json")
    .then(r => r.json())
    .then(data => localData = data)
    .catch(() => console.log("Không đọc được ai_local.json"));

  // Mở / đóng cửa sổ
  aiToggle.addEventListener("click", () => {
    aiChat.classList.add("active");
  });

  aiClose.addEventListener("click", () => {
    aiChat.classList.remove("active");
  });

  // Hiển thị tin nhắn
  function addMessage(text, me = false){
    const div = document.createElement("div");
    div.className = me ? "ai-message user" : "ai-message bot";
    div.innerHTML = text.replace(/\n/g,"<br>");
    aiBody.appendChild(div);
    aiBody.scrollTop = aiBody.scrollHeight;
  }

  // Trả lời AI
  function reply(q){

    const t = q.toLowerCase();

    // ===== Thông tin của xã =====
    if(t.includes("giờ làm")){
      addMessage(`🕒 ${localData.center.working_hours}`);
      return;
    }

    if(t.includes("điện thoại") || t.includes("liên hệ")){
      addMessage(`☎ ${localData.center.phone}`);
      return;
    }

    if(t.includes("địa chỉ") || t.includes("ở đâu")){
      addMessage(`📍 ${localData.center.address}`);
      return;
    }

    if(t.includes("tiếp công dân")){
      addMessage(
`📅 ${localData.citizen_reception.day}
🕗 ${localData.citizen_reception.time}
📍 ${localData.citizen_reception.location}`);
      return;
    }

    // ===== Thủ tục DVC Quốc gia =====
    if(localData.dvc_links){

      const found = Object.keys(localData.dvc_links)
        .find(key => t.includes(key));

      if(found){

        const url = localData.dvc_links[found];

        addMessage(
`📌 <b>${found.toUpperCase()}</b>

Thủ tục này được thực hiện trên Cổng Dịch vụ công Quốc gia.

<a href="${url}" target="_blank" class="ai-link-btn">
🔗 MỞ THỦ TỤC TRÊN CỔNG DVC
</a>`);
        return;
      }
    }

    // ===== Mặc định =====
    addMessage(
`Xin chào bà con!

Tôi có thể hỗ trợ:

• Tra cứu thủ tục hành chính
• Giờ làm việc
• Tiếp công dân
• Điện thoại liên hệ
• Địa chỉ Trung tâm PVHCC`);
  }

  // Gửi tin nhắn
  function send(){
    const txt = aiInput.value.trim();
    if(!txt) return;
    addMessage(txt, true);
    aiInput.value = "";
    reply(txt);
  }

  aiSend.addEventListener("click", send);

  aiInput.addEventListener("keydown", e=>{
    if(e.key==="Enter") send();
  });

  // Chip gợi ý
  document.querySelectorAll(".ai-chip").forEach(chip=>{
    chip.addEventListener("click", ()=>{
      aiInput.value = chip.innerText;
      send();
    });
  });

});
