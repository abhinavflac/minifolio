// Add copy buttons to all code blocks
export function initCopyButtons() {
  // Wait for DOM to be ready
  if (typeof window === 'undefined') return;

  function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('.prose pre');
    
    codeBlocks.forEach(pre => {
      // Skip if button already exists
      if (pre.querySelector('.copy-btn')) return;
      
      const button = document.createElement('button');
      button.className = 'copy-btn';
      button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      `;
      
      button.addEventListener('click', async () => {
        const code = pre.querySelector('code');
        if (!code) return;
        
        try {
          await navigator.clipboard.writeText(code.textContent);
          
          // Show success feedback
          button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
          `;
          button.classList.add('copied');
          
          // Reset after 2 seconds
          setTimeout(() => {
            button.innerHTML = `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            `;
            button.classList.remove('copied');
          }, 2000);
          
        } catch (err) {
          console.error('Failed to copy code:', err);
        }
      });
      
      pre.appendChild(button);
    });
  }

  // Run immediately
  addCopyButtons();
  
  // Also run when new content is loaded (for dynamic content)
  const observer = new MutationObserver(addCopyButtons);
  observer.observe(document.body, { childList: true, subtree: true });
}
