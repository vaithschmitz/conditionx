// src/components/Navbar.jsx
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { FiMenu, FiX } from 'react-icons/fi';

const navItems = [
  { name: 'Log Activity', path: '/log' },
  { name: 'Overview', path: '/overview' },
  { name: 'Climbing', path: '/climbing' },
  { name: 'Yoga', path: '/yoga' },
  { name: 'Conditioning', path: '/conditioning' },
  { name: 'Cardio', path: '/cardio' },
  { name: 'Recovery', path: '/recovery' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-extrabold text-blue-600 select-none">
          ConditionX
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map(({ name, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                isActive
                  ? 'text-blue-600 font-semibold border-b-2 border-blue-600 pb-1 transition'
                  : 'text-gray-700 hover:text-blue-500 transition-colors'
              }
            >
              {name}
            </NavLink>
          ))}
          <a
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 transition-colors text-sm font-medium"
          >
            Log out
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? (
            <FiX className="text-blue-600 w-6 h-6" />
          ) : (
            <FiMenu className="text-blue-600 w-6 h-6" />
          )}
        </button>
      </div>

      {menuOpen && (
  <div className="md:hidden px-6 pt-2 pb-4 space-y-4">
    {navItems.map(({ name, path }) => (
      <NavLink
        key={path}
        to={path}
        onClick={closeMenu}
        className={({ isActive }) =>
          isActive
            ? 'block text-blue-600 font-semibold'
            : 'block text-gray-700 hover:text-blue-500 transition'
        }
      >
        {name}
      </NavLink>
    ))}
    <div className="mt-4">
      <a
        onClick={(e) => {
          handleLogout(e);
          closeMenu();
        }}
        className="block text-red-500 hover:text-red-600 font-medium"
      >
        Log out
      </a>
    </div>
  </div>
)}

    </header>
  );
}
