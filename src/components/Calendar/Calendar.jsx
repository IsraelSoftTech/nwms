import React, { useState } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styles
import './Calendar.css'; // Import custom styles

const Calendar = ({ onClose }) => {
  const [date, setDate] = useState(null);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };


  return (
    <div className="calendar-overlay" onClick={onClose}>
      <div className="calendar-container" onClick={(e) => e.stopPropagation()}>
        <div className="calendar-header">
      
        </div>
        <ReactCalendar
          onChange={handleDateChange}
          value={date}
          locale="en-US" // Locale set to US
        />
      </div>
    </div>
  );
};

export default Calendar;
