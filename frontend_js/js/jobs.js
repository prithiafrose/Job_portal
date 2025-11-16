document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(location.search);
  const q = params.get('q') || '';
  const page = Number(params.get('page') || 1);
  const limit = Number(params.get('limit') || 10);
  const typeParam = params.get('type') || '';
  const locationParam = params.get('location') || '';

  const qEl = document.getElementById('q');
  const typeEl = document.getElementById('type');
  const locationEl = document.getElementById('location');

  if (qEl) qEl.value = q;
  if (typeEl) typeEl.value = typeParam;
  if (locationEl) locationEl.value = locationParam;

  document.getElementById('list-filter')?.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const query = qEl.value;
    const type = typeEl.value;
    const location = locationEl.value;
    const url = new URL(location.href);
    url.searchParams.set('q', query || '');
    if (type) url.searchParams.set('type', type); else url.searchParams.delete('type');
    if (location) url.searchParams.set('location', location); else url.searchParams.delete('location');
    url.searchParams.set('page', '1');
    location.href = url.toString();
  });

  async function load(pageNum = 1) {
    const url = new URL(API_BASE + '/jobs');
    url.searchParams.set('q', q);
    url.searchParams.set('page', pageNum);
    url.searchParams.set('limit', limit);
    if (typeParam) url.searchParams.set('type', typeParam);
    if (locationParam) url.searchParams.set('location', locationParam);

    const res = await fetch(url.toString());
    const body = await res.json();
    const list = document.getElementById('jobs-list');
    list.innerHTML = '';
    body.jobs.forEach(job => {
      const item = document.createElement('div');
      item.className = 'job-item';
      item.innerHTML = `
        <div class="left">
          <a href="job-details.html?id=${job.id}"><strong>${escapeHTML(job.title)}</strong></a>
          <div class="meta">${escapeHTML(job.company)} • ${escapeHTML(job.location||'')}</div>
        </div>
        <div class="right">
          <a href="job-details.html?id=${job.id}">View</a>
        </div>
      `;
      list.appendChild(item);
    });

    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    const totalPages = Math.ceil(body.total / limit) || 1;
    for (let p = 1; p <= totalPages; p++) {
      const btn = document.createElement('button');
      btn.textContent = p;
      if (p === pageNum) btn.disabled = true;
      btn.addEventListener('click', () => {
        const urlp = new URL(location.href);
        urlp.searchParams.set('page', p);
        location.href = urlp.toString();
      });
      pagination.appendChild(btn);
      if (p >= 10) break;
    }
  }

  load(page);
});
