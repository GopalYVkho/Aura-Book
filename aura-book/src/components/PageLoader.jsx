// src/components/PageLoader.jsx
const PageLoader = ({ message = "Loading workspace...", icon = "hourglass_top" }) => {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-surface-container-lowest">
        <div className="relative flex items-center justify-center mb-space-md">
          <div className="w-16 h-16 rounded-full border-4 border-surface-container border-t-primary animate-spin"></div>
          <span className="material-symbols-outlined absolute text-primary text-[24px]">
            {icon}
          </span>
        </div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-wide animate-pulse">
          {message}
        </h2>
      </div>
    );
  };
  
  export default PageLoader;