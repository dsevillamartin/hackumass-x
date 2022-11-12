import React, { useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

import client, { getCurrentAccount } from '../../api'
import { Account } from 'appwrite'
import { Navigate, useNavigate } from 'react-router-dom'

export default function SignIn() {
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    if (isLoading) return

    setIsLoading(true)

    getCurrentAccount()
      .then((acc) => {
        if (acc) {
          navigate('/calendar')
        } else {
          setIsLoading(false)
        }
      })
      .catch((e) => {
        setIsLoading(false)
      })
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()

    setIsLoading(true)

    try {
      const account = new Account(client)
      await account.createEmailSession(
        emailRef.current.value,
        passwordRef.current.value
      )

      navigate('/calendar')
    } catch (e) {
      console.error(e)
      setError(e.message)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="field">
        <p className="control has-icons-left has-icons-right">
          <input
            className="input"
            type="email"
            placeholder="Email"
            ref={emailRef}
            defaultValue="email@domain.com"
          />
          <span className="icon is-small is-left">
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
            defaultValue="password"
          />
          <span className="icon is-small is-left">
            <FontAwesomeIcon icon={solid('lock')} />
          </span>
        </p>
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            className={`button is-link ${isLoading && 'is-loading'}`}
            type="submit"
          >
            Submit
          </button>
        </div>
        <div className="control">
          <button className="button is-link is-light" type="reset">
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}
