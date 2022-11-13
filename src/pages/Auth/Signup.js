import React, { useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

import { Account, ID } from 'appwrite'

import { account } from '../../api'
import { Navigate, useNavigate } from 'react-router-dom'

import './style.scss'

export default function Signup({ accountData, setAccountData }) {
  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    if (accountData) {
      navigate('/calendar')
    }
  }, [accountData])

  const onSubmit = async (e) => {
    e.preventDefault()

    setIsLoading(true)

    const email = emailRef.current.value
    const password = passwordRef.current.value
    const name = nameRef.current.value

    let acc

    try {
      acc = await account.create(ID.unique(), email, password, name)
    } catch (e) {
      console.error(e)
      setError(e.message)
      setIsLoading(false)
      return
    }

    try {
      await account.createEmailSession(email, password)

      setAccountData(acc)
    } catch (e) {
      navigate('/auth/login')
    }
  }

  return (
    <div id="authparent">
      <form onSubmit={onSubmit} className="auth-form" id="SignupForm">
        <div id="title" className="label">
          <label>Sign Up</label>
        </div>

        {error && <div className="notification is-danger">{error}</div>}

        <div className="field">
          <p className="control has-icons-left has-icons-right">
            <input
              className="input"
              type="text"
              placeholder="Name"
              ref={nameRef}
              required
            />
            <span className="icon is-small is-left has-text-white">
              <FontAwesomeIcon icon={solid('user')} />
            </span>
          </p>
        </div>

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

        <div className="control mt-4 mb-4">
          <button
            className={`button is-inverted is-outlined is-primary is-fullwidth ${
              isLoading && 'is-loading'
            }`}
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}
