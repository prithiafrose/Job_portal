const API_BASE = 'http://localhost:5001/api/auth'; // Uses auth routes

const token = localStorage.getItem('token');

if (!token) {
    window.location.href = '../Auth/login.html';
}

async function fetchProfile() {
    try {
        const res = await fetch(`${API_BASE}/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.status === 401) {
            window.location.href = '../Auth/login.html';
            return;
        }

        const data = await res.json();
        const user = data.user;
        
        document.getElementById('username').value = user.username;
        document.getElementById('email').value = user.email;
        document.getElementById('mobile').value = user.mobile;
        
    } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Failed to load profile');
    }
}

document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const mobile = document.getElementById('mobile').value;
    const password = document.getElementById('password').value;
    
    const body = { username, email, mobile };
    if (password) body.password = password;
    
    try {
        const res = await fetch(`${API_BASE}/profile`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        const data = await res.json();
        
        if (res.ok) {
            alert('Profile updated successfully');
            // Update local storage user info if needed (though mostly just token is used)
        } else {
            alert(data.error || 'Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile');
    }
});

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    window.location.href = '../Auth/login.html';
});

// Initialize
fetchProfile();
