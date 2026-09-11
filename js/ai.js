// ===== TRỢ LÝ AI PVHCC =====

const aiToggle = document.getElementById("ai-toggle");
const aiChat   = document.getElementById("ai-chat");
const aiClose  = document.getElementById("ai-close");
const aiBody   = document.getElementById("ai-body");
const aiInput  = document.getElementById("ai-input");
const aiSend   = document.getElementById("ai-send");

// Nếu trang không có chatbot thì thoát
if (aiToggle && aiChat) {

  aiToggle.onclick = () => aiChat.classList.toggle("open");
  aiClose.onclick  = () => aiChat.classList.remove("open");

  const answers = {
    "khai sinh":"Thủ tục đăng ký khai sinh: Chuẩn bị Giấy chứng sinh, CCCD của cha mẹ và nộp tại Bộ phận Một cửa.",
    "chứng thực":"Mang bản chính và bản photo để đối chiếu tại Trung tâm PVHCC.",
    "đất":"Lĩnh vực đất đai gồm cấp đổi GCN, tách thửa, đăng ký biến động...",
    "tiếp công dân":"Lịch tiếp công dân định kỳ: Thứ Tư hằng tuần lúc 08:00 tại Phòng Tiếp dân.",
    "nộp hồ sơ":"Chọn mục 'Nộp hồ sơ trực tuyến' ngay trên trang chủ để thực hiện dịch vụ công."
  };

  function addMessage(text, me=false){
    const div = document.createElement("div");
    div.className = me ? "ai-message user" : "ai-message bot";
    div.innerHTML = text;
    aiBody.appendChild(div);
    aiBody.scrollTop = aiBody.scrollHeight;
  }

  function reply(q){
    const s = q.toLowerCase();
    let res = "Xin lỗi, tôi chưa có dữ liệu cho câu hỏi này. Vui lòng liên hệ 0984 803 163.";

    Object.keys(answers).forEach(k=>{
      if(s.includes(k)) res = answers[k];
    });

    setTimeout(()=>addMessage(res),400);
  }

  function send(){
    const text = aiInput.value.trim();
    if(!text) return;
    addMessage(text,true);
    aiInput.value="";
    reply(text);
  }

  aiSend.onclick = send;
  aiInput.addEventListener("keydown",e=>{
    if(e.key==="Enter") send();
  });

  document.querySelectorAll(".ai-chip").forEach(btn=>{
    btn.onclick = ()=>{
      const q = btn.innerText;
      addMessage(q,true);
      reply(q);
    }
  });

}
