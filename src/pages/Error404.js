import React from 'react'
import { Link } from 'react-router-dom'
import './error404.scss'

import Blahgenda404 from '../assets/Blahgenda404.svg'

export default function Error404({ accountData }) {
  return (
    <div id="wrapper404">
      {/* <Blahgenda404 /> */}
      <img id="shark404" src={Blahgenda404} />
      <h2 id="msg404">
        Oh no! We were not able to find the page you were looking for :(
      </h2>
      <div className="options">
        <h3 className="option404">
          Maybe try the&nbsp;
          <Link className="link has-text-primary" to="/">
            <strong>Homepage</strong>
          </Link>
        </h3>
      </div>
      {accountData ? (
        <div className="options">
          <h3 className="option404">
            or the&nbsp;
            <Link className="link has-text-primary" to="/calendar">
              <strong>Calendar</strong>
            </Link>
          </h3>
        </div>
      ) : (
        <div className="options">
          <h3 className="option404">
            or maybe to&nbsp;
            <Link className="link has-text-primary" to="/auth/signup">
              <strong>Sign Up</strong>
            </Link>
            &nbsp;or&nbsp;
            <Link className="link has-text-primary" to="/auth/login">
              <strong>Log In</strong>
            </Link>
          </h3>
        </div>
      )}
    </div>
  )
}
