import React, { useState, useEffect  } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/dashboard/Profile.css';
import { getProfile, updateProfile } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";



const Profile = () => {

   const { token } = useAuth();

  // Static data - replace with API calls later
  // const [profileData, setProfileData] = useState({
  //   firstname: "John",
  //   lastname: "Doe",
  //   email: "john.doe@example.com",
  //   phone: "+91-9876543210",
  //   gender: "male",
  //   birthDate: "1990-01-01",
  //   address: "123 Health Street, Near Om Clinic",
  //   city: "Mumbai",
  //   state: "Maharashtra",
  //   country: "India"
  // });

  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({...profileData});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile(token);
        setProfileData(data);
        setTempData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert(error.msg || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // const handleSave = () => {
  //   setProfileData(tempData);
  //   setIsEditing(false);
  //   alert("Profile updated successfully!");
  // };
   const handleSave = async () => {
    try {
      const updated = await updateProfile(token, tempData);
      setProfileData(updated);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.msg || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  if (loading) return <p>Loading profile...</p>;
  if (!profileData) return <p>No profile data found.</p>; 

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>My Profile</h2>
        <div className="profile-actions-top">
          {!isEditing ? (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <>
              <button className="btn btn-tertiary" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn btn-secondary" onClick={handleSave}>
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="profile-grid">
          {/* Row 1: First Name, Last Name, Email */}
          <div className="form-row triple">
            <div className="form-group">
              <label>First Name</label>
              {isEditing ? (
                <input type="text" name="firstname" value={tempData.firstname || ""} onChange={handleChange} />
              ) : (
                <p>{profileData.firstname}</p>
              )}
            </div>
            <div className="form-group">
              <label>Last Name</label>
              {isEditing ? (
                <input type="text" name="lastname" value={tempData.lastname || ""} onChange={handleChange} />
              ) : (
                <p>{profileData.lastname}</p>
              )}
            </div>
            <div className="form-group">
              <label>Email</label>
              {isEditing ? (
                <input type="email" name="email" value={tempData.email || ""} onChange={handleChange} />
              ) : (
                <p>{profileData.email}</p>
              )}
            </div>
          </div>

          {/* Row 2: Phone, Date of Birth, Gender */}
          <div className="form-row triple">
            <div className="form-group">
              <label>Phone Number</label>
              {isEditing ? (
                <input type="tel" name="phone" value={tempData.phone ||""} onChange={handleChange} />
              ) : (
                <p>{profileData.phone}</p>
              )}
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              {isEditing ? (
                <input type="date" name="birthDate" value={tempData.birthDate
                        ? tempData.birthDate.split("T")[0]
                        : ""} onChange={handleChange} />
              ) : (
                <p>
                  {/* {new Date(profileData.birthDate).toLocaleDateString()} */}
                  {profileData.birthDate
                      ? new Date(profileData.birthDate).toLocaleDateString()
                      : ""}
                  </p>
              )}
            </div>
            <div className="form-group">
              <label>Gender</label>
              {isEditing ? (
                <div className="select-wrapper">
                  <select name="gender" value={tempData.gender||""} onChange={handleChange}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              ) : (
                <p>
                  {/* {profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1)} */}
                  {profileData.gender
                      ? profileData.gender.charAt(0).toUpperCase() +
                        profileData.gender.slice(1)
                      : ""}
                  </p>
              )}
            </div>
          </div>
        </div>
        </div>

        <div className="profile-section">
          <h3>Address Information</h3>
          
          {/* Row 3: Full Address */}
          <div className="profile-grid">
          <div className="form-row group">
            <div className="form-group full-width">
              <label>Address</label>
              {isEditing ? (
                <input type="text" name="address" value={tempData.address||""} onChange={handleChange} />
              ) : (
                <p>{profileData.address}</p>
              )}
            </div>
          </div>
         

          {/* Row 4: City, State, Country */}
          <div className="form-row triple">
            <div className="form-group">
              <label>City</label>
              {isEditing ? (
                <input type="text" name="city" value={tempData.city||""} onChange={handleChange} />
              ) : (
                <p>{profileData.city}</p>
              )}
            </div>
            <div className="form-group">
              <label>State</label>
              {isEditing ? (
                <input type="text" name="state" value={tempData.state||""} onChange={handleChange} />
              ) : (
                <p>{profileData.state}</p>
              )}
            </div>
            <div className="form-group">
              <label>Country</label>
              {isEditing ? (
                <input type="text" name="country" value={tempData.country||""} onChange={handleChange} />
              ) : (
                <p>{profileData.country}</p>
              )}
            </div>
          </div>
        </div>
 </div>
        <div className="profile-actions-bottom">
          <Link to="/dashboard/user" className="btn btn-tertiary">
            Back to Dashboard
          </Link>
          <button className="btn btn-primary" onClick={() => alert('Password change coming soon')}>
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;