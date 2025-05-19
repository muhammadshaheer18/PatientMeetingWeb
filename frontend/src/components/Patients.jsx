import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import People01 from './Profile.png';
import './Patients.css';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get("http://localhost:3000/patients");
                setPatients(response.data);
            } catch (error) {
                console.error("Error fetching patients:", error);
            }
        };

        fetchPatients();
    }, []);

    const handleRedirect = (email) => {
        navigate("/send-email", { state: { email } });
    };

    const handleAddPatient = () => {
        navigate("/addpatients");
    };

    const handleSendButton = async (email, patientName, bookingDate) => {
        try {
            const startDate = new Date(bookingDate);
            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

            const eventDetails = {
                summary: `Meeting with ${patientName}`,
                description: "Consultation meeting.",
                start: {
                    dateTime: startDate.toISOString(),
                    timeZone: 'Asia/Karachi',
                },
                end: {
                    dateTime: endDate.toISOString(),
                    timeZone: 'Asia/Karachi',
                },
                attendees: [{ email }],
                conferenceData: {
                    createRequest: {
                        requestId: `sample-${Date.now()}`,
                        conferenceSolutionKey: { type: "hangoutsMeet" }
                    }
                }
            };

            await axios.post('http://localhost:3000/send-meet-invite', eventDetails);
            alert("Google Meet invite sent successfully!");
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to send invite.");
        }
    };

    return (
        <div className="patients-container">
            <div className="header-section">
                <h1 className="title">Patient Management</h1>
                <button className="add-patient-btn" onClick={handleAddPatient}>
                    Add New Patient
                </button>
            </div>
            
            <div className="table-wrapper">
                <table className="patients-table">
                    <thead>
                        <tr>
                            <th>Profile</th>
                            <th>Name</th>
                            <th>Booking Date</th>
                            <th>Case</th>
                            <th>Fee Status</th>
                            <th>Contact</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient, index) => (
                            <tr key={index}>
                                <td>
                                    <img
                                        src={People01}
                                        alt={patient.name}
                                        className="profile-img"
                                    />
                                </td>
                                <td>{patient.name}</td>
                                <td>{new Date(patient.bookingDate).toLocaleString('en-US', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short'
                                })}</td>
                                <td>{patient.case}</td>
                                <td>
                                    <span className={`status-badge ${patient.feeStatus.toLowerCase()}`}>
                                        {patient.feeStatus}
                                    </span>
                                </td>
                                <td>
                                    <div className="contact-info">
                                        <span className="email">{patient.email}</span>
                                        {patient.phone && <span className="phone">{patient.phone}</span>}
                                    </div>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button 
                                            className="action-btn email-btn" 
                                            onClick={() => handleRedirect(patient.email)}
                                        >
                                            <i className="icon">✉️</i> Email
                                        </button>
                                        <button
                                            className="action-btn meet-btn"
                                            onClick={() => handleSendButton(patient.email, patient.name, patient.bookingDate)}
                                        >
                                            <i className="icon">🎥</i> Meet
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Patients;