window.onload = function(){
    u("#TableOfContents a").handle("click", 
        function(e){
            u(e.currentTarget.hash).scroll();
        }
    );

var copy_svg = "<svg tabindex=\"0\" class=\'copy_svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' xmlns=\'http:\/\/www.w3.org\/2000\/svg\' xmlns:xlink=\'http:\/\/www.w3.org\/1999\/xlink\'><rect width=\'24\' height=\'24\' stroke=\'none\' fill=\'#000000\' opacity=\'0\'\/>\r\n\r\n\r\n<g transform=\"matrix(0.8 0 0 0.8 12 12)\" >\r\n<path style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\" transform=\" translate(-15, -14.5)\" d=\"M 11 2 C 9.895 2 9 2.895 9 4 L 9 20 C 9 21.105 9.895 22 11 22 L 24 22 C 25.105 22 26 21.105 26 20 L 26 8.5 C 26 8.235 25.895031 7.9809687 25.707031 7.7929688 L 20.207031 2.2929688 C 20.019031 2.1049687 19.765 2 19.5 2 L 11 2 z M 19 3.9042969 L 24.095703 9 L 20 9 C 19.448 9 19 8.552 19 8 L 19 3.9042969 z M 6 7 C 4.895 7 4 7.895 4 9 L 4 25 C 4 26.105 4.895 27 6 27 L 19 27 C 20.105 27 21 26.105 21 25 L 21 24 L 11 24 C 8.794 24 7 22.206 7 20 L 7 7 L 6 7 z\" stroke-linecap=\"round\" \/>\r\n<\/g>\r\n<\/svg>";

u(".highlight").append(copy_svg)

u(".copy_svg").on("click", e => {
    var code = e.currentTarget.parentElement;

    navigator.clipboard.writeText(code.innerText);

    toast_text("Copied to clipboard!");
});
// Claude code
// Table of Contents Active Section Highlighting
        function initTableOfContents() {
            const tocLinks = document.querySelectorAll('#TableOfContents a[href^="#"]');
            const headings = Array.from(tocLinks).map(link => {
                const id = link.getAttribute('href').substring(1);
                return document.getElementById(id);
            }).filter(heading => heading !== null);

            // Throttle function to limit how often we check scroll position
            function throttle(func, limit) {
                let inThrottle;
                return function() {
                    const args = arguments;
                    const context = this;
                    if (!inThrottle) {
                        func.apply(context, args);
                        inThrottle = true;
                        setTimeout(() => inThrottle = false, limit);
                    }
                }
            }

            // Function to update active link
            function updateActiveLink() {
                const scrollPosition = window.scrollY + 100; // Offset for better UX
                
                // Find the current section
                let currentSection = null;
                for (let i = headings.length - 1; i >= 0; i--) {
                    const heading = headings[i];
                    if (heading && heading.offsetTop <= scrollPosition) {
                        currentSection = heading;
                        break;
                    }
                }

                // Remove active class from all links
                tocLinks.forEach(link => link.classList.remove('active'));

                // Add active class to current section link
                if (currentSection) {
                    const currentLink = document.querySelector(`#TableOfContents a[href="#${currentSection.id}"]`);
                    if (currentLink) {
                        currentLink.classList.add('active');
                    }
                }
            }

            // Smooth scroll for TOC links
            tocLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const target = document.getElementById(targetId);
                    
                    if (target) {
                        const offsetTop = target.offsetTop - 20; // Small offset from top
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                });
            });

            // Listen for scroll events with throttling
            window.addEventListener('scroll', throttle(updateActiveLink, 100));
            
            // Initial call to set active link on page load
            updateActiveLink();
        }

        // Initialize when DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initTableOfContents);
        } else {
            initTableOfContents();
        }



}
function toast_text(message, duration = 3000) {
    const toastContainer = document.getElementById('toast-container');

    // Create the toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    // Toast content
    toast.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">✖</button>
    `;

    // Append the toast to the container
    document.body.appendChild(toast);

    // Auto-remove the toast after the specified duration
    setTimeout(() => {
        if (toast) toast.remove();
    }, duration);


console.log("This runs!");

}


