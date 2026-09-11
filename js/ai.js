// ===== TRỢ LÝ AI PVHCC =====

const aiToggle = document.getElementById("ai-toggle");
const aiChat = document.getElementById("ai-chat");
const aiClose = document.getElementById("ai-close");
const aiBody = document.getElementById("ai-body");
const aiInput = document.getElementById("ai-input");
const aiSend = document.getElementById("ai-send");

// Mở / đóng
aiToggle.onclick = () => aiChat.classList.toggle("open");
aiClose.onclick = () => aiChat.classList.remove("open");

// Câu trả lời mẫu
const answers = {
  "khai sinh":
    "Thủ tục đăng ký khai sinh: Chuẩn bị giấy chứng sinh, CCCD của cha/mẹ và nộp tại Bộ phận Một cửa.",
  "chứng thực":
    "Chứng thực bản sao: Mang bản chính và bản photo để đối chiếu tại Trung tâm PVHCC.",
  "đất đai":
    "Lĩnh vực đất đai gồm: cấp đổi GCN, tách thửa, đăng ký biến động và các thủ tục liên quan.",
  "tiếp công dân":
    "Lịch tiếp công dân định kỳ: Thứ Tư hàng tuần từ 08:00 tại Phòng Tiếp dân.",
  "nộp hồ sơ":
    "Anh/Chị có thể chọn mục 'Nộp hồ sơ trực tuyến' ngay trên trang chủ để thực hiện dịch vụ công."
};

// Thêm tin nhắn
function addMessage(text, me = false) {
  const div = document.createElement("div");
  div.className = me ? "ai-message user" : "ai-message bot";
  div.innerHTML = text;
  aiBody.appendChild(div);
  aiBody.scrollTop = aiBody.scrollHeight;
}

// Trả lời
function reply(question) {
  const q = question.toLowerCase();

  let res =
    "Xin lỗi, tôi chưa có dữ liệu cho nội dung này. Vui lòng liên hệ Bộ phận Một cửa: 0984 803 163.";

  Object.keys(answers).forEach((key) => {
    if (q.includes(key)) res = answers[key];
  });

  setTimeout(() => addMessage(res), 500);
}

// Gửi
function send() {
  const text = aiInput.value.trim();
  if (!text) return;

  addMessage(text, true);
  aiInput.value = "";
  reply(text);
}

aiSend.onclick = send;
aiInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") send();
});

// Chip gợi ý
document.querySelectorAll(".ai-chip").forEach((chip) => {
  chip.onclick = () => {
    const text = chip.innerText;
    addMessage(text, true);
    reply(text);
  };
});
