// ===== TRỢ LÝ AI PVHCC ĐẠI ĐỒNG =====

const aiChat = document.getElementById("ai-chat");
const aiToggle = document.getElementById("ai-toggle");
const aiClose = document.getElementById("ai-close");
const aiBody = document.getElementById("ai-body");
const aiInput = document.getElementById("ai-input");
const aiSend = document.getElementById("ai-send");

let localData = {};

// Đọc dữ liệu xã
fetch("./data/ai_local.json")
  .then(r => r.json())
  .then(data => localData = data);

// Mở / đóng
aiToggle.onclick = () => aiChat.classList.add("active");
aiClose.onclick = () => aiChat.classList.remove("active");

// Gửi tin nhắn
function addMessage(text, me=false){
  const div=document.createElement("div");
  div.className = me ? "ai-message user" : "ai-message bot";
  div.innerHTML = text.replace(/\n/g,"<br>");
  aiBody.appendChild(div);
  aiBody.scrollTop = aiBody.scrollHeight;
}

// Trả lời
function reply(q){
  const t=q.toLowerCase();
  let res="Xin lỗi, tôi chưa có dữ liệu này. Vui lòng liên hệ Bộ phận Một cửa: 0984 803 163.";

  if(t.includes("địa chỉ") || t.includes("ở đâu")){
    res=`📍 ${localData.center.address}`;
  }
  else if(t.includes("điện thoại") || t.includes("số điện thoại")){
    res=`☎ ${localData.center.phone}`;
  }
  else if(t.includes("email")){
    res=`✉ ${localData.center.email}`;
  }
  else if(t.includes("giờ làm") || t.includes("làm việc")){
    res=`🕒 ${localData.center.working_hours}`;
  }
  else if(t.includes("tiếp công dân")){
    res=`📅 ${localData.citizen_reception.day}
🕗 ${localData.citizen_reception.time}
📍 ${localData.citizen_reception.location}`;
  }
  else if(t.includes("hộ tịch")){
    const s=localData.staff.find(x=>x.field==="Hộ tịch");
    res=`Cán bộ phụ trách Hộ tịch:
👤 ${s.name}
☎ ${s.phone}`;
  }
  else if(t.includes("chứng thực")){
    const s=localData.staff.find(x=>x.field==="Chứng thực");
    res=`Cán bộ phụ trách Chứng thực:
👤 ${s.name}
☎ ${s.phone}`;
  }
  else if(t.includes("đất đai")){
    const s=localData.staff.find(x=>x.field==="Đất đai");
    res=`Cán bộ phụ trách Đất đai:
👤 ${s.name}
☎ ${s.phone}`;
  }
  else if(
      t.includes("khai sinh") ||
      t.includes("kết hôn") ||
      t.includes("khai tử") ||
      t.includes("thủ tục") ||
      t.includes("lệ phí") ||
      t.includes("hồ sơ")
  ){
    res=`📌 Thủ tục này được tra cứu trên Cổng Dịch vụ công Quốc gia.

👉 Mở mục "Tra cứu thủ tục" trên website hoặc truy cập:
https://dichvucong.gov.vn

Tôi sẽ hỗ trợ thông tin liên hệ và cán bộ xử lý tại xã Đại Đồng.`;
  }

  setTimeout(()=>addMessage(res),400);
}

function send(){
  const txt=aiInput.value.trim();
  if(!txt) return;
  addMessage(txt,true);
  aiInput.value="";
  reply(txt);
}

aiSend.onclick=send;
aiInput.addEventListener("keydown",e=>{
  if(e.key==="Enter") send();
});
