import defaultImage from "../assets/image/profile.jpg";

const statusStyles = {
  upcoming: {
    label: "Confirmed",
    icon: "event",
    pill: "bg-secondary-container/30 text-on-secondary-container",
    dot: "bg-secondary",
    card: "",
  },
  past: {
    label: "Completed",
    icon: "history",
    pill: "bg-surface-container-high text-on-surface-variant",
    dot: "bg-outline",
    card: "opacity-80 hover:opacity-100",
  },
};

const AppointmentCard = ({ appointment, variant = "upcoming", onCancel }) => {
  const styles = statusStyles[variant];
  const isPast = variant === "past";

  return (
    <article
      className={`group flex min-h-full flex-col justify-between rounded-2xl bg-surface-container-lowest p-space-md shadow-sm transition-all duration-200 hover:shadow-md sm:p-space-lg ${styles.card}`}
    >
      <div>
        <div className="mb-space-md flex items-start justify-between gap-space-sm">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-label-sm text-label-sm ${styles.pill}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}></span>
            {styles.label}
          </span>
        </div>

        <div
          className={`mb-space-md flex items-center gap-space-md transition-all ${
            isPast ? "grayscale group-hover:grayscale-0" : ""
          }`}
        >
          <img
            className="h-14 w-14 shrink-0 rounded-full object-cover shadow-sm"
            alt={appointment.name}
            src={defaultImage}
          />
          <div className="min-w-0">
            <h3 className="truncate font-headline-sm text-headline-sm text-on-surface">
              {appointment.name}
            </h3>
            <p className="truncate font-body-sm text-body-sm text-on-surface-variant">
              Lead Product Designer
            </p>
          </div>
        </div>

        <h4 className="mb-space-sm font-headline-sm text-headline-sm leading-snug text-on-surface">
          {appointment.topic || "1-on-1 Strategy Session"}
        </h4>

        <div className="mb-space-lg flex items-start gap-space-xs rounded-xl bg-surface-container-low p-space-sm">
          <span
            className={`material-symbols-outlined mt-0.5 shrink-0 text-[20px] ${
              isPast ? "text-outline" : "text-primary"
            }`}
          >
            {styles.icon}
          </span>
          <div className="font-body-sm text-body-sm">
            <p
              className={`font-numeric-slot text-numeric-slot ${
                isPast
                  ? "text-on-surface-variant line-through decoration-outline/50"
                  : "text-on-surface"
              }`}
            >
              {appointment.date}
            </p>
            <p
              className={
                isPast
                  ? "text-on-surface-variant line-through decoration-outline/50"
                  : "text-on-surface-variant"
              }
            >
              {appointment.time}
            </p>
          </div>
        </div>
      </div>

      {!isPast && (
        <div className="border-t border-surface-container-low pt-space-md">
          <button className="flex h-11 w-full items-center justify-center gap-space-xs rounded-full bg-primary-container font-label-lg text-label-lg text-on-primary shadow-sm transition-all hover:bg-primary cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">
              video_call
            </span>
            Join Video Call
          </button>
          <button
            onClick={() => onCancel(appointment)}
            className="mt-space-sm w-full rounded-full border border-transparent py-2 font-label-md text-label-md text-error transition-all hover:border-error/30 hover:bg-error-container cursor-pointer"
          >
            Cancel Appointment
          </button>
        </div>
      )}
    </article>
  );
};

export default AppointmentCard;
