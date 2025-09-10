import React, { useEffect, useMemo, useState } from "react";
import "../../styles/dashboard/Profile.css";
import { useDoctorApi } from "../../api/doctorApi";
import { useNavigate, useParams } from "react-router-dom";
// import { addDoctor } from "../../api/doctorApi";
import { showAlert } from "../../components/AlertComponent";

function AddDoctor() {
    const { id } = useParams();
    const defaultCountry = "India";

    const initialAddress = {
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: defaultCountry,
        pincode: "",
    };

    const [personalInfo, setPersonalInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone:" ",
        dateOfBirth: "",
        gender: "",
        qualification: "",
        specialization: "",
        occupation: "",
        professionalStatus: "experienced",
        totalExperienceYears: "",
        lastHospitalName: "",
        positionHeld: "",
    });

    const [currentAddress, setCurrentAddress] = useState({ ...initialAddress });
    const [workAddress, setWorkAddress] = useState({ ...initialAddress });
    const [permanentAddress, setPermanentAddress] = useState({ ...initialAddress });
    const [isPermanentSameAsCurrent, setIsPermanentSameAsCurrent] = useState(false);

    const [familyDetails, setFamilyDetails] = useState({
        fatherName: "",
        fatherContact: "",
        fatherOccupation: "",
        motherName: "",
        motherContact: "",
        motherOccupation: "",
    });

    const [emergencyContact, setEmergencyContact] = useState({
        contactName: "",
        relation: "",
        contactNumber: "",
    });

    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const genderOptions = [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
        // { value: "Prefer not to say", label: "Prefer not to say" },
    ];

    const relationOptions = [
        { value: "Spouse", label: "Spouse" },
        { value: "Parent", label: "Parent" },
        { value: "Sibling", label: "Sibling" },
        { value: "Other", label: "Other" },
    ];

    const stateOptions = useMemo(
        () => [
            "Andhra Pradesh",
            "Arunachal Pradesh",
            "Assam",
            "Bihar",
            "Chhattisgarh",
            "Goa",
            "Gujarat",
            "Haryana",
            "Himachal Pradesh",
            "Jharkhand",
            "Karnataka",
            "Kerala",
            "Madhya Pradesh",
            "Maharashtra",
            "Manipur",
            "Meghalaya",
            "Mizoram",
            "Nagaland",
            "Odisha",
            "Punjab",
            "Rajasthan",
            "Sikkim",
            "Tamil Nadu",
            "Telangana",
            "Tripura",
            "Uttar Pradesh",
            "Uttarakhand",
            "West Bengal",
            "Andaman and Nicobar Islands",
            "Chandigarh",
            "Dadra and Nagar Haveli and Daman and Diu",
            "Delhi",
            "Jammu and Kashmir",
            "Ladakh",
            "Lakshadweep",
            "Puducherry",
        ],
        []
    );

    const specializationOptions = [
        "Cardiology",
        "Dermatology",
        "Pediatrics",
        "Physiotherapy",
        "Orthopedics",
        "Neurology",
        "Gynecology",
        "General Medicine",
    ];
    const { addDoctor, getDoctorById, updateDoctor } = useDoctorApi();
    const navigate = useNavigate();

    useEffect(() => {
        if (isPermanentSameAsCurrent) {
            setPermanentAddress({ ...currentAddress });
        }
    }, [isPermanentSameAsCurrent, currentAddress]);

    const handlePersonalChange = (field, value) => {
        setPersonalInfo((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddressChange = (scope, field, value) => {
        const setters = {
            current: setCurrentAddress,
            work: setWorkAddress,
            permanent: setPermanentAddress,
        };
        setters[scope]((prev) => ({ ...prev, [field]: value }));
    };

    const handleFamilyChange = (field, value) => {
        setFamilyDetails((prev) => ({ ...prev, [field]: value }));
    };

    const handleEmergencyChange = (field, value) => {
        setEmergencyContact((prev) => ({ ...prev, [field]: value }));
    };

    const validateEmail = (value) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);
    const digitsOnly = (value) => value.replace(/[^0-9]/g, "");
    const validatePhone = (value) => {
        const numeric = digitsOnly(value);
        return numeric.length >= 10;
    };
    const validatePincode = (value) => digitsOnly(value).length === 6;

    const validateForm = () => {
        const errors = {};

        if (!personalInfo.firstName.trim()) errors.firstName = "First name is required";
        if (!personalInfo.lastName.trim()) errors.lastName = "Last name is required";
        if (!personalInfo.email.trim() || !validateEmail(personalInfo.email)) errors.email = "Valid email is required";
        if (!personalInfo.phone.trim() || !validatePhone(personalInfo.phone)) errors.phone = "Valid phone is required";
        if (!personalInfo.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
        if (!personalInfo.gender) errors.gender = "Gender is required";
        if (!personalInfo.qualification.trim()) errors.qualification = "Qualification is required";
        if (!personalInfo.specialization) errors.specialization = "Specialization is required";
        if (!personalInfo.occupation.trim()) errors.occupation = "Occupation is required";

        if (!currentAddress.addressLine1.trim()) errors.currentAddressLine1 = "Address line 1 is required";
        if (!currentAddress.city.trim()) errors.currentCity = "City is required";
        if (!currentAddress.state.trim()) errors.currentState = "State is required";
        if (!currentAddress.country.trim()) errors.currentCountry = "Country is required";
        if (!validatePincode(currentAddress.pincode)) errors.currentPincode = "Valid 6-digit pincode is required";

        if (personalInfo.professionalStatus === "experienced") {
            if (!personalInfo.totalExperienceYears) errors.totalExperienceYears = "Total years is required";
            if (!personalInfo.lastHospitalName.trim()) errors.lastHospitalName = "Last hospital/clinic is required";
            if (!personalInfo.positionHeld.trim()) errors.positionHeld = "Position held is required";

            if (!workAddress.addressLine1.trim()) errors.workAddressLine1 = "Work address line 1 is required";
            if (!workAddress.city.trim()) errors.workCity = "City is required";
            if (!workAddress.state.trim()) errors.workState = "State is required";
            if (!workAddress.country.trim()) errors.workCountry = "Country is required";
            if (!validatePincode(workAddress.pincode)) errors.workPincode = "Valid 6-digit pincode is required";
        }

        if (!emergencyContact.contactName.trim()) errors.emergencyName = "Contact name is required";
        if (!emergencyContact.relation.trim()) errors.emergencyRelation = "Relation is required";
        if (!validatePhone(emergencyContact.contactNumber)) errors.emergencyNumber = "Valid contact number is required";

        if (!isPermanentSameAsCurrent) {
            if (!permanentAddress.addressLine1.trim()) errors.permanentAddressLine1 = "Permanent address is required";
            if (!permanentAddress.city.trim()) errors.permanentCity = "Permanent city is required";
            if (!permanentAddress.state.trim()) errors.permanentState = "Permanent state is required";
            if (!permanentAddress.country.trim()) errors.permanentCountry = "Permanent country is required";
            if (!validatePincode(permanentAddress.pincode)) errors.permanentPincode = "Valid 6-digit pincode is required";
        }

        if (!familyDetails.fatherName.trim()) errors.fatherName = "Father's name is required";
        if (!validatePhone(familyDetails.fatherContact)) errors.fatherContact = "Valid father's contact is required";
        if (!familyDetails.fatherOccupation.trim()) errors.fatherOccupation = "Father's occupation is required";
        if (!familyDetails.motherName.trim()) errors.motherName = "Mother's name is required";
        if (!validatePhone(familyDetails.motherContact)) errors.motherContact = "Valid mother's contact is required";
        if (!familyDetails.motherOccupation.trim()) errors.motherOccupation = "Mother's occupation is required";

        return errors;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {

            setIsSubmitting(true);
            const errors = validateForm();
            setFormErrors(errors);
            if (Object.keys(errors).length > 0) {
                setIsSubmitting(false);
                return;
            }
            const payload = {
                firstname: personalInfo.firstName,
                lastname: personalInfo.lastName,
                email: personalInfo.email,
                countryCode: personalInfo.countryCode || "+91",
                phone: personalInfo.phone.trim(),
                dob: personalInfo.dateOfBirth,
                gender: personalInfo.gender,
                role: 3,
                address: currentAddress.addressLine1,
                city: currentAddress.city,
                state: currentAddress.state,
                country: currentAddress.country,
                pincode: currentAddress.pincode,

                professionalStatus: personalInfo.professionalStatus,
                qualification: personalInfo.qualification,
                specialization: personalInfo.specialization,
                occupation: personalInfo.occupation,

                workExperience: personalInfo.professionalStatus === "experienced" ? {
                    totalYears: personalInfo.totalExperienceYears,
                    lastHospital: personalInfo.lastHospitalName,
                    position: personalInfo.positionHeld,
                    workAddress: {
                        hospitalName: workAddress.addressLine1, // or add separate field
                        line1: workAddress.addressLine1,
                        line2: workAddress.addressLine2,
                        city: workAddress.city,
                        state: workAddress.state,
                        country: workAddress.country,
                        pincode: workAddress.pincode
                    }
                } : null,

                familyDetails: {
                    father: {
                        name: familyDetails.fatherName,
                        contact: familyDetails.fatherContact.trim(),
                        occupation: familyDetails.fatherOccupation
                    },
                    mother: {
                        name: familyDetails.motherName,
                        contact: familyDetails.motherContact.trim(),
                        occupation: familyDetails.motherOccupation
                    },
                    permanentAddress: {
                        line1: permanentAddress.addressLine1,
                        line2: permanentAddress.addressLine2,
                        city: permanentAddress.city,
                        state: permanentAddress.state,
                        country: permanentAddress.country,
                        pincode: permanentAddress.pincode
                    },
                    currentAddress: {
                        line1: currentAddress.addressLine1,
                        line2: currentAddress.addressLine2,
                        city: currentAddress.city,
                        state: currentAddress.state,
                        country: currentAddress.country,
                        pincode: currentAddress.pincode
                    },
                    sameAsPermanent: isPermanentSameAsCurrent,
                    emergencyContact: {
                        name: emergencyContact.contactName,
                        relation: emergencyContact.relation,
                        contact: emergencyContact.contactNumber.trim()
                    }
                }
            };
            let result;
            if (!id) {
                result = await addDoctor(payload);
                showAlert("Doctor Add Successfully!", "success")
            } else {
                result = await updateDoctor(id, payload);
                showAlert("Doctor Updated Successfully!","success")
                navigate(`/dashboard/admin/members`);
            }

            if (result?.success) {
                resetForm();
            }
            setIsSubmitting(false);
        } catch (err) {
            setIsSubmitting(false);
        }
    };
    const resetForm = () => {
        setPersonalInfo({
            firstName: "",
            lastName: "",
            email: "",
            countryCode: "+91",
            phone:"",
            dateOfBirth: "",
            gender: "",
            qualification: "",
            specialization: "",
            occupation: "",
            professionalStatus: "experienced",
            totalExperienceYears: "",
            lastHospitalName: "",
            positionHeld: "",
        });
        setCurrentAddress({ ...initialAddress });
        setWorkAddress({ ...initialAddress });
        setPermanentAddress({ ...initialAddress });
        setIsPermanentSameAsCurrent(false);
        setFamilyDetails({
            fatherName: "",
            fatherContact: "",
            fatherOccupation: "",
            motherName: "",
            motherContact: "",
            motherOccupation: "",
        });
        setEmergencyContact({
            contactName: "",
            relation: "",
            contactNumber: "",
        });
        setFormErrors({});
    };


    const sectionClass = "bg-white rounded-lg shadow-sm p-4 px-[40px] md:p-8";
    const labelClass = "block mb-[0.4rem] font-semibold text-[#495057] text-[0.9rem] text-left";
    const inputClass = "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus-primary";
    const selectClass = inputClass;
    const errorClass = "text-xs text-red-600 mt-1 text-left";

    useEffect(() => {
        if (id) {
            getDoctorById(id).then((data) => {
                // setFormData(data);  // prefill all fields
                console.log(data?.dob, ">>>data ")
                setPersonalInfo({
                    firstName: data?.firstname,
                    lastName: data?.lastname,
                    email: data?.email,
                    phone: data?.phone,
                    dateOfBirth: data?.dob,
                    gender: data?.gender,
                    qualification: data?.qualification,
                    specialization: data?.specialization,
                    occupation: data?.occupation,
                    professionalStatus: data?.professionalStatus,
                    totalExperienceYears: data?.workExperience?.totalYears,
                    lastHospitalName: data?.workExperience?.lastHospital,
                    positionHeld: data?.workExperience?.position
                })
                setCurrentAddress({

                    addressLine1: data?.familyDetails?.currentAddress?.line1,
                    city: data?.familyDetails?.currentAddress?.city,
                    state: data?.familyDetails?.currentAddress?.state,
                    country: data?.familyDetails?.currentAddress?.country,
                    pincode: data?.familyDetails?.currentAddress?.pincode

                })
                setWorkAddress({
                    addressLine1: data?.workExperience?.workAddress?.line1,
                    city: data?.workExperience?.workAddress?.city,
                    state: data?.workExperience?.workAddress?.state,
                    country: data?.workExperience?.workAddress?.country,
                    pincode: data?.workExperience?.workAddress?.pincode
                })
                setPermanentAddress({
                    addressLine1: data?.familyDetails?.permanentAddress?.line1,
                    city: data?.familyDetails?.permanentAddress?.city,
                    state: data?.familyDetails?.permanentAddress?.state,
                    country: data?.familyDetails?.permanentAddress?.country,
                    pincode: data?.familyDetails?.permanentAddress?.pincode
                })
                setIsPermanentSameAsCurrent(data?.familyDetails?.sameAsPermanent);
                setFamilyDetails({
                    fatherName: data?.familyDetails?.father?.name,
                    fatherContact: data?.familyDetails?.father?.contact,
                    fatherOccupation: data?.familyDetails?.father?.occupation,
                    motherName: data?.familyDetails?.mother?.name,
                    motherContact: data?.familyDetails?.mother?.contact,
                    motherOccupation: data?.familyDetails?.mother?.occupation
                })
                setEmergencyContact({
                    contactName: data?.familyDetails?.emergencyContact?.name,
                    relation: data?.familyDetails?.emergencyContact?.relation,
                    contactNumber: data?.familyDetails?.emergencyContact?.contact
                })
            });



        }

    }, [id]);

    return (
        <div style={{ height: "calc(100vh - 60px)", display: "flex", flexDirection: "column" }}>
            <span className='text-[1.8rem] text-[#1a6f8b] m-0 font-semibold flex justify-start pt-[20px] pb-[1rem] px-[20px] border-b border-[#eee] sticky top-0 z-10 bg-[#f5f7fa]' style={{ fontFamily: "'Arial', sans-serif" }}>
                {id ? "Edit Doctor":"Add Doctor"}
            </span>
            <form onSubmit={onSubmit} className="space-y-6 px-5 py-5" style={{ flex: 1, overflowY: "auto" }}>
                <section className={sectionClass}>
                    <h2 className="dashboard-section-title">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>First name<span className="text-red-500">*</span></label>
                            <input className={inputClass} type="text" value={personalInfo.firstName} onChange={(e) => handlePersonalChange("firstName", e.target.value)} />
                            {formErrors.firstName && <p className={errorClass}>{formErrors.firstName}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Last name<span className="text-red-500">*</span></label>
                            <input className={inputClass} type="text" value={personalInfo.lastName} onChange={(e) => handlePersonalChange("lastName", e.target.value)} />
                            {formErrors.lastName && <p className={errorClass}>{formErrors.lastName}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Email<span className="text-red-500">*</span></label>
                            <input className={inputClass} type="email" value={personalInfo.email} onChange={(e) => handlePersonalChange("email", e.target.value)} />
                            {formErrors.email && <p className={errorClass}>{formErrors.email}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Phone number (with country code)<span className="text-red-500">*</span></label>
                            {/* <input className={inputClass} type="tel"  placeholder="+91 9876543210" value={personalInfo.phone} onChange={(e) => handlePersonalChange("phone", e.target.value)} /> */}
                            <div className="flex gap-2">
                                {/* Country code dropdown */}
                                <select
                                    className={` rounded-md border border-gray-300 px-2 py-2 text-sm focus-primary w-20`}   // narrow width for country code
                                    value={personalInfo.countryCode}
                                    onChange={(e) => handlePersonalChange("countryCode", e.target.value)}
                                >
                                    <option value="+91">🇮🇳 +91</option>
                                    <option value="+1">🇺🇸 +1</option>
                                    <option value="+44">🇬🇧 +44</option>
                                    <option value="+61">🇦🇺 +61</option>
                                    <option value="+81">🇯🇵 +81</option>
                                    {/* Add more as needed */}
                                </select>

                                {/* Phone number input */}
                                <input
                                    className={`${inputClass} flex-1`}
                                    type="tel"

                                    placeholder="9876543210"
                                    value={personalInfo.phone}
                                    onChange={(e) => handlePersonalChange("phone", e.target.value)}
                                />
                            </div>
                            {formErrors.phone && <p className={errorClass}>{formErrors.phone}</p>}
                        </div>
                        <div>
                            <label className={labelClass}> Date of birth<span className="text-red-500">*</span></label>
                            <input className={inputClass} type="date"
                                value={personalInfo.dateOfBirth ? personalInfo.dateOfBirth.split("T")[0] : ""}
                                onChange={(e) => handlePersonalChange("dateOfBirth", e.target.value)} />
                            {formErrors.dateOfBirth && <p className={errorClass}>{formErrors.dateOfBirth}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Gender<span className="text-red-500">*</span></label>
                            <select className={selectClass} value={personalInfo.gender} onChange={(e) => handlePersonalChange("gender", e.target.value)}>
                                <option value="">Select gender</option>
                                {genderOptions.map((g) => (
                                    <option key={g.value} value={g.value}>{g.label}</option>
                                ))}
                            </select>
                            {formErrors.gender && <p className={errorClass}>{formErrors.gender}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Qualification<span className="text-red-500">*</span></label>
                            <input className={inputClass} type="text" placeholder="e.g., BPT, MPT" value={personalInfo.qualification} onChange={(e) => handlePersonalChange("qualification", e.target.value)} />
                            {formErrors.qualification && <p className={errorClass}>{formErrors.qualification}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Specialization<span className="text-red-500">*</span></label>
                            <select className={selectClass} value={personalInfo.specialization} onChange={(e) => handlePersonalChange("specialization", e.target.value)}>
                                <option value="">Select specialization</option>
                                {specializationOptions.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                            {formErrors.specialization && <p className={errorClass}>{formErrors.specialization}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClass}>Occupation<span className="text-red-500">*</span></label>
                            <input className={inputClass} type="text" value={personalInfo.occupation} onChange={(e) => handlePersonalChange("occupation", e.target.value)} />
                            {formErrors.occupation && <p className={errorClass}>{formErrors.occupation}</p>}
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className={labelClass}>Professional status<span className="text-red-500">*</span></p>
                        <div className="flex flex-wrap gap-4">
                            <label className="inline-flex items-center gap-2">
                                <input type="radio" className="h-4 w-4" name="professionalStatus" value="fresher" checked={personalInfo.professionalStatus === "fresher"} onChange={(e) => handlePersonalChange("professionalStatus", e.target.value)} />
                                <span className="text-sm text-gray-700">Fresher</span>
                            </label>
                            <label className="inline-flex items-center gap-2">
                                <input type="radio" className="h-4 w-4" name="professionalStatus" value="experienced" checked={personalInfo.professionalStatus === "experienced"} onChange={(e) => handlePersonalChange("professionalStatus", e.target.value)} />
                                <span className="text-sm text-gray-700">Experienced</span>
                            </label>
                        </div>
                    </div>
                </section>



                {personalInfo.professionalStatus === "experienced" && (
                    <section className={sectionClass}>
                        <h2 className="dashboard-section-title">Work Experience</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className={labelClass}>Total Years of Experience<span className="text-red-500">*</span></label>
                                <input className={inputClass} type="number" min={0} value={personalInfo.totalExperienceYears} onChange={(e) => handlePersonalChange("totalExperienceYears", e.target.value)} />
                                {formErrors.totalExperienceYears && <p className={errorClass}>{formErrors.totalExperienceYears}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Last Hospital/Clinic Name<span className="text-red-500">*</span></label>
                                <input className={inputClass} type="text" value={personalInfo.lastHospitalName} onChange={(e) => handlePersonalChange("lastHospitalName", e.target.value)} />
                                {formErrors.lastHospitalName && <p className={errorClass}>{formErrors.lastHospitalName}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClass}>Position Held<span className="text-red-500">*</span></label>
                                <input className={inputClass} type="text" placeholder="e.g., Physiotherapist" value={personalInfo.positionHeld} onChange={(e) => handlePersonalChange("positionHeld", e.target.value)} />
                                {formErrors.positionHeld && <p className={errorClass}>{formErrors.positionHeld}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className={labelClass}>Hospital/Clinic Address<span className="text-red-500">*</span></label>
                                <input className={inputClass} type="text" value={workAddress.addressLine1} onChange={(e) => handleAddressChange("work", "addressLine1", e.target.value)} />
                                {formErrors.workAddressLine1 && <p className={errorClass}>{formErrors.workAddressLine1}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full md:col-span-2">
                                <div>
                                    <label className={labelClass}>Country<span className="text-red-500">*</span></label>
                                    <select className={selectClass} value={workAddress.country} onChange={(e) => handleAddressChange("work", "country", e.target.value)}>
                                        <option value="India">India</option>
                                    </select>
                                    {formErrors.workCountry && <p className={errorClass}>{formErrors.workCountry}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>State<span className="text-red-500">*</span></label>
                                    <select className={selectClass} value={workAddress.state} onChange={(e) => handleAddressChange("work", "state", e.target.value)}>
                                        <option value="">Select state</option>
                                        {stateOptions.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    {formErrors.workState && <p className={errorClass}>{formErrors.workState}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>City<span className="text-red-500">*</span></label>
                                    <input className={inputClass} type="text" value={workAddress.city} onChange={(e) => handleAddressChange("work", "city", e.target.value)} />
                                    {formErrors.workCity && <p className={errorClass}>{formErrors.workCity}</p>}
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Pincode<span className="text-red-500">*</span></label>
                                <input className={inputClass} type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={workAddress.pincode} onChange={(e) => handleAddressChange("work", "pincode", digitsOnly(e.target.value))} />
                                {formErrors.workPincode && <p className={errorClass}>{formErrors.workPincode}</p>}
                            </div>
                        </div>
                    </section>
                )}
                <section className={sectionClass}>
                    <h2 className="dashboard-section-title">Current Address Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className={labelClass}>Address<span className="text-red-500">*</span></label>
                            <input className={inputClass} type="text" value={currentAddress.addressLine1} onChange={(e) => handleAddressChange("current", "addressLine1", e.target.value)} />
                            {formErrors.currentAddressLine1 && <p className={errorClass}>{formErrors.currentAddressLine1}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full md:col-span-2">
                            <div>
                                <label className={labelClass}>Country<span className="text-red-500">*</span></label>
                                <select className={selectClass} value={currentAddress.country} onChange={(e) => handleAddressChange("current", "country", e.target.value)}>
                                    <option value="India">India</option>
                                </select>
                                {formErrors.currentCountry && <p className={errorClass}>{formErrors.currentCountry}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>State<span className="text-red-500">*</span></label>
                                <select className={selectClass} value={currentAddress.state} onChange={(e) => handleAddressChange("current", "state", e.target.value)}>
                                    <option value="">Select state</option>
                                    {stateOptions.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                {formErrors.currentState && <p className={errorClass}>{formErrors.currentState}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>City<span className="text-red-500">*</span></label>
                                <input className={inputClass} type="text" value={currentAddress.city} onChange={(e) => handleAddressChange("current", "city", e.target.value)} />
                                {formErrors.currentCity && <p className={errorClass}>{formErrors.currentCity}</p>}
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Pincode<span className="text-red-500">*</span></label>
                            <input className={inputClass} type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={currentAddress.pincode} onChange={(e) => handleAddressChange("current", "pincode", digitsOnly(e.target.value))} />
                            {formErrors.currentPincode && <p className={errorClass}>{formErrors.currentPincode}</p>}
                        </div>
                    </div>
                </section>
                <section className={sectionClass}>
                    <h2 className="dashboard-section-title">Family Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* Father Name */}
                        <div>
                            <label className={labelClass}>Father’s name<span className="text-red-500">*</span></label>
                            <input
                                className={inputClass}
                                type="text"

                                pattern="^[A-Za-z\s]+$"   // only letters + spaces
                                value={familyDetails.fatherName}
                                onChange={(e) => handleFamilyChange("fatherName", e.target.value)}
                            />
                            {formErrors.fatherName && <p className={errorClass}>{formErrors.fatherName}</p>}
                        </div>

                        {/* Father Contact */}
                        <div>
                            <label className={labelClass}>Father’s contact number<span className="text-red-500">*</span></label>
                            <input
                                className={inputClass}
                                type="tel"

                                pattern="^\d{10}$"   // exactly 10 digits
                                value={familyDetails.fatherContact}
                                onChange={(e) => handleFamilyChange("fatherContact", e.target.value)}
                            />
                            {formErrors.fatherContact && <p className={errorClass}>{formErrors.fatherContact}</p>}
                        </div>

                        {/* Father Occupation */}
                        <div>
                            <label className={labelClass}>Father’s occupation<span className="text-red-500">*</span></label>
                            <input
                                className={inputClass}
                                type="text"

                                pattern="^[A-Za-z\s]+$"
                                value={familyDetails.fatherOccupation}
                                onChange={(e) => handleFamilyChange("fatherOccupation", e.target.value)}
                            />
                            {formErrors.fatherOccupation && <p className={errorClass}>{formErrors.fatherOccupation}</p>}
                        </div>

                        {/* Mother Name */}
                        <div>
                            <label className={labelClass}>Mother’s name<span className="text-red-500">*</span></label>
                            <input
                                className={inputClass}
                                type="text"

                                pattern="^[A-Za-z\s]+$"
                                value={familyDetails.motherName}
                                onChange={(e) => handleFamilyChange("motherName", e.target.value)}
                            />
                            {formErrors.motherName && <p className={errorClass}>{formErrors.motherName}</p>}
                        </div>

                        {/* Mother Contact */}
                        <div>
                            <label className={labelClass}>Mother’s contact number<span className="text-red-500">*</span></label>
                            <input
                                className={inputClass}
                                type="tel"

                                pattern="^\d{10}$"
                                value={familyDetails.motherContact}
                                onChange={(e) => handleFamilyChange("motherContact", e.target.value)}
                            />
                            {formErrors.motherContact && <p className={errorClass}>{formErrors.motherContact}</p>}
                        </div>

                        {/* Mother Occupation */}
                        <div>
                            <label className={labelClass}>Mother’s occupation<span className="text-red-500">*</span></label>
                            <input
                                className={inputClass}
                                type="text"

                                pattern="^[A-Za-z\s]+$"
                                value={familyDetails.motherOccupation}
                                onChange={(e) => handleFamilyChange("motherOccupation", e.target.value)}
                            />
                            {formErrors.motherOccupation && <p className={errorClass}>{formErrors.motherOccupation}</p>}
                        </div>
                    </div>
                </section>
                <section className={sectionClass}>
                    <h2 className="dashboard-section-title">Permanent Address</h2>
                    <div className="flex items-center gap-2 mb-4">
                        <input id="sameAddress" type="checkbox" className="h-4 w-4" checked={isPermanentSameAsCurrent} onChange={(e) => setIsPermanentSameAsCurrent(e.target.checked)} />
                        <label htmlFor="sameAddress" className="text-sm text-gray-700">Same as current address</label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className={labelClass}>Address<span className="text-red-500">*</span></label>
                            <input className={`${inputClass} disabled:cursor-not-allowed`} type="text" value={permanentAddress.addressLine1} onChange={(e) => handleAddressChange("permanent", "addressLine1", e.target.value)} disabled={isPermanentSameAsCurrent} />
                            {formErrors.permanentAddressLine1 && <p className={errorClass}>{formErrors.permanentAddressLine1}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full md:col-span-2">
                            <div>
                                <label className={labelClass}>Country<span className="text-red-500">*</span></label>
                                <select className={`${selectClass} disabled:cursor-not-allowed`} value={permanentAddress.country} onChange={(e) => handleAddressChange("permanent", "country", e.target.value)} disabled={isPermanentSameAsCurrent}>
                                    <option value="India">India</option>
                                </select>
                                {formErrors.permanentCountry && <p className={errorClass}>{formErrors.permanentCountry}</p>}
                            </div>

                            <div>
                                <label className={labelClass}>State<span className="text-red-500">*</span></label>
                                <select className={`${selectClass} disabled:cursor-not-allowed`} value={permanentAddress.state} onChange={(e) => handleAddressChange("permanent", "state", e.target.value)} disabled={isPermanentSameAsCurrent}>
                                    <option value="">Select state<span className="text-red-500">*</span></option>
                                    {stateOptions.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                {formErrors.permanentState && <p className={errorClass}>{formErrors.permanentState}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>City<span className="text-red-500">*</span></label>
                                <input className={`${inputClass} disabled:cursor-not-allowed`} type="text" value={permanentAddress.city} onChange={(e) => handleAddressChange("permanent", "city", e.target.value)} disabled={isPermanentSameAsCurrent} />
                                {formErrors.permanentCity && <p className={errorClass}>{formErrors.permanentCity}</p>}
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Pincode<span className="text-red-500">*</span></label>
                            <input className={`${inputClass} disabled:cursor-not-allowed`} type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={permanentAddress.pincode} onChange={(e) => handleAddressChange("permanent", "pincode", digitsOnly(e.target.value))} disabled={isPermanentSameAsCurrent} />
                            {formErrors.permanentPincode && <p className={errorClass}>{formErrors.permanentPincode}</p>}
                        </div>
                    </div>
                </section>

                <section className={sectionClass}>
                    <h2 className="dashboard-section-title">Emergency Contact</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className={labelClass}>Contact person name<span className="text-red-500">*</span></label>
                            <input className={inputClass} type="text" value={emergencyContact.contactName} onChange={(e) => handleEmergencyChange("contactName", e.target.value)} />
                            {formErrors.emergencyName && <p className={errorClass}>{formErrors.emergencyName}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Relation<span className="text-red-500">*</span></label>
                            <select className={selectClass} value={emergencyContact.relation} onChange={(e) => handleEmergencyChange("relation", e.target.value)}>
                                <option value="">Select relation</option>
                                {relationOptions.map((r) => (
                                    <option key={r.value} value={r.value}>{r.label}</option>
                                ))}
                            </select>
                            {formErrors.emergencyRelation && <p className={errorClass}>{formErrors.emergencyRelation}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Contact number<span className="text-red-500">*</span></label>
                            <input className={inputClass} type="tel" value={emergencyContact.contactNumber} onChange={(e) => handleEmergencyChange("contactNumber", e.target.value)} />
                            {formErrors.emergencyNumber && <p className={errorClass}>{formErrors.emergencyNumber}</p>}
                        </div>
                    </div>
                </section>

                <div className="flex justify-end gap-3">
                    <button type="button" className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 custom-button-secondary" onClick={resetForm}>Clear</button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 custom-button-primary" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Save Doctor"}</button>
                </div>
            </form>
        </div>
    );
}

export default AddDoctor;


