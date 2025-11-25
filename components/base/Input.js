/**
 * Input Component - Web Component reutilizable
 * Estilos encapsulados con Shadow DOM
 */
class CustomInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['type', 'placeholder', 'value', 'label', 'required', 'disabled'];
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
    const input = this.shadowRoot.querySelector('input');
    if (input) {
      input.addEventListener('input', (e) => {
        this.setAttribute('value', e.target.value);
        this.dispatchEvent(new CustomEvent('input-change', {
          detail: { value: e.target.value },
          bubbles: true,
          composed: true
        }));
      });
    }
  }

  render() {
    const type = this.getAttribute('type') || 'text';
    const placeholder = this.getAttribute('placeholder') || '';
    const value = this.getAttribute('value') || '';
    const label = this.getAttribute('label') || '';
    const required = this.hasAttribute('required');
    const disabled = this.hasAttribute('disabled');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          margin-bottom: 20px;
        }

        .input-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          color: #2563eb;
          font-size: 14px;
          font-weight: 600;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        input {
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

        input:focus {
          outline: none;
          border-color: #1d4ed8;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        input:disabled {
          background-color: #f3f4f6;
          cursor: not-allowed;
          opacity: 0.6;
        }

        input::placeholder {
          color: #9ca3af;
        }

        @media (min-width: 768px) {
          input {
            padding: 14px 20px;
            font-size: 18px;
          }

          label {
            font-size: 16px;
          }
        }
      </style>
      <div class="input-container">
        ${label ? `<label>${label}</label>` : ''}
        <input 
          type="${type}" 
          placeholder="${placeholder}" 
          value="${value}"
          ${required ? 'required' : ''}
          ${disabled ? 'disabled' : ''}
        />
      </div>
    `;
  }
}

customElements.define('custom-input', CustomInput);

