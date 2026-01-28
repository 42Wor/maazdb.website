/**
 * MaazDB v11.9 Core Engine
 * Handles UI logic, Syntax Highlighting, and OS Detection
 */

(function() {
    "use strict";

    const MaazDB = {
        version: "11.9.0",
        
        init() {
            this.detectOS();
            this.initSyntaxHighlighting();
            this.initSmoothScroll();
            this.initDocsNavigation();
            this.initTabs();
            this.initCopyButtons();
            console.log(`MaazDB Engine v${this.version} initialized.`);
        },

        /**
         * Detects User OS to highlight correct download
         */
        detectOS() {
            const platform = window.navigator.platform.toLowerCase();
            const osMessage = document.getElementById('os-message');
            let os = "Unknown";

            if (platform.includes('win')) os = "Windows";
            else if (platform.includes('linux')) os = "Linux";
            else if (platform.includes('mac')) os = "macOS";

            if (osMessage && os !== "Unknown") {
                osMessage.innerHTML = `<i class="fas fa-check-circle"></i> Detected ${os} - v11.9 Recommended.`;
                
                // Highlight specific card
                const cards = document.querySelectorAll('.dl-card');
                cards.forEach(card => {
                    if (card.dataset.os === os) {
                        card.classList.add('recommended');
                    }
                });
            }
        },

        /**
         * Custom SQL Syntax Highlighter
         */
        initSyntaxHighlighting() {
            const codeBlocks = document.querySelectorAll('pre code');
            
            const keywords = [
                'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 
                'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'DATABASE', 
                'USE', 'DROP', 'FOREIGN', 'KEY', 'REFERENCES', 'PRIMARY', 
                'SERIAL', 'TEXT', 'DOUBLE', 'BOOL', 'TIMESTAMP', 'INT', 
                'LOGIN', 'PASSWORD', 'BACKUP', 'RESTORE', 'COUNT', 'AVG', 'SUM'
            ];

            codeBlocks.forEach(block => {
                let html = block.innerHTML;

                // Highlight Keywords
                keywords.forEach(kw => {
                    const regex = new RegExp(`\\b${kw}\\b`, 'g');
                    html = html.replace(regex, `<span class="sql-keyword">${kw}</span>`);
                });

                // Highlight Strings
                html = html.replace(/'([^']+)'/g, `<span class="sql-string">'$1'</span>`);

                // Highlight Numbers
                html = html.replace(/\b(\d+\.?\d*)\b/g, `<span class="sql-number">$1</span>`);

                // Highlight Comments
                html = html.replace(/-- .+/g, `<span class="sql-comment">$&</span>`);

                block.innerHTML = html;
            });
        },

        /**
         * Smooth scrolling for anchor links
         */
        initSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        window.scrollTo({
                            top: target.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        },

        /**
         * Documentation Sidebar Logic
         */
        initDocsNavigation() {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.sidebar-link');

            window.addEventListener('scroll', () => {
                let current = "";
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    if (pageYOffset >= sectionTop - 150) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').includes(current)) {
                        link.classList.add('active');
                    }
                });
            });
        },

        /**
         * Tab System for Code Examples
         */
        initTabs() {
            const tabs = document.querySelectorAll('.tab-trigger');
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const parent = tab.closest('.code-tabs');
                    const target = tab.dataset.target;

                    parent.querySelectorAll('.tab-trigger').forEach(t => t.classList.remove('active'));
                    parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

                    tab.classList.add('active');
                    document.getElementById(target).classList.add('active');
                });
            });
        },

        /**
         * Copy to Clipboard functionality
         */
        initCopyButtons() {
            const blocks = document.querySelectorAll('pre');
            blocks.forEach(block => {
                const button = document.createElement('button');
                button.className = 'copy-btn';
                button.innerHTML = '<i class="far fa-copy"></i>';
                block.appendChild(button);

                button.addEventListener('click', () => {
                    const code = block.querySelector('code').innerText;
                    navigator.clipboard.writeText(code).then(() => {
                        button.innerHTML = '<i class="fas fa-check"></i>';
                        setTimeout(() => {
                            button.innerHTML = '<i class="far fa-copy"></i>';
                        }, 2000);
                    });
                });
            });
        }
    };

    // Start Engine
    document.addEventListener('DOMContentLoaded', () => MaazDB.init());

})();