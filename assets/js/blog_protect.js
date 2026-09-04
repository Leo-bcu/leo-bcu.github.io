/* =============================================================
 * Blog Password Protection (New Feature)
 * -------------------------------------------------------------
 * - 密码为多组固定值，每一组均以 SHA-256 哈希形式存储（非明文）
 * - 对用户输入进行 SHA-256 后，只要命中哈希数组中的任意一个即通过
 * - 全局毛玻璃覆盖层 + 密码输入框 + 确认按钮 + 返回按钮
 * - 验证成功后将状态存入 sessionStorage（会话级）
 * - 本文件为新增内容，不修改任何既有功能代码
 * ============================================================= */
(function () {
    'use strict';

    /* ----------------------------------------------------------
     * 加密存储的密码列表（SHA-256 哈希数组）——命中任意一个即通过验证
     *   当前明文对应关系（可自由增删）：
     *     [0] mengli   （主访问密码）
     *     [1] BruceLeo   （访客阅读密码）
     *     [2] mengli0105  （管理员密码）
     *   如需新增/修改密码，可用以下命令生成新哈希：
     *     echo -n "你的新密码" | shasum -a 256 | awk '{print $1}'
     *   然后把结果字符串追加到 BLOG_PROTECT_HASHES 数组即可。
     * ---------------------------------------------------------- */
    var BLOG_PROTECT_HASHES = [
        '00792cb9930848e85f994ad699e3fe8004d7668106baf718557e2f14fdb2ed61',
        '843fbbcf767a3889a070ec787a8b4e61825a4efe86e7062fd080f4099dfcafcc',
        'a8d3f98ecc55e0eaab3dff7da37f19d52fa3194110bfc7edfda56ccf95f84dc6',
    ];
    // 可选：加盐（保持空串即可，可自定义任意字符串增强单向性；
    //       注意：修改后之前的所有哈希都需以相同盐值重新生成）
    var BLOG_PROTECT_SALT = '';

    // STORAGE_KEY 基于第一个哈希生成，便于密码轮换后旧会话自动失效
    var STORAGE_KEY = 'blog_protect_unlocked_' + (BLOG_PROTECT_HASHES[0] || '').slice(0, 8);

    /* ---------- DOM refs ---------- */
    var overlay, input, form, errorBox, backBtn, toggleBtn, submitBtn;

    /* ---------- Utility: SHA-256 via SubtleCrypto ---------- */
    function sha256(str) {
        var buf = new TextEncoder().encode(str);
        return crypto.subtle.digest('SHA-256', buf).then(function (digest) {
            return Array.from(new Uint8Array(digest))
                .map(function (b) { return b.toString(16).padStart(2, '0'); })
                .join('');
        });
    }

    /* ---------- UI helpers ---------- */
    function showOverlay() {
        if (!overlay) return;
        overlay.style.display = 'block';
        document.body.classList.add('blog-protect-locked');
        setTimeout(function () {
            if (input) input.focus();
        }, 150);
    }

    function hideOverlay() {
        if (!overlay) return;
        overlay.style.display = 'none';
        document.body.classList.remove('blog-protect-locked');
    }

    function showError(msg) {
        if (!errorBox) return;
        errorBox.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + (msg || '密码错误，请重试');
        errorBox.style.display = 'flex';
        // Re-trigger animation
        errorBox.style.animation = 'none';
        void errorBox.offsetWidth;
        errorBox.style.animation = '';
    }

    function hideError() {
        if (errorBox) errorBox.style.display = 'none';
    }

    /* ---------- Verify password (multi-hash) ---------- */
    function verifyPassword(plain) {
        var toHash = (BLOG_PROTECT_SALT ? BLOG_PROTECT_SALT + '::' : '') + plain;
        return sha256(toHash).then(function (h) {
            // 命中哈希数组中任意一个即通过（支持多密码）
            return BLOG_PROTECT_HASHES.indexOf(h) !== -1;
        });
    }

    /* ---------- Event: form submit ---------- */
    function onSubmit(e) {
        e.preventDefault();
        var val = input.value;
        if (!val) {
            showError('请输入密码');
            return;
        }
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 验证中...';
        hideError();

        verifyPassword(val).then(function (ok) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-check"></i> 确认';
            if (ok) {
                try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (_) {}
                hideOverlay();
                // Clear input for safety
                input.value = '';
            } else {
                showError('密码错误，请重试');
                input.select();
            }
        }).catch(function () {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-check"></i> 确认';
            showError('验证失败，请重试');
        });
    }

    /* ---------- Event: back button ---------- */
    function onBack() {
        // If there is a previous history entry, go back; otherwise go home.
        if (window.history.length > 1 && document.referrer) {
            window.history.back();
        } else {
            // Try site root
            var base = (document.querySelector('base') || {}).href || '/';
            window.location.href = base;
        }
    }

    /* ---------- Event: toggle password visibility ---------- */
    function onTogglePw() {
        if (!input) return;
        var isPw = input.type === 'password';
        input.type = isPw ? 'text' : 'password';
        var icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.className = isPw ? 'fas fa-eye-slash' : 'fas fa-eye';
        }
    }

    /* ---------- Init ---------- */
    function init() {
        overlay    = document.getElementById('blog-protect-overlay');
        form       = document.getElementById('blog-protect-form');
        input      = document.getElementById('blog-protect-password');
        errorBox   = document.getElementById('blog-protect-error');
        backBtn    = document.getElementById('blog-protect-back');
        toggleBtn  = document.getElementById('blog-protect-toggle-pw');
        submitBtn  = document.getElementById('blog-protect-submit');

        if (!overlay) return; // modal not included on this page

        // Already unlocked in current session → skip
        var unlocked = false;
        try { unlocked = sessionStorage.getItem(STORAGE_KEY) === '1'; } catch (_) {}
        if (unlocked) return;

        // Wire events
        if (form)      form.addEventListener('submit', onSubmit);
        if (backBtn)   backBtn.addEventListener('click', onBack);
        if (toggleBtn) toggleBtn.addEventListener('click', onTogglePw);
        if (input) {
            input.addEventListener('input', hideError);
            // Allow Enter key to submit (default form behavior already does this)
            // Escape → back
            input.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') { e.preventDefault(); onBack(); }
            });
        }
        // Global Escape → back (when overlay visible)
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay.style.display === 'block'
                && document.activeElement !== input) {
                onBack();
            }
        });

        showOverlay();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
