import { Client, Account, ID, Databases } from 'appwrite'

const client = new Client()
  .setEndpoint('https://api-blahgenda.dsev.dev/v1') // Your API Endpoint
  .setProject('636f502bd6d75a45b48b') // Your project ID

export const account = new Account(client)
export const databases = new Databases(client)

export const getCurrentAccount = () => account.get()

export default client
