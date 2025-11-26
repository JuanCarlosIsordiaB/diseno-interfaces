Sistema de Tutorías Académicas - Web Components - Juan Carlos Isordia Betancourt
Descripción del Proyecto
Este es un sistema web que hice para gestionar tutorías académicas. Lo construí completamente con Web Components nativos, sin usar frameworks como React o Vue (bueno, técnicamente usé Next.js como base, pero toda la lógica de componentes es con Web Components puros). La idea era demostrar que se pueden hacer cosas bastante complejas usando solo los estándares del navegador.
¿Qué hace?
Básicamente es una app donde estudiantes y tutores pueden manejar sus citas académicas. Tiene todo lo que esperarías:

Funciona en cualquier dispositivo: Lo hice responsive desde el inicio
Navegación por pestañas: Puedes moverte entre secciones sin que se recargue la página
Agendar tutorías: Formulario completo para crear citas
Notificaciones: Te avisa cuando pasa algo importante
Perfil: Puedes ver y editar tu información

Cómo está organizado
La estructura
Organicé todo en carpetas para que sea fácil encontrar las cosas:
components/
├── base/
│ ├── Button.js
│ ├── Input.js
│ ├── NavigationBar.js
│ ├── HamburgerMenu.js
│ └── NotificationsList.js
├── pages/
│ ├── HomePage.js
│ ├── AgendarPage.js
│ ├── LoginPage.js
│ └── ProfilePage.js
├── Router.js
└── index.js
Shadow DOM para no volver loco
Usé Shadow DOM en todos los componentes. ¿Por qué? Porque así los estilos de un componente no se meten con los de otro. Es como tener cada componente en su propia cajita:
javascriptclass CustomButton extends HTMLElement {
constructor() {
super();
this.attachShadow({ mode: 'open' });
}
}
Accesibilidad (porque importa)
Traté de hacer las cosas bien desde el principio:

Usé las etiquetas HTML correctas (nav, button, etc.)
Puse atributos ARIA donde los necesitaba
Todo se puede usar con el teclado
Los colores tienen buen contraste

Los Componentes
Los componentes básicos (que uso en todos lados)
CustomButton
Es un botón pero con esteroides. Tiene diferentes estilos que puedo cambiar con un atributo:
Lo que puede hacer:

Tres estilos diferentes: primary, secondary, outline
Se puede deshabilitar
Tiene efectos hover bonitos
Le puedes meter lo que quieras adentro (emojis, íconos, lo que sea)

Cómo se usa:
html<custom-button variant="primary" type="submit">
Agendar Cita
</custom-button>
CustomInput
Un input que valida y te avisa cuando cambias algo:
Lo que tiene:

Funciona con cualquier tipo: texto, email, contraseña, fecha, hora...
Valida si pones required
Dispara eventos cuando escribes algo
Se ve bien en todos los estados (focus, error, disabled)

Ejemplo:
html<custom-input 
  type="email" 
  label="Correo Electrónico" 
  placeholder="tu@email.com"
  required>
</custom-input>
NavigationBar
La barrita de abajo que te dice dónde estás:
Características:

Tiene íconos SVG que cambian cuando estás en cada página
Manda eventos cuando le das clic
Se adapta al tamaño de pantalla
Las transiciones están suavecitas

HamburgerMenu
El menú típico que sale de la izquierda:
Qué hace:

Se abre con animación
Tiene un overlay oscuro atrás
El ícono se convierte en X cuando está abierto
Puedes cerrarlo haciendo clic afuera

NotificationsList
Aquí es donde guardo las notificaciones:
Features:

Se guarda en localStorage (no se pierden al recargar)
Se actualiza solita cuando hay nuevas notificaciones
Puedes borrar notificaciones una por una
Muestra un mensaje cuando no hay nada

Las páginas
HomePage
El dashboard principal. Aquí ves tus notificaciones y puedes abrir el menú.
AgendarPage
El formulario para crear tutorías. Valida todo y te confirma cuando agendas algo.
ProfilePage
Tu perfil, donde puedes ver y editar tu info.
Reutilización (DRY, ¿no?)
Diseñé todo para reutilizar
Los componentes están hechos para usarse en cualquier lado:

Base sólida: Los componentes de base/ son super genéricos
Composición: Las páginas juntan varios componentes base
Configurables: Todo se puede personalizar con atributos
Eventos consistentes: Todos hablan el mismo idioma

Slots (contenido flexible)
javascript// Puedo meter lo que sea dentro del botón
<custom-button variant="primary">
<span>Con emoji si quiero</span>
</custom-button>

// Y el botón simplemente lo renderiza
render() {
this.shadowRoot.innerHTML = `    <button class="${variant}">
      <slot></slot>
    </button>
 `;
}
Propiedades reactivas
Los componentes se actualizan solos cuando cambio los atributos:
javascriptstatic get observedAttributes() {
return ['variant', 'disabled', 'type'];
}

