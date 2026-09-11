// ===== TRỢ LÝ AI PVHCC ĐẠI ĐỒNG =====
document.addEventListener("DOMContentLoaded", () => {

  const aiChat   = document.getElementById("ai-chat");
  const aiToggle = document.getElementById("ai-toggle");
  const aiClose  = document.getElementById("ai-close");
  const aiBody   = document.getElementById("ai-body");
  const aiInput  = document.getElementById("ai-input");
  const aiSend   = document.getElementById("ai-send");

  let localData = {};

  // Đọc dữ liệu xã
  fetch("./data/ai_local.json")
    .then(r => r.json())
    .then(data => localData = data)
    .catch(() => console.log("Không đọc được ai_local.json"));

  // Mở cửa sổ
  aiToggle.addEventListener("click", () => {
    aiChat.classList.add("active");
  });

  // Đóng cửa sổ
  aiClose.addEventListener("click", () => {
    aiChat.classList.remove("active");
  });

  // Thêm tin nhắn
  function addMessage(text, me = false){
    const div = document.createElement("div");
    div.className = me ? "ai-message user" : "ai-message bot";
    div.innerHTML = text.replace(/\n/g,"<br>");
    aiBody.appendChild(div);
    aiBody.scrollTop = aiBody.scrollHeight;
  }

  // Trả lời
  function reply(q){
    const t = q.toLowerCase();
    let res = "Xin lỗi, vui lòng liên hệ Bộ phận Một cửa: 0984 803 163.";

    if(t.includes("giờ làm")){
      res = "🕒 Thứ Hai đến Thứ Sáu: 07:00–17:00";
    }
    else if(t.includes("tiếp công dân")){
      res = "📅 Thứ Tư hằng tuần\n🕗 08:00–11:30\n📍 Phòng Tiếp công dân";
    }
    else if(t.includes("điện thoại")){
      res = "☎ 0984 803 163";
    }
    else if(t.includes("địa chỉ")){
      res = "📍 Số 02 Nguyễn Sỹ Sách, Thôn Dũng 1, xã Đại Đồng";
    }
    else if(
      t.includes("khai sinh") ||
      t.includes("kết hôn") ||
      t.includes("khai tử") ||
      t.includes("chứng thực") ||
      t.includes("đất đai") ||
      t.includes("thủ tục")
    ){
      res = `📌 Thủ tục này được tra cứu trên Cổng Dịch vụ công Quốc gia.

👉 https://dichvucong.gov.vn

Tôi sẽ hỗ trợ thông tin liên hệ và cán bộ xử lý tại xã Đại Đồng.`;
    }

    setTimeout(() => addMessage(res), 300);
  }

  function send(){
    const txt = aiInput.value.trim();
    if(!txt) return;
    addMessage(txt, true);
    aiInput.value = "";
    reply(txt);
  }

  aiSend.addEventListener("click", send);
  aiInput.addEventListener("keydown", e => {
    if(e.key === "Enter") send();
  });

  // Chip gợi ý
  document.querySelectorAll(".ai-chip").forEach(chip=>{
    chip.onclick = ()=>{
      aiInput.value = chip.innerText;
      send();
    }
  });

});
