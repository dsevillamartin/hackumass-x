import React from 'react'
import EventContainer from './Event/EventModal'

export default function EventView({ event, close }) {
  return (
    <EventContainer>
      <h1>hi</h1>
      {event?.title}
    </EventContainer>
  )
}
