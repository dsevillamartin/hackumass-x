import React, { useEffect, useLayoutEffect } from 'react'
import { BrowserRouter, Link, useLocation } from 'react-router-dom'
import { account } from './api'
import Router from './Router'

import Blahgenda from './assets/Blahgenda.svg'

const App = () => {
  const [accountData, setAccountData] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [navbarOpen, setNavbarOpen] = React.useState(false)

  const [accountId, setAccountId] = React.useState(null)

  useEffect(() => {
    setAccountId(accountData?.$id)
  }, [accountData, accountData?.$id])

  useLayoutEffect(() => {
    account
      .get()
      .then((data) => {
        setAccountData(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)

        setAccountData(null)
        setIsLoading(false)
      })
  }, [])

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen)
  }

  return (
    <BrowserRouter>
      <nav
        className="navbar is-dark  is-fixed-top"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <Link className="navbar-item" to="/">
            {/* <Blahgenda /> */}
            <img src={Blahgenda} height="50" />
            <h1>Blahgenda</h1>
          </Link>

          {/* burger */}
          <a
            role="button"
            className={`navbar-burger ${navbarOpen ? 'is-active' : ''}`}
            aria-label="menu"
            aria-expanded="false"
            onClick={toggleNavbar}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div className={`navbar-menu ${navbarOpen ? 'is-active' : ''}`}>
          {accountData && (
            <div className="navbar-start">
              <div className="navbar-item has-text-weight-semibold ml-5 is-capitalized is-italic has-text-warning-light">
                Welcome, {accountData.name}
              </div>
            </div>
          )}
          {!isLoading && (
            <div className="navbar-end">
              <div className="navbar-item">
                {accountId ? (
                  <>
                    <a
                      className="button"
                      target="_blank"
                      href={`https://api.blahgenda.tech/v1/storage/buckets/6370291502dec4fa9083/files/${accountId}/view?project=636f502bd6d75a45b48b&mode=admin`}
                    >
                      Export
                    </a>
                    &nbsp;
                    <Link className="button is-light" to="/auth/logout">
                      <strong>Log out</strong>
                    </Link>
                  </>
                ) : (
                  <div className="buttons">
                    <Link className="button is-primary" to="/auth/signup">
                      <strong>Sign up</strong>
                    </Link>
                    <Link className="button is-light" to="/auth/login">
                      Log in
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {isLoading ? (
        <div className="container is-loading mt-6" />
      ) : (
        <Router accountData={accountData} setAccountData={setAccountData} />
      )}
    </BrowserRouter>
  )
}

export default App
