const EmptyState = ({ icon, title, children }) => (
  <div className="col-span-full flex min-h-72 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-lowest px-space-lg py-space-2xl text-center">
    <span className="material-symbols-outlined mb-space-md text-[48px] text-outline">
      {icon}
    </span>
    <h3 className="font-headline-md text-headline-md text-on-surface">
      {title}
    </h3>
    <p className="mt-space-xs max-w-sm font-body-md text-body-md text-on-surface-variant">
      {children}
    </p>
  </div>
);

export default EmptyState;
