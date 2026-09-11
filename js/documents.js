fetch("data/documents.json")
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
          <span class="pdf-badge">PDF</span>
          <span class="type-badge">${doc.type}</span>
          <span class="doc-arrow">→</span>
        </div>
      </a>
    `).join("");
  })
  .catch(err => console.error("Documents:", err));
