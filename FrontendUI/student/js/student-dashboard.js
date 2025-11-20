const API_BASE = 'http://localhost:5001/apply-job'; // Note: /apply-job route prefix
// Wait, applicationsController routes are mounted at /apply-job in Server.js
// So /apply-job/my-applications is the endpoint.

const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

if (!token) {
    window.location.href = '../Auth/login.html';
}

if (role && role !== 'student') {
    // Optional: Redirect if not student, but maybe allow them to see?
    // Usually good to restrict.
    // alert('You are logged in as ' + role + '. Redirecting to your dashboard.');
    // if (role === 'admin') window.location.href = '../admin/dashboard.html';
    // if (role === 'recruiter') window.location.href = '../recruiter/dashboard.html';
}

async function fetchApplications() {
    try {
        const res = await fetch(`${API_BASE}/my-applications`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 401) {
            window.location.href = '../Auth/login.html';
            return;
        }

        const applications = await res.json();
        renderApplications(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        document.getElementById('applications-list').innerHTML = '<tr><td colspan="6">Error loading applications</td></tr>';
    }
}

function renderApplications(apps) {
    const tbody = document.getElementById('applications-list');
    
    if (apps.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">You haven\'t applied to any jobs yet.</td></tr>';
        return;
    }

    tbody.innerHTML = apps.map(app => {
        const job = app.Job || {};
        const statusClass = `status-${app.status || 'pending'}`;
        return `
            <tr>
                <td>${job.job_position || 'Unknown Job'}</td>
                <td>${job.company_name || 'Unknown Company'}</td>
                <td>${job.location || 'N/A'}</td>
                <td>${job.monthly_salary ? '₹' + job.monthly_salary : 'N/A'}</td>
                <td>${new Date(app.createdAt).toLocaleDateString()}</td>
                <td class="${statusClass}">${(app.status || 'Pending').toUpperCase()}</td>
            </tr>
        `;
    }).join('');
}

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    window.location.href = '../Auth/login.html';
});

// Initialize
fetchApplications();
