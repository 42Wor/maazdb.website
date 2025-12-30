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
});