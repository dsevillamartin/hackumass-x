import React from 'react'
import { updateEventData } from '../../../api/database'
import FormModal from './FormModal'

export default function EditEventModal({
  event,
  updateEvent,
  showing,
  ...props
}) {
  const request = async (data) => {
    const evt = await updateEventData(event.$id, data)

    updateEvent(evt)
  }

  return (
    <FormModal
      request={request}
      event={event}
      isEditing
      showing={showing}
      {...props}
    />
  )
}
