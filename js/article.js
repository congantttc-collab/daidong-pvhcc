// Lấy id từ URL: article.html?id=1
const params = new URLSearchParams(window.location.search);
const articleId = Number(params.get("id"));

fetch("../data/news.json")
  .then(res => res.json())
  .then(news => {

    const article = news.find(item => item.id === articleId);

    if (!article) {
      document.getElementById("article-container").innerHTML =
        "<h2>Không tìm thấy bài viết.</h2>";
      return;
    }

    // Đổi tiêu đề trình duyệt
    document.title = article.title;

    // Breadcrumb
    document.getElementById("bc-category").textContent = article.category;

    // Hiển thị bài viết
    document.getElementById("article-container").innerHTML = `
      <div class="article-category">${article.category.toUpperCase()}</div>

      <h1 class="article-title">${article.title}</h1>

      <div class="article-meta">
        <span>🗓 ${article.date}</span>
        <span>🏛 Trung tâm PVHCC xã Đại Đồng</span>
      </div>

      <div class="article-summary">
        ${article.summary}
      </div>

      <img src="../${article.image}" alt="${article.title}" class="article-cover">

      <div class="article-content">
        ${article.content}
      </div>

      <hr>

      <div class="share-box">
        <button class="share-btn facebook">Facebook</button>
        <button class="share-btn zalo">Zalo</button>
        <button class="share-btn print" onclick="window.print()">In bài viết</button>
      </div>
    `;

  })
  .catch(() => {
    document.getElementById("article-container").innerHTML =
      "<h2>Lỗi tải dữ liệu.</h2>";
  });
