/**
 * ProfilePage Component - Página de perfil del usuario
 * Web Component con Shadow DOM
 * Permite editar nombre, carrera y grado
 */
class ProfilePage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.userData = {
      nombre: "Juan Carlos",
      carrera: "Ingeniería en Sistemas",
      grado: "5to Semestre",
      imagen: "",
    };
    this.isEditing = false;
  }

  static get observedAttributes() {
    return ["user-data"];
  }

  connectedCallback() {
    this.loadUserData();
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback() {
    const data = this.getAttribute("user-data");
    if (data) {
      this.userData = JSON.parse(data);
      this.render();
      this.setupEventListeners();
    }
  }

  mostrarMensajeExito(mensaje) {
    const toast = document.createElement("div");
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #10b981;
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      font-weight: 600;
      animation: slideDown 0.3s ease;
    `;
    toast.textContent = mensaje;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "slideUp 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  mostrarMensajeError(mensaje) {
    const toast = document.createElement("div");
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #ef4444;
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      font-weight: 600;
      animation: slideDown 0.3s ease;
    `;
    toast.textContent = mensaje;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "slideUp 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  loadUserData() {
    const saved = localStorage.getItem("userProfile");
    if (saved) {
      this.userData = JSON.parse(saved);
    }
  }

  setupEventListeners() {
    const editButton = this.shadowRoot.querySelector("#edit-button");
    const saveButton = this.shadowRoot.querySelector("#save-button");
    const cancelButton = this.shadowRoot.querySelector("#cancel-button");

    if (editButton) {
      editButton.addEventListener("click", () => {
        this.isEditing = true;
        this.render();
        this.setupEventListeners();
      });
    }

    if (saveButton) {
      saveButton.addEventListener("click", () => {
        const nombre = this.shadowRoot.querySelector("#nombre-input")?.value;
        const carrera = this.shadowRoot.querySelector("#carrera-input")?.value;
        const grado = this.shadowRoot.querySelector("#grado-input")?.value;

        if (nombre && carrera && grado) {
          this.userData = { ...this.userData, nombre, carrera, grado };
          localStorage.setItem("userProfile", JSON.stringify(this.userData));

          this.dispatchEvent(
            new CustomEvent("profile-updated", {
              detail: this.userData,
              bubbles: true,
              composed: true,
            })
          );

          this.isEditing = false;
          alert("Perfil actualizado exitosamente");
          this.render();
          this.setupEventListeners();
        } else {
          alert("Por favor completa todos los campos");
        }
      });
    }

    if (cancelButton) {
      cancelButton.addEventListener("click", () => {
        this.isEditing = false;
        this.render();
        this.setupEventListeners();
      });
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-20px);
          }
        }
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
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .profile-image-container {
          width: 100%;
          max-width: 300px;
          height: 250px;
          border: 3px solid #2563eb;
          border-radius: 16px;
          background-color: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
          transition: all 0.3s ease;
        }

        .profile-image-container:hover {
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
          transform: translateY(-2px);
        }

        .profile-image-placeholder {
          color: #1f2937;
          font-size: 18px;
          font-weight: 700;
          text-transform: uppercase;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .profile-info {
          width: 100%;
          max-width: 400px;
        }

        .info-item {
          margin-bottom: 20px;
        }

        .info-label {
          font-size: 14px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .info-value {
          font-size: 16px;
          color: #4b5563;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .info-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #2563eb;
          border-radius: 8px;
          font-size: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background-color: white;
          color: #1f2937;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .info-input:focus {
          outline: none;
          border-color: #1d4ed8;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .button-container {
          display: flex;
          gap: 12px;
          margin-top: 32px;
          width: 100%;
          max-width: 400px;
        }

        .action-button {
          flex: 1;
          padding: 12px 24px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .edit-button {
          background-color: #2563eb;
          color: white;
        }

        .edit-button:hover {
          background-color: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .save-button {
          background-color: #10b981;
          color: white;
        }

        .save-button:hover {
          background-color: #059669;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .cancel-button {
          background-color: #6b7280;
          color: white;
        }

        .cancel-button:hover {
          background-color: #4b5563;
          transform: translateY(-2px);
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
            max-width: 800px;
            margin: 0 auto;
          }

          .profile-image-container {
            max-width: 400px;
            height: 300px;
            border-radius: 20px;
            margin-bottom: 32px;
          }

          .profile-image-placeholder {
            font-size: 24px;
          }

          .profile-info {
            max-width: 500px;
          }

          .info-item {
            margin-bottom: 24px;
          }

          .info-label {
            font-size: 16px;
            margin-bottom: 12px;
          }

          .info-value {
            font-size: 18px;
          }

          .info-input {
            padding: 14px 20px;
            font-size: 18px;
            border-radius: 12px;
          }

          .button-container {
            margin-top: 40px;
            gap: 16px;
          }

          .action-button {
            padding: 16px 32px;
            font-size: 18px;
            border-radius: 16px;
          }
        }
      </style>
      <div class="header">
        <div class="header-left">
          <hamburger-menu></hamburger-menu>
          <h1 class="header-title">Mi Perfil</h1>
        </div>
      </div>
      <div class="content">
        <div class="profile-image-container">
          <div class="profile-image-placeholder">CON IMAGEN</div>
        </div>
        <div class="profile-info">
          <div class="info-item">
            <div class="info-label">Nombre Completo</div>
            ${
              this.isEditing
                ? `<input type="text" id="nombre-input" class="info-input" value="${this.userData.nombre}" />`
                : `<div class="info-value">${this.userData.nombre}</div>`
            }
          </div>
          <div class="info-item">
            <div class="info-label">Carrera</div>
            ${
              this.isEditing
                ? `<input type="text" id="carrera-input" class="info-input" value="${this.userData.carrera}" />`
                : `<div class="info-value">${this.userData.carrera}</div>`
            }
          </div>
          <div class="info-item">
            <div class="info-label">Grado</div>
            ${
              this.isEditing
                ? `<input type="text" id="grado-input" class="info-input" value="${this.userData.grado}" />`
                : `<div class="info-value">${this.userData.grado}</div>`
            }
          </div>
          <div class="button-container">
            ${
              this.isEditing
                ? `
              <button id="save-button" class="action-button save-button">Guardar</button>
              <button id="cancel-button" class="action-button cancel-button">Cancelar</button>
            `
                : `
              <button id="edit-button" class="action-button edit-button">Editar</button>
            `
            }
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("profile-page", ProfilePage);