attributeChangedCallback() {
this.render();
}
Cómo funciona todo junto
El sistema de navegación
Hice mi propio router porque... ¿por qué no? Es más simple de lo que parece:
javascriptnavigate(route) {
const pages = {
'home': 'home-page',
'agendar': 'agendar-page',
'perfil': 'profile-page'
};

this.showPage(pages[route]);
this.updateNavigation(route);
}
Cómo se hablan los componentes
Uso eventos custom porque es lo más limpio:
javascript// Un componente manda un evento
this.dispatchEvent(new CustomEvent('navigate', {
detail: { route: 'agendar' },
bubbles: true,
composed: true
}));

// Otro lo escucha
document.addEventListener('navigate', (e) => {
this.router.navigate(e.detail.route);
});
El flujo completo
Así es como un usuario usa la app:

Login: Entras con tu email y contraseña
Dashboard: Ves tus notificaciones
Agendar: Creas una nueva tutoría
Perfil: Cambias tu info si quieres
Navegación: Te mueves suavecito entre todo

Código limpio (o al menos lo intenté)
Usé ES6+ porque sí
javascript// Destructuring, template literals, todo lo moderno
const { route } = e.detail;
const html = `<div class="${className}">${content}</div>`;

// Arrow functions everywhere
const activeItems = items.filter(item => item.active);
Nombres que tienen sentido

Componentes: PascalCase (CustomButton, NavigationBar)
Métodos: camelCase (setupEventListeners)
CSS Classes: kebab-case (nav-icon, input-container)
Eventos: kebab-case (input-change, navigate)

Estructura consistente
Todos mis componentes siguen el mismo patrón:
javascriptclass ComponentName extends HTMLElement {
constructor() { /_ Inicio aquí _/ }

static get observedAttributes() { /_ Qué atributos observo _/ }

connectedCallback() { /_ Cuando se monta _/ }

attributeChangedCallback() { /_ Cuando cambia algo _/ }

setupEventListeners() { /_ Los eventos _/ }

render() { /_ Dibujo todo _/ }
}
Las cosas creativas que hice
Soluciones que me parecieron interesantes

1. Sistema de notificaciones en tiempo real
   Cuando creas una notificación, todas las listas se actualizan solas:
   javascriptdocument.dispatchEvent(new CustomEvent('notificacion-creada', {
   detail: { notification: newNotification }
   }));
2. Router sin librerías
   Hice un sistema de navegación completo usando solo Web Components. No instalé nada extra.
3. Animaciones sutiles
   Agregué animaciones CSS (fadeIn, slideUp, bounceIn) para que se sienta más fluido. No son exageradas, solo lo suficiente para que se note.
   Para correrlo
   bashnpm install
   npm run dev

```

Abre http://localhost:3000

### Lo que puedes probar:

- Navegar entre páginas sin que se recargue
- Hacer login (aunque no valida de verdad, es un demo)
- Ver y crear notificaciones (se guardan en localStorage)
- Abrir el menú hamburguesa
- Ver todo en responsive (prueba en tu celular)
- Las animaciones y transiciones

## Lo que usé

- Next.js 16: Para el servidor y SSR
- React 19: Solo para el componente que carga todo
- Web Components: La estrella del show
- JavaScript ES6+: Moderno y limpio
- CSS3: Para los estilos y animaciones
- localStorage: Para guardar las notificaciones

## Cómo está organizado todo
```

diseno/
├── app/
│ ├── components/
│ │ └── AppClient.tsx
│ ├── page.tsx
│ └── layout.tsx
├── components/
│ ├── base/
│ │ ├── Button.js
│ │ ├── Input.js
│ │ ├── NavigationBar.js
│ │ ├── HamburgerMenu.js
│ │ └── NotificationsList.js
│ ├── pages/
│ │ ├── LoginPage.js
│ │ ├── HomePage.js
│ │ ├── AgendarPage.js
│ │ └── ProfilePage.js
│ └── Router.js
└── public/
└── components/
Lo que aprendí
Este proyecto fue un buen ejercicio para entender Web Components a fondo. Me gustó ver cómo puedes hacer apps complejas sin depender de frameworks gigantes. Obvio, Next.js está ahí como base, pero toda la lógica de componentes es pura Web API.
La arquitectura modular hace que sea fácil agregar más cosas después. Si quisiera agregar otra página o componente, solo tengo que seguir el mismo patrón que ya tengo.
Nota
Este proyecto lo hice para la clase de Diseño de Interfaces. Fue bastante trabajo pero me gustó cómo quedó. Si tienes preguntas o sugerencias, siéntete libre de contactarme.
