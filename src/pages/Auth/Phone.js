import React, { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { getCurrentAccount } from '../../api'

import './style.scss'

export default function Phone() {
  const [isLoading, setIsLoading] = useState(false)

  // TODO twilio is no longer giving $50 free credits
  //so epic!!!

  useEffect(() => {
    if (isLoading) return

    setIsLoading(true)

    getCurrentAccount()
      .then((account) => {
        if (account.phoneVerification) {
          redirect('/calendar')
        }

        setIsLoading(false)
      })
      .catch((e) => {
        setIsLoading(false)
      })
  }, [])

  return <h1>a</h1>
}
