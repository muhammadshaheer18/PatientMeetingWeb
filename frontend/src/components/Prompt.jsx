import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Prompt.css'; // <-- Importing custom CSS

function Prompt() {
    const location = useLocation();

    const [emailDetails, setEmailDetails] = useState({
        to: location.state?.email || "",
        subject: "",
        body: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmailDetails({ ...emailDetails, [name]: value });
    };

    const sendEmail = async () => {
        try {
            const response = await axios.post("http://localhost:3000/send-email", emailDetails);
            alert(response.data);
        } catch (error) {
            alert("Failed to send email: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="prompt-container">
            <div className="prompt-card">
                <h2 className="prompt-title">Meeting Scheduler</h2>
                <div className='form-container'>
                    <h3 className="form-heading">Send Email</h3>
                    <input
                        type="email"
                        name="to"
                        placeholder="Recipient Email"
                        value={emailDetails.to}
                        onChange={handleChange}
                        className="form-input"
                    />
                    <input
                        type="text"
                        name="subject"
                        placeholder="Subject"
                        value={emailDetails.subject}
                        onChange={handleChange}
                        className="form-input"
                    />
                    <textarea
                        name="body"
                        placeholder="Email Body"
                        value={emailDetails.body}
                        onChange={handleChange}
                        className="form-textarea"
                    />
                    <button onClick={sendEmail} className="send-btn">Send Email</button>
                </div>
            </div>
        </div>
    );
}

export default Prompt;
