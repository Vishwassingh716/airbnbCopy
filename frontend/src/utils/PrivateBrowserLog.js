import React from 'react'
import { Navigate ,Route, Routes } from 'react-router-dom'
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';



const PrivateBrowserLog = ({children , ...rest}) => {
    console.log('it works');
    let {authToken} = useContext(AuthContext)
    const auth = authToken ? true : false
  return (
    <Routes>
      <Route {...rest} element={auth ? <Navigate to = '/'/> :children }/>
    </Routes>
  )
}





export default PrivateBrowserLog
