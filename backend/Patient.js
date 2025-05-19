const mongoose = require('mongoose');

// Define the Patient schema
const PatientSchema = new mongoose.Schema(
    {
        profile: {
            type: String,
            required: true, // Profile image URL or placeholder
        },
        name: {
            type: String,
            required: true, // Patient's name
        },
        bookingDate: {
            type: Date,
            required: true, // Date of the patient's booking
        },
        case: {
            type: String,
            required: true, // The case/consultation type
        },
        feeStatus: {
            type: String,
            required: true, // Payment status (e.g., "Paid", "Pending")
        },
        email: {
            type: String,
            required: true, // Patient's email address
            unique: true, // Email should be unique
        },
        emailActions: {
            customizedEmailSent: {
                type: Boolean,
                default: false, // Whether the customized email was sent
            },
            meetingInviteSent: {
                type: Boolean,
                default: false, // Whether the meeting invite was sent
            },
        },
    },
    {
        collection: 'Patient', // Define the collection name
        timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
    }
);

// Create a model based on the schema
const Patient = mongoose.model('Patient', PatientSchema);

module.exports = Patient;
