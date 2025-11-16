// Kernal模块 - 用户登录/登出功能
const Kernal = {
    // 模拟用户数据
    users: [
        { id: 1, username: 'testuser', password: '123456', avatar: 'https://via.placeholder.com/32x32/4e6ef2/ffffff?text=T' },
        { id: 2, username: 'admin', password: 'admin123', avatar: 'https://via.placeholder.com/32x32/315efb/ffffff?text=A' }
    ],
    
    currentUser: null,
    
    // 登录功能
    login: function(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            return { success: true, user: user };
        }
        return { success: false, message: '用户名或密码错误' };
    },
    
    // 登出功能
    logout: function() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        return { success: true };
    },
    
    // 获取当前用户
    getCurrentUser: function() {
        if (!this.currentUser) {
            const stored = localStorage.getItem('currentUser');
            if (stored) {
                this.currentUser = JSON.parse(stored);
            }
        }
        return this.currentUser;
    },
    
    // 检查是否已登录
    isLoggedIn: function() {
        return this.getCurrentUser() !== null;
    }
};

// 导出到全局
window.Kernal = Kernal;