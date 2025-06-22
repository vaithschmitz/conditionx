// src/layouts/AppLayout.jsx
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AppLayout() {
  const { pathname } = useLocation();
  const showNavbar = pathname !== '/' && pathname !== '/register';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {showNavbar && <Navbar />}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
