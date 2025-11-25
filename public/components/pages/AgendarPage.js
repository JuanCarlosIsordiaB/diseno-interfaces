/**
 * AgendarPage Component - Página para agendar tutorías
 * Web Component con Shadow DOM
 * Incluye tabs Agendar/Historial
 */
class AgendarPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.activeTab = "agendar";
    this.historial = [];
  }

  static get observedAttributes() {
    return ["active-tab"];
  }

  connectedCallback() {
    this.activeTab = this.getAttribute("active-tab") || "agendar";
    this.loadHistorial();
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback() {
    this.activeTab = this.getAttribute("active-tab") || "agendar";
    this.render();
    this.setupEventListeners();
  }

  loadHistorial() {
   
    const saved = localStorage.getItem("tutorias");
    if (saved) {
      this.historial = JSON.parse(saved);
    } else {
      this.historial = [];
    }
  }

  saveHistorial() {
   
    localStorage.setItem("tutorias", JSON.stringify(this.historial));
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

  agregarTutoria(tema, maestro, fechaHora) {
    
    const fechaHoraParts = fechaHora.split(" ");
    const fecha = fechaHoraParts[0] || fechaHora;
    const hora = fechaHoraParts.slice(1).join(" ") || "";

    const nuevaTutoria = {
      id: Date.now(),
      tema: tema,
      maestro: maestro,
      fecha: fecha,
      hora: hora || "Sin hora especificada",
    };

    this.historial.unshift(nuevaTutoria); 
    this.saveHistorial();

    
    this.crearNotificacion(tema, maestro, fecha, hora);
  }

  crearNotificacion(tema, maestro, fecha, hora) {
    const notificaciones = JSON.parse(
      localStorage.getItem("notificaciones") || "[]"
    );

    const nuevaNotificacion = {
      id: Date.now(),
      message: `Nueva tutoría agendada: ${tema} con ${maestro} el ${fecha} a las ${hora}`,
      date: new Date().toISOString(),
      type: "tutoria",
    };

    notificaciones.unshift(nuevaNotificacion);
    localStorage.setItem("notificaciones", JSON.stringify(notificaciones));

    
    document.dispatchEvent(
      new CustomEvent("notificacion-creada", {
        detail: nuevaNotificacion,
      })
    );
  }

  setupEventListeners() {
    
    const tabButtons = this.shadowRoot.querySelectorAll(".tab-button");
    tabButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.activeTab = tab;
        this.setAttribute("active-tab", tab);
      });
    });

    
    const agendarBtn = this.shadowRoot.querySelector("#agendar-btn");
    if (agendarBtn) {
      agendarBtn.addEventListener("click", () => {
        const temaSelect = this.shadowRoot.querySelector("#tema-select");
        const maestroSelect = this.shadowRoot.querySelector("#maestro-select");
        const fechaInput = this.shadowRoot.querySelector("#fecha-input");
        const horaInput = this.shadowRoot.querySelector("#hora-input");
        const fechaHoraDisplay = this.shadowRoot.querySelector(
          "#fecha-hora-display"
        );

        const tema = temaSelect?.value;
        const maestro = maestroSelect?.value;
        const fecha = fechaInput?.value;
        const hora = horaInput?.value;
        const fechaHora = fechaHoraDisplay?.value || "";

        if (tema && maestro && fecha && hora) {
          
          const temaText = temaSelect.options[temaSelect.selectedIndex].text;
          const maestroText =
            maestroSelect.options[maestroSelect.selectedIndex].text;

          
          this.agregarTutoria(temaText, maestroText, fechaHora);

          
          temaSelect.value = "";
          maestroSelect.value = "";
          fechaInput.value = "";
          horaInput.value = "";
          if (fechaHoraDisplay) fechaHoraDisplay.value = "";

          
          this.activeTab = "historial";
          this.setAttribute("active-tab", "historial");
          this.render();
          this.setupEventListeners();


          this.mostrarMensajeExito("Tutoría agendada exitosamente");
        } else {
          this.mostrarMensajeError("Por favor completa todos los campos");
        }
      });
    }

    const fechaInput = this.shadowRoot.querySelector("#fecha-input");
    const horaInput = this.shadowRoot.querySelector("#hora-input");
    const fechaHoraDisplay = this.shadowRoot.querySelector(
      "#fecha-hora-display"
    );

    const updateFechaHoraDisplay = () => {
      const fecha = fechaInput?.value;
      const hora = horaInput?.value;

      if (fecha && hora) {
        const fechaObj = new Date(fecha + "T" + hora);
        const formatted = fechaObj.toLocaleString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        if (fechaHoraDisplay) {
          fechaHoraDisplay.value = formatted;
        }
      } else if (fechaHoraDisplay) {
        fechaHoraDisplay.value = "";
      }
    };

    if (fechaInput) {
      fechaInput.addEventListener("change", updateFechaHoraDisplay);
    }

    if (horaInput) {
      horaInput.addEventListener("change", updateFechaHoraDisplay);
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
        }

        .tabs-container {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .tab-button {
          flex: 1;
          padding: 12px 20px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .tab-button.active {
          background-color: #2563eb;
          color: white;
        }

        .tab-button:not(.active) {
          background-color: #e5e7eb;
          color: #6b7280;
        }

        .tab-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .form-section {
          display: ${this.activeTab === "agendar" ? "block" : "none"};
          animation: ${
            this.activeTab === "agendar" ? "fadeIn 0.3s ease" : "none"
          };
        }

        .historial-section {
          display: ${this.activeTab === "historial" ? "block" : "none"};
          animation: ${
            this.activeTab === "historial" ? "fadeIn 0.3s ease" : "none"
          };
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

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          color: #1f2937;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .form-input,
        .form-select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background-color: white;
          color: #1f2937;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .date-time-container {
          display: flex;
          gap: 12px;
          flex-direction: column;
        }

        .date-input-wrapper,
        .time-input-wrapper {
          position: relative;
          width: 100%;
        }

        .date-input,
        .time-input {
          padding-right: 45px;
        }

        .calendar-icon,
        .clock-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          fill: #6b7280;
          pointer-events: none;
        }

        .select-wrapper {
          position: relative;
        }

        .select-wrapper::after {
          content: '▼';
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          pointer-events: none;
        }

        .agendar-button {
          background-color: #2563eb;
          color: white;
          padding: 12px 32px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          float: right;
          margin-top: 20px;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .agendar-button:hover {
          background-color: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
        }

        .agendar-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        }

        .historial-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .historial-card {
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          animation: slideIn 0.3s ease;
        }

        .historial-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
          border-color: #2563eb;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .historial-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .historial-tema {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .historial-maestro {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 8px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .historial-fecha {
          font-size: 12px;
          color: #9ca3af;
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
            max-width: 800px;
            margin: 0 auto;
          }

          .tabs-container {
            gap: 16px;
            margin-bottom: 32px;
          }

          .tab-button {
            padding: 16px 32px;
            font-size: 18px;
            border-radius: 16px;
          }

          .form-group {
            margin-bottom: 32px;
          }

          .form-label {
            font-size: 16px;
            margin-bottom: 12px;
          }

          .form-input,
          .form-select {
            padding: 14px 20px;
            font-size: 18px;
            border-radius: 12px;
          }

          .date-time-container {
            flex-direction: row;
            gap: 16px;
          }

          .date-input-wrapper,
          .time-input-wrapper {
            flex: 1;
          }

          .agendar-button {
            padding: 16px 40px;
            font-size: 18px;
            border-radius: 16px;
          }

          .historial-list {
            gap: 24px;
          }

          .historial-card {
            padding: 24px;
            border-radius: 16px;
          }

          .historial-tema {
            font-size: 20px;
          }
        }
      </style>
      <div class="header">
        <div class="header-left">
          <hamburger-menu></hamburger-menu>
          <h1 class="header-title">Agendar Tutoría</h1>
        </div>
      </div>
      <div class="content">
        <div class="tabs-container">
          <button class="tab-button ${
            this.activeTab === "agendar" ? "active" : ""
          }" data-tab="agendar">
            Agendar
          </button>
          <button class="tab-button ${
            this.activeTab === "historial" ? "active" : ""
          }" data-tab="historial">
            Historial
          </button>
        </div>

        <div class="form-section">
          <div class="form-group">
            <label class="form-label">Tema</label>
            <div class="select-wrapper">
              <select id="tema-select" class="form-select">
                <option value="">Selecciona un tema</option>
                <option value="matematicas">Matemáticas</option>
                <option value="fisica">Física</option>
                <option value="quimica">Química</option>
                <option value="programacion">Programación</option>
                <option value="ingles">Inglés</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Maestro</label>
            <div class="select-wrapper">
              <select id="maestro-select" class="form-select">
                <option value="">Selecciona un maestro</option>
                <option value="garcia">Prof. García</option>
                <option value="martinez">Prof. Martínez</option>
                <option value="rodriguez">Prof. Rodríguez</option>
                <option value="lopez">Prof. López</option>
                <option value="fernandez">Prof. Fernández</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Fecha y hora de llegada</label>
            <div class="date-time-container">
              <div class="date-input-wrapper">
                <input 
                  type="date" 
                  id="fecha-input" 
                  class="form-input date-input" 
                  required
                />
                <svg class="calendar-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zm0-13H5V6h14v1z"/>
                </svg>
              </div>
              <div class="time-input-wrapper">
                <input 
                  type="time" 
                  id="hora-input" 
                  class="form-input time-input" 
                  required
                />
                <svg class="clock-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
              </div>
            </div>
            <input 
              type="hidden" 
              id="fecha-hora-display" 
            />
          </div>

          <button id="agendar-btn" class="agendar-button">Agendar</button>
          <div style="clear: both;"></div>
        </div>

        <div class="historial-section">
          <div class="historial-list">
            ${
              this.historial.length > 0
                ? this.historial
                    .map(
                      (item) => `
              <div class="historial-card">
                <div class="historial-card-header">
                  <div class="historial-tema">${item.tema}</div>
                </div>
                <div class="historial-maestro">${
                  item.maestro || "Sin maestro asignado"
                }</div>
                <div class="historial-fecha">${item.fecha} ${
                        item.hora ? "- " + item.hora : ""
                      }</div>
              </div>
            `
                    )
                    .join("")
                : "<p style=\"text-align: center; color: #6b7280; padding: 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;\">No hay tutorías agendadas</p>"
            }
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("agendar-page", AgendarPage);
