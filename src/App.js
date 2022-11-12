import React, { useEffect, useLayoutEffect } from 'react'
import { BrowserRouter, Link } from 'react-router-dom'
import { account } from './api'
import Router from './Router'

// import BlahgendaLogo from './assets/Blahgenda.svg'

const App = () => {
  const [accountData, setAccountData] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true)

  useLayoutEffect(() => {
    account.get().then((data) => {
      setAccountData(data)

      setIsLoading(false)
    })
  }, [])

  return (
    <BrowserRouter>
      {/* <nav>
        <a id="logo" href="/">
            <img src="/assets/Blahgenda.svg" alt="blahgenda logo" />
        </a>
    </nav> */}

      <nav
        className="navbar is-dark"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <Link className="navbar-item" to="/">
            <img src="/assets/Blahgenda.svg" height="50" />
            <h1>Blahgenda</h1>
          </Link>

          {/* burger */}
          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div className="navbar-menu">
          <div className="navbar-end">
            <div className="navbar-item">
              {accountData ? (
                <Link className="button is-primary" to="/calendar">
                <strong>Calendar</strong>
              </Link>
              ) : 
                <div className="buttons">
                  <a className="button is-primary" href="/auth/signup">
                    <strong>Sign up</strong>
                  </a>
                  <a className="button is-light" href="/auth/login">
                    Log in
                  </a>
                </div>}
            </div>
          </div>
        </div>
      </nav>

      <div className="container">
        {isLoading ? 'Loading...' : <Router accountData={accountData} />}
      </div>
    </BrowserRouter>
  )
}

export default App
