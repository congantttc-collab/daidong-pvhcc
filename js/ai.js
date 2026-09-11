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
  // Tạo đường dẫn tìm kiếm trên Cổng DVC Quốc gia
function createDVCLink(keyword){
    return "https://dichvucong.gov.vn/p/home/dvc-tthc-category.html?keyword="
        + encodeURIComponent(keyword);
}
function reply(q){

  const t = q.toLowerCase();

  // ===== Thông tin của xã =====
  if(t.includes("giờ làm")){
      return addMessage(`🕒 ${localData.center.working_hours}`);
  }

  if(t.includes("điện thoại")){
      return addMessage(`☎ ${localData.center.phone}`);
  }

  if(t.includes("địa chỉ") || t.includes("ở đâu")){
      return addMessage(`📍 ${localData.center.address}`);
  }

  if(t.includes("tiếp công dân")){
      return addMessage(
`📅 ${localData.citizen_reception.day}
🕗 ${localData.citizen_reception.time}
📍 ${localData.citizen_reception.location}`);
  }

  // ===== Nhận diện thủ tục =====
  const procedures = [
    "khai sinh","kết hôn","khai tử",
    "chứng thực","đất đai","tách thửa",
    "cấp sổ đỏ","xác nhận tình trạng hôn nhân",
    "đổi tên","cải chính hộ tịch"
  ];

  const found = procedures.find(p => t.includes(p));

  if(found){

      const url = createDVCLink(found);

      return addMessage(`
📌 <b>${found.toUpperCase()}</b>

Thủ tục này được tra cứu trên Cổng Dịch vụ công Quốc gia.

<a href="${url}" target="_blank" class="ai-link-btn">
🔗 MỞ THỦ TỤC TRÊN CỔNG DVC
</a>`);
  }

  return addMessage(
"Xin lỗi, tôi chưa hiểu câu hỏi. Bà con có thể hỏi về thủ tục, giờ làm việc, tiếp công dân hoặc số điện thoại."
  );
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
