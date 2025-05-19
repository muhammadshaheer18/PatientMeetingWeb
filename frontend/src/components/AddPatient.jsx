import React, { useState } from 'react';
import { Calendar, User, FileText, Mail, CreditCard, Image, ChevronLeft, Save } from 'lucide-react';
import './AddPatient.css'; // <-- CSS file import

const AddPatient = () => {
  const [formData, setFormData] = useState({
    profile: '',
    name: '',
    bookingDate: '',
    case: '',
    feeStatus: '',
    email: '',
    emailActions: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  if (e) e.preventDefault();
  setIsSubmitting(true);

  try {
    // Example API endpoint - change to your backend URL
    const response = await fetch('http://localhost:3000/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to save patient data');
    }

    const data = await response.json();
    console.log('Patient saved:', data);

    alert('Patient added successfully!');
    setFormData({
      profile: '',
      name: '',
      bookingDate: '',
      case: '',
      feeStatus: '',
      email: '',
      emailActions: [],
    });
  } catch (error) {
    console.error('Error saving patient:', error);
    alert('Failed to add patient');
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <button className="back-button">
            <ChevronLeft size={20} />
          </button>
          <h2>Add New Patient</h2>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          {/* Profile Image URL */}
          <div className="form-group">
            <label htmlFor="profile">
              <Image size={16} className="icon" />
              Profile Image
            </label>
            <input
              type="text"
              id="profile"
              name="profile"
              placeholder="Enter image URL"
              value={formData.profile}
              onChange={handleChange}
            />
          </div>

          {/* Patient Name */}
          <div className="form-group">
            <label htmlFor="name">
              <User size={16} className="icon" />
              Patient Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter patient name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Booking Date */}
          <div className="form-group">
            <label htmlFor="bookingDate">
              <Calendar size={16} className="icon" />
              Appointment Date
            </label>
            <input
              type="datetime-local"
              id="bookingDate"
              name="bookingDate"
              value={formData.bookingDate}
              onChange={handleChange}
            />
          </div>

          {/* Case Description */}
          <div className="form-group">
            <label htmlFor="case">
              <FileText size={16} className="icon" />
              Case Description
            </label>
            <textarea
              id="case"
              name="case"
              placeholder="Enter case details"
              value={formData.case}
              onChange={handleChange}
              rows="3"
            />
          </div>

          {/* Fee Status */}
          <div className="form-group">
            <label htmlFor="feeStatus">
              <CreditCard size={16} className="icon" />
              Fee Status
            </label>
            <select
              id="feeStatus"
              name="feeStatus"
              value={formData.feeStatus}
              onChange={handleChange}
            >
              <option value="">Select Fee Status</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">
              <Mail size={16} className="icon" />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter patient email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Submit */}
          <div className="form-group">
            <button type="submit" disabled={isSubmitting} className="submit-button">
              <Save size={18} className="icon" />
              {isSubmitting ? 'Adding Patient...' : 'Add Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;
