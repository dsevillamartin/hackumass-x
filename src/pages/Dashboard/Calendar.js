import React, { useEffect } from 'react'
import { Account, Query } from 'appwrite'
import Kalend, { CalendarView } from 'kalend' // import component
import 'kalend/dist/styles/index.css' // import styles
import client, { databases } from '../../api'
import { redirect, useLocation, useNavigate } from 'react-router-dom'
import { COLLECTION_ID, DATABASE_ID } from '../../api/database'
import './calendar.scss'
import EventModal from './Event/EventModal'
import CreateEventModal from './Event/CreateEventModal'
import EditEventModal from './Event/EditEventModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import dayjs from 'dayjs'
import EventAgenda from './Calendar/EventAgenda'
import { EVENT_TYPE } from 'kalend/layout'

export default function Calendar({ accountData }) {
  const [loadError, setLoadError] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [events, setEvents] = React.useState([])
  const eventsDataRef = React.useRef()

  const [showingEvent, setShowingEvent] = React.useState(null)
  const [isShowingEvent, setIsShowingEvent] = React.useState(false)
  const [showingCreate, setShowingCreate] = React.useState(false)
  const [showingCreateTask, setShowingCreateTask] = React.useState(false)
  const [showingEdit, setShowingEdit] = React.useState(false)
  const [isShowingEdit, setIsShowingEdit] = React.useState(false)
  const [showingCreateStart, setShowingCreateStart] = React.useState(null)

  const navigate = useNavigate()

  const refreshEvents = () =>
    setEvents(
      eventsDataRef.current
        .map(({ is_task, ...doc }) => {
          const evt = {
            id: doc.$id,
            startAt: doc.start_time,
            endAt: is_task
              ? dayjs.utc(doc.start_time).add(30, 'minutes').toISOString()
              : doc.end_time,
            summary: doc.name,
            color: doc.color,
            type: is_task ? 'TASK' : 'EVENT',
            isTaskChecked: doc.is_complete,
          }

          return {
            ...evt,
            children: {
              agendaView: (
                <EventAgenda
                  event={evt}
                  priority={doc.priority}
                  isDark={true}
                  type="agenda"
                />
              ),
            },
          }
        })
        .sort((a, b) => (dayjs(a.startAt).isAfter(dayjs(b.startAt)) ? 1 : -1))
    )

  const addEvent = (evt) => {
    eventsDataRef.current.push(evt)
    refreshEvents()
  }

  const updateEvent = (evt) => {
    const index = eventsDataRef.current.findIndex((e) => e.$id === evt.$id)
    eventsDataRef.current[index] = evt
    refreshEvents()
  }

  useEffect(() => {
    setIsLoading(true)

    if (!accountData) {
      navigate('/auth/login')
    }

    databases
      .listDocuments(DATABASE_ID, COLLECTION_ID)
      .then((list) => {
        eventsDataRef.current = list.documents

        refreshEvents()

        setIsLoading(false)
      })
      .catch((e) => {
        console.error(e)
        setLoadError(e.message)
        setIsLoading(false)
      })
  }, [])

  const removeEvent = (id) => {
    eventsDataRef.current = eventsDataRef.current.filter(
      (doc) => doc.$id !== id
    )

    refreshEvents()
  }

  const showCreate = () => {
    setShowingCreateTask(false)
    setShowingCreate(true)
  }

  const onNewEventClick = (date) => {
    setShowingCreateStart({
      start_time: dayjs.utc(date.startAt).local(),
      end_time: dayjs.utc(date.endAt).local(),
    })
    showCreate()
  }

  const showCreateTask = () => {
    setShowingCreateTask(true)
    setShowingCreate(true)
  }

  const onEventClick = ({ id }) => {
    const event = eventsDataRef.current.find((e) => e.$id === id)

    setIsShowingEvent(true)
    setShowingEvent(event)
  }
  const closeEventModal = () => setIsShowingEvent(false)
  const openEditModal = (id) => {
    setIsShowingEvent(false)
    setShowingEdit(eventsDataRef.current.find((e) => e.$id === id))
    setIsShowingEdit(true)
  }

  if (isLoading) {
    return
  }

  return (
    <>
      <div className="dropdown is-hoverable is-up is-right" id="create-button">
        <div className="dropdown-trigger">
          <button
            className="button"
            aria-haspopup="true"
            aria-controls="dropdown-menu4"
          >
            <span className="icon is-small">
              <FontAwesomeIcon icon={solid('plus')} />
            </span>
          </button>
        </div>
        <div className="dropdown-menu" id="dropdown-menu4" role="menu">
          <div className="dropdown-content">
            <a href="#" className="dropdown-item" onClick={showCreate}>
              Event
            </a>
            <a href="#" className="dropdown-item" onClick={showCreateTask}>
              Task
            </a>
          </div>
        </div>
      </div>
      <CreateEventModal
        accountData={accountData}
        setShowing={setShowingCreate}
        showing={showingCreate}
        start={showingCreateStart}
        addEvent={addEvent}
        isTask={showingCreateTask}
      />
      <EditEventModal
        setShowing={setIsShowingEdit}
        showing={isShowingEdit}
        event={showingEdit}
        updateEvent={updateEvent}
      />
      <EventModal
        open={isShowingEvent}
        close={closeEventModal}
        event={showingEvent}
        removeEvent={removeEvent}
        updateEvent={updateEvent}
        openEditModal={openEditModal}
      />
      <Kalend
        onEventClick={onEventClick}
        // onNewEventClick={onNewEventClick}
        events={events}
        initialDate={new Date().toISOString()}
        hourHeight={60}
        initialView={CalendarView.WEEK}
        timeFormat={'12'}
        language={'en'}
        disabledDragging={true}
        showTimeLine={true}
        // weekDayStart="Sunday"
        focusHour={new Date().getHours()}
        onNewEventClick={onNewEventClick}
        showWeekNumbers={true}
        isDark
      />
    </>
  )
}
