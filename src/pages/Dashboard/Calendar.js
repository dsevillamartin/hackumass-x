import React, { useEffect } from 'react'
import { Account, Query } from 'appwrite'
import Kalend, { CalendarView } from 'kalend' // import component
import 'kalend/dist/styles/index.css' // import styles
import client, { databases } from '../../api'
import { redirect, useLocation, useNavigate } from 'react-router-dom'
import CreateEvent from './CreateEvent'
import { COLLECTION_ID, DATABASE_ID } from '../../api/database'
import './calendar.scss'
import EventView from './EventView'

export default function Calendar({ accountData }) {
  const [loadError, setLoadError] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [events, setEvents] = React.useState([]);
  const [eventsData, setEventsData] = React.useState([]);
  const [showingCreate, setShowingCreate] = React.useState(false);

  const [showingEvent, setShowingEvent] = React.useState(null);
  const [isShowingEvent, setIsShowingEvent] = React.useState(false);

  const navigate = useNavigate()

  useEffect(() => {
    setIsLoading(true)

    if (!accountData) {
      navigate('/auth/login')
    }

    databases
      .listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('user_id', accountData.$id),
      ])
      .then((list) => {
        setEventsData(list.documents);
        setEvents(list.documents.map(doc => ({
          id: doc.$id,
          startAt: doc.start_time,
          endAt: doc.end_time,
          summary: doc.name,
          color: doc.color,
        })));
      })
      .catch((e) => {
        console.error(e)
        setLoadError(e.message)
        setIsLoading(false)
      })
  }, [])

  const showCreate = () => {
    setShowingCreate(true);
  }

  const onEventClick = ({ id }) => {
    const event = eventsData.find(e => e.$id === id);

    setIsShowingEvent(true);
    setShowingEvent(event);
  }
  

  return (
    <div id="calendar-container">
      <button className="button is-primary" onClick={showCreate}>
        Create
      </button>
      {showingCreate && <CreateEvent accountData={accountData} setShowing={setShowingCreate} />}
      {isShowingEvent && <EventView setShowing={setShowingEvent} event={showingEvent} />}
      <Kalend
        onEventClick={onEventClick}
        // onNewEventClick={onNewEventClick}
        events={events}
        initialDate={new Date().toISOString()}
        hourHeight={60}
        initialView={CalendarView.WEEK}
        disabledViews={[CalendarView.DAY]}
        // onSelectView={onSelectView}
        // selectedView={selectedView}
        // onPageChange={onPageChange}
        timeFormat={'24'}
        weekDayStart={'Monday'}
        calendarIDsHidden={['work']}
        language={'en'}
      />
    </div>
  )
}
