const API_BASE = 'http://localhost:5001/api/admin';

// Auth Check
const token = localStorage.getItem('token');
const userRole = localStorage.getItem('role');

if (!token || userRole !== 'admin') {
    alert('Unauthorized access. Please login as admin.');
    window.location.href = '../Auth/login.html';
}

async function fetchUsers() {
    try {
        const res = await fetch(`${API_BASE}/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.status === 401) {
            window.location.href = '../Auth/login.html';
            return;
        }
        
        const users = await res.json();
        renderUsers(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to load users');
    }
}

function renderUsers(users) {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.mobile}</td>
            <td>${user.role}</td>
            <td>
                <button class="btn" style="background-color:#ff4d4d" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    
    try {
        const res = await fetch(`${API_BASE}/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await res.json();
        
        if (res.ok) {
            alert('User deleted successfully');
            fetchUsers();
        } else {
            alert(data.error || 'Failed to delete user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
    }
}

// Initialize
fetchUsers();
