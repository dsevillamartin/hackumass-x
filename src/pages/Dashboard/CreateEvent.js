import { ID, Permission, Role } from 'appwrite'
import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { databases } from '../../api'
import { DATABASE_ID, COLLECTION_ID } from '../../api/database'

export default function CreateEvent({ accountData, showing, setShowing }) {
  const title = useRef()
  const startDateTime = useRef()
  const endDateTime = useRef()
  const location = useRef()
  const notes = useRef()
  const color = useRef()
  const priority = useRef()

  useEffect(() => {
    const onKeyDown = (e) => {
        if (e.key === 'Escape') {
            setShowing(false);
        }
    }

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [])

  const create = async (e) => {
    e.preventDefault()

    await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      {
        name: title.current.value,
        start_time: startDateTime.current.value,
        end_time: endDateTime.current.value,
        location: location.current.value,
        notes: notes.current.value,
        color: color.current.value,
        priority: parseInt(priority.current.value),
        user_id: accountData.$id,
      },
      [
        Permission.read(Role.user(accountData.$id)),
        Permission.write(Role.user(accountData.$id)),
        Permission.delete(Role.user(accountData.$id)),
      ]
    )
  }

  const hideCreate = () => {
    setShowing(false);
  }

  return (
    <div id="calendar-create-container">
      <div id="calendar-create">

        <form id="event" onSubmit={create}>
          <input className="input" type="text" placeholder="Title" ref={title} />
          <input
            className="input"
            type="datetime-local"
            placeholder="Start time"
            ref={startDateTime}
          />
          <input
            className="input"
            type="datetime-local"
            placeholder="End time"
            ref={endDateTime}
          />
          <input
            className="input"
            type="text"
            placeholder="Location"
            ref={location}
          />
          <input className="input" type="text" placeholder="Notes" ref={notes} />
          <input className="input" type="color" placeholder="Color" ref={color} />
          <input
            className="input"
            type="number"
            placeholder="Priority"
            ref={priority}
          />

          <button className="button is-primary" type="submit">
            Create
          </button>
          <button className="button is-light" onClick={hideCreate}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}
