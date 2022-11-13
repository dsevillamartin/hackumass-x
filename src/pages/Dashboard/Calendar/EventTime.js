import React, { useContext } from 'react'

import { CalendarEvent, Config } from 'kalend/common/interface'
import { Context, Store } from 'kalend/context/store'
import { DateTime } from 'luxon'
import { EVENT_TYPE, TIME_FORMAT } from 'kalend/common/enums'
import { parseCssDark } from 'kalend/utils/common'
import { parseToDateTime } from 'kalend/utils/dateTimeParser'

const TIME_FORMAT_PATTERN = 'HH:mm'
const TIME_H_12_FORMAT_PATTERN = 'hh:mm a'

const parseTimeFormat = (day, timeFormat) => {
  if (timeFormat === TIME_FORMAT.H_24) {
    return day.toFormat(TIME_FORMAT_PATTERN)
  } else {
    return day.toFormat(TIME_H_12_FORMAT_PATTERN)
  }
}

const formatEventTimeV2 = (event, timeFormat, timezone, endAtState, day) => {
  const { startAt, endAt } = event

  const startAtDateTime = parseToDateTime(startAt, timezone, timezone)
  const endAtDateTime = parseToDateTime(endAtState || endAt, timezone, timezone)

  return {
    start: parseTimeFormat(startAtDateTime, timeFormat),
    end: parseTimeFormat(endAtDateTime, timeFormat),
  }
}

const normalTime = (
  timeFormat,
  event,
  timezone,
  type,
  isDark,
  endAt,
  isDarkColor,
  day
) => {
  const timeV2 = formatEventTimeV2(event, timeFormat, timezone, endAt, day)

  const style = {
    color: event.style?.color ? event.style.color : 'inherit',
  }

  return timeFormat === TIME_FORMAT.H_12 ? (
    <p
      className={`Kalend__text ${parseCssDark(
        `Kalend__Event__time__type-${type}`,
        isDark
      )} Kalend__Event__time ${
        isDarkColor ? 'Kalend__text-light' : 'Kalend__text-dark'
      }`}
      style={style}
    >
      {timeV2.start}
      <br />
      {timeV2.end}
    </p>
  ) : (
    <p
      className={`Kalend__text ${parseCssDark(
        `Kalend__Event__time__type-${type}`,
        isDark
      )} Kalend__Event__time ${
        isDarkColor ? 'Kalend__text-light' : 'Kalend__text-dark'
      }`}
      style={style}
    >
      {timeV2.start} - {timeV2.end}
    </p>
  )
}

const EventTime = (props) => {
  const { isDark, event, type, endAt, isDarkColor } = props

  const [store] = useContext(Context)
  const { config, isMobile } = store
  const { timezone, timeFormat } = config

  console.log(props)

  const style = {
    color: event.style?.color ? event.style.color : 'inherit',
  }

  return type === EVENT_TYPE.AGENDA && event.allDay ? (
    <>
      <p
        className={`Kalend__text ${parseCssDark(
          `Kalend__Event__time__type-${type}`,
          isDark
        )} Kalend__Event__time ${
          isDarkColor ? 'Kalend__text-light' : 'Kalend__text-dark'
        }`}
        style={style}
      >
        All day
      </p>
      {!isMobile ? (
        <p
          style={{
            color: 'transparent',
            padding: 0,
            margin: 0,
            fontSize: '0.8em',
          }}
        >
          123 12
        </p>
      ) : null}
    </>
  ) : (
    normalTime(
      timeFormat,
      event,
      timezone,
      type,
      isDark,
      endAt,
      isDarkColor,
      null
    )
  )
}

export default EventTime
