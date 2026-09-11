fetch("./data/documents.json")
  .then(res => res.json())
  .then(docs => {
    const box = document.getElementById("documents-list");
    if (!box) return;

    box.innerHTML = docs.slice(0, 5).map(doc => `
      <a href="pages/document.html?id=${doc.id}" class="doc-item">
        <div class="doc-left">
          <div class="doc-meta">
            <span>${doc.date}</span>
            <span>•</span>
            <span>${doc.number}</span>
          </div>

          <h3>${doc.title}</h3>

          <p>${doc.summary}</p>
        </div>

       <div class="doc-right">
    <div class="pdf-icon">
        <icon name=file-pdf color="#D70000" size=lg/>
        <span>PDF</span>
    </div>

    <span class="type-badge">${doc.type}</span>

    ${doc.id <= 2 ? '<span class="status-badge">MỚI</span>' : ''}

    <span class="doc-arrow">➜</span>
</div>
        </div>
      </a>
    `).join("");
  })
  .catch(err => console.error("Documents:", err));
