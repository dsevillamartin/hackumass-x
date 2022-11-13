import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './home.scss'

import Blahgenda from '../assets/Blahgenda.svg'

export default function Home({ accountData }) {
  return (
    <div className="divCenter">
      {/* <div id="" */}
      <img id="big-logo" className="mb-4" src={Blahgenda} />
      <h2 className="has-text-weight-bold">Blahgenda</h2>
      <p id="page-text" className="has-text-weight-bold">
        A new way to schedule your life
      </p>
      <div className="button-thing mt-5">
        {accountData ? (
          <Link className="button is-big" to="/calendar">
            <strong>View Calendar</strong>
          </Link>
        ) : (
          <Link className="button is-big" to="/auth/signup">
            <strong>Join Now!</strong>
          </Link>
        )}
      </div>
      <div className="fade-in-image"></div>
    </div>
  )
}
