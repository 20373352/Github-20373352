window.onload = function() {
    initializeApp();
}

function initializeApp() {
    // 初始化用户状态
    if(Kernal.isLogin()) {
        initUserInfo();
    }

    // 设置搜索按钮监听器
    document.getElementById('search-btn').addEventListener('click', function() {
        search();
    });

    // 设置登录按钮监听器
    document.getElementById('top-right').addEventListener('click', function() {
        clickLogin();
    });

    // 添加回车键搜索功能
    const searchInput = document.getElementById('input_');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                search();
            }
        });

        // 添加输入框焦点效果
        searchInput.addEventListener('focus', function() {
            this.parentElement.parentElement.classList.add('search-focused');
        });

        searchInput.addEventListener('blur', function() {
            this.parentElement.parentElement.classList.remove('search-focused');
        });
    }

    // 添加热榜项目点击事件
    initHotListEvents();

    // 添加Logo点击事件
    const logo = document.getElementById('logo');
    if (logo) {
        logo.addEventListener('click', function() {
            showMessage('百度一下，你就知道！', 'info');
        });
    }
}

function search() {
    const searchInput = document.getElementById('input_');
    const query = searchInput ? searchInput.value.trim() : '';
    
    if (!query) {
        showMessage('请输入搜索内容', 'warning');
        searchInput.focus();
        return;
    }
    
    // 显示搜索提示
    showMessage(`正在搜索: ${query}`, 'info');
    
    // 模拟搜索延迟，然后跳转到百度搜索
    setTimeout(() => {
        const baiduSearchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`;
        window.open(baiduSearchUrl, '_blank');
    }, 500);
}

function clickLogin() {
    if(!Kernal.isLogin()) {
        login();
    }
    else {
        logout();
    }
}

function initUserInfo() {
    try {
        const username = Kernal.getUserName() || '用户';
        const userAvatar = './img/user.jpg'; // 修正图片路径
        
        const content = `
            <div id="user">
                <span id="user-img">
                    <img src="${userAvatar}" alt="用户头像" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiNmMGYwZjAiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMCIgcj0iMyIgZmlsbD0iIzk5OTk5OSIvPgo8cGF0aCBkPSJtNiAxOC41YzAtMy41IDIuNS02IDYtNnM2IDIuNSA2IDYiIGZpbGw9IiM5OTk5OTkiLz4KPC9zdmc+'" />
                </span>
                <span id="name">${username}</span>
            </div>
        `;
        
        document.getElementById('top-right').innerHTML = content;
        
        // 添加用户菜单点击事件
        const userElement = document.getElementById('user');
        if (userElement) {
            userElement.addEventListener('click', function(e) {
                e.stopPropagation();
                showUserMenu();
            });
        }
    } catch (error) {
        console.error('初始化用户信息失败:', error);
        showMessage('用户信息加载失败', 'error');
    }
}

// ============================================================ 新增的辅助函数

function initHotListEvents() {
    const hotItems = document.querySelectorAll('#hot li');
    hotItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const gameContent = this.querySelector('.hot-content');
            if (gameContent) {
                const gameName = gameContent.textContent;
                showMessage(`点击了热榜第${index + 1}名: ${gameName}`, 'info');
                
                // 模拟搜索该游戏
                setTimeout(() => {
                    const searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(gameName)}`;
                    window.open(searchUrl, '_blank');
                }, 300);
            }
        });

        // 添加悬停效果
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.transition = 'transform 0.2s ease';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

function showMessage(message, type = 'info') {
    // 移除已存在的消息
    const existingMessage = document.querySelector('.message-toast');
    if (existingMessage) {
        existingMessage.remove();
    }

    // 创建消息元素
    const messageElement = document.createElement('div');
    messageElement.className = `message-toast message-${type}`;
    messageElement.textContent = message;

    // 添加到页面
    document.body.appendChild(messageElement);

    // 显示动画
    setTimeout(() => {
        messageElement.classList.add('show');
    }, 10);

    // 自动隐藏
    setTimeout(() => {
        messageElement.classList.remove('show');
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 300);
    }, 3000);
}

function showUserMenu() {
    // 移除已存在的菜单
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }

    // 创建用户菜单
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="menu-item" onclick="showMessage('个人中心功能开发中', 'info')">个人中心</div>
        <div class="menu-item" onclick="showMessage('设置功能开发中', 'info')">设置</div>
        <div class="menu-separator"></div>
        <div class="menu-item" onclick="logout()">退出登录</div>
    `;

    // 定位菜单
    const userElement = document.getElementById('user');
    const rect = userElement.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = (rect.bottom + 5) + 'px';
    menu.style.right = '24px';

    document.body.appendChild(menu);

    // 点击其他地方关闭菜单
    setTimeout(() => {
        document.addEventListener('click', function closeMenu() {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        });
    }, 10);
}

// ============================================================ 你不需要去关注的代码

function login() {
    Kernal.login();
    location.reload();
}

function logout() {
    Kernal.logout();
    location.reload();
}
