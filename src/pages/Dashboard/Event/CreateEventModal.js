import React from 'react'
import EditEventModal from './FormModal'
import { databases } from '../../../api'
import { DATABASE_ID, COLLECTION_ID } from '../../../api/database'
import { ID, Permission, Role } from 'appwrite'

export default function CreateEventModal({ accountData, addEvent, ...props }) {
  const request = async (data) => {
    const evt = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      {
        ...data,
        user_id: accountData.$id,
      },
      [
        Permission.read(Role.user(accountData.$id)),
        Permission.write(Role.user(accountData.$id)),
        Permission.delete(Role.user(accountData.$id)),
      ]
    )

    addEvent(evt)
  }

  return <EditEventModal request={request} {...props} />
}
