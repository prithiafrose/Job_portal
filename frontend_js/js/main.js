document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('search-form');
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const q = document.getElementById('search-query').value;
    location.href = 'pages/jobs.html?q=' + encodeURIComponent(q);
  });

  try {
    const res = await fetch(API_BASE + '/jobs?limit=6');
    const data = await res.json();
    const container = document.getElementById('jobs-list');
    container.innerHTML = '';
    data.jobs.forEach(job => {
      const card = document.createElement('div');
      card.className = 'job-card';
      card.innerHTML = `
        <h3>${escapeHTML(job.title)}</h3>
        <div class="meta">${escapeHTML(job.company)} • ${escapeHTML(job.location||'')}</div>
        <p>${escapeHTML((job.description||'').slice(0,120))}...</p>
        <a href="pages/job-details.html?id=${job.id}">View</a>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Failed to load featured jobs', err);
  }
});
