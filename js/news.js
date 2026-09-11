document.addEventListener("DOMContentLoaded", async () => {
  const featured = document.getElementById("featured-news");
  const sidebar = document.getElementById("news-sidebar");

  if (!featured || !sidebar) return;

  try {
    const res = await fetch("data/news.json");
    const news = await res.json();

    if (!Array.isArray(news) || news.length === 0) return;

    // Tin nổi bật
    const first = news[0];

    featured.innerHTML = `
      <a href="pages/article.html?id=${first.id}" class="featured-card">
        <div class="featured-image">
          <img src="${first.image}" alt="${first.title}">
          <span class="featured-badge">TIN NỔI BẬT</span>
        </div>

        <div class="featured-content">
          <div class="news-date">${first.date}</div>
          <h3>${first.title}</h3>
          <p>${first.summary}</p>

          <div class="read-more">
            Đọc tiếp
            <span>→</span>
          </div>
        </div>
      </a>
    `;

    // 4 tin nhỏ bên phải
    sidebar.innerHTML = "";

    news.slice(1, 5).forEach(item => {
      sidebar.innerHTML += `
        <a href="pages/article.html?id=${item.id}" class="side-news">
          <img src="${item.image}" alt="${item.title}">
          <div class="side-content">
            <div class="news-date">${item.date}</div>
            <h4>${item.title}</h4>
            <span class="arrow">→</span>
          </div>
        </a>
      `;
    });

  } catch (err) {
    console.error("Lỗi tải tin tức:", err);

    featured.innerHTML = `
      <div class="news-error">
        Không tải được dữ liệu tin tức.
      </div>
    `;
  }
});
