/* 
    FILE PATH: app/static/js/docs.js 
    MaazDB v12.4 - Documentation Interactions & Syntax Highlighting
*/

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // 1. COPY TO CLIPBOARD FUNCTIONALITY
    // ==========================================
    const preBlocks = document.querySelectorAll('pre');
    
    preBlocks.forEach(pre => {
        pre.style.position = 'relative';
        
        const button = document.createElement('button');
        button.className = 'copy-btn';
        button.innerHTML = '<i class="far fa-copy"></i> Copy';
        pre.appendChild(button);
        
        button.addEventListener('click', async () => {
            const codeElement = pre.querySelector('code');
            // Get text from code element, or fallback to pre text (removing the button text)
            const codeText = codeElement ? codeElement.innerText : pre.innerText.replace(' Copy', '');
            
            try {
                await navigator.clipboard.writeText(codeText);
                button.innerHTML = '<i class="fas fa-check"></i> Copied!';
                button.style.color = '#4ade80'; 
                button.style.borderColor = '#4ade80';
                button.style.background = 'rgba(74, 222, 128, 0.1)';
                
                setTimeout(() => {
                    button.innerHTML = '<i class="far fa-copy"></i> Copy';
                    button.style.color = '';
                    button.style.borderColor = '';
                    button.style.background = '';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    });

    // ==========================================
    // 2. ROBUST SQL SYNTAX HIGHLIGHTING
    // ==========================================
    
    const sqlKeywords = [
        'SELECT', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'DELETE', 'SET',
        'CREATE', 'TABLE', 'DROP', 'ALTER', 'INDEX', 'UNIQUE', 'DEFAULT',
        'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'FROM', 'WHERE', 'AND', 
        'OR', 'NOT', 'AS', 'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET',
        'TRUE', 'FALSE', 'NULL', 'SERIAL', 'INT', 'TEXT', 'DOUBLE', 'BOOL', 
        'TIMESTAMP', 'VARCHAR', 'BOOLEAN', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'ON',
        'SHOW', 'DATABASES', 'USE', 'DESCRIBE', 'EXPLAIN', 'BACKUP', 'RESTORE'
    ];

    const keywordPattern = sqlKeywords.join('|');
    
    // Regex Groups:
    // 1. Comments (-- or /* */)
    // 2. Strings ('...' or "...")
    // 3. Numbers (123, 4.5)
    // 4. Keywords (SELECT, FROM...)
    const sqlRegex = new RegExp(
        `(--.*$|\\/\\*[\\s\\S]*?\\*\\/)|(['"](?:\\\\.|[^\\\\])*?['"])|(\\b\\d+(?:\\.\\d+)?\\b)|\\b(${keywordPattern})\\b`, 
        'gim'
    );

    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        // 1. Get the raw text content (this converts &lt; back to < automatically)
        let rawText = block.textContent;
        
        // 2. Escape ONLY HTML tags (<, >, &) to prevent browser hiding <table_name>
        // IMPORTANT: Do NOT escape quotes (' or ") here, or the Regex won't find strings!
        let safeText = rawText
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        
        // 3. Apply highlighting to the safe text
        let highlightedHtml = safeText.replace(sqlRegex, function(match, comment, string, number, keyword) {
            if (comment) return `<span class="sql-comment">${comment}</span>`;
            if (string)  return `<span class="sql-string">${string}</span>`;
            if (number)  return `<span class="sql-number">${number}</span>`;
            if (keyword) return `<span class="sql-keyword">${keyword.toUpperCase()}</span>`;
            return match;
        });
        
        // 4. Inject the HTML
        block.innerHTML = highlightedHtml;
    });

    // ==========================================
    // 3. SCROLL SPY
    // ==========================================
    const sidebarLinks = document.querySelectorAll('.docs-sidebar a');
    const sections = document.querySelectorAll('section[id], .docs-content h2[id]'); 
    
    function onScroll() {
        let current = '';
        const scrollY = window.pageYOffset + 150; 
        
        sections.forEach(section => {
            if (scrollY >= section.offsetTop) {
                current = section.getAttribute('id');
            }
        });
        
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', onScroll);
    onScroll(); 
});