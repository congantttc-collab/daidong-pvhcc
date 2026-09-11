fetch("./data/calendar.json")
  .then(res => res.json())
  .then(events => {
    const box = document.getElementById("calendar-list");
    if (!box) return;

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    box.innerHTML = events.slice(0, 5).map(ev => {
      const isToday = ev.fullDate === todayStr;

      return `
      <a href="pages/calendar.html?id=${ev.id}" class="calendar-item ${isToday ? 'today' : ''}">
        <div class="cal-date">
          <span class="weekday">${ev.weekday}</span>
          <span class="day">${ev.day}</span>
          <span class="month">${ev.month}</span>
        </div>

        <div class="cal-content">
          <div class="cal-top">
            <h3>${ev.title}</h3>
            ${isToday ? '<span class="today-badge">HÔM NAY</span>' : ''}
          </div>

          <div class="cal-meta">
            📍 ${ev.location}
          </div>
        </div>

        <div class="cal-right">
          <span class="type">${ev.type}</span>
          <span class="time">${ev.time}</span>
        </div>
      </a>
      `;
    }).join("");
  })
  .catch(err => console.error("Calendar:", err));
