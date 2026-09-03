import { NavLink } from 'react-router-dom';
import logo from "../assets/image/logo.png";

const Header = () => {
  // Navigation active state styling helper
  const navLinkClass = ({ isActive }) =>
    isActive
      ? "transition-all bg-primary-container text-on-primary font-headline-sm rounded-full px-space-md py-space-xs"
      : "px-space-md py-space-xs rounded-full font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(15,23,42,0.04)]">
      <div className="h-16 max-w-container-max-w mx-auto px-gutter-desktop flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-space-sm">
          <img alt="Brand logo" className="h-8 w-auto object-contain" src={logo} />
          <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Aura Book</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-space-xs">
          <NavLink to="/" className={navLinkClass}>Book Appointment</NavLink>
          <NavLink to="/my-appointments" className={navLinkClass}>My Appointments</NavLink>
          <a href="#" className="px-space-md py-space-xs rounded-full font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all">Specialists</a>
          <a href="#" className="px-space-md py-space-xs rounded-full font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all">Support</a>
        </nav>

        {/* Profile & Notifications */}
        <div className="flex items-center gap-space-md">
          <button aria-label="Notifications" className="w-touch-target-min h-touch-target-min rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
          </button>
          <div className="flex items-center gap-space-xs pl-space-xs py-space-2xs pr-space-sm rounded-full hover:bg-surface-container transition-colors cursor-pointer">
            <img alt="Profile" className="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1UxcSi8G-rBmFVglqOcMWoV3MIqq0NQNlDbIa7GGsgSvEAVbfFKdK0jkzG2WCWT904V1mhlXkX58eIuC2pAWkyxOiTdTuRahTIW2G9gtqTGPpD8cB0Byekd4VJFOERSTaWRHf9CRUabasUbDwIlf73GUzDDkpPV6v4e_Wn5GSdDljwSpl9QS6ThN5_xCZURSoRcJ31UEciN6h2EdDl837pvpeLXXRMDl0xayUDDairNETwLKQvEzWMDt_o" />
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">keyboard_arrow_down</span>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;