// ===== TRA CỨU THỦ TỤC HÀNH CHÍNH =====

let procedures = [];
let currentField = "all";

fetch("./data/procedures.json")
  .then(res => res.json())
  .then(data => {
    procedures = data;
    renderResults(procedures);
  });

// Hiển thị kết quả
function renderResults(list) {
  const box = document.getElementById("search-result");
  if (!box) return;

  if (list.length === 0) {
    box.innerHTML = `
      <div class="empty-result">
        Không tìm thấy thủ tục phù hợp.
      </div>`;
    return;
  }

  box.innerHTML = list.map(item => `
    <div class="procedure-card">

      <div class="procedure-top">
        <span class="field">${item.linhVuc}</span>
        <span class="level">${item.mucDo}</span>
      </div>

      <h3>${item.ten}</h3>

      <div class="procedure-info">
        ⏱ ${item.thoiHan} &nbsp;&nbsp; • &nbsp;&nbsp;
        💰 ${item.lePhi}
      </div>

      <a href="${item.bieuMau}" target="_blank" class="download-btn">
        📄 Tải biểu mẫu
      </a>

    </div>
  `).join("");
}

// Tìm kiếm
function searchProcedure() {

  const keyword = document
    .getElementById("searchInput")
    .value.toLowerCase();

  let result = procedures.filter(item =>
    item.ten.toLowerCase().includes(keyword)
  );

  if (currentField !== "all") {
    result = result.filter(item => item.linhVuc === currentField);
  }

  renderResults(result);
}

// Nút Tra cứu
document.getElementById("searchBtn")
  ?.addEventListener("click", searchProcedure);

// Gõ là tìm luôn
document.getElementById("searchInput")
  ?.addEventListener("input", searchProcedure);

// Bộ lọc
document.querySelectorAll(".filter-btn").forEach(btn => {

  btn.addEventListener("click", () => {

    document.querySelectorAll(".filter-btn")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

    currentField = btn.dataset.field;

    searchProcedure();

  });

});
