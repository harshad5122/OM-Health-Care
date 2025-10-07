import React, { useState, useEffect } from 'react';
import { Link  } from 'react-router-dom';
// import { getProfile, updateProfile } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import { useUserApi } from '../../api/userApi';
import {showAlert} from '../../components/AlertComponent';


const Profile = () => {

  const { token ,setUser} = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({ ...profileData });
  const [loading, setLoading] = useState(true);
  const { getProfile, updateProfile } = useUserApi();

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        setProfileData(data);
        setUser(data)
        setTempData(data);
      } catch (error) {
        console.log("Error fetching profile:", error);
        showAlert(error.msg, "error")
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    if (!token) return;

    fetchProfile();
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
      fetchProfile();
      setIsEditing(false);
     showAlert("Profile updated successfully!", "success")
    } catch (error) {
      console.log("Error updating profile:", error);
      showAlert(error.msg, "error")
    }
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  if (loading) return <p>Loading profile...</p>;
  if (!profileData) return <p>No profile data found.</p>;

  return (
    <div className="profile-container py-[20px] mx-auto rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)] py-[20px] flex flex-col" style={{ height: "calc(100vh - 60px)"}}>
      <div className="profile-header px-[20px] flex justify-between items-center pb-4 border-b border-[#eee]">
        <span className='text-[1.8rem] text-[#1a6f8b] m-0 font-semibold flex sticky top-0 z-10'>
          My Profile
        </span>
        <div className="profile-actions-top flex gap-[1rem]">
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

      <div className="profile-content px-[20px] pt-[20px]" style={{ flex: 1, overflowY: "auto" }}>
        <div className="mb-10 p-6 border border-[#f0f0f0] rounded-lg bg-[#fcfcfc]">
          <h3 className='text-left text-[#343a40] text-[1.4rem] mt-0 mb-6 pb-2 border-b border-[#e0e0e0]'>Personal Information</h3>
          <div className="flex flex-col gap-[1.5rem]">
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
                  <input type="tel" name="phone" value={tempData.phone || ""} onChange={handleChange} />
                ) : (
                  <p>{profileData.phone}</p>
                )}
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                {isEditing ? (
                  <input type="date" name="dob" value={tempData.dob
                    ? tempData.dob.split("T")[0]
                    : ""} onChange={handleChange} />
                ) : (
                  // <p>
                  //   {profileData.dob
                  //     ? new Date(profileData.dob).toLocaleDateString()
                  //     : ""}
                  // </p>
                  <p>
                    {profileData.dob
                      ? new Date(profileData.dob).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : ""}
                  </p>

                )}
              </div>
              <div className="form-group">
                <label>Gender</label>
                {isEditing ? (
                  <div className="select-wrapper">
                    <select name="gender" value={tempData.gender || ""} onChange={handleChange}>
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

        <div className="mb-10 p-6 border border-[#f0f0f0] rounded-lg bg-[#fcfcfc]">
          <h3 className='text-left text-[#343a40] text-[1.4rem] mt-0 mb-6 pb-2 border-b border-[#e0e0e0]'>Address Information</h3>

          {/* Row 3: Full Address */}
          <div className="flex flex-col gap-[1.5rem]">
            <div className="form-row group">
              <div className="form-group full-width">
                <label>Address</label>
                {isEditing ? (
                  <input type="text" name="address" value={tempData.address || ""} onChange={handleChange} />
                ) : (
                  <p>{profileData.address}</p>
                )}
              </div>
            </div>


            {/* Row 4: City, State, Country */}
            <div className="form-row triple">
              <div className="form-group">
                <label>Country</label>
                {isEditing ? (
                  <input type="text" name="country" value={tempData.country || ""} onChange={handleChange} />
                ) : (
                  <p>{profileData.country}</p>
                )}
              </div>
              <div className="form-group">
                <label>State</label>
                {isEditing ? (
                  <input type="text" name="state" value={tempData.state || ""} onChange={handleChange} />
                ) : (
                  <p>{profileData.state}</p>
                )}
              </div>
             <div className="form-group">
                <label>City</label>
                {isEditing ? (
                  <input type="text" name="city" value={tempData.city || ""} onChange={handleChange} />
                ) : (
                  <p>{profileData.city}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={`profile-actions-bottom w-full flex ${profileData.role === 2 ? "justify-between":"justify-end"} mt-[2rem] pt-[1.5rem] border-t border-[#eee]`}>
          {/* <Link 
          // to="/dashboard/admin/home" 
           to={profileData.role === 1 ? "/dashboard/user/home" : "/dashboard/admin/home"}
          className="btn btn-tertiary"
          >
            Back to Dashboard
          </Link> */}
          {profileData.role === 2 && (
            <Link 
              to="/dashboard/admin/home"
              className="btn btn-tertiary"
            >
              Back to Dashboard
            </Link>
          )}

          <Link className="btn btn-primary" to="/auth/change-password?from=profile">
            Change Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;