// import React, { useState } from 'react';
// import { collection, addDoc } from 'firebase/firestore';
// import { db } from '../services/firebase';

// const DonatorRegistration = () => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     age: '',
//     weight: '',
//     bloodGroup: '',
//     healthConditions: '',
//     medications: '',
//     isAbove18: false,
//     address: '',
//     emergencyContact: ''
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const validateForm = () => {
//     setMessage('');

//     if (!formData.fullName.trim()) {
//       setMessage('Full name is required.');
//       return false;
//     }

//     if (!formData.email.trim()) {
//       setMessage('Email is required.');
//       return false;
//     }

//     if (!formData.phone.trim()) {
//       setMessage('Phone number is required.');
//       return false;
//     }

//     if (!formData.age || parseInt(formData.age) < 18) {
//       setMessage('Age must be 18 or above.');
//       return false;
//     }

//     if (!formData.weight || parseInt(formData.weight) < 50) {
//       setMessage('Minimum weight requirement is 50 kg.');
//       return false;
//     }

//     if (!formData.bloodGroup) {
//       setMessage('Blood group selection is required.');
//       return false;
//     }

//     if (!formData.isAbove18) {
//       setMessage('You must confirm that you are 18 or above to donate blood.');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     setMessage('');

//     try {
//       const donorDocRef = await addDoc(collection(db, 'donors'), {
//         ...formData,
//         age: parseInt(formData.age),
//         weight: parseInt(formData.weight),
//         registrationDate: new Date().toISOString(),
//         status: 'registered'
//       });
      
//       await addDoc(collection(db, 'bloodInventory'), {
//         bloodGroup: formData.bloodGroup,
//         donorName: formData.fullName,
//         donorId: donorDocRef.id,
//         donationDate: new Date().toISOString(),
//         units: 1,
//         status: 'available'
//       });

//       setMessage('Registration successful! Thank you for your donation commitment.');
      
//       setFormData({
//         fullName: '',
//         email: '',
//         phone: '',
//         age: '',
//         weight: '',
//         bloodGroup: '',
//         healthConditions: '',
//         medications: '',
//         isAbove18: false,
//         address: '',
//         emergencyContact: ''
//       });

//     } catch (error) {
//       console.error('Error during registration: ', error);
//       setMessage(`Registration failed: ${error.message}. Please try again.`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="registration-container">
//       <div className="registration-card">
//         <h2>Blood Donor Registration</h2>
        
//         {message && (
//           <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
//             {message}
//           </div>
//         )}
        
//         <form onSubmit={handleSubmit} className="registration-form">
//           <div className="form-section">
//             <h3>Personal Information</h3>
            
//             <div className="form-group">
//               <label htmlFor="fullName">Full Name *</label>
//               <input
//                 type="text"
//                 id="fullName"
//                 name="fullName"
//                 value={formData.fullName}
//                 onChange={handleInputChange}
//                 required
//                 placeholder="Enter your full name"
//               />
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="email">Email *</label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   required
//                   placeholder="Enter your email"
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="phone">Phone Number *</label>
//                 <input
//                   type="tel"
//                   id="phone"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   required
//                   placeholder="Enter your phone number"
//                 />
//               </div>
//             </div>

//             <div className="form-group">
//               <label htmlFor="address">Address</label>
//               <textarea
//                 id="address"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleInputChange}
//                 rows="3"
//                 placeholder="Enter your address"
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="emergencyContact">Emergency Contact</label>
//               <input
//                 type="tel"
//                 id="emergencyContact"
//                 name="emergencyContact"
//                 value={formData.emergencyContact}
//                 onChange={handleInputChange}
//                 placeholder="Enter emergency contact number"
//               />
//             </div>
//           </div>

//           <div className="form-section">
//             <h3>Medical Information</h3>
            
//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="age">Age *</label>
//                 <input
//                   type="number"
//                   id="age"
//                   name="age"
//                   value={formData.age}
//                   onChange={handleInputChange}
//                   min="18"
//                   max="65"
//                   required
//                   placeholder="Enter your age"
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="weight">Weight (kg) *</label>
//                 <input
//                   type="number"
//                   id="weight"
//                   name="weight"
//                   value={formData.weight}
//                   onChange={handleInputChange}
//                   min="50"
//                   required
//                   placeholder="Enter your weight"
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="bloodGroup">Blood Group *</label>
//                 <select
//                   id="bloodGroup"
//                   name="bloodGroup"
//                   value={formData.bloodGroup}
//                   onChange={handleInputChange}
//                   required
//                 >
//                   <option value="">Select Blood Group</option>
//                   {bloodGroups.map(group => (
//                     <option key={group} value={group}>{group}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="form-group">
//               <label htmlFor="healthConditions">Health Conditions</label>
//               <textarea
//                 id="healthConditions"
//                 name="healthConditions"
//                 value={formData.healthConditions}
//                 onChange={handleInputChange}
//                 placeholder="Please mention any chronic diseases, recent surgeries, or health conditions"
//                 rows="3"
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="medications">Current Medications</label>
//               <textarea
//                 id="medications"
//                 name="medications"
//                 value={formData.medications}
//                 onChange={handleInputChange}
//                 placeholder="Please list any medications you are currently taking"
//                 rows="3"
//               />
//             </div>
//           </div>

//           <div className="form-section">
//             <div className="checkbox-group">
//               <label className="checkbox-label">
//                 <input
//                   type="checkbox"
//                   name="isAbove18"
//                   checked={formData.isAbove18}
//                   onChange={handleInputChange}
//                   required
//                 />
//                 <span className="checkbox-text">
//                   I confirm that I am 18 years of age or older and eligible to donate blood *
//                 </span>
//               </label>
//             </div>
//           </div>

//           <button 
//             type="submit" 
//             className="submit-btn"
//             disabled={loading}
//           >
//             {loading ? 'Registering...' : 'Register as Donor'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default DonatorRegistration;

import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const DonatorRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    weight: '',
    bloodGroup: '',
    healthConditions: '',
    medications: '',
    isAbove18: false,
    address: '',
    emergencyContact: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    setMessage('');

    if (!formData.fullName.trim()) {
      setMessage('Full name is required.');
      return false;
    }

    if (!formData.email.trim()) {
      setMessage('Email is required.');
      return false;
    }

    if (!formData.phone.trim()) {
      setMessage('Phone number is required.');
      return false;
    }

    if (!formData.age || parseInt(formData.age) < 18) {
      setMessage('Age must be 18 or above.');
      return false;
    }

    if (!formData.weight || parseInt(formData.weight) < 50) {
      setMessage('Minimum weight requirement is 50 kg.');
      return false;
    }

    if (!formData.bloodGroup) {
      setMessage('Blood group selection is required.');
      return false;
    }

    if (!formData.isAbove18) {
      setMessage('You must confirm that you are 18 or above to donate blood.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const donorDocRef = await addDoc(collection(db, 'donors'), {
        ...formData,
        age: parseInt(formData.age),
        weight: parseInt(formData.weight),
        registrationDate: new Date().toISOString(),
        status: 'registered'
      });
      
      await addDoc(collection(db, 'bloodInventory'), {
        bloodGroup: formData.bloodGroup,
        donorName: formData.fullName,
        donorId: donorDocRef.id,
        donationDate: new Date().toISOString(),
        units: 1,
        status: 'available'
      });

      setMessage('Registration successful! Thank you for your donation commitment.');
      
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        weight: '',
        bloodGroup: '',
        healthConditions: '',
        medications: '',
        isAbove18: false,
        address: '',
        emergencyContact: ''
      });

    } catch (error) {
      console.error('Error during registration: ', error);
      setMessage(`Registration failed: ${error.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h2>Blood Donor Registration</h2>
        
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-section">
            <h3>Personal Information</h3>
            {/* ... Personal Info Inputs ... */}
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your phone number"
                />
              </div>
            </div>


            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="3"
                placeholder="Enter your address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="emergencyContact">Emergency Contact</label>
              <input
                type="tel"
                id="emergencyContact"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                placeholder="Enter emergency contact number"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Medical Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Age *</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="18"
                  max="65"
                  required
                  placeholder="Enter your age"
                />
              </div>

              <div className="form-group">
                <label htmlFor="weight">Weight (kg) *</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  min="50"
                  required
                  placeholder="Enter your weight"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bloodGroup">Blood Group *</label>
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="healthConditions">Health Conditions</label>
              <textarea
                id="healthConditions"
                name="healthConditions"
                value={formData.healthConditions}
                onChange={handleInputChange}
                placeholder="Please mention any chronic diseases, recent surgeries, or health conditions"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="medications">Current Medications</label>
              <textarea
                id="medications"
                name="medications"
                value={formData.medications}
                onChange={handleInputChange}
                placeholder="Please list any medications you are currently taking"
                rows="3"
              />
            </div>
          </div>

          <div className="form-section">
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isAbove18"
                  checked={formData.isAbove18}
                  onChange={handleInputChange}
                  required
                />
                <span className="checkbox-text">
                  I confirm that I am 18 years of age or older and eligible to donate blood *
                </span>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register as Donor'}
          </button>
        </form>

        {/* --- Moved message display here, after the form --- */}
        {message && (
          <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonatorRegistration;
