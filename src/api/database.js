import { Databases } from 'appwrite'
import client from '.'

export const DATABASE_ID = '636f5b6eafb4f87bc2a5'
export const COLLECTION_ID = '636f5ba37013c90ca3fb'

export const databases = new Databases(client)

export const deleteEvent = async (id) =>
  await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id)
export const updateEventData = async (id, data) =>
  await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, data)
