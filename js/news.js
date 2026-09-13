const API = "https://script.google.com/macros/s/AKfycbygLfolmilb0eD-sfgT4vshz9IXI65DUHhh7-Uw_hkcYVKC7tD_beGoipCLZSD-jYDlbg/exec";

async function getNews() {
  const res = await fetch(API + "?api=news");
  const data = await res.json();
  return data;
}

async function renderNews() {

  const list = await getNews();

  const wrap = document.getElementById("news-list");
  if (!wrap) return;

  list.sort((a,b)=> b.ngay.localeCompare(a.ngay));

  wrap.innerHTML = list.map((n,i)=>`

    <article class="news-card ${i===0?'featured':''}">
      <a href="pages/article.html?id=${n.id}">
        <img src="${n.anh}" alt="${n.tieude}">
      </a>

      <div class="news-body">
        <div class="news-date">${n.ngay}</div>

        <h3>
          <a href="pages/article.html?id=${n.id}">
            ${n.tieude}
          </a>
        </h3>

        <p>${n.tomtat}</p>

        <a class="read-more" href="pages/article.html?id=${n.id}">
          Đọc tiếp →
        </a>
      </div>
    </article>

  `).join("");

}

document.addEventListener("DOMContentLoaded", renderNews);
