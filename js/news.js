fetch("data/news.json")
  .then(res => res.json())
  .then(news => {
    news.sort((a, b) => b.id - a.id);

    const featured = news[0];
    const others = news.slice(1, 5);

    document.getElementById("featured-news").innerHTML = `
      <a href="pages/article.html?id=${featured.id}" class="featured-card">
        <img src="${featured.image}" alt="${featured.title}">
        <div class="featured-content">
          <span class="news-date">${featured.date}</span>
          <h3>${featured.title}</h3>
        </div>
      </a>
    `;

    document.getElementById("news-sidebar").innerHTML =
      others.map(item => `
        <a href="pages/article.html?id=${item.id}" class="news-item">
          <img src="${item.image}" alt="${item.title}">
          <div class="news-info">
            <span>${item.date}</span>
            <h4>${item.title}</h4>
          </div>
        </a>
      `).join("");
  })
  .catch(err => console.error("News:", err));
