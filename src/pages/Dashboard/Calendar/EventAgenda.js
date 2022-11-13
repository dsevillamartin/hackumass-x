// Copyright (c) 2021 nibdo
// The original code is licensed under MIT (https://github.com/nibdo/kalend/blob/6a43851f4b50627b44820318e22d3974d9d9b272/LICENSE)

import React from 'react'
import { CalendarEvent } from 'kalend/common/interface'
import { Context, Store } from 'kalend/context/store'
import { EVENT_TYPE } from 'kalend/common/enums'
import { useContext } from 'react'
import EventSummary from './EventSummary'
import EventTime from './EventTime'

const EventAgenda = (props) => {
  const { isDark, event, type, priority } = props
  const [store] = useContext(Context)
  const { isMobile } = store

  const summary = (
    <>
      {event.summary}
      {priority === 1 ? (
        <span className="has-text-danger ml-5 is-size-5" disabled>
          !!!
        </span>
      ) : priority === 2 ? (
        <span className="has-text-warning ml-5 is-size-5" disabled>
          !!
        </span>
      ) : (
        <span className="has-text-success ml-5 is-size-5" disabled>
          !
        </span>
      )}
    </>
  )

  return !isMobile ? (
    <div className={'Kalend__EventAgenda__container'}>
      <EventTime
        isDark={isDark}
        event={event}
        type={type}
        isDarkColor={isDark}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: event.color,
            marginLeft: 8,
            marginRight: 8,
            filter: isDark ? 'saturate(60%) brightness(120%)' : 'none',
          }}
        />
      </div>
      <EventSummary
        summary={event.summary}
        isDark={isDark}
        viewType={type}
        type={event.type}
        isDarkColor={isDark}
        event={event}
        priority={priority}
      />
    </div>
  ) : (
    <div className={'Kalend__EventAgenda__container'}>
      <div
        style={{
          width: 8,
          height: 55,
          borderRadius: 4,
          background: event.color,
          filter: isDark ? 'saturate(60%) brightness(120%)' : 'none',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <EventSummary
          summary={summary}
          isDark={isDark}
          viewType={type}
          type={event.type}
          isDarkColor={isDark}
          event={event}
          priority={priority}
        />
        <EventTime
          isDark={isDark}
          event={event}
          type={type}
          isDarkColor={isDark}
        />
      </div>
    </div>
  )
}

export default EventAgenda
