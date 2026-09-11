fetch("data/news.json")
  .then(res => res.json())
  .then(news => {

    const featured = document.getElementById("featured-news");
    const sidebar = document.getElementById("news-sidebar");

    if (!featured || !sidebar) return;

    // Tin nổi bật
    const first = news[0];

    featured.innerHTML = `
      <a href="pages/article.html?id=${first.id}" class="featured-card">
        <div class="featured-image">
          <img src="${first.image}" alt="${first.title}">
          <span class="featured-badge">TIN NỔI BẬT</span>
        </div>

        <div class="featured-content">
          <h3>${first.title}</h3>
          <p>${first.summary}</p>

          <div class="featured-meta">
          <span>${first.date} • ${first.category}</span>
            <span class="arrow">→</span>
          </div>
        </div>
      </a>
    `;

    // 4 tin nhỏ bên phải
    sidebar.innerHTML = news.slice(1,5).map(item => `
      <a href="pages/article.html?id=${item.id}" class="side-news">
        <img src="${item.image}" alt="${item.title}">

        <div class="side-content">
          <span class="side-date">${item.date}</span>
          <h4>${item.title}</h4>
        </div>
      </a>
    `).join("");

  })
  .catch(err => console.error("News:", err));
