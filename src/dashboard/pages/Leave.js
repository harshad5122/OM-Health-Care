import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Edit, Delete } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { showAlert } from "../../components/AlertComponent";
import { useLeaveApi } from "../../api/leaveApi";
import ReusableModal from "../../components/ReusableModal"
import {
    CircularProgress,
    Tooltip
} from "@mui/material";

function Leave(isDrawerOpen) {
    const { createLeave, getLeaveById,deleteLeave,editLeave} = useLeaveApi();
    const { user } = useAuth();
    const [leaveData, setLeaveData] = React.useState({
        startDate: null,
        endDate: null,
        reason: "",
        leave_type: "",
    });
    const [leaveByIdData, setLeaveByIdData] = React.useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [isEditMode, setIsEditMode] = React.useState(false);
    const [editId, setEditId] = React.useState(null);
    const [deleteId, setDeleteId] = React.useState(null);
    const columns = ["Start Date", "End Date", "Leave Type","Reason", "Status"];
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-GB");
    };

    const handleChange = (key, value) => {
        setLeaveData((prev) => ({ ...prev, [key]: value }));
    };

    const fetchLeaveById = async () => {
        if (!user?.staff_id) return;
        setLoading(true); 
        try {
            const result = await getLeaveById(user.staff_id);
            setLeaveByIdData(result);
        } catch (error) {
            console.log("Error fetching leave by ID:", error);
        }
        finally {
            setLoading(false); 
        }
    };


    const handleApplyLeave = async () => {
        const payload = {
            staff_id: user?.staff_id || "",
            staff_name: `${user?.firstname || ""} ${user?.lastname || ""}`.trim(),
            start_date: leaveData.startDate
                ? dayjs(leaveData.startDate).format("YYYY-MM-DD")
                : "",
            end_date: leaveData.endDate
                ? dayjs(leaveData.endDate).format("YYYY-MM-DD")
                : "",
            leave_type: leaveData.leave_type,
            reason: leaveData.reason,
        };

        try {
            await createLeave(payload);

            setLeaveData({
                startDate: null,
                endDate: null,
                reason: "",
                leave_type: "",
            });
            fetchLeaveById();
            showAlert("Leave Created Successfully", "success")
        } catch (err) {
            console.log("Failed to apply leave:", err);
            showAlert("Something went wrong", "error")
        }
    };
    // const handleUpdateLeave = async () => {
    //     console.log("UPDATELEAVE")
    // };
    const handleUpdateLeave = async () => {
        if (!editId) return;

        const payload = {
            start_date: leaveData.startDate
                ? dayjs(leaveData.startDate).format("YYYY-MM-DD")
                : "",
            end_date: leaveData.endDate
                ? dayjs(leaveData.endDate).format("YYYY-MM-DD")
                : "",
            leave_type: leaveData.leave_type,
            reason: leaveData.reason,
        };

        try {
            await editLeave(editId, payload); // call your API

            showAlert("Leave updated successfully", "success");

            // Reset form and exit edit mode
            setLeaveData({
                startDate: null,
                endDate: null,
                reason: "",
                leave_type: "",
            });
            setIsEditMode(false);
            setEditId(null);

            // Refresh the leave table
            fetchLeaveById();
        } catch (err) {
            console.log("Failed to update leave:", err);
            showAlert("Failed to update leave", "error");
        }
    };

    const handleDeleteLeave = async () => {
        if (!deleteId) return;
        try {
            await deleteLeave(deleteId); 
            showAlert("Leave cancelled successfully", "success");
            setIsDeleteModalOpen(false);
            setDeleteId(null);
            fetchLeaveById(); 
        } catch (error) {
            console.log("Error deleting leave:", error);
            showAlert("Failed to delete leave", "error");
        }
    };


    React.useEffect(() => {
        fetchLeaveById();
    }, [user?._id]);

    return (
        <div id="dashboard-container" className={isDrawerOpen ? 'drawer-open' : 'drawer-closed'}
            style={{ height: "calc(100vh - 60px)", display: "flex", flexDirection: "column" }}
        >
            {isDeleteModalOpen &&
                <ReusableModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false)
                    }}
                    title={"Cancle Leave ?"}
                >
                    <div className='px-2 pt-1 flex flex-col'>
                        <span>
                            Are you sure you want to cancel this leave?
                        </span>

                        <div className='flex gap-2 justify-end mt-3'>
                            <button
                                className={`px-4 py-1 rounded text-white transition bg-[#1a6f8b] hover:bg-[#15596e]`}
                                onClick={handleDeleteLeave}
                            >
                                Yes
                            </button>
                            <button className="bg-[#1a6f8b] text-white px-4 py-1 rounded hover:bg-[#15596e] transition"
                                onClick={() => {
                                    setIsDeleteModalOpen(false)
                                }}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </ReusableModal>
            }
            <span className='text-[1.8rem] text-[#1a6f8b] m-0 font-semibold flex justify-start pt-[20px] pb-[1rem] px-[20px] border-b border-[#eee] sticky top-0 z-10 bg-[#f5f7fa]' style={{ fontFamily: "'Arial', sans-serif" }}>
                Leave Management
            </span>
            <div className="px-4 flex flex-col gap-2 py-2 items-center flex-shrink-0">
                <span className="border border-[#f0f0f0] rounded bg-[#fcfcfc] px-4 py-2 flex flex-col gap-2 w-full">
                    <p className='text-left text-[15px] font-semibold text-[#1a6f8b] border-b border-[#f0f0f0] pb-1'>Apply Leave</p>
                    <span className="flex gap-4 items-center pt-2 pb-1">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div className="flex gap-4 items-center">
                                <span className="flex flex-col">
                                    <label className="text-sm text-gray-600 mb-1 text-left font-semibold">
                                       Start Date
                                    </label>
                                    <div className="flex gap-2 leave-calendar">
                                        <DatePicker
                                            value={leaveData.startDate}
                                            onChange={(val) => handleChange("startDate", val)}
                                            slotProps={{ textField: { size: "small" } }}
                                            format="DD/MM/YYYY"
                                        />
                                    </div>
                                </span>
                                <span className="flex flex-col leave-calendar">
                                    <label className="text-sm text-gray-600 mb-1 text-left font-semibold">
                                       End Date
                                    </label>
                                    <div className="flex gap-2">
                                        <DatePicker
                                            value={leaveData.endDate}
                                            onChange={(val) => handleChange("endDate", val)}
                                            slotProps={{ textField: { size: "small" } }}
                                            format="DD/MM/YYYY"
                                        />
                                    </div>
                                </span>
                            </div>
                        </LocalizationProvider>
                        <span className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1 text-left font-semibold">
                                Leave Type
                            </label>
                            <select
                                className="border border-gray-300 rounded px-1 py-1.5 focus:outline-none text-[14px] text-gray-600 cursor-pointer"
                                value={leaveData.leave_type}
                                onChange={(e) => handleChange("leave_type", e.target.value)}
                            >
                                <option value="" disabled>
                                    Select leave type
                                </option>
                                <option value="FULL_DAY">Full Day</option>
                                <option value="FIRST_HALF">First Half</option>
                                <option value="SECOND_HALF">Second Half</option>
                            </select>
                        </span>

                    </span>
                    <span className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 text-left">
                            Reason for Leave
                        </span>
                        <textarea
                            className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none text-[14px]"
                            rows="4"
                            placeholder="Enter your reason..."
                            value={leaveData.reason}
                            onChange={(e) => handleChange("reason", e.target.value)}
                        />
                    </span>
                    <span className="flex gap-2 justify-end my-2">
                        <button
                            // onClick={handleApplyLeave}
                            onClick={isEditMode ? handleUpdateLeave : handleApplyLeave}
                            className="bg-[#1a6f8b] text-white px-4 py-1.5 rounded hover:bg-[#15596e] transition"
                        >
                            {isEditMode ? "Update Leave" : "Apply Leave"}
                        </button>
                        <button
                            onClick={() =>{
                                setLeaveData({
                                    startDate: null,
                                    endDate: null,
                                    reason: "",
                                    leave_type: "",
                                })
                                setIsEditMode(false); 
                                setEditId(null);
                            }}
                            className="bg-[#1a6f8b] text-white px-4 py-1.5 rounded hover:bg-[#15596e] transition"
                        >
                            Cancel
                        </button>
                    </span>

                </span>
            </div>
            <div className="px-4 flex-1 py-2 overflow-hidden">
                <div className="border border-[#f0f0f0] rounded bg-[#fcfcfc] w-full h-full flex flex-col px-4 py-2">
                    <p className='text-left text-[15px] font-semibold text-[#1a6f8b] border-b border-[#f0f0f0] pb-1'>
                        Leave Records
                    </p>
                    <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-full w-full">
                            <CircularProgress size={30} />
                        </div>
                    ) : (
                        <table className="min-w-full border-collapse">
                            <thead className="sticky top-0 bg-[#f5f7fa] z-10">
                                <tr className="border border-gray-200b">
                                    {columns.map((col, index) => (
                                        <th
                                            key={index}
                                            className="px-4 py-2 text-sm font-semibold text-gray-700 text-left"
                                        >
                                            {col}
                                        </th>
                                    ))}
                                    <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaveByIdData?.length > 0 ? (
                                    leaveByIdData.map((leave, index) => (
                                        <tr key={leave._id} className="border border-gray-200 text-left">
                                            <td className="px-4 py-2 text-sm">
                                                {formatDate(leave.start_date)}{" "}
                                            </td>
                                            <td className="px-4 py-2 text-sm">
                                                {formatDate(leave.end_date)}{" "}
                                            </td>
                                            <td className="px-4 py-2 text-sm">
                                                 {leave.leave_type}
                                            </td>
                                            <td className="px-4 py-2 text-sm max-w-[250px] truncate" title={leave.reason}>
                                                {leave.reason}
                                            </td>
                                            <td className="px-4 py-2 text-sm">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-medium
                                                        ${leave.status === "PENDING"
                                                            ? "bg-green-100 text-green-700"
                                                            : leave.status === "CONFIRMED"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : leave.status === "CANCELLED"
                                                                    ? "bg-red-100 text-red-700"
                                                                    : "bg-gray-100 text-gray-700"
                                                        }`}
                                                >
                                                    {leave.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 flex gap-3">
                                                <span>
                                                    <Tooltip
                                                        title={
                                                            leave.status === "CONFIRMED" || leave.status === "CANCELLED"
                                                                ? "Cannot edit once status is confirmed or cancelled"
                                                                : "Edit leave"
                                                        }
                                                    >
                                                        <Edit 
                                                            className={`${leave.status === "CONFIRMED" || leave.status === "CANCELLED" ? "text-gray-400 cursor-not-allowed" : "text-blue-500 cursor-pointer"}`}
                                                            sx={{ fontSize: "18px" }} 
                                                            onClick={() => {
                                                                if (leave.status === "CONFIRMED" || leave.status === "CANCELLED") return;
                                                                setIsEditMode(true);
                                                                setEditId(leave._id);
                                                                setLeaveData({
                                                                startDate: dayjs(leave.start_date),
                                                                endDate: dayjs(leave.end_date),
                                                                reason: leave.reason,
                                                                leave_type: leave.leave_type,
                                                                });
                                                            }}
                                                        />
                                                    </Tooltip>
                                                </span>
                                                <Delete
                                                    className="text-red-500 cursor-pointer"
                                                    sx={{ fontSize: "18px" }}
                                                    onClick={() => {
                                                        setDeleteId(leave._id); 
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={columns.length + 1}
                                            className="text-center text-gray-500 text-sm py-4"
                                        >
                                            No leave records available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Leave;