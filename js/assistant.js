// ===== TRỢ LÝ AI PVHCC =====

const toggle = document.getElementById("ai-toggle");
const chat = document.getElementById("ai-chat");
const closeBtn = document.getElementById("ai-close");

if (toggle && chat) {

  toggle.addEventListener("click", () => {
    chat.classList.toggle("active");
  });

  closeBtn.addEventListener("click", () => {
    chat.classList.remove("active");
  });

}
