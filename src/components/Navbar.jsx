// src/components/Navbar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

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
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-extrabold text-blue-600 select-none">
          ConditionX
        </div>

        <nav className="flex space-x-6 text-sm font-medium">
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
            href="#"
            onClick={handleLogout}
            className="text-gray-700 hover:text-blue-500 transition-colors"
          >
            Log out
          </a>
        </nav>
      </div>
    </header>
  );
}
