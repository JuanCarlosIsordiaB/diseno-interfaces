/**
 * LoginPage Component - Página de inicio de sesión
 * Web Component con Shadow DOM
 */
class LoginPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const button = this.shadowRoot.querySelector("custom-button");
    if (button) {
      button.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("navigate", {
            detail: { route: "home" },
            bubbles: true,
            composed: true,
          })
        );
      });
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          min-height: 100vh;
          background-color: white;
        }

        .header {
          background-color: #2563eb;
          height: 120px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-icon-container {
          position: absolute;
          top: 60px;
          background-color: white;
          width: 100px;
          height: 100px;
          border-radius: 20px;
          border: 3px solid #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          animation: bounceIn 0.6s ease;
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }

        .profile-icon {
          width: 60px;
          height: 60px;
          fill: #2563eb;
        }

        .content {
          padding: 80px 20px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: calc(100vh - 120px);
        }

        .login-card {
          background-color: #f3f4f6;
          border-radius: 20px;
          padding: 40px 24px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          animation: slideUp 0.5s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-title {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          text-align: center;
          margin-bottom: 32px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .form-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        @media (min-width: 768px) {
          .header {
            height: 150px;
          }

          .profile-icon-container {
            width: 120px;
            height: 120px;
            top: 75px;
            border-radius: 24px;
          }

          .profile-icon {
            width: 70px;
            height: 70px;
          }

          .content {
            padding: 100px 40px 60px;
            justify-content: center;
          }

          .login-card {
            padding: 50px 40px;
            max-width: 500px;
            border-radius: 24px;
          }

          .login-title {
            font-size: 32px;
            margin-bottom: 40px;
          }
        }
      </style>
      <div class="header">
        <div class="profile-icon-container">
          <svg class="profile-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            <path d="M19 12h-2v-2h-2v2h-2v2h2v2h2v-2h2v-2z"/>
          </svg>
        </div>
      </div>
      <div class="content">
        <div class="login-card">
          <h1 class="login-title">LOGIN</h1>
          <div class="form-container">
            <custom-input 
              id="email-input"
              label="Label" 
              type="email" 
              placeholder="Ingresa tu email"
              required
            ></custom-input>
            <custom-input 
              id="password-input"
              label="Label" 
              type="password" 
              placeholder="Ingresa tu contraseña"
              required
            ></custom-input>
            <custom-button variant="primary">Boton</custom-button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("login-page", LoginPage);
