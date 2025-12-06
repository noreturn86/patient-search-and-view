import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function Schedule() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null); // null = calendar view
  const [activeSlots, setActiveSlots] = useState([]);

  const provider = useSelector((state) => state.auth.provider);
  const token = useSelector((state) => state.auth.token);
  const { allPatients, loading, error } = useSelector((state) => state.patients);

  const monthName = new Date(currentYear, currentMonth).toLocaleString("default", {
    month: "long",
  });


  useEffect(() => {
    if (!provider) return;
    loadProviderSlots(provider.id, token);

  }, [provider]);


  async function loadProviderSlots(providerId, token) {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/slots/provider`,
        {
          params: { providerId },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const formattedSlots = res.data.map((slot) => ({
        date: new Date(slot.datetime),
        patientId: slot.patientId,
      }));
      console.log("formatted slots: ", formattedSlots);
      setActiveSlots(formattedSlots);
    } catch (err) {
      console.error("Error fetching slots:", err);
    }
  }

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



  //generate appointment slots
  const getAppointmentSlots = () => {
    const slots = [];

    //build first slot
    const startingSlot = new Date(selectedDate);
    startingSlot.setHours(0, 0, 0, 0);

    for (let i = 0; i < 96; i++) {
      //clone and add the offset
      const slot = new Date(startingSlot);
      slot.setMinutes(slot.getMinutes() + (15 * i));
      slots.push(slot);
    }
    console.log("calendar slots: ", slots);
    return slots; //array of Date objects
  };


  const onDayClick = (dateObj) => {
    setSelectedDate(dateObj);
  };

  const calendar = buildCalendar(currentMonth, currentYear);
  const appointmentSlots = selectedDate ? getAppointmentSlots() : []; //array of date objects




  const toggleSlot = async (providerId, datetime, token) => {

    //check is slot is active (available or booked)
    const matchingSlot = activeSlots.find(s => s.date.getTime() === datetime.getTime());

    if (matchingSlot && matchingSlot.patientId) {
      try {

      } catch (error) {
        console.error(
          "Error adding slot:",
          error.response?.status,
          error.response?.data || error.message
        );
      }
    }

    try {
      const isoDatetime = new Date(datetime).toISOString();

      const response = await axios({
        method: "post",
        url: "http://localhost:8080/api/slots/add",
        params: { providerId, datetime: isoDatetime },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Slot added:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error adding slot:",
        error.response?.status,
        error.response?.data || error.message
      );
    }
  };

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
                  ${cell.inMonth
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
        {/* cancel/return to calendar button */}
        <button
          onClick={() => setSelectedDate(null)}
          className="flex items-center gap-2 px-3 py-2 bg-white shadow rounded hover:bg-gray-100 transition"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Calendar
        </button>
        {/* display selectedDate */}
        <h2 className="text-xl font-semibold text-gray-700 ml-4">
          {selectedDate.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })} (Local time)
        </h2>
      </div>

      {/* display appointment slots */}
      <div className="grid grid-cols-4 gap-3 w-3/4">

        {appointmentSlots.map((slot, i) => {
          const slotStatus = activeSlots.find(
            (activeSlot) => activeSlot.date.getTime() === slot.getTime()
          );

          let bgColor = "bg-white";
          let label = `${slot.getHours()}:${slot.getMinutes().toString().padStart(2, "0")}`;

          if (slotStatus) {
            if (slotStatus.patientId) {
              bgColor = "bg-red-500";
              const patient = allPatients.find(p => p.id === slotStatus.patientId);
              label = patient ? `${patient.firstName} ${patient.lastName}` : "Loading...";
            } else {
              bgColor = "bg-green-500";
            }
          }

          return (
            <div
              key={i}
              className={`${bgColor} text-gray-800 rounded-lg shadow flex items-center justify-center py-2 cursor-pointer hover:bg-blue-100 transition`}
              onClick={() => { toggleSlot(provider.id, slot, token) }}
            >
              {label}
            </div>
          );
        })}

      </div>

    </div>
  );
}