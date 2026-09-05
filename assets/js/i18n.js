// ===== 中英文切换 (CN/EN toggle) =====
// 规则：
//  - [data-zh] 元素：JS 直接替换其文本内容（英文为默认内容，中文存于 data-zh 属性）
//  - .lang-en / .lang-zh 元素：成对渲染、按语言显示隐藏（用于含 HTML 的富文本）
//  - 偏好保存在 localStorage，默认英文，不做浏览器语言自动检测
(function () {
    var STORAGE_KEY = 'site-lang';
    var SUPPORTED = ['en', 'zh'];

    function getSavedLang() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }

    function detectLang() {
        var saved = getSavedLang();
        if (SUPPORTED.indexOf(saved) !== -1) return saved;
        return 'en';
    }

    function applyLang(lang) {
        var isZh = lang === 'zh';
        document.documentElement.classList.toggle('lang-zh', isZh);
        document.documentElement.lang = isZh ? 'zh-CN' : 'en';

        // 文本替换类：data-zh
        var nodes = document.querySelectorAll('[data-zh]');
        for (var i = 0; i < nodes.length; i++) {
            var el = nodes[i];
            if (el.dataset.enText === undefined) {
                el.dataset.enText = el.textContent;
            }
            el.textContent = isZh ? el.getAttribute('data-zh') : el.dataset.enText;
        }

        // 开关按钮状态
        var btns = document.querySelectorAll('.lang-btn');
        for (var j = 0; j < btns.length; j++) {
            var btn = btns[j];
            var active = btn.getAttribute('data-lang-set') === lang;
            btn.classList.toggle('active', active);
            btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        }

        try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
    }

    var buttons = document.querySelectorAll('.lang-btn');
    for (var k = 0; k < buttons.length; k++) {
        buttons[k].addEventListener('click', function () {
            applyLang(this.getAttribute('data-lang-set'));
        });
    }

    applyLang(detectLang());
})();
