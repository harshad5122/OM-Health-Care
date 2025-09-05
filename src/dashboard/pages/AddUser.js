import React, { useState } from "react";
import "../../styles/dashboard/Profile.css";
import { useUserApi } from "../../api/userApi";
// import { addUser } from "../../api/userApi"; // <-- you'll create this API function

function AddUser() {

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        countryCode: "+91",
        phone: "",
        email: "",
        // password: "",
        address: "",
        country: "India",
        state: "",
        city: "",
        gender: "",
        dob: "",
    });

    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { createUser } = useUserApi();

    const genderOptions = [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
    ];

    const stateOptions = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
        "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
        "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
        "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
        "West Bengal", "Delhi"
    ];

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };
    const validateEmail = (value) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);
    const digitsOnly = (value) => value.replace(/[^0-9]/g, "");
    const validatePhone = (value) => {
        const numeric = digitsOnly(value);
        return numeric.length >= 10;
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.firstname.trim()) errors.firstname = "First name is required";
        if (!formData.lastname.trim()) errors.lastname = "Last name is required";
        // if (!formData.email.trim()) errors.email = "Email is required";
        // // if (!formData.password.trim()) errors.password = "Password is required";
        // if (!formData.phone.trim()) errors.phone = "Phone number is required";
        if (!formData.email.trim() || !validateEmail(formData.email)) errors.email = "Valid email is required";
        if (!formData.phone.trim() || !validatePhone(formData.phone)) errors.phone = "Valid phone is required";

        if (!formData.address.trim()) errors.address = "Address is required";
        if (!formData.state.trim()) errors.state = "State is required";
        if (!formData.city.trim()) errors.city = "City is required";
        if (!formData.gender.trim()) errors.gender = "Gender is required";
        if (!formData.dob.trim()) errors.dob = "Date of birth is required";
        return errors;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const errors = validateForm();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            setIsSubmitting(false);
            return;
        }

        try {
            console.log(formData, ">>> form data >>>")

            const result = await createUser(formData);

            if (result?.success) {
                resetForm();
            }
        } catch (err) {
            console.error("Error adding user:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            firstname: "",
            lastname: "",
            countryCode: "+91",
            phone: "",
            email: "",
            // password: "",
            address: "",
            country: "India",
            state: "",
            city: "",
            gender: "",
            dob: "",
        });
        setFormErrors({});
    };

    const sectionClass = "bg-white rounded-lg shadow-sm p-4 px-[40px] md:p-8";
    const labelClass = "block mb-[0.4rem] font-semibold text-[#495057] text-[0.9rem] text-left";
    const inputClass = "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus-primary";
    const selectClass = inputClass;
    const errorClass = "text-xs text-red-600 mt-1 text-left";

    return (
        <div style={{ height: "calc(100vh - 60px)",display:"flex",flexDirection:"column"}}>
            <span className='text-[1.8rem] text-[#1a6f8b] m-0 font-semibold flex justify-start pt-[20px] pb-[1rem] px-[20px] border-b border-[#eee] sticky top-0 z-10 bg-[#f5f7fa]' style={{ fontFamily: "'Arial', sans-serif" }}>
                Add User
            </span>
            <form onSubmit={onSubmit} className="space-y-6 px-5 py-5" style={{ flex: 1, overflowY: "auto" }}>
                <section className={sectionClass}>
                    <h2 className="dashboard-section-title">Add User</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>First name *</label>
                            <input className={inputClass} type="text" value={formData.firstname} onChange={(e) => handleChange("firstname", e.target.value)} />
                            {formErrors.firstname && <p className={errorClass}>{formErrors.firstname}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Last name *</label>
                            <input className={inputClass} type="text" value={formData.lastname} onChange={(e) => handleChange("lastname", e.target.value)} />
                            {formErrors.lastname && <p className={errorClass}>{formErrors.lastname}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Email *</label>
                            <input className={inputClass} type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
                            {formErrors.email && <p className={errorClass}>{formErrors.email}</p>}
                        </div>
                        {/* <div>
                            <label className={labelClass}>Password *</label>
                            <input className={inputClass} type="password" value={formData.password} onChange={(e) => handleChange("password", e.target.value)} />
                            {formErrors.password && <p className={errorClass}>{formErrors.password}</p>}
                        </div> */}
                        <div>
                            <label className={labelClass}>Gender *</label>
                            <select className={selectClass} value={formData.gender} onChange={(e) => handleChange("gender", e.target.value)}>
                                <option value="">Select gender</option>
                                {genderOptions.map((g) => (
                                    <option key={g.value} value={g.value}>{g.label}</option>
                                ))}
                            </select>
                            {formErrors.gender && <p className={errorClass}>{formErrors.gender}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Phone *</label>
                            <div className="flex gap-2">
                                <select
                                    className="rounded-md border border-gray-300 px-2 py-2 text-sm w-20"
                                    value={formData.countryCode}
                                    onChange={(e) => handleChange("countryCode", e.target.value)}
                                >
                                    <option value="+91">🇮🇳 +91</option>
                                    <option value="+1">🇺🇸 +1</option>
                                </select>
                                <input
                                    className={`${inputClass} flex-1`}
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                    placeholder="9876543210"
                                />
                            </div>
                            {formErrors.phone && <p className={errorClass}>{formErrors.phone}</p>}
                        </div>

                        {/* DOB */}
                        <div>
                            <label className={labelClass}>Date of Birth *</label>
                            <input
                                className={inputClass}
                                type="date"
                                value={formData.dob}
                                onChange={(e) => handleChange("dob", e.target.value)}
                            />
                            {formErrors.dob && <p className={errorClass}>{formErrors.dob}</p>}
                        </div>


                        <div className="md:col-span-2">
                            <label className={labelClass}>Address *</label>
                            <input className={inputClass} type="text" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} />
                            {formErrors.address && <p className={errorClass}>{formErrors.address}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full md:col-span-2">
                            <span>
                                <label className={labelClass}>Country *</label>
                                <select
                                    className={selectClass}
                                    value={formData.country}
                                    onChange={(e) => handleChange("country", e.target.value)}
                                >
                                    <option value="">Select country</option>
                                    <option value="India">India</option>
                                    <option value="United States">United States</option>
                                    <option value="Canada">Canada</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="Australia">Australia</option>
                                    <option value="Germany">Germany</option>
                                    <option value="France">France</option>
                                    <option value="Singapore">Singapore</option>
                                    {/* Add more countries as needed */}
                                </select>
                                {formErrors.country && <p className={errorClass}>{formErrors.country}</p>}
                            </span>
                            <span>
                                <label className={labelClass}>State *</label>
                                <select className={selectClass} value={formData.state} onChange={(e) => handleChange("state", e.target.value)}>
                                    <option value="">Select state</option>
                                    {stateOptions.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                {formErrors.state && <p className={errorClass}>{formErrors.state}</p>}
                            </span>
                            <span>
                                <label className={labelClass}>City *</label>
                                <input className={inputClass} type="text" value={formData.city} onChange={(e) => handleChange("city", e.target.value)} />
                                {formErrors.city && <p className={errorClass}>{formErrors.city}</p>}
                            </span>
                        </div>

                    </div>
                </section>

                <div className="flex justify-end gap-3">
                    <button type="button" className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 custom-button-secondary" onClick={resetForm}>Clear</button>
                    <button type="submit" className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 custom-button-primary" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Save User"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddUser;
