/* ==========================================================
   AI 7.0 PRO - TRUNG TÂM PVHCC XÃ ĐẠI ĐỒNG
   Kết nối trực tiếp GPT-5.6
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const chat   = document.getElementById("ai-chat");
    const toggle = document.getElementById("ai-toggle");
    const close  = document.getElementById("ai-close");
    const body   = document.getElementById("ai-body");
    const input  = document.getElementById("ai-input");
    const send   = document.getElementById("ai-send");

    const API = "http://127.0.0.1:3000/chat";

    toggle.onclick = ()=> chat.classList.add("active");
    close.onclick  = ()=> chat.classList.remove("active");

    let history = [];

    function addMessage(html, me=false){

        const div = document.createElement("div");
        div.className = me ? "ai-message user" : "ai-message bot";
        div.innerHTML = html;

        body.appendChild(div);
        body.scrollTop = body.scrollHeight;

    }

    function typing(){

        const div = document.createElement("div");
        div.className="ai-message bot";
        div.id="typing";
        div.innerHTML="🤖 Đang suy nghĩ...";
        body.appendChild(div);
        body.scrollTop=body.scrollHeight;

    }

    function removeTyping(){

        const t=document.getElementById("typing");
        if(t) t.remove();

    }

    async function askGPT(question){

        typing();

        history.push({
            role:"user",
            content:question
        });

        try{

            const res = await fetch(API,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    messages:history
                })
            });

            const data = await res.json();

            removeTyping();

            history.push({
                role:"assistant",
                content:data.reply
            });

            addMessage(data.reply.replace(/\n/g,"<br>"));

        }catch(e){

            removeTyping();

            addMessage(`
                ❌ Không kết nối được AI.

                <br><br>
                Hãy kiểm tra:

                <br>• Server đang chạy
                <br>• npm start chưa tắt
                <br>• Port 3000 hoạt động
            `);

        }

    }

    async function sendMessage(){

        const text=input.value.trim();
        if(!text) return;

        addMessage(text,true);
        input.value="";

        await askGPT(text);

    }

    send.onclick=sendMessage;

    input.addEventListener("keydown",e=>{
        if(e.key==="Enter") sendMessage();
    });

    document.querySelectorAll(".ai-chip").forEach(chip=>{
        chip.onclick=()=>{
            input.value=chip.innerText;
            sendMessage();
        }
    });

    console.log("AI 7.0 PRO FRONTEND READY");

});
