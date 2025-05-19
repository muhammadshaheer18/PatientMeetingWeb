import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import People01 from './Profile.png';
import './Patients.css'; // <-- CSS file import

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

    const handleSendButton = async (email, patientName, bookingDate) => {
        try {
            const startDate = new Date(bookingDate);
            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

            const eventDetails = {
                summary: `Meeting with ${patientName}`,
                description: "Consultation meeting.",
                start: {
                    dateTime: startDate,
                    timeZone: 'Asia/Karachi',
                },
                end: {
                    dateTime: endDate,
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
            <h1 className="title">Patient List</h1>
            <div className="table-wrapper">
                <table className="patients-table">
                    <thead>
                        <tr>
                            <th>Profile</th>
                            <th>Name</th>
                            <th>Booking Date</th>
                            <th>Case</th>
                            <th>Fee Status</th>
                            <th>Email</th>
                            <th>Write Email</th>
                            <th>Send Invite</th>
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
                                <td>{patient.feeStatus}</td>
                                <td>{patient.email}</td>
                                <td>
                                    <button className="action-btn" onClick={() => handleRedirect(patient.email)}>Write Mail</button>
                                </td>
                                <td>
                                    <button
                                        className="action-btn"
                                        onClick={() => handleSendButton(patient.email, patient.name, patient.bookingDate)}
                                    >
                                        Send Invite
                                    </button>
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
