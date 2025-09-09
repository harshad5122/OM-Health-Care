// components/common/Calendar.js
import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);


function CustomCalendar({ events = [], onSelectSlot, onSelectEvent }) {

    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState(Views.MONTH);

    const handleNavigate = (newDate, view) => {
        if (view === "month") {
            console.log(">>LOO")
            setCurrentDate(newDate);
        }
    };
    const handleViewChange = (newView) => {
        setCurrentView(newView);
        console.log("Switched to view:", newView);
    };
    return (
        <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            style={{ height: 500 }}
            onSelectSlot={onSelectSlot}
            onSelectEvent={onSelectEvent}
            views={{ month: true, week: true, day: true }}
            view={currentView}
            onView={handleViewChange}
            defaultView={Views.MONTH}   // ✅ required for view switching
            date={currentDate}          // ✅ controlled date state
            onNavigate={handleNavigate} // ✅ handles next/prev/today
            popup
        />
    );
}

export default CustomCalendar;
