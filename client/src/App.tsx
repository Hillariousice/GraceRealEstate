import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import React from 'react'
import './App.css'
import Home from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup";


function App() {

  return (
   <React.Fragment>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/signup" element={<Signup/>}/>
{/* <Route path="/signup" element={<Login/>}/> */}
      </Routes>
    </Router>
   </React.Fragment>
  )
}

export default App
