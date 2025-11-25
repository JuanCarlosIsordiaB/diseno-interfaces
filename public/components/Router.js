/**
 * Router Component - Sistema de navegación para la aplicación
 * Maneja el routing entre diferentes páginas
 */
class AppRouter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentRoute = 'login';
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.handleRoute();
  }

  setupEventListeners() {
    document.addEventListener('navigate', (e) => {
      this.navigateTo(e.detail.route);
    });
  }

  navigateTo(route) {
    this.currentRoute = route;
    this.handleRoute();
  }

  handleRoute() {
    const container = this.shadowRoot.querySelector('#page-container');
    const navBar = this.shadowRoot.querySelector('navigation-bar');
    
    if (!container) return;

    container.innerHTML = '';

    switch (this.currentRoute) {
      case 'login':
        if (navBar) navBar.style.display = 'none';
        const loginPage = document.createElement('login-page');
        container.appendChild(loginPage);
        break;
      
      case 'home':
        if (navBar) {
          navBar.style.display = 'block';
          navBar.setAttribute('active', 'home');
        }
        const homePage = document.createElement('home-page');
        container.appendChild(homePage);
        break;
      
      case 'agendar':
        if (navBar) {
          navBar.style.display = 'block';
          navBar.setAttribute('active', 'agendar');
        }
        const agendarPage = document.createElement('agendar-page');
        container.appendChild(agendarPage);
        break;
      
      case 'perfil':
        if (navBar) {
          navBar.style.display = 'block';
          navBar.setAttribute('active', 'perfil');
        }
        const profilePage = document.createElement('profile-page');
        container.appendChild(profilePage);
        break;
      
      default:
        this.navigateTo('login');
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          min-height: 100vh;
        }

        #page-container {
          width: 100%;
          min-height: 100vh;
        }

        navigation-bar {
          display: none;
        }
      </style>
      <div id="page-container"></div>
      <navigation-bar></navigation-bar>
    `;
  }
}

customElements.define('app-router', AppRouter);

