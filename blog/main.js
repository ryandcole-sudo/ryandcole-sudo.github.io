window.onload = function () {

    // ---- Copy-to-clipboard button on code blocks (unchanged, but kept) ----
    var copy_svg = "<svg tabindex=\"0\" class='copy_svg' width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><rect width='24' height='24' stroke='none' fill='#000000' opacity='0'/>\r\n\r\n\r\n<g transform=\"matrix(0.8 0 0 0.8 12 12)\" >\r\n<path style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\" transform=\" translate(-15, -14.5)\" d=\"M 11 2 C 9.895 2 9 2.895 9 4 L 9 20 C 9 21.105 9.895 22 11 22 L 24 22 C 25.105 22 26 21.105 26 20 L 26 8.5 C 26 8.235 25.895031 7.9809687 25.707031 7.7929688 L 20.207031 2.2929688 C 20.019031 2.1049687 19.765 2 19.5 2 L 11 2 z M 19 3.9042969 L 24.095703 9 L 20 9 C 19.448 9 19 8.552 19 8 L 19 3.9042969 z M 6 7 C 4.895 7 4 7.895 4 9 L 4 25 C 4 26.105 4.895 27 6 27 L 19 27 C 20.105 27 21 26.105 21 25 L 21 24 L 11 24 C 8.794 24 7 22.206 7 20 L 7 7 L 6 7 z\" stroke-linecap=\"round\" />\r\n</g>\r\n</svg>";

    if (typeof u === 'function') {
        u(".highlight").append(copy_svg);
        u(".copy_svg").on("click", e => {
            var code = e.currentTarget.parentElement;
            navigator.clipboard.writeText(code.innerText);
            toast_text("Copied to clipboard!");
        });
    } else {
        document.querySelectorAll(".highlight").forEach(block => {
            block.insertAdjacentHTML("beforeend", copy_svg);
        });
        document.querySelectorAll(".copy_svg").forEach(btn => {
            btn.addEventListener("click", e => {
                var code = e.currentTarget.parentElement;
                navigator.clipboard.writeText(code.innerText).then(() => {
                    toast_text("Copied to clipboard!");
                }).catch(() => {
                    toast_text("Couldn't copy — try selecting manually");
                });
            });
            btn.addEventListener("keydown", e => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    btn.click();
                }
            });
        });
    }

    // ---- Wrap any bare <table> in a horizontal scroll container ----
    document.querySelectorAll(".article-content table, .content table").forEach(table => {
        if (table.parentElement.classList.contains("table-scroll")) return;
        const wrapper = document.createElement("div");
        wrapper.className = "table-scroll";
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });

    // ---- Reading progress bar ----
    (function initProgressBar() {
        let bar = document.querySelector(".progress-bar");
        if (!bar) {
            bar = document.createElement("div");
            bar.className = "progress-bar";
            document.body.appendChild(bar);
        }
        function updateProgress() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            bar.style.width = Math.min(100, Math.max(0, pct)) + "%";
        }
        window.addEventListener("scroll", throttle(updateProgress, 50), { passive: true });
        updateProgress();
    })();

    // ---- Header TOC Dropdown (replaces old nav & mobile TOC toggle) ----
    function initHeaderToc() {
        const toc = document.getElementById('TableOfContents');
        if (!toc) return;

        // Find or create the toggle button in the header
        let toggleBtn = document.querySelector('.toc-toggle');
        if (!toggleBtn) {
            const headerContent = document.querySelector('.header-content');
            if (!headerContent) return;
            toggleBtn = document.createElement('button');
            toggleBtn.className = 'toc-toggle';
            toggleBtn.innerHTML = '<span>Contents</span><span class="chevron">▾</span>';
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.setAttribute('aria-controls', 'TableOfContents');
            headerContent.appendChild(toggleBtn);
        }

        function openToc() {
            toc.classList.add('toc-open');
            toggleBtn.setAttribute('aria-expanded', 'true');
        }
        function closeToc() {
            toc.classList.remove('toc-open');
            toggleBtn.setAttribute('aria-expanded', 'false');
        }
        function toggleToc() {
            toc.classList.contains('toc-open') ? closeToc() : openToc();
        }

        toggleBtn.addEventListener('click', toggleToc);

        // Close when clicking outside the TOC or the button
        document.addEventListener('click', (e) => {
            if (!toc.contains(e.target) && !toggleBtn.contains(e.target)) {
                closeToc();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeToc();
        });

        // Close when a TOC link is clicked (smooth scroll handled later)
        toc.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeToc);
        });
    }

    // ---- Table of Contents: active-section highlighting & smooth scroll ----
    function initTableOfContents() {
        const tocLinks = document.querySelectorAll('#TableOfContents a[href^="#"]');
        const headings = Array.from(tocLinks).map(link => {
            const id = decodeURIComponent(link.getAttribute('href').substring(1));
            return document.getElementById(id);
        }).filter(heading => heading !== null);

        // Determine offset dynamically based on header height
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 0;

        function updateActiveLink() {
            const scrollPosition = window.scrollY + headerHeight + 20;

            let currentSection = null;
            for (let i = headings.length - 1; i >= 0; i--) {
                const heading = headings[i];
                if (heading && heading.offsetTop <= scrollPosition) {
                    currentSection = heading;
                    break;
                }
            }

            tocLinks.forEach(link => link.classList.remove('active'));

            if (currentSection) {
                const currentLink = document.querySelector(`#TableOfContents a[href="#${CSS.escape(currentSection.id)}"]`);
                if (currentLink) currentLink.classList.add('active');
            }
        }

        tocLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = decodeURIComponent(this.getAttribute('href').substring(1));
                const target = document.getElementById(targetId);

                if (target) {
                    const offsetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 10;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                    // The dropdown is closed by the listener in initHeaderToc
                }
            });
        });

        window.addEventListener('scroll', throttle(updateActiveLink, 100), { passive: true });
        updateActiveLink();
    }

    // Initialise the new header TOC functionality
    initHeaderToc();
    initTableOfContents();
};

// ---- Throttle helper ----
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ---- Toast notification helper ----
function toast_text(message, duration = 3000) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    const span = document.createElement('span');
    span.textContent = message;
    const btn = document.createElement('button');
    btn.textContent = '✖';
    btn.setAttribute('aria-label', 'Dismiss notification');
    btn.addEventListener('click', () => toast.remove());

    toast.appendChild(span);
    toast.appendChild(btn);
    toastContainer.appendChild(toast);

    setTimeout(() => {
        if (toast) toast.remove();
    }, duration);
}