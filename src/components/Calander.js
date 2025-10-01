// components/common/Calendar.js
import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);


function CustomCalendar({ events = [], onSelectSlot, onSelectEvent, date, onNevigate }) {

    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState(Views.MONTH);
    // const [date, setDate] = React.useState(new Date());


    const handleNavigate = (newDate, view) => {
        if (view === "month") {
            setCurrentDate(newDate);
            onNevigate(null, newDate)
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
            defaultView={Views.MONTH}
            date={currentDate}
            // date={new Date(date)}         // ✅ controlled date state
            onNavigate={handleNavigate} // ✅ handles next/prev/today
            popup
            eventPropGetter={(event) => {
                let backgroundColor = "";
                let borderColor = "";
                let textColor = "white";

                switch (event.type) {
                    case "leave":
                        backgroundColor = "#9E9E9E"; // gray
                        borderColor = "#757575";
                        break;
                    case "booked":
                        switch (event.status) {
                            case "PENDING":
                                backgroundColor = "#FF9800"; // orange
                                borderColor = "#F57C00";
                                break;
                            case "CONFIRMED":
                                backgroundColor = "#4CAF50"; // green
                                borderColor = "#388E3C";
                                break;
                            case "COMPLETED":
                                backgroundColor = "#2196F3"; // blue
                                borderColor = "#1976D2";
                                break;
                            case "CANCELLED":
                                backgroundColor = "#F44336"; // red
                                borderColor = "#D32F2F";
                                break;
                            default:
                                backgroundColor = "#607D8B"; // fallback grey-blue
                        }
                        break;
                    default:
                        backgroundColor = "#607D8B"; // fallback
                }

                return {
                    style: {
                        backgroundColor,
                        borderColor,
                        color: textColor,
                        borderRadius: "6px",
                        padding: "2px 6px",
                    },
                };
            }}

            dayPropGetter={(date) => {
                const isPast = date < new Date().setHours(0, 0, 0, 0);
                if (isPast) {
                    return {
                        style: {
                            backgroundColor: "#f5f5f5",
                            color: "#9e9e9e",
                            pointerEvents: "none",
                        },
                    };
                }
                return {};
            }}
        />
    );
}

export default CustomCalendar;
