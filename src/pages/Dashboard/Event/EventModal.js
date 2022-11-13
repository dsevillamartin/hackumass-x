import React, { useEffect } from 'react'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import Modal from './Modal'
import Color from 'color'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { deleteEvent, updateEventData } from '../../../api/database'

dayjs.extend(LocalizedFormat)

export default function EventModal({
  event,
  removeEvent,
  updateEvent,
  openEditModal,
  open,
  close,
  ...props
}) {
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [isTaskComplete, setIsTaskComplete] = React.useState(false)
  const [isToggleLoading, setIsToggleLoading] = React.useState(false)
  const taskRef = React.useRef()

  const startAt = dayjs(event?.start_time)
  const endAt = dayjs(event?.end_time)

  useEffect(() => {
    setIsTaskComplete(event?.is_complete)
    if (taskRef.current) {
      taskRef.current.checked = event?.is_complete
    }
  }, [event?.is_complete, event?.$id, event?.$updatedAt])

  const del = async () => {
    if (!confirm('Are you sure you want to delete this event?')) return

    setIsDeleting(true)

    try {
      await deleteEvent(event.$id)

      removeEvent(event.$id)
      setIsDeleting(false)
      close()
    } catch (e) {
      console.error(e)
      setIsDeleting(false)
    }
  }

  const edit = () => openEditModal(event.$id)
  const toggleTask = async () => {
    setIsToggleLoading(true)

    const evt = await updateEventData(event.$id, {
      is_complete: !isTaskComplete,
    })

    await updateEvent(evt)

    setIsTaskComplete(evt.is_complete)
    setIsToggleLoading(false)
  }

  const isTask = event?.is_task

  return (
    <Modal open={open} close={close} id="event-modal" {...props} useCard>
      <div
        className="modal-card-head"
        style={{ backgroundColor: event?.color }}
      >
        <div className="modal-card-title">
          {isTask ? (
            <>
              <label class="b-checkbox checkbox is-medium">
                <input
                  type="checkbox"
                  ref={taskRef}
                  onChange={toggleTask}
                  {...(isToggleLoading ? { disabled: true } : {})}
                />
                <span class="check"></span>
                <strong
                  class="control-label"
                  style={{ color: Color(event?.color).negate() }}
                >
                  {event?.name}
                </strong>
              </label>
              &nbsp;&nbsp;
            </>
          ) : (
            <span style={{ color: Color(event?.color).negate() }}>
              {event?.name}
            </span>
          )}
          {event?.priority === 1 ? (
            <span className="has-text-danger ml-5 is-size-5">!!!</span>
          ) : event?.priority === 2 ? (
            <span className="has-text-warning ml-5 is-size-5">!!</span>
          ) : (
            <span className="has-text-success ml-5 is-size-5">!</span>
          )}
        </div>
        <div className="field has-addons">
          <div className="control">
            <button
              className="button is-small is-rounded is-light is-outlined"
              onClick={edit}
            >
              <FontAwesomeIcon icon={solid('pencil')} />
            </button>
          </div>
          <div className="control">
            <button
              className={`button is-small is-rounded is-danger is-outlined ${
                isDeleting && 'is-loading'
              }`}
              onClick={del}
            >
              <FontAwesomeIcon icon={solid('trash')} />
            </button>
          </div>
        </div>
      </div>
      <div className="modal-card-body">
        <div className="content">
          <div className="columns is-multiline">
            <div className="column is-one-fifth has-text-white has-text-right">
              <FontAwesomeIcon icon={solid('clock')} />
            </div>
            <div className="column is-four-fifths">
              {isTask ? (
                <>
                  <div className="columns">
                    <div className="column is-one-third has-text-weight-semibold	">
                      Complete By
                    </div>
                    <div className="column">
                      <time dateTime={event?.start_time}>
                        {startAt.format('LLL')}
                      </time>
                    </div>
                  </div>
                  <div className="columns">
                    <div className="column is-one-third has-text-weight-semibold	">
                      Due Date
                    </div>
                    <div className="column">
                      <time dateTime={event?.end_time}>
                        {endAt.format('LLL')}
                      </time>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <time dateTime={event?.start_time}>
                    {startAt.format('LLL')}
                  </time>
                  {' - '}
                  <time dateTime={event?.end_time}>
                    {endAt.format(startAt.isSame(endAt, 'day') ? 'LT' : 'LLL')}
                  </time>
                </>
              )}
            </div>

            <div className="column is-one-fifth has-text-white has-text-right">
              <FontAwesomeIcon icon={solid('location-dot')} />
            </div>
            <div className="column is-four-fifths">
              {event?.location || '-'}
            </div>

            {/* <div className="column is-one-fifth has-text-white has-text-right">
              <strong>Priority</strong>
            </div>
            <div className="column is-four-fifths">
              {event?.priority == 1
                ? 'High'
                : event?.priority == 2
                ? 'Medium'
                : event?.priority == 3
                ? 'Low'
                : 'None'}
            </div> */}

            <div className="column is-one-fifth has-text-white has-text-right">
              <FontAwesomeIcon icon={solid('comment-alt')} />
            </div>
            <div className="column is-four-fifths">{event?.notes || '-'}</div>
          </div>

          {process.env.NODE_ENV !== 'production' && (
            <details>
              <pre>
                <code>{JSON.stringify(event, null, 4)}</code>
              </pre>
            </details>
          )}
        </div>
      </div>
    </Modal>
  )
}
