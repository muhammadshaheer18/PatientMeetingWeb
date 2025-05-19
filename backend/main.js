require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
require("./Patient");
const Patient = mongoose.model("Patient");
const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3001", credentials: true }));

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

connectDB();

// Nodemailer Transporter using Gmail OAuth2 or basic auth
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

app.get('/patients', async (req, res) => {
    try {
        const patients = await Patient.find({});
        res.send(
            patients.map(patient => ({
                ...patient.toObject(),
                bookingDate: patient.bookingDate.toISOString().split('T')[0],
            }))
        );
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving patients', error });
    }
});

app.post('/patients', async (req, res) => {
    try {
        const { profile, name, bookingDate, case: caseDesc, feeStatus, email, emailActions } = req.body;
        const newPatient = new Patient({
            profile,
            name,
            bookingDate: new Date(bookingDate),
            case: caseDesc,
            feeStatus,
            email,
            emailActions,
        });
        const savedPatient = await newPatient.save();
        res.json(savedPatient);
    } catch (error) {
        res.status(400).json({ message: 'Error saving patient', error });
    }
});

app.post("/send-email", async (req, res) => {
    const { to, subject, body } = req.body;

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject,
        text: body,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email", details: error.message });
    }
});

const oAuth2Client = new OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.OAUTH_REDIRECT_URI
);

oAuth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

app.post('/send-meet-invite', async (req, res) => {
    const { summary, description, start, end, attendees } = req.body;
    const psychEmail = ''; // If needed, fill or remove

    try {
        const event = {
            summary,
            description,
            start: {
                dateTime: new Date(start.dateTime).toISOString(),
                timeZone: start.timeZone,
            },
            end: {
                dateTime: new Date(end.dateTime).toISOString(),
                timeZone: end.timeZone,
            },
            attendees,
            conferenceData: {
                createRequest: {
                    requestId: `meet-${Date.now()}`,
                    conferenceSolutionKey: {
                        type: "hangoutsMeet",
                    },
                },
            },
        };

        const createdEvent = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1,
        });

        const googleMeetLink = createdEvent.data.hangoutLink || 'Unavailable';

        const startDateFormatted = new Date(start.dateTime).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
        const endDateFormatted = new Date(end.dateTime).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });

        const emailContent = `
Dear Patient,

You are invited to a meeting with the following details:

Meeting Summary: ${summary || 'N/A'}
Meeting Description: ${description || 'N/A'}
Start: ${startDateFormatted}
End: ${endDateFormatted}

Join the meeting using this link: ${googleMeetLink}

Kind regards,
Your Scheduler App
`;

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: [attendees[0].email, psychEmail].filter(Boolean),
            subject: `Meeting Invite: ${summary}`,
            text: emailContent,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: "Google Meet invite created and email sent successfully",
            event: createdEvent.data,
            googleMeetLink,
        });
    } catch (error) {
        console.error('Error creating Google Meet invite or sending email:', error);
        res.status(500).json({
            error: "Failed to create Google Meet invite or send email",
            details: error.message,
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
