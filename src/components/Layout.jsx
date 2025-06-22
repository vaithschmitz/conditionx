import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { name: 'Overview', path: '/overview' },
  { name: 'Climbing', path: '/climbing' },
  { name: 'Yoga', path: '/yoga' },
  { name: 'Conditioning', path: '/conditioning' },
  { name: 'Cardio', path: '/cardio' },
  { name: 'Recovery', path: '/recovery' },
];

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg text-text font-sans">
      {/* Header */}
      <header className="bg-surface border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Brand (not a link) */}
          <div className="text-2xl font-bold tracking-tight text-primary select-none">
            ConditionX
          </div>

          {/* Navigation */}
          <nav className="flex gap-5 items-center text-sm font-medium">
            {navItems.map(({ name, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `transition pb-1 border-b-2 ${
                    isActive
                      ? 'text-primary border-primary font-semibold'
                      : 'text-text-muted border-transparent hover:text-primary'
                  }`
                }
              >
                {name}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
