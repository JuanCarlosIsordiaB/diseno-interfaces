"use client";

import { useEffect, createElement } from "react";

export default function AppClient() {
  useEffect(() => {
    // Cargar todos los componentes Web usando scripts dinámicos
    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.type = "module";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const loadComponents = async () => {
      try {
        await loadScript("/components/base/Button.js");
        await loadScript("/components/base/Input.js");
        await loadScript("/components/base/NavigationBar.js");
        await loadScript("/components/base/NotificationsList.js");
        await loadScript("/components/base/HamburgerMenu.js");

        await loadScript("/components/pages/LoginPage.js");
        await loadScript("/components/pages/HomePage.js");
        await loadScript("/components/pages/AgendarPage.js");
        await loadScript("/components/pages/ProfilePage.js");

        await loadScript("/components/Router.js");
      } catch (error) {
        console.error("Error cargando componentes:", error);
      }
    };

    loadComponents();
  }, []);

  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      {createElement("app-router")}
    </div>
  );
}
