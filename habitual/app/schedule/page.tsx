"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { IoMdArrowRoundBack } from "react-icons/io";
import { DateSelectArg } from '@fullcalendar/core';

import Link from "next/link";
import { createEventId } from "@/lib/event-utils";
import { useState } from "react";

export default function Calendar() {

  // const [currentEvents, setCurrentEvents] = useState([])
  const [hover,setHover] = useState(false)

      const handleDateSelect = (selectInfo: DateSelectArg) => {
      const title = prompt('Please enter a new title for your event');
      const calendarApi = selectInfo.view.calendar;

      calendarApi.unselect(); // clear date selection

      if (title) {
        calendarApi.addEvent({
          id: createEventId(),
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay,
        });
      }
    }

  return (
    <main className="flex justify-center items-center h-screen relative">
      <Link href="/" className="absolute top-6 left-6">
        <IoMdArrowRoundBack size={40} color={hover ? 'gray' : 'black'} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} />
      </Link>
      <div className="w-full" style={{ padding: 12 }}>
        <FullCalendar
          height={'66vh'}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{right: 'dayGridMonth,timeGridWeek,timeGridDay'}}
          footerToolbar={{
            left: '',
            right: 'today prevYear,prev,next,nextYear'
          }}
          selectable={true}
          editable
          nowIndicator
          dayMaxEventRows={3}
          select={handleDateSelect}
          // eventsSet={handleEvent}
          initialView="dayGridMonth"
        />
      </div>
    </main>
  );
}
