const API_BASE = 'http://localhost:5001/api/admin';

// Auth Check
const token = localStorage.getItem('token');
const userRole = localStorage.getItem('role');

if (!token || userRole !== 'admin') {
    alert('Unauthorized access. Please login as admin.');
    window.location.href = '../Auth/login.html';
}

async function fetchJobs() {
    try {
        const res = await fetch(`${API_BASE}/jobs`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.status === 401) {
            window.location.href = '../Auth/login.html';
            return;
        }
        
        const jobs = await res.json();
        renderJobs(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        alert('Failed to load jobs');
    }
}

function renderJobs(jobs) {
    const tbody = document.getElementById('jobs-table-body');
    tbody.innerHTML = '';
    
    jobs.forEach(job => {
        const tr = document.createElement('tr');
        const status = job.status || 'pending';
        let actions = '';
        
        if (status === 'pending') {
            actions += `<button class="btn" style="background-color:#28a745; margin-right:5px;" onclick="updateStatus(${job.id}, 'active')">Approve</button>`;
            actions += `<button class="btn" style="background-color:#ffc107; margin-right:5px;" onclick="updateStatus(${job.id}, 'rejected')">Reject</button>`;
        } else if (status === 'active') {
             actions += `<button class="btn" style="background-color:#ffc107; margin-right:5px;" onclick="updateStatus(${job.id}, 'rejected')">Reject</button>`;
        } else if (status === 'rejected') {
             actions += `<button class="btn" style="background-color:#28a745; margin-right:5px;" onclick="updateStatus(${job.id}, 'active')">Approve</button>`;
        }
        
        actions += `<button class="btn" style="background-color:#ff4d4d" onclick="deleteJob(${job.id})">Delete</button>`;

        tr.innerHTML = `
            <td>${job.id}</td>
            <td>${job.job_position}</td>
            <td>${job.company_name}</td>
            <td>${status.toUpperCase()}</td>
            <td>${actions}</td>
        `;
        tbody.appendChild(tr);
    });
}

async function updateStatus(id, status) {
    try {
        const res = await fetch(`${API_BASE}/jobs/${id}/status`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        if (res.ok) {
            // alert(`Job ${status} successfully`);
            fetchJobs();
        } else {
            const data = await res.json();
            alert(data.error || 'Failed to update status');
        }
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Error updating status');
    }
}

async function deleteJob(id) {
    if (!confirm('Are you sure you want to delete this job?')) return;
    
    try {
        const res = await fetch(`${API_BASE}/jobs/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
            alert('Job deleted successfully');
            fetchJobs();
        } else {
            const data = await res.json();
            alert(data.error || 'Failed to delete job');
        }
    } catch (error) {
        console.error('Error deleting job:', error);
        alert('Error deleting job');
    }
}

// Initialize
fetchJobs();
