// FILE PATH: js/script.js

// Add simple functionality here if needed (e.g., dynamic version display)

console.log("MaazDB Website Loaded.");

// Example: Dynamically update the version number
document.addEventListener('DOMContentLoaded', () => {
    const versionElements = document.querySelectorAll('h1, h2');
    const version = 'v11.6.0';
    versionElements.forEach(el => {
        el.innerHTML = el.innerHTML.replace('v11.6', version);
    });
});