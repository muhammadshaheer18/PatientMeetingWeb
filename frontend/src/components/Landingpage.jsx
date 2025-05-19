
// Landingpage.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Patients from './Patients';

function Landingpage() {
    return (
        <div className="meeting-box">
            <Patients />
        </div>
    );
}

export default Landingpage;