import { ID, Permission, Role } from 'appwrite'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import React, { useRef } from 'react'
import Modal from './Modal'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

dayjs.extend(utc)

export default function CreateEvent({
  accountData,
  showing,
  isEditing,
  setShowing,
  event,
  start,
  request,
  isTask,
}) {
  // Event is defined if we are editing an event instead of creating a new one
  const now = dayjs()

  const defTitle = event?.name
  const defStartDateTime =
    start?.start_time || (event ? dayjs.utc(event?.start_time).local() : now)
  const defEndDateTime =
    start?.end_time ||
    (event ? dayjs.utc(event?.end_time).local() : now.add(60, 'minutes'))
  const defLocation = event?.location
  const defNotes = event?.notes
  const defColor = event?.color || '#ffffff'
  const defPriority = event?.priority || 2

  const title = useRef()
  const startDateTime = useRef()
  const endDateTime = useRef()
  const location = useRef()
  const notes = useRef()
  const color = useRef()
  const priority = useRef()

  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const formRef = useRef()

  console.log()

  const submit = async (e) => {
    e.preventDefault()

    setIsLoading(true)
    setError(null)

    try {
      const start = dayjs(startDateTime.current.value)
      const end = dayjs(endDateTime.current.value)

      const data = {
        name: title.current.value,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        location: location.current.value,
        notes: notes.current.value,
        color: color.current.value,
        priority: parseInt(priority.current.value),
        is_task: typeof event?.is_task == 'boolean' ? event?.is_task : !!isTask,
        is_complete: event?.is_complete,
      }

      if (start.isAfter(end)) {
        throw new Error('Start time must be before end time')
      } else if (!data.name) {
        throw new Error('Name is required')
      } else if (
        isNaN(data.priority) ||
        data.priority < 1 ||
        data.priority > 3
      ) {
        throw new Error('Priority must be between low and high')
      }

      await request(data)

      setIsLoading(false)
      hide()
    } catch (e) {
      console.error(e)
      setError(e.message)
      setIsLoading(false)
    }
  }

  const realTask = typeof event?.is_task == 'boolean' ? event.is_task : isTask

  const hide = () => setShowing(false)

  return (
    <Modal open={showing} close={hide} useCard id="CalendarModal">
      <div className="modal-card-head">
        <p className="modal-card-title">
          {isEditing ? 'Edit' : 'Create'} {isTask ? 'Task' : 'Event'}
        </p>
        <a className="delete" aria-label="close" onClick={hide}></a>
      </div>
      <div className="modal-card-body">
        {showing && (
          <div id="calendar-create">
            <form id="event" onSubmit={submit} ref={formRef}>
              {error && (
                <div className="message is-danger">
                  <div className="message-body">{error}</div>
                </div>
              )}

              <div className="field is-horizontal">
                <div className="field-label">
                  <label className="label">Title</label>
                </div>
                <div className="field-body">
                  <div className="field has-addons">
                    <div className="control is-expanded">
                      <input
                        className="input"
                        type="text"
                        placeholder=""
                        ref={title}
                        defaultValue={defTitle}
                        required
                      />
                    </div>
                    <div className="control">
                      <label id="color-input-wrapper">
                        <input
                          id="color-input"
                          className="input"
                          type="color"
                          placeholder="Color"
                          ref={color}
                          defaultValue={defColor}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="field is-horizontal">
                <div className="field-label">
                  <label className="label">Time</label>
                </div>
                <div className="field-body">
                  {realTask ? (
                    <>
                      <div class="field is-horizontal">
                        <div class="field-label">
                          <label class="label">Due Date</label>
                        </div>
                        <div class="field-body">
                          <div class="field is-expanded">
                            <div class="control">
                              <input
                                className="input"
                                type="datetime-local"
                                placeholder="Due date"
                                ref={endDateTime}
                                defaultValue={defEndDateTime.format(
                                  'YYYY-MM-DDTHH:mm'
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="field">
                        <div className="control">
                          <input
                            className="input"
                            type="datetime-local"
                            placeholder="Start time"
                            ref={startDateTime}
                            defaultValue={defStartDateTime.format(
                              'YYYY-MM-DDTHH:mm'
                            )}
                          />
                        </div>
                      </div>
                      <div className="field">
                        <div className="control">
                          <input
                            className="input"
                            type="datetime-local"
                            placeholder="End time"
                            ref={endDateTime}
                            defaultValue={defEndDateTime.format(
                              'YYYY-MM-DDTHH:mm'
                            )}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {realTask && (
                <div class="field is-horizontal">
                  <div class="field-label"></div>
                  <div class="field-body">
                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label">Do By</label>
                      </div>
                      <div class="field-body">
                        <div class="field is-expanded">
                          <div class="control">
                            <input
                              className="input"
                              type="datetime-local"
                              placeholder="Complete By"
                              ref={startDateTime}
                              defaultValue={defStartDateTime.format(
                                'YYYY-MM-DDTHH:mm'
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="field is-horizontal">
                <div className="field-label">
                  <label className="label">Location</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="text"
                        ref={location}
                        defaultValue={defLocation}
                      />
                      <span className="icon is-small is-left has-text-white">
                        <FontAwesomeIcon icon={solid('location-dot')} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="field is-horizontal">
                <div className="field-label">
                  <label className="label">Notes</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <div className="control">
                      <textarea
                        className="textarea"
                        type="text"
                        ref={notes}
                        defaultValue={defNotes}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="field is-horizontal">
                <div className="field-label">
                  <label className="label">Priority</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select ref={priority} defaultValue={defPriority}>
                          <option value="1">High</option>
                          <option value="2">Medium</option>
                          <option value="3">Low</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="is-hidden" type="submit"></button>
            </form>
          </div>
        )}
      </div>
      <footer className="modal-card-foot">
        <button
          className={`button is-primary ${isLoading && 'is-loading'}`}
          type="submit"
          onClick={submit}
        >
          {isEditing ? 'Update' : 'Create'}
        </button>
        <button className="button is-light" type="reset">
          Reset
        </button>
      </footer>
    </Modal>
  )
}
