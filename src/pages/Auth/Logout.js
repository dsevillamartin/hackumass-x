import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../api/auth'

export default function Logout({ accountData, setAccountData }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (accountData) {
      logout()
        .then(() => {
          setAccountData(null)
          navigate('/auth/login', {
            state: {
              message: 'You have been logged out.',
            },
          })
        })
        .catch((e) => {
          console.error(e)
        })
    } else {
      navigate('/auth/login')
    }
  }, [])

  return <h1>Logging out...</h1>
}
