import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landingpage from './components/Landingpage';
import Prompt from './components/Prompt';
import Patients from './components/Patients';
import AddPatient from "./components/AddPatient";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage/>} />
        <Route path="/send-email" element={<Prompt/>} />
        <Route path='/patients' element={<Patients/>}/>
        <Route path="/addpatients" element={<AddPatient/>}/>
      </Routes>
    </Router>
  );
}

export default App;