import { NavLink } from 'react-router-dom';
import logo from "../assets/image/logo.png";
import user from "../assets/image/user.jpg";

const Header = () => {
  const navLinkClass = ({ isActive }) =>
    isActive
      ? "whitespace-nowrap transition-all bg-primary-container text-on-primary font-headline-sm rounded-full px-space-md py-space-xs"
      : "whitespace-nowrap px-space-md py-space-xs rounded-full font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all";

  const mobileNavLinkClass = ({ isActive }) =>
    isActive
      ? "flex-1 rounded-full bg-primary-container px-space-sm py-space-xs text-center font-label-md text-label-md text-on-primary"
      : "flex-1 rounded-full px-space-sm py-space-xs text-center font-label-md text-label-md text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-on-surface";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(15,23,42,0.04)]">
      <div className="max-w-container-max-w mx-auto px-gutter-mobile sm:px-gutter-desktop">
        <div className="h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-space-sm">
          <img alt="Brand logo" className="h-8 w-auto object-contain" src={logo} />
          <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Aura Book</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-space-xs">
          <NavLink to="/" className={navLinkClass}>Book Appointment</NavLink>
          <NavLink to="/my-appointments" className={navLinkClass}>My Appointments</NavLink>
        </nav>

        {/* Profile & Notifications */}
        <div className="flex items-center gap-space-md">
          <button aria-label="Notifications" className="w-touch-target-min h-touch-target-min rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
          </button>
          <div className="flex items-center gap-space-xs pl-space-xs py-space-2xs pr-space-sm rounded-full hover:bg-surface-container transition-colors cursor-pointer">
            <img alt="Profile" className="w-8 h-8 rounded-full object-cover" src={user} />
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">keyboard_arrow_down</span>
          </div>
        </div>

        </div>

        <nav className="flex gap-space-xs border-t border-surface-container-low py-space-xs md:hidden">
          <NavLink to="/" className={mobileNavLinkClass}>Book</NavLink>
          <NavLink to="/my-appointments" className={mobileNavLinkClass}>Appointments</NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
