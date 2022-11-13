// Copyright (c) 2021 nibdo
// The original code is licensed under MIT (https://github.com/nibdo/kalend/blob/6a43851f4b50627b44820318e22d3974d9d9b272/LICENSE)

import { CALENDAR_EVENT_TYPE } from 'kalend/common/interface'
import { EvaIcons } from 'kalend/components/eva-icons'
import { parseCssDark } from 'kalend/utils/common'
import React from 'react'

export const parseEventString = (
  value,
  className,
  style,
  type,
  isDark,
  isTaskChecked,
  priority
) => {
  let newValueString = value

  if (newValueString.indexOf('\\n') !== -1) {
    newValueString = newValueString.replace(/\\n/g, ' ')
  }

  if (newValueString.indexOf('\\;') !== -1) {
    newValueString = newValueString.replace(/\\;/g, ';')
  }
  if (newValueString.indexOf('\\,') !== -1) {
    newValueString = newValueString.replace(/\\,/g, ',')
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
      }}
    >
      {type === CALENDAR_EVENT_TYPE.TASK ? (
        !isTaskChecked ? (
          <EvaIcons.RadioOff
            className={parseCssDark('Kalend__icon-task', isDark)}
          />
        ) : (
          <EvaIcons.RadioOn
            className={parseCssDark('Kalend__icon-task', isDark)}
          />
        )
      ) : null}
      <p className={className} style={style}>
        {newValueString}

        {priority === 1 ? (
          <span className="has-text-danger ml-5 is-size-6">!!!</span>
        ) : priority === 2 ? (
          <span className="has-text-warning ml-5 is-size-6">!!</span>
        ) : (
          <span className="has-text-success ml-5 is-size-6">!</span>
        )}
      </p>
    </div>
  )
}
