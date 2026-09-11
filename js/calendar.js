fetch("./data/calendar.json")
  .then(res => res.json())
  .then(items => {
    const box = document.getElementById("calendar-list");
    if (!box) return;

    box.innerHTML = items.slice(0, 5).map(item => `
      <div class="calendar-item">

        <div class="calendar-date">
          <div class="calendar-day">${item.weekday}</div>
          <div class="calendar-number">${item.day}</div>
          <div class="calendar-month">${item.month}</div>
        </div>

        <div class="calendar-content">
          <h3>${item.title}</h3>

          <div class="calendar-meta">
            <span>📍 ${item.location}</span>
          </div>
        </div>

        <div class="calendar-right">
          <span class="calendar-type">${item.type}</span>
          <span class="calendar-time">${item.time}</span>
        </div>

      </div>
    `).join("");
  })
  .catch(err => console.error("Calendar:", err));
