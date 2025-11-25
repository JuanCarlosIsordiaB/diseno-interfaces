/**
 * HamburgerMenu Component - Menú hamburguesa reutilizable
 * Web Component con Shadow DOM
 */
class HamburgerMenu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isOpen = false;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const button = this.shadowRoot.querySelector(".hamburger-button");
    const menu = this.shadowRoot.querySelector(".menu-overlay");
    const closeButton = this.shadowRoot.querySelector(".close-button");
    const menuItems = this.shadowRoot.querySelectorAll(".menu-item");

    if (button) {
      button.addEventListener("click", () => {
        this.toggleMenu();
      });
    }

    if (closeButton) {
      closeButton.addEventListener("click", () => {
        this.closeMenu();
      });
    }

    if (menu) {
      menu.addEventListener("click", (e) => {
        if (e.target === menu) {
          this.closeMenu();
        }
      });
    }

    menuItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        const route = e.currentTarget.dataset.route;
        if (route) {
          this.dispatchEvent(
            new CustomEvent("navigate", {
              detail: { route },
              bubbles: true,
              composed: true,
            })
          );
          this.closeMenu();
        }
      });
    });
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    this.render();
    this.setupEventListeners();
  }

  closeMenu() {
    this.isOpen = false;
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .hamburger-button {
          width: 40px;
          height: 40px;
          background-color: white;
          border: none;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 8px;
        }

        .hamburger-button:hover {
          background-color: #f3f4f6;
          transform: scale(1.05);
        }

        .hamburger-line {
          width: 20px;
          height: 2px;
          background-color: #2563eb;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .hamburger-button.active .hamburger-line:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .hamburger-button.active .hamburger-line:nth-child(2) {
          opacity: 0;
        }

        .hamburger-button.active .hamburger-line:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -6px);
        }

        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 9999;
          display: ${this.isOpen ? "flex" : "none"};
          align-items: flex-start;
          justify-content: flex-start;
          animation: ${this.isOpen ? "fadeIn" : "none"} 0.3s ease;
        }

        .menu-panel {
          background-color: white;
          width: 280px;
          height: 100vh;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
          transform: ${this.isOpen ? "translateX(0)" : "translateX(-100%)"};
          transition: transform 0.3s ease;
          overflow-y: auto;
        }

        .menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e5e7eb;
        }

        .menu-title {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .close-button {
          width: 32px;
          height: 32px;
          background-color: #f3f4f6;
          border: none;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .close-button:hover {
          background-color: #e5e7eb;
        }

        .close-button svg {
          width: 20px;
          height: 20px;
          fill: #6b7280;
        }

        .menu-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 8px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .menu-item:hover {
          background-color: #f3f4f6;
          transform: translateX(4px);
        }

        .menu-item.active {
          background-color: #dbeafe;
          color: #2563eb;
        }

        .menu-item-icon {
          width: 24px;
          height: 24px;
          fill: currentColor;
        }

        .menu-item-text {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .menu-item.active .menu-item-text {
          color: #2563eb;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @media (min-width: 768px) {
          .hamburger-button {
            width: 50px;
            height: 50px;
            border-radius: 12px;
          }

          .menu-panel {
            width: 320px;
          }
        }
      </style>
      <button class="hamburger-button ${this.isOpen ? "active" : ""}" aria-label="Abrir menú">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
      <div class="menu-overlay" style="display: ${this.isOpen ? "flex" : "none"}">
        <div class="menu-panel">
          <div class="menu-header">
            <h2 class="menu-title">Menú</h2>
            <button class="close-button" aria-label="Cerrar menú">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
          <ul class="menu-list">
            <li class="menu-item" data-route="home">
              <svg class="menu-item-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <span class="menu-item-text">Inicio</span>
            </li>
            <li class="menu-item" data-route="agendar">
              <svg class="menu-item-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zm0-13H5V6h14v1z"/>
              </svg>
              <span class="menu-item-text">Agendar Tutoría</span>
            </li>
            <li class="menu-item" data-route="perfil">
              <svg class="menu-item-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span class="menu-item-text">Mi Perfil</span>
            </li>
          </ul>
        </div>
      </div>
    `;
  }
}

customElements.define("hamburger-menu", HamburgerMenu);

