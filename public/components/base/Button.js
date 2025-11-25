/**
 * Button Component - Web Component reutilizable
 * Estilos encapsulados con Shadow DOM
 */
class CustomButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['variant', 'disabled', 'type'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const variant = this.getAttribute('variant') || 'primary';
    const disabled = this.hasAttribute('disabled');
    const type = this.getAttribute('type') || 'button';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        
        button {
          width: 100%;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .primary {
          background-color: #2563eb;
          color: white;
        }

        .primary:hover:not(:disabled) {
          background-color: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
        }

        .secondary {
          background-color: #6b7280;
          color: white;
        }

        .secondary:hover:not(:disabled) {
          background-color: #4b5563;
        }

        .outline {
          background-color: transparent;
          color: #2563eb;
          border: 2px solid #2563eb;
        }

        .outline:hover:not(:disabled) {
          background-color: #2563eb;
          color: white;
        }

        @media (min-width: 768px) {
          button {
            padding: 14px 32px;
            font-size: 18px;
            max-width: 300px;
          }
        }
      </style>
      <button class="${variant}" type="${type}" ${disabled ? 'disabled' : ''}>
        <slot></slot>
      </button>
    `;
  }
}

customElements.define('custom-button', CustomButton);

