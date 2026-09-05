export const DEFAULT_SLOTS = [
  { time: "09:30 AM", status: "available" },
  { time: "10:15 AM", status: "available" },
  { time: "11:00 AM", status: "available" },
  { time: "02:00 PM", status: "available" },
  { time: "02:45 PM", status: "available" },
  { time: "03:30 PM", status: "available" },
];

export const formatDateForAPI = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const splitSlotsByPeriod = (slots = []) => ({
  morningSlots: slots.filter((slot) => slot.time.includes("AM")),
  afternoonSlots: slots.filter((slot) => slot.time.includes("PM")),
});

export const toSlotDateTime = (dateObj, slotTime) => {
  const [time, modifier] = slotTime.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const slotDateTime = new Date(dateObj);
  slotDateTime.setHours(hours, minutes, 0, 0);

  return slotDateTime;
};

export const isSlotDisabled = (slot, dateObj, today, now = new Date()) => {
  if (slot.status === "booked" || slot.status === "expired") return true;
  if (dateObj < today) return true;

  if (dateObj.getTime() === today.getTime()) {
    return toSlotDateTime(dateObj, slot.time) <= now;
  }

  return false;
};

export const getAppointmentId = (appointment) => appointment?._id ?? appointment?.id;
