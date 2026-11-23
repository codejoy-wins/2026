// Shared destinations. Root-relative URLs work on nested pages, too.
(() => {
  const destinations = [
    ["DJ Aliens", "/alien.html"],
    ["Music", "/music.html"],
    ["Blog", "/blog"],
    ["Story", "/story.html"],
    ["Chess", "/chess.html"],
    ["Web Development", "/web.html"],
    ["Articles", "/articles.html"],
    ["Projects", "/projects.html"],
    ["Numerology", "/numerology.html"],
    ["Education", "/education.html"],
    ["Poem", "/poem.html"],
    ["Reviews", "/home.html"],
    ["Videos", "/videos.html"],
    ["Art", "/art.html"],
    ["Game Design", "/game.html"],
  ];

  function pagePath(pathname) {
    return pathname.replace(/\/+$/, '').replace(/\/index\.html$/i, '').replace(/\.html$/i, '') || '/';
  }

  class JannNav extends HTMLElement {
    connectedCallback() {
      const menu = document.createElement('details');
      const toggle = document.createElement('summary');
      toggle.textContent = 'Explore';
      const nav = document.createElement('nav');
      nav.setAttribute('aria-label', 'Site');

      const currentPage = pagePath(window.location.pathname);
      for (const [label, path] of destinations) {
        if (pagePath(path) === currentPage) continue;

        const link = document.createElement('a');
        link.href = path;
        link.textContent = label;
        nav.append(link);
      }

      menu.append(toggle, nav);
      this.replaceChildren(menu);
      this.listeners = new AbortController();
      const options = { signal: this.listeners.signal };

      document.addEventListener('click', event => {
        if (!this.contains(event.target)) menu.open = false;
      }, options);

      document.addEventListener('keydown', event => {
        if (event.key !== 'Escape' || !menu.open) return;
        const restoreFocus = this.contains(document.activeElement);
        menu.open = false;
        if (restoreFocus) toggle.focus();
      }, options);
    }

    disconnectedCallback() {
      this.listeners.abort();
    }
  }

  if (!customElements.get('jann-nav')) customElements.define('jann-nav', JannNav);
})();
