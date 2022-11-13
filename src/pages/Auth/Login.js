import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

import client, { getCurrentAccount } from '../../api'
import { Account } from 'appwrite'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import './style.scss'

export default function SignIn({ accountData, setAccountData }) {
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const location = useLocation()
  const { message } = location.state || {}

  const navigate = useNavigate()

  useEffect(() => {
    if (accountData) {
      navigate('/calendar')
    }
  }, [accountData])

  const onSubmit = async (e) => {
    e.preventDefault()

    setIsLoading(true)
    location.state = null

    try {
      const account = new Account(client)

      await account.createEmailSession(
        emailRef.current.value,
        passwordRef.current.value
      )

      setAccountData(await account.get())
    } catch (e) {
      console.error(e)
      setError(e.message)
      setIsLoading(false)
    }
  }

  return (
    <form id="LoginForm" className="auth-form" onSubmit={onSubmit}>
      <div id="title" className="label">
        <label>Log In</label>
      </div>

      {message && <div className="notification is-success">{message}</div>}
      {error && <div className="notification is-danger">{error}</div>}

      <div className="field">
        <p className="control has-icons-left has-icons-right">
          <input
            className="input"
            type="email"
            placeholder="Email"
            ref={emailRef}
            required
          />
          <span className="icon is-small is-left has-text-white">
            <FontAwesomeIcon icon={solid('envelope')} />
          </span>
        </p>
      </div>

      <div className="field">
        <p className="control has-icons-left">
          <input
            className="input"
            type="password"
            placeholder="Password"
            ref={passwordRef}
            required
          />
          <span className="icon is-small is-left has-text-white">
            <FontAwesomeIcon icon={solid('lock')} />
          </span>
        </p>
      </div>

      <div className="control my-4">
        <button
          className={`button is-primary is-outlined is-inverted is-fullwidth ${
            isLoading && 'is-loading'
          }`}
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  )
}
