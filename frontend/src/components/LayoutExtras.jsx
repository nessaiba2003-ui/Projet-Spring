export const Topbar = () => (
  <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
    <h2 className="text-gray-500 font-medium">Système de Suivi</h2>
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">AD</div>
      <span className="text-sm font-semibold">Administrateur</span>
    </div>
  </header>
);

export const Footer = () => (
  <footer className="p-4 bg-gray-50 border-t text-center text-xs text-gray-400">
    © 2026 - Application de Gestion de Projets - Tous droits réservés.
  </footer>
);