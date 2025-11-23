import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function Schedule() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null); // null = calendar view

  const monthName = new Date(currentYear, currentMonth).toLocaleString("default", {
    month: "long",
  });

  const prevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const buildCalendar = (month, year) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingWeekday = firstDay.getDay();

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevDays = [...Array(startingWeekday)].map((_, i) => ({
      day: prevMonthLastDay - startingWeekday + i + 1,
      inMonth: false,
      date: new Date(year, month - 1, prevMonthLastDay - startingWeekday + i + 1),
    }));

    const currentDays = [...Array(daysInMonth)].map((_, i) => ({
      day: i + 1,
      inMonth: true,
      date: new Date(year, month, i + 1),
    }));

    const totalCells = 42; // always 6 weeks
    const nextDaysCount = totalCells - (prevDays.length + currentDays.length);
    const nextDays = [...Array(nextDaysCount)].map((_, i) => ({
      day: i + 1,
      inMonth: false,
      date: new Date(year, month + 1, i + 1),
    }));

    return [...prevDays, ...currentDays, ...nextDays];
  };

  const isToday = (dateObj) => {
    return (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    );
  };

  // Generate appointment slots from 7:00 to 19:00 in 15-min intervals
  const getAppointmentSlots = () => {
    const slots = [];
    for (let hour = 7; hour < 19; hour++) {
      for (let min = 0; min < 60; min += 15) {
        const hh = hour.toString().padStart(2, "0");
        const mm = min.toString().padStart(2, "0");
        slots.push(`${selectedDate} ${hh}:${mm}`);
      }
    }
    return slots;
  };

  const onDayClick = (dateObj) => {
    setSelectedDate(dateObj);
  };

  const calendar = buildCalendar(currentMonth, currentYear);
  const appointmentSlots = selectedDate ? getAppointmentSlots() : [];

  // Calendar View
  if (!selectedDate) {
    return (
      <div className="w-full flex flex-col items-center p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Schedule</h1>

        {/* Month Header */}
        <div className="w-1/2 flex items-center justify-between mb-6 bg-white p-3 rounded-lg shadow-md">
          <FontAwesomeIcon
            icon={faChevronLeft}
            className="cursor-pointer text-gray-600 hover:text-blue-600 transition-colors"
            onClick={prevMonth}
          />
          <h2 className="text-xl font-semibold text-gray-700">
            {monthName} {currentYear}
          </h2>
          <FontAwesomeIcon
            icon={faChevronRight}
            className="cursor-pointer text-gray-600 hover:text-blue-600 transition-colors"
            onClick={nextMonth}
          />
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 w-3/4">
          {/* Weekday headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div
              key={d}
              className="text-center font-semibold text-gray-600 py-2 bg-gray-100 rounded-lg"
            >
              {d}
            </div>
          ))}

          {/* Days */}
          {calendar.map((cell, i) => {
            const todayHighlight = isToday(cell.date);
            return (
              <div
                key={i}
                onClick={() => onDayClick(cell.date)}
                className={`
                  flex items-center justify-center aspect-square rounded-lg border cursor-pointer
                  ${
                    cell.inMonth
                      ? "bg-white hover:bg-blue-100 transition-colors shadow-sm"
                      : "bg-gray-100 text-gray-400"
                  }
                  ${todayHighlight ? "bg-blue-200 border-blue-500 font-semibold" : ""}
                `}
              >
                {cell.day}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Appointment View
  return (
    <div className="w-full flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      <div className="w-3/4 flex items-center mb-4">
        <button
          onClick={() => setSelectedDate(null)}
          className="flex items-center gap-2 px-3 py-2 bg-white shadow rounded hover:bg-gray-100 transition"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Calendar
        </button>
        <h2 className="text-xl font-semibold text-gray-700 ml-4">
          {selectedDate.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </h2>
      </div>

      <div className="grid grid-cols-4 gap-3 w-3/4">
        {appointmentSlots.map((slot, i) => (
          <div
            key={i}
            className="bg-white text-gray-800 rounded-lg shadow flex items-center justify-center py-2 cursor-pointer hover:bg-blue-100 transition"
          >
            {slot}
          </div>
        ))}
      </div>
    </div>
  );
}
