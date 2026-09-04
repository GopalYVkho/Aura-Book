import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import PageLoader from "../components/PageLoader";

const BookingPage = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const now = new Date();

  const navigate = useNavigate();

  const [viewDate, setViewDate] = useState(new Date(today));
  const [selectedDate, setSelectedDate] = useState(new Date(today));
  const [selectedSlot, setSelectedSlot] = useState("");

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // API States
  const [morningSlots, setMorningSlots] = useState([]);
  const [afternoonSlots, setAfternoonSlots] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userTimezone] = useState(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const formatDateForAPI = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const formattedDate = formatDateForAPI(selectedDate);
        const response = await fetch(
          `http://localhost:5000/api/slots?date=${formattedDate}`
        );
        const data = await response.json();

        let fetchedSlots = data.slots;

        if (!fetchedSlots || fetchedSlots.length === 0) {
          fetchedSlots = [
            { time: "09:30 AM", status: "available" },
            { time: "10:15 AM", status: "available" },
            { time: "11:00 AM", status: "available" },
            { time: "02:00 PM", status: "available" },
            { time: "02:45 PM", status: "available" },
            { time: "03:30 PM", status: "available" },
          ];
        }

        setMorningSlots(fetchedSlots.filter((s) => s.time.includes("AM")));
        setAfternoonSlots(fetchedSlots.filter((s) => s.time.includes("PM")));
      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    };

    fetchSlots();
  }, [selectedDate]);

  const handleBookClick = async () => {
    setIsBooking(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: formatDateForAPI(selectedDate),
          time: selectedSlot,
          name: "Disha (Reviewer)",
        }),
      });

      const data = await response.json();

      if (response.status === 409) {
        setErrorMessage(data.message);
        setIsBooking(false);
        setSelectedDate(new Date(selectedDate));
      } else if (response.ok) {
        setIsConfirmed(true);
        setIsBooking(false);
        setSelectedDate(new Date(selectedDate));
        toast.success("Your session has been successfully booked!", {
          duration: 3000,
          style: {
            borderRadius: "9999px",
            background: "#131b2e",
            color: "#fff",
            padding: "12px 20px",
          },
        });

        setTimeout(() => {
          navigate("/my-appointments");
        }, 2000);
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.", error);
      setIsBooking(false);
    }
  };

  const handlePrevMonth = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  const blanks = Array.from(
    { length: getFirstDayOfMonth(currentYear, currentMonth) },
    (_, i) => i
  );
  const days = Array.from(
    { length: getDaysInMonth(currentYear, currentMonth) },
    (_, i) => i + 1
  );
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNamesFull = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const isSlotDisabled = (slot, dateObj) => {
    if (slot.status === "booked") return true;
    if (dateObj < today) return true;

    if (dateObj.getTime() === today.getTime()) {
      const [time, modifier] = slot.time.split(" ");
      let [hours, minutes] = time.split(":");
      hours = parseInt(hours, 10);
      if (modifier === "PM" && hours < 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      const slotDateTime = new Date(dateObj);
      slotDateTime.setHours(hours, parseInt(minutes, 10), 0, 0);
      return slotDateTime <= now;
    }
    return false;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoad) {
    return <PageLoader message="Setting up your workspace..." icon="calendar_clock" />;
  }

  return (
    <div className="w-full max-w-container-max-w mx-auto px-gutter-desktop py-space-xl flex flex-col gap-space-xl">
      {/* ERROR TOAST NOTIFICATION */}
      {errorMessage && (
        <div className="fixed top-20 right-4 z-50 bg-error-container text-on-error-container p-4 rounded-xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-5">
          <span className="material-symbols-outlined text-[20px]">error</span>
          <div className="flex flex-col">
            <span className="font-headline-sm">Slot Already Taken</span>
            <span className="font-body-sm">{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage("")}
            className="ml-4 font-label-sm hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. FULLY RESTORED HERO CARD */}
      <section className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-space-lg md:p-space-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-lg z-10">
          <div className="relative flex-shrink-0">
            <img
              className="w-24 h-24 rounded-full object-cover shadow-sm ring-4 ring-surface-container-low"
              alt="Sarah Jenkins"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV2WWVey_FnijuHf_sZ5YfMMacUUHADg5nBkKH_fqGj4GeAN62urg8-CavqZ7MgtBgDfloVLXrIooVrGGd_9cjmg7984ZnO2jxLYv-IZ_IrGyGAWf8kM6oparM0LT7hJU_-ZXxLzwPpAlK1HSRyEfGga8YbVAqymy40qtKwdq2HQ3-PyZGCwBLAbzPcy4xG5MgPFCbd0ZcrCT2_1GK7ZpQrF8ghPLfHZrurgwg1HmA8nmnSnZEFGuLdA"
            />
          </div>
          <div className="flex flex-col gap-space-2xs">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="bg-secondary-container text-on-secondary-container px-space-xs py-space-2xs rounded-full font-label-sm text-label-sm uppercase tracking-wide">
                Top Mentor
              </span>
              <span className="bg-surface-container text-on-surface-variant px-space-xs py-space-2xs rounded-full font-label-sm text-label-sm flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-[14px] text-amber-500"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <strong className="text-on-surface font-headline-sm">
                  4.9
                </strong>{" "}
                (98 reviews)
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
              1-on-1 Strategy Session
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              with Sarah Jenkins — Lead Product Designer & Design Systems
              Architect
            </p>

            <div className="flex flex-wrap items-center gap-space-md mt-space-xs text-on-surface-variant font-label-md text-label-md">
              <div className="flex items-center gap-1.5 bg-surface-container-low px-space-sm py-space-2xs rounded-lg">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  schedule
                </span>
                <span>45 min</span>
              </div>
              <div className="flex items-center gap-1.5 bg-surface-container-low px-space-sm py-space-2xs rounded-lg">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  videocam
                </span>
                <span>Google Meet</span>
              </div>
              <div className="flex items-center gap-1.5 bg-surface-container-low px-space-sm py-space-2xs rounded-lg">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  payments
                </span>
                <span className="text-on-surface font-headline-sm">₹1,500</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-space-xs w-full lg:w-auto bg-surface-container-low/60 p-space-md rounded-xl z-10">
          <span className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider">
            Session Timezone
          </span>
          <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-space-xs rounded-full shadow-sm cursor-pointer hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-primary text-[18px]">
              globe
            </span>
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              {userTimezone
                ? userTimezone.replace("_", " ")
                : "Detecting Timezone..."}
            </span>
            <span className="material-symbols-outlined text-on-surface-variant text-[16px]">
              expand_more
            </span>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Times automatically aligned to your region
          </span>
        </div>
      </section>

      {/* Main Workspace */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        {/* Left Column: Calendar */}
        <section className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-sm p-space-lg md:p-space-xl flex flex-col gap-space-lg">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight">
                Select Date
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Choose an available day for Sarah's calendar
              </p>
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-sm text-headline-sm text-on-surface mr-space-sm">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <button
                onClick={handlePrevMonth}
                className="w-touch-target-min h-touch-target-min rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  chevron_left
                </span>
              </button>
              <button
                onClick={handleNextMonth}
                className="w-touch-target-min h-touch-target-min rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider py-space-xs">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {blanks.map((_, i) => (
              <div key={`blank-${i}`} className="h-14"></div>
            ))}

            {days.map((day) => {
              const thisDate = new Date(currentYear, currentMonth, day);
              const isPast = thisDate < today;
              const isSelected = selectedDate.getTime() === thisDate.getTime();
              const isWeekend =
                thisDate.getDay() === 0 || thisDate.getDay() === 6;

              const isDisabledDay = isPast || isWeekend;

              return (
                <button
                  key={`${currentYear}-${currentMonth}-${day}`}
                  disabled={isDisabledDay}
                  onClick={() => {
                    setSelectedDate(thisDate);
                    setSelectedSlot("");
                    setIsConfirmed(false);
                    setErrorMessage("");
                  }}
                  className={`h-14 rounded-lg flex flex-col items-center justify-center font-numeric-slot text-numeric-slot transition-all duration-200 relative focus:outline-none ${
                    isDisabledDay
                      ? "bg-surface-container-lowest text-outline cursor-not-allowed border border-surface-container border-dashed"
                      : isSelected
                      ? "bg-primary-container text-on-primary shadow-md transform scale-[1.03] border border-transparent"
                      : "bg-surface-container-low hover:bg-surface-container-high text-on-surface border border-transparent cursor-pointer"
                  }`}
                >
                  <span className={isSelected ? "font-bold" : ""}>{day}</span>

                  {!isDisabledDay && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-1 ${
                        isSelected
                          ? "bg-surface-container-lowest"
                          : "bg-secondary"
                      }`}
                    ></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 2. FULLY RESTORED ACTIVE SELECTION BANNER */}
          <div className="mt-space-md p-space-md bg-surface-container-low rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-headline-sm">
                <span className="material-symbols-outlined text-[20px]">
                  calendar_today
                </span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm uppercase text-on-surface-variant block">
                  Active Selection
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface">
                  {dayNamesFull[selectedDate.getDay()]},{" "}
                  {monthNames[selectedDate.getMonth()]} {selectedDate.getDate()}
                  , {selectedDate.getFullYear()}
                </span>
              </div>
            </div>
            {(() => {
              const availableCount = [
                ...morningSlots,
                ...afternoonSlots,
              ].filter((slot) => slot.status === "available" && !isSlotDisabled(slot, selectedDate)).length;

              if (availableCount === 0) {
                return (
                  <div className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-semibold">
                    No Slots Available
                  </div>
                );
              }

              return (
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {availableCount} {availableCount === 1 ? "Slot" : "Slots"}{" "}
                  Available
                </div>
              );
            })()}
          </div>

          {/* 3. FULLY RESTORED WORKING RULES */}
          <div className="flex items-start gap-space-sm bg-surface-container-lowest p-space-sm rounded-lg text-on-surface-variant font-body-sm text-body-sm mt-2">
            <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0 mt-0.5">
              info
            </span>
            <span>
              Sessions are 30 minutes long. You can cancel your appointment
              anytime from your dashboard.
            </span>
          </div>
        </section>

        {/* Right Column: Time Slots & Summary */}
        <section className="lg:col-span-5 flex flex-col gap-space-lg">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg md:p-space-xl flex flex-col gap-space-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col">
                <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight">
                  Available Slots
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Select your preferred start time
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-space-sm text-on-surface-variant font-label-sm text-label-sm">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-surface-container-high"></span>
                  <span>Open</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-surface-dim"></span>
                  <span>Booked</span>
                </div>
              </div>
            </div>

            {/* Morning */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">
                    wb_sunny
                  </span>
                  Morning
                </span>
                <span>{morningSlots.length} slots</span>
              </div>
              <div className="grid grid-cols-3 gap-space-xs">
                {morningSlots.map((slot, index) => {
                  const isDisabled = isSlotDisabled(slot, selectedDate);
                  const isSelected = selectedSlot === slot.time;
                  return (
                    <button
                      key={`m-${index}`}
                      onClick={() => !isDisabled && setSelectedSlot(slot.time)}
                      disabled={isDisabled}
                      className={`h-11 rounded-xl font-numeric-slot text-numeric-slot flex items-center justify-center transition-all ${
                        isDisabled
                          ? "bg-surface-container text-outline-variant cursor-not-allowed line-through opacity-70"
                          : isSelected
                          ? "bg-primary-container text-on-primary shadow-md scale-[1.02] gap-1"
                          : "bg-surface-container-low hover:bg-surface-container-high text-on-surface hover:scale-[1.02] cursor-pointer"
                      }`}
                    >
                      {isSelected && !isDisabled && (
                        <span className="material-symbols-outlined text-[16px]">
                          check_circle
                        </span>
                      )}
                      <span>{slot.time}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Afternoon & Evening */}
            <div className="flex flex-col gap-space-xs pt-space-xs mt-2">
              <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">
                    wb_twilight
                  </span>
                  Afternoon & Evening
                </span>
                <span>{afternoonSlots.length} slots</span>
              </div>
              <div className="grid grid-cols-3 gap-space-xs">
                {afternoonSlots.map((slot, index) => {
                  const isDisabled = isSlotDisabled(slot, selectedDate);
                  const isSelected = selectedSlot === slot.time;
                  return (
                    <button
                      key={`a-${index}`}
                      onClick={() => !isDisabled && setSelectedSlot(slot.time)}
                      disabled={isDisabled}
                      className={`h-11 rounded-xl font-numeric-slot text-numeric-slot flex items-center justify-center transition-all ${
                        isDisabled
                          ? "bg-surface-container text-outline-variant cursor-not-allowed line-through opacity-70"
                          : isSelected
                          ? "bg-primary-container text-on-primary shadow-md scale-[1.02] gap-1"
                          : "bg-surface-container-low hover:bg-surface-container-high text-on-surface hover:scale-[1.02] cursor-pointer"
                      }`}
                    >
                      {isSelected && !isDisabled && (
                        <span className="material-symbols-outlined text-[16px]">
                          check_circle
                        </span>
                      )}
                      <span>{slot.time}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. FULLY RESTORED SUMMARY PANEL */}
          <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-lg md:p-space-xl flex flex-col gap-space-md relative overflow-hidden">
            <div className="flex items-center justify-between pb-space-xs">
              <span className="font-headline-sm text-headline-sm text-on-surface">
                Booking Summary
              </span>
            </div>

            <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-xs">
              <div className="flex items-center justify-between text-on-surface font-label-lg text-label-lg">
                <span className="font-semibold">
                  {dayNamesFull[selectedDate.getDay()].slice(0, 3)},{" "}
                  {monthNames[selectedDate.getMonth()].slice(0, 3)}{" "}
                  {selectedDate.getDate()} • {selectedSlot || "Select a time"}
                </span>
                <span className="text-primary font-headline-sm">₹1,500</span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                <span>Strategy Session (30 min)</span>
                <span>Single Seat</span>
              </div>
            </div>

            <div className="flex items-start gap-space-xs bg-secondary-container/40 p-space-sm rounded-xl">
              <span className="material-symbols-outlined text-secondary text-[20px] flex-shrink-0 mt-0.5">
                verified
              </span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-secondary-container font-semibold">
                  Instant Confirmation Guarantee
                </span>
                <span className="font-body-sm text-body-sm text-on-secondary-container">
                  Sarah accepts bookings directly. Google Meet invitation
                  dispatched immediately to your email.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-space-xs">
              <span className="font-body-md text-body-md text-on-surface-variant">
                Total Amount Due
              </span>
              <span className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                ₹1,500
              </span>
            </div>

            <button
              onClick={handleBookClick}
              disabled={isBooking || isConfirmed || !selectedSlot}
              className={`w-full h-12 rounded-full font-label-lg text-label-lg flex items-center justify-center gap-space-xs shadow-md transition-all active:scale-[0.98]  ${
                !selectedSlot
                  ? "bg-surface-container text-outline cursor-not-allowed"
                  : isConfirmed
                  ? "bg-secondary text-white shadow-lg "
                  : "bg-primary-container hover:bg-primary text-on-primary hover:shadow-lg cursor-pointer"
              }`}
            >
              {isBooking ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    sync
                  </span>
                  <span>Locking Slot...</span>
                </>
              ) : isConfirmed ? (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    check
                  </span>
                  <span>Confirmed!</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                  <span>Confirm & Reserve Appointment</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[14px]">
                lock
              </span>
              <span>256-bit encrypted executive scheduling</span>
            </div>
          </div>
        </section>
      </div>
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
};

export default BookingPage;
