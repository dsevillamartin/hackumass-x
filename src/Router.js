import React, { Suspense } from 'react'
import { Route, useLocation } from 'react-router-dom'
import { Routes } from 'react-router-dom/dist'

const Home = React.lazy(() => import('./pages/Home'))
const Login = React.lazy(() => import('./pages/Auth/Login'))
const Signup = React.lazy(() => import('./pages/Auth/Signup'))
const Logout = React.lazy(() => import('./pages/Auth/Logout'))
const Calendar = React.lazy(() => import('./pages/Dashboard/Calendar'))
const Error404 = React.lazy(() => import('./pages/Error404'))

export default (props) => (
  <div className="container" data-path={useLocation().pathname}>
    <Suspense fallback={<div className="container is-loading" />}>
      <Routes>
        <Route exact path="/" element={<Home {...props} />} />
        <Route exact path="/calendar" element={<Calendar {...props} />} />
        <Route path="/auth/login" element={<Login {...props} />} />
        <Route path="/auth/signup" element={<Signup {...props} />} />
        <Route path="/auth/logout" element={<Logout {...props} />} />
        <Route path="*" element={<Error404 {...props} />} />
      </Routes>
    </Suspense>
  </div>
)
