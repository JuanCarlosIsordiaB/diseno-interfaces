/**
 * HomePage Component - Página principal con notificaciones
 * Web Component con Shadow DOM
 */
class HomePage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["notifications"];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback() {
    this.render();
  }

  setupEventListeners() {
    
    document.addEventListener("notificacion-creada", () => {
      const notificationsList =
        this.shadowRoot.querySelector("notifications-list");
      if (notificationsList) {
        notificationsList.loadNotifications();
        notificationsList.render();
        notificationsList.setupEventListeners();
      }
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          min-height: 100vh;
          background-color: white;
          padding-bottom: 80px;
        }

        .header {
          background-color: #2563eb;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          position: relative;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-title {
          font-size: 20px;
          font-weight: 700;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .content {
          padding: 20px;
        }

        .notifications-section {
          background-color: #f3f4f6;
          border-radius: 20px;
          padding: 24px;
          min-height: calc(100vh - 180px);
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .section-title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }


        @media (min-width: 768px) {
          .header {
            height: 100px;
            padding: 0 40px;
          }

          .header-title {
            font-size: 24px;
          }

          .content {
            padding: 40px;
            max-width: 1200px;
            margin: 0 auto;
          }

          .notifications-section {
            padding: 40px;
            border-radius: 24px;
          }

          .section-title {
            font-size: 32px;
            margin-bottom: 32px;
          }

        }
      </style>
      <div class="header">
        <div class="header-left">
          <hamburger-menu></hamburger-menu>
          <h1 class="header-title">Tutorías Académicas</h1>
        </div>
      </div>
      <div class="content">
        <div class="notifications-section">
          <h2 class="section-title">Notificaciones</h2>
          <notifications-list></notifications-list>
        </div>
      </div>
    `;
  }
}

customElements.define("home-page", HomePage);
