import { useState, useEffect } from "react";
import PageLoader from "../components/PageLoader";
import toast, { Toaster } from "react-hot-toast";
import { API_URL } from "../config";
import AppointmentCard from "../components/AppointmentCard";
import EmptyState from "../components/EmptyState";
import { getAppointmentId } from "../utils/appointmentHelpers";

const AppointmentsPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [appointments, setAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const loaderDelay = new Promise((resolve) => setTimeout(resolve, 700));
        const response = await fetch(`${API_URL}/api/appointments`);
        await loaderDelay;
        const data = await response.json();

        if (!isMounted) return;

        setAppointments(data.upcoming || []);
        setPastAppointments(data.past || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAppointments();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!selectedAppointment) return;
    
    try {
      const response = await fetch(
        `${API_URL}/api/appointments/${getAppointmentId(selectedAppointment)}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setAppointments(
          appointments.filter(
            (appointment) =>
              getAppointmentId(appointment) !== getAppointmentId(selectedAppointment)
          )
        );
        setIsCancelModalOpen(false);
        setSelectedAppointment(null);
        toast.success(data?.message || "Appointment cancelled");
        
      } else {
        console.error("Failed to cancel appointment");
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  if (isLoading) {
    return (
      <PageLoader
        message="Loading your appointments..."
        icon="calendar_clock"
      />
    );
  }

  return (
    <div className="w-full max-w-container-max-w mx-auto px-gutter-mobile py-space-lg sm:px-gutter-desktop sm:py-space-xl relative animate-in fade-in slide-in-from-bottom-3 duration-700 ease-out">
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
        <div className="grid grid-cols-2 gap-space-xs sm:flex sm:items-center">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg items-stretch">
          {/* Dynamic List Render for Upcoming */}
          {activeTab === "upcoming" && appointments.length > 0 ? (
            appointments.map((app) => (
              <AppointmentCard
                key={getAppointmentId(app)}
                appointment={app}
                onCancel={handleCancelClick}
              />
            ))
          ) : activeTab === "upcoming" && appointments.length === 0 ? (
            <EmptyState icon="event_busy" title="No Upcoming Appointments">
              You don't have any sessions booked right now. Schedule a new one
              to get started.
            </EmptyState>
          ) : null}

          {/* Empty State for Past */}
          {activeTab === "past" && pastAppointments.length === 0 && (
            <EmptyState icon="history" title="No Past Appointments">
              Your past session history will appear here once you complete an
              appointment.
            </EmptyState>
          )}

          {activeTab === "past" && pastAppointments.length > 0
            ? pastAppointments.map((app) => (
                <AppointmentCard
                  key={getAppointmentId(app)}
                  appointment={app}
                  variant="past"
                />
              ))
            : null}
        </div>

      {/* Dynamic Cancel Modal connected to DELETE API */}
      {isCancelModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-gutter-mobile">
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg sm:p-space-xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150 relative">
            <div className="w-12 h-12 rounded-full bg-error-container flex items-center justify-center text-error mb-space-md">
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
            <div className="flex flex-col-reverse gap-space-sm sm:flex-row sm:items-center sm:justify-end">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="h-11 rounded-full px-space-lg text-on-surface-variant hover:bg-surface-container-high font-label-lg transition-colors cursor-pointer"
              >
                Keep Appointment
              </button>
              <button
                onClick={confirmCancel}
                className="h-11 rounded-full bg-red-container px-space-lg text-error shadow-sm transition-all hover:bg-error hover:text-on-red cursor-pointer"
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
