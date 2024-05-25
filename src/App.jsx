import React, { useState } from 'react'
import "./App.css";
import Sidebar from './Sidebar';
import Chat from './Chat';
import { Route, Routes } from "react-router-dom";
import { Switch } from '@mui/material';
import Login from "./Login"
import { useStateValue } from "./StateProvider";

const App = () => {

  const [{ user }, dispatch] = useStateValue();

  return (
    <div className='app'>
      {!user ? (
        <Login/>
      ) : (
        <div className="app__body">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/rooms/:roomId" element={<Chat />} />
          </Routes>
        </div>
      )}
    </div>
  )
}

export default App
