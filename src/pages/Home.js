import React, { useState, useEffect } from 'react'

export default function Home() {
  return (
    <div className="divCenter">
      <h2>Blahgenda</h2>
      <p id="page-text">A new way to schedule your life.</p>
      <div className="button-thing">
        <a className="button is-big" href="/auth/signup">
          <strong>Join Now!</strong>
        </a>
      </div>
    </div>
  )
}
