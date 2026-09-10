fetch("data/news.json")
.then(res => res.json())
.then(data => {

    const featured = document.getElementById("featured-news");
    const sidebar = document.getElementById("news-sidebar");

    if(!featured || !sidebar) return;

    const first = data[0];

    featured.innerHTML = `
        <a class="featured-card" href="${first.link}">
            <img src="${first.image}" alt="${first.title}">
            <div class="featured-overlay">
                <span class="featured-category">${first.category}</span>
                <h3>${first.title}</h3>
                <div class="featured-date">${first.date}</div>
            </div>
        </a>
    `;

    sidebar.innerHTML = "";

    data.slice(1,5).forEach(item=>{
        sidebar.innerHTML += `
        <a class="news-mini" href="${item.link}">
            <img src="${item.image}" alt="${item.title}">
            <div>
                <small>${item.date}</small>
                <h4>${item.title}</h4>
            </div>
        </a>
        `;
    });

});
