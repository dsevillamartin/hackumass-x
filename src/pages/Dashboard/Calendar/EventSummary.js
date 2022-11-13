// Copyright (c) 2021 nibdo
// The original code is licensed under MIT (https://github.com/nibdo/kalend/blob/6a43851f4b50627b44820318e22d3974d9d9b272/LICENSE)
import { CALENDAR_EVENT_TYPE } from 'kalend/common/interface'
import { EVENT_TYPE } from 'kalend/common/enums'
import { parseCssDark } from 'kalend/utils/common'
import { parseEventString } from './parseEventString'

const parseFontSize = (height) => {
  if (height < 10) {
    return 7
  } else if (height < 15) {
    return 9
  } else if (height < 20) {
    return 11
  } else {
    return 13
  }
}

const EventSummary = (props) => {
  const {
    isDark,
    summary,
    type,
    viewType,
    isDarkColor,
    event,
    height,
    priority,
  } = props

  const eventType = type || CALENDAR_EVENT_TYPE.EVENT

  const style = {
    color: event.style?.color ? event.style.color : 'inherit',
  }

  if (height) {
    style.fontSize = parseFontSize(height)

    // adjust for smaller event container
    if (height <= 20) {
      style.paddingTop = 0
      style.lineHeight = 'normal'
      style.height = '100%'
      style.padding = '0px 0px 6px 4px !important'
    }
  }

  return parseEventString(
    summary,
    ` Kalend__text ${parseCssDark(
      'Kalend__Event__summary',
      isDark
    )} ${parseCssDark(`Kalend__Event__summary__type-${viewType}`, isDark)} ${
      isDarkColor ? 'Kalend__text-light' : 'Kalend__text-dark'
    }`,
    style,
    eventType,
    isDarkColor || false,
    event.isTaskChecked,
    priority
  )
}

export default EventSummary
