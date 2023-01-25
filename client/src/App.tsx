import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import React from 'react'
import './App.css'
import Home from "./pages/Home/Home";

function App() {

  return (
   <React.Fragment>
    <Router>
      <Routes>
<Route path="/" element={<Home/>}/>

      </Routes>
    </Router>
   </React.Fragment>
  )
}

export default App
