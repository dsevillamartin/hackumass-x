import React from 'react'
import { Route, Link, createBrowserRouter, Switch } from 'react-router-dom'
import { BrowserRouter, Routes } from 'react-router-dom/dist'

import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import Phone from './pages/Auth/Phone'
import Calendar from './pages/Dashboard/Calendar'
import Home from './pages/Home'

export default (props) => (
  <Routes>
    <Route exact path="/" element={<Home {...props} />} />
    <Route exact path="/calendar" element={<Calendar {...props} />} />
    <Route path="/auth/login" element={<Login {...props} />} />
    <Route path="/auth/signup" element={<Signup {...props} />} />
    {/* <Route path="/auth/phone" element={<Phone {...props} />} /> */}
  </Routes>
)
