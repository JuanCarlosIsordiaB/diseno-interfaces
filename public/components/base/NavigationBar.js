/**
 * NavigationBar Component - Barra de navegación inferior
 * Web Component reutilizable con Shadow DOM
 */
class NavigationBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['active'];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const icons = this.shadowRoot.querySelectorAll('.nav-icon');
    icons.forEach((icon, index) => {
      icon.addEventListener('click', () => {
        const routes = ['home', 'agendar', 'perfil'];
        this.dispatchEvent(new CustomEvent('navigate', {
          detail: { route: routes[index] },
          bubbles: true,
          composed: true
        }));
      });
    });
  }

  render() {
    const active = this.getAttribute('active') || 'home';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }

        .nav-bar {
          background-color: #e0e7ff;
          padding: 12px 20px;
          border-radius: 20px 20px 0 0;
          display: flex;
          justify-content: space-around;
          align-items: center;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        }

        .nav-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .nav-icon:hover {
          background-color: rgba(37, 99, 235, 0.1);
        }

        .nav-icon svg {
          width: 24px;
          height: 24px;
          transition: all 0.3s ease;
        }

        .nav-icon.active svg {
          fill: #2563eb;
        }

        .nav-icon:not(.active) svg {
          fill: #1f2937;
        }

        @media (min-width: 768px) {
          .nav-bar {
            max-width: 600px;
            margin: 0 auto;
            padding: 16px 40px;
          }

          .nav-icon svg {
            width: 28px;
            height: 28px;
          }
        }
      </style>
      <nav class="nav-bar">
        <div class="nav-icon ${active === 'home' ? 'active' : ''}" data-route="home">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </div>
        <div class="nav-icon ${active === 'agendar' ? 'active' : ''}" data-route="agendar">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zm0-13H5V6h14v1z"/>
          </svg>
        </div>
        <div class="nav-icon ${active === 'perfil' ? 'active' : ''}" data-route="perfil">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
      </nav>
    `;
  }
}

customElements.define('navigation-bar', NavigationBar);

