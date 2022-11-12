import React, { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

import { Account, ID } from 'appwrite'

import { account } from '../../api'
import { Navigate, useNavigate } from 'react-router-dom'

export default function Signup() {
  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const [isLoading, setIsLoading] = React.useState(false)

  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()

    setIsLoading(true)

    const email = emailRef.current.value
    const password = passwordRef.current.value
    const name = nameRef.current.value

    try {
      const response = await account.create(ID.unique(), email, password, name)
    } catch (e) {
      console.error(e)

      setIsLoading(false)

      return
    }

    try {
      await account.createEmailSession(email, password)

      navigate('/calendar')
    } catch (e) {
      navigate('/auth/login')
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="field">
        <p className="control has-icons-left has-icons-right">
          <input
            className="input"
            type="text"
            placeholder="Name"
            ref={nameRef}
            defaultValue="name"
          />
          <span className="icon is-small is-left">
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
