fetch("data/news.json")
  .then(res => res.json())
  .then(news => {
    // Sắp xếp mới nhất
    news.sort((a, b) => b.id - a.id);

    const featured = news[0];
    const others = news.slice(1, 5);

    // ===== Tin nổi bật =====
    document.getElementById("featured-news").innerHTML = `
      <a href="pages/article.html?id=${featured.id}" class="featured-link">
        <div class="featured-card">
          <img src="${featured.image}" alt="${featured.title}">
          <div class="featured-overlay">
            <span class="badge">${featured.category}</span>
            <h3>${featured.title}</h3>
            <p>${featured.date}</p>
          </div>
        </div>
      </a>
    `;

    // ===== 4 tin mới =====
   const list = document.getElementById("news-sidebar");
    list.innerHTML = "";

    others.forEach(item => {
      list.innerHTML += `
        <a href="pages/article.html?id=${item.id}" class="news-item">
          <img src="${item.image}" alt="${item.title}">
          <div>
            <small>${item.date}</small>
            <h4>${item.title}</h4>
          </div>
        </a>
      `;
    });
  })
  .catch(err => console.error("News:", err));
