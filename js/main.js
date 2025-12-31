/* FILE PATH: js/main.js */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Detect Operating System
    const osMessage = document.getElementById('os-message');
    const platform = navigator.platform.toLowerCase();
    let os = "Unknown";

    if (platform.includes('win')) os = "Windows";
    else if (platform.includes('linux')) os = "Linux";
    else if (platform.includes('mac')) os = "macOS";

    // 2. Highlight and display message
    if(osMessage && os !== "Unknown") {
        osMessage.innerHTML = `<i class="fas fa-check-circle"></i> Detected OS: ${os} - Recommended Download Highlighted below.`;
        
        if (os === "Windows") {
            document.querySelector('.dl-card.windows').style.borderColor = '#dc2626';
            document.querySelector('.dl-card.windows').style.background = '#1e293b';
        } else if (os === "Linux") {
            document.querySelector('.dl-card.linux').style.borderColor = '#dc2626';
             document.querySelector('.dl-card.linux').style.background = '#1e293b';
        } else if (os === "macOS") {
            document.querySelector('.dl-card.mac').style.borderColor = '#dc2626';
             document.querySelector('.dl-card.mac').style.background = '#1e293b';
        }
    }

    // 3. Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Add active class to current page in navigation
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });

    // 5. Add loading animation to download buttons
    document.querySelectorAll('.dl-card[href*="downloads"]').forEach(card => {
        card.addEventListener('click', function(e) {
            const platform = this.classList.contains('windows') ? 'Windows' :
                           this.classList.contains('linux') ? 'Linux' : 'macOS';
            
            // Optional: You could add analytics here
            console.log(`Download initiated for ${platform}`);
            
            // Add a small visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
});