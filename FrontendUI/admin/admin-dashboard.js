const API_BASE = 'http://localhost:5001/api/admin';

// Auth Check
const token = localStorage.getItem('token');
const userRole = localStorage.getItem('role');

if (!token || userRole !== 'admin') {
    alert('Unauthorized access. Please login as admin.');
    window.location.href = '../Auth/login.html';
}

async function fetchStats() {
    try {
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [userStatsRes, jobStatsRes, pendingRes, recentRes] = await Promise.all([
            fetch(`${API_BASE}/users/stats`, { headers }),
            fetch(`${API_BASE}/jobs/stats`, { headers }),
            fetch(`${API_BASE}/jobs/pending`, { headers }),
            fetch(`${API_BASE}/users/recent`, { headers })
        ]);

        if (userStatsRes.status === 401) {
            window.location.href = '../Auth/login.html';
            return;
        }

        const userStats = await userStatsRes.json();
        const jobStats = await jobStatsRes.json();
        const pendingStats = await pendingRes.json();
        const recentStats = await recentRes.json();

        // Update UI
        // Finding elements by text content or structure since they don't have IDs in the HTML provided
        // To make it robust, I should probably add IDs to the HTML.
        // But let's try to select by card order as a fallback if I can't edit HTML immediately (though I can).
        // Best approach: Update HTML to have IDs, then update JS.
        
        document.getElementById('total-users').textContent = userStats.totalUsers;
        document.getElementById('total-jobs').textContent = jobStats.totalJobs;
        document.getElementById('pending-approvals').textContent = pendingStats.pendingCount;
        document.getElementById('recent-registrations').textContent = recentStats.recentCount;

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
    }
}

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    window.location.href = '../Auth/login.html';
});

// Initialize
fetchStats();
