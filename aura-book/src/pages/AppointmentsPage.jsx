import { useState, useEffect } from "react";
import PageLoader from "../components/PageLoader";
import toast, { Toaster } from "react-hot-toast";

const AppointmentsPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Dynamic API States
  const [appointments, setAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const defaultImage =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuARCoG_0OZqiBZPgUVvEOvaf0kzW3qu-_XB8x-M-I5EMMZWuSuc8Y6viIW3cyI3L2tcQx2ggQMy9JBvzFurud3V39xrJyowks4_z0tfWQq-TC5N85cGtD658MMn13IZcdXSZ0u_0LTGhTHws2FcEC5SE19UfoBBvIGog3EikE5Lm9cSFWAqyUabMjPer3nqRvqm9cen4z-t3omHAHLfTYUZYPbwV0GnEx_bm8qtw6BVw7eX-ELcrrDAsQ";

  // 1. Fetch Appointments from Backend

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/api/appointments");
        const data = await response.json();
        setAppointments(data.upcoming);
        setPastAppointments(data.past);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!selectedAppointment) return;
    console.log(selectedAppointment,appointments);
    
    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/${selectedAppointment._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      console.log(data)
      if (response.ok) {
        setAppointments(
          appointments.filter((app) => app.id !== selectedAppointment._id)
        );
        setIsCancelModalOpen(false);
        setSelectedAppointment(null);
        toast.success(data?.message, {
          duration: 3000,
          style: {
            borderRadius: "9999px",
            background: "#131b2e",
            color: "#fff",
            padding: "12px 20px",
          },
        });
        
      } else {
        console.error("Failed to cancel appointment");
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoad) {
    return (
      <PageLoader
        message="Setting up your workspace..."
        icon="calendar_clock"
      />
    );
  }

  return (
    <div className="w-full max-w-container-max-w mx-auto px-gutter-desktop py-space-xl relative">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg mb-space-2xl">
        <div className="max-w-2xl">
          <div className="flex items-center gap-space-xs text-primary mb-space-2xs">
            <span className="material-symbols-outlined text-[18px]">
              calendar_clock
            </span>
            <span className="font-label-md text-label-md uppercase tracking-wider">
              Session Management
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            My Appointments
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-2xs">
            Manage or connect to your scheduled mentoring and
            consultation sessions with executive advisors.
          </p>
        </div>
      </div>

      {/* Dynamic Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-xl bg-surface-container-low p-space-xs rounded-2xl">
        <div className="flex items-center gap-space-xs">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex items-center gap-space-xs px-space-lg py-space-xs rounded-full transition-all cursor-pointer ${
              activeTab === "upcoming"
                ? "bg-surface-container-lowest text-primary shadow-sm font-headline-sm"
                : "text-on-surface-variant hover:text-on-surface font-label-lg"
            }`}
          >
            <span>Upcoming</span>
            <span
              className={`px-2 py-0.5 rounded-full font-label-sm ${
                activeTab === "upcoming"
                  ? "bg-primary/10 text-primary"
                  : "bg-surface-container-high text-on-surface-variant"
              }`}
            >
              {appointments.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`flex items-center gap-space-xs px-space-lg py-space-xs rounded-full transition-all cursor-pointer ${
              activeTab === "past"
                ? "bg-surface-container-lowest text-primary shadow-sm font-headline-sm"
                : "text-on-surface-variant hover:text-on-surface font-label-lg"
            }`}
          >
            <span>Past</span>
            <span
              className={`px-2 py-0.5 rounded-full font-label-sm ${
                activeTab === "past"
                  ? "bg-primary/10 text-primary"
                  : "bg-surface-container-high text-on-surface-variant"
              }`}
            >
              {pastAppointments.length}
            </span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="w-full flex justify-center py-20">
          <span className="material-symbols-outlined animate-spin text-primary text-[40px]">
            sync
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg items-stretch">
          {/* Dynamic List Render for Upcoming */}
          {activeTab === "upcoming" && appointments.length > 0 ? (
            appointments.map((app) => (
              <div
                key={app.id}
                className="group flex flex-col justify-between bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className="flex items-start justify-between gap-space-sm mb-space-md">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/30 text-on-secondary-container font-label-sm text-label-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>{" "}
                      Confirmed
                    </span>
                  </div>
                  <div className="flex items-center gap-space-md mb-space-md">
                    <img
                      className="w-14 h-14 rounded-full object-cover shadow-sm"
                      alt={app.name}
                      src={defaultImage}
                    />
                    <div className="min-w-0">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface truncate">
                        {app.name}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                        Lead Product Designer
                      </p>
                    </div>
                  </div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface mb-space-sm leading-snug">
                    {app.topic}
                  </h4>
                  <div className="flex items-start gap-space-xs p-space-sm rounded-xl bg-surface-container-low mb-space-lg">
                    <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                      event
                    </span>
                    <div className="font-body-sm text-body-sm">
                      <p className="font-numeric-slot text-numeric-slot text-on-surface">
                        {app.date}
                      </p>
                      <p className="text-on-surface-variant">{app.time}</p>
                    </div>
                  </div>
                </div>
                <div className="pt-space-md border-t border-surface-container-low">
                  <button className="w-full h-11 rounded-full bg-primary-container text-on-primary font-label-lg hover:bg-primary transition-all flex items-center justify-center gap-space-xs shadow-sm cursor-pointer">
                    <span className="material-symbols-outlined text-[20px]">
                      video_call
                    </span>{" "}
                    Join Video Call
                  </button>
                  <div className="flex items-center justify-center mt-space-sm">
                    <button
                      onClick={() => handleCancelClick(app)}
                      className="w-full py-2 rounded-full font-label-md text-tertiary hover:bg-tertiary-fixed/10 border border-transparent hover:border-tertiary/30 transition-all cursor-pointer"
                    >
                      Cancel Appointment
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : activeTab === "upcoming" && appointments.length === 0 ? (
            /* Empty State for Upcoming */
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-surface-container-lowest rounded-2xl border-2 border-dashed border-outline-variant ">
              <span className="material-symbols-outlined text-[48px] text-outline mb-4">
                event_busy
              </span>
              <h3 className="font-headline-md text-on-surface mb-2">
                No Upcoming Appointments
              </h3>
              <p className="font-body-md text-on-surface-variant max-w-sm mb-6">
                You don't have any sessions booked right now. Schedule a new one
                to get started.
              </p>
            </div>
          ) : null}

          {/* Empty State for Past */}
          {activeTab === "past" && pastAppointments.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-surface-container-lowest rounded-2xl border-2 border-dashed border-outline-variant">
              <span className="material-symbols-outlined text-[48px] text-outline mb-4">
                history
              </span>
              <h3 className="font-headline-md text-on-surface mb-2">
                No Past Appointments
              </h3>
              <p className="font-body-md text-on-surface-variant max-w-sm">
                Your past session history will appear here once you complete an
                appointment.
              </p>
            </div>
          )}

          {activeTab === "past" && pastAppointments.length > 0
            ? pastAppointments.map((app) => (
                <div
                  key={app.id}
                  className="group flex flex-col justify-between bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm opacity-80 hover:opacity-100 transition-all duration-200"
                >
                  <div>
                    <div className="flex items-start justify-between gap-space-sm mb-space-md">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>{" "}
                        Completed
                      </span>
                    </div>
                    <div className="flex items-center gap-space-md mb-space-md grayscale group-hover:grayscale-0 transition-all">
                      <img
                        className="w-14 h-14 rounded-full object-cover shadow-sm"
                        alt={app.name}
                        src={defaultImage}
                      />
                      <div className="min-w-0">
                        <h3 className="font-headline-sm text-headline-sm text-on-surface truncate">
                          {app.name}
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                          Lead Product Designer
                        </p>
                      </div>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface mb-space-sm leading-snug">
                      {app.topic || "1-on-1 Strategy Session"}
                    </h4>
                    <div className="flex items-start gap-space-xs p-space-sm rounded-xl bg-surface-container-low mb-space-lg">
                      <span className="material-symbols-outlined text-outline text-[20px] shrink-0 mt-0.5">
                        history
                      </span>
                      <div className="font-body-sm text-body-sm">
                        <p className="font-numeric-slot text-numeric-slot text-on-surface-variant line-through decoration-outline/50">
                          {app.date}
                        </p>
                        <p className="text-on-surface-variant line-through decoration-outline/50">
                          {app.time}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : null}
        </div>
      )}

      {/* Dynamic Cancel Modal connected to DELETE API */}
      {isCancelModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-gutter-mobile">
          <div className="bg-surface-container-lowest rounded-2xl p-space-xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150 relative">
            <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary mb-space-md">
              <span className="material-symbols-outlined text-[24px]">
                warning
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-space-2xs">
              Cancel Appointment?
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
              Are you sure you want to cancel your session with{" "}
              <span className="font-headline-sm text-on-surface">
                {selectedAppointment.name}
              </span>{" "}
              on{" "}
              <span className="font-numeric-slot text-on-surface">
                {selectedAppointment.date}
              </span>{" "}
              at {selectedAppointment.time}?
            </p>
            <div className="p-space-sm rounded-xl bg-surface-container-low mb-space-lg flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-outline text-[20px]">
                info
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Notice: Cancellation within 24h forfeits credit carryover.
              </span>
            </div>
            <div className="flex items-center justify-end gap-space-sm">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="px-space-lg h-11 rounded-full text-on-surface-variant hover:bg-surface-container-high font-label-lg transition-colors cursor-pointer"
              >
                Keep Appointment
              </button>
              <button
                onClick={confirmCancel}
                className="px-space-lg h-11 rounded-full bg-tertiary-container hover:bg-tertiary text-on-tertiary font-label-lg shadow-sm transition-all cursor-pointer"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
};

export default AppointmentsPage;
