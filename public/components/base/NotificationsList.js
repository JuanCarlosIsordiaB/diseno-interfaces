/**
 * NotificationsList Component - Componente reutilizable para mostrar notificaciones
 * Web Component con Shadow DOM, responsive (mobile y desktop)
 */
class NotificationsList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.notifications = [];
  }

  static get observedAttributes() {
    return ["notifications"];
  }

  connectedCallback() {
    this.loadNotifications();
    this.render();
    this.setupEventListeners();

  
    window.addEventListener("storage", () => {
      this.loadNotifications();
      this.render();
      this.setupEventListeners();
    });

    
    document.addEventListener("notificacion-creada", () => {
      this.loadNotifications();
      this.render();
      this.setupEventListeners();
    });
  }

  attributeChangedCallback() {
    this.loadNotifications();
    this.render();
    this.setupEventListeners();
  }

  loadNotifications() {
    
    const saved = localStorage.getItem("notificaciones");
    if (saved) {
      this.notifications = JSON.parse(saved);
    } else {
      this.notifications = [];
    }
  }

  eliminarNotificacion(id) {
    this.notifications = this.notifications.filter((notif) => notif.id !== id);
    localStorage.setItem("notificaciones", JSON.stringify(this.notifications));
    this.render();
    this.setupEventListeners();

    
    document.dispatchEvent(
      new CustomEvent("notificacion-eliminada", {
        detail: { id },
      })
    );
  }

  setupEventListeners() {
    
    const deleteButtons = this.shadowRoot.querySelectorAll(".delete-button");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        this.eliminarNotificacion(id);
      });
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .notification-card {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .notification-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .notification-content {
          flex: 1;
        }

        .notification-message {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          margin: 0;
        }

        .delete-button {
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .delete-button:hover {
          background-color: #dc2626;
          transform: scale(1.1);
        }

        .delete-button svg {
          width: 18px;
          height: 18px;
          fill: white;
        }

        .empty-state {
          text-align: center;
          color: #6b7280;
          padding: 40px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        @media (min-width: 768px) {
          .notifications-list {
            gap: 24px;
          }

          .notification-card {
            padding: 24px;
            border-radius: 16px;
          }

          .notification-message {
            font-size: 16px;
          }

          .delete-button {
            width: 40px;
            height: 40px;
          }

          .delete-button svg {
            width: 20px;
            height: 20px;
          }
        }
      </style>
      <div class="notifications-list">
        ${
          this.notifications.length > 0
            ? this.notifications
                .map(
                  (notif) => `
            <div class="notification-card">
              <div class="notification-content">
                <p class="notification-message">${notif.message}</p>
              </div>
              <button class="delete-button" data-id="${notif.id}" title="Eliminar notificación">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          `
                )
                .join("")
            : '<p class="empty-state">No hay notificaciones</p>'
        }
      </div>
    `;
  }
}

customElements.define("notifications-list", NotificationsList);
