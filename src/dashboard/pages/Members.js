import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Pagination,
    IconButton,
    CircularProgress,
    Stack
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useDoctorApi } from "../../api/doctorApi";
import { useUserApi } from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import Filter from "../../components/Filter";
import dayjs from "dayjs";


function Members() {
    const [activeTab, setActiveTab] = useState("staff");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("thisMonth");
    const [page, setPage] = useState(1);
    const [staffData, setStaffData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(false); // 🔹 loading state
    const [totalCounts, setTotalCounts] = useState(0);
    const { getDoctor } = useDoctorApi();
    const { getUserList } = useUserApi();
    const navigate = useNavigate();
    const rowsPerPage = 100; // show 10 per page
    const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
    const [toDate, setToDate] = useState(dayjs().endOf("month"));
    
   
    const fetchStaff = async (skip,from = fromDate, to = toDate) => {
        try {
            setLoading(true);
            const data = await getDoctor({ skip, limit: rowsPerPage, search, from_date: from ? dayjs(from).format("YYYY-MM-DD") : "",
            to_date: to ? dayjs(to).format("YYYY-MM-DD") : "",}); 
            setStaffData(data?.rows);
            setTotalCounts(data?.total_count)

        } catch (err) {
            console.error("Error fetching staff:", err);
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    };

    const fetchUser = async (skip,from = fromDate, to = toDate) => {
        try {
            setLoading(true);
            const data = await getUserList({ skip, limit: rowsPerPage, search , from_date: from ? dayjs(from).format("YYYY-MM-DD") : "",
            to_date: to ? dayjs(to).format("YYYY-MM-DD") : "",});
            setUserData(data?.rows);
            setTotalCounts(data?.total_count)
        } catch (err) {
            console.error("Error fetching user:", err);
        } finally {
            setLoading(false);
        }
    }

    const rows = activeTab === "staff" ? staffData : userData;

    const handleChangePage = (event, value) => {
        setPage(value);
        const skip = (value - 1) * rowsPerPage
        if (activeTab === "staff") {
            fetchStaff(skip);
        }
        if (activeTab === "user") {
            fetchUser(skip);
        }
    };
    const handleSearch = () => {
        // setPage(value);
        const skip = (page - 1) * rowsPerPage
        if (activeTab === "staff") {
            fetchStaff(skip);
        }
        if (activeTab === "user") {
            fetchUser(skip);
        }
    }
    const handleEdit = (row, type) => {
        // Navigate to the add-doctor page with query param or route param
        if (activeTab === "staff") {
            navigate(`/dashboard/admin/add-doctor/${row._id}`);
        } else {
            navigate(`/dashboard/admin/add-user/${row._id}`);
        }
    };

    // 🔹 Fetch staff when switching to staff tab
    useEffect(() => {
        if (activeTab === "staff") {
            fetchStaff(0);
            setPage(1)
        }
        if (activeTab === "user") {
            fetchUser(0);
            setPage(1)
        }
    }, [activeTab]);

    useEffect(() => {
        const allKeys = new Set();
        rows?.forEach((row) => {
            Object.keys(row)?.forEach((key) => {
                if (key !== "_id") {   // 🚫 exclude _id
                    allKeys.add(key);
                }
            });
        });
        setColumns(Array.from(allKeys));
    }, [rows]);
    const handleSearchButton = () => {
        setPage(1);
        const skip = 0; 

        if (activeTab === "staff") {
            fetchStaff(skip);
        }

        if (activeTab === "user") {
            fetchUser(skip);
        }
    };
    const handleClearButton = () => {
        const start = dayjs().startOf("month");
        const end = dayjs().endOf("month");

        setFilter("thisMonth");
        setFromDate(start);
        setToDate(end);
        setPage(1);

        const skip = 0;
        if (activeTab === "staff") {
            fetchStaff(skip, start, end);
        }
        if (activeTab === "user") {
            fetchUser(skip, start, end);
        }
    };


    return (
        <div className="px-6 pt-6 pb-3">
           
            <div className="flex justify-between items-center mb-4 space-x-4">
              
                <div className="inline-flex  rounded-lg overflow-hidden">
                    <button
                        className={`px-4 py-2 font-medium transition-colors duration-200
                            ${activeTab === "staff"
                                ? "bg-[#1a6f8b] text-white border-[#1a6f8b]"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-400"
                            } rounded-l-md border`}
                        onClick={() => setActiveTab("staff")}
                    >
                        Staff
                    </button>

                    <button
                        className={`px-4 py-2 font-medium transition-colors duration-200
                            ${activeTab === "user"
                                ? "bg-[#1a6f8b] text-white border-[#1a6f8b]"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-400"
                            } rounded-r-md border`}
                        onClick={() => setActiveTab("user")}
                    >
                        User
                    </button>
                </div>

                <Filter
                    search={search}
                    setSearch={setSearch}
                    filter={filter}
                    setFilter={setFilter}
                    handleSearch={handleSearch}
                    fromDate={fromDate}
                    setFromDate={setFromDate}
                    toDate={toDate}
                    setToDate={setToDate}
                    handleSearchButton={handleSearchButton}
                    handleClearButton={handleClearButton}
                />
            </div>
            <div className="overflow-x-auto h-[75vh]">
                {loading ? (
                <div className="flex justify-center items-center h-full">
                    <Stack sx={{ color: '#1a6f8b' }}>
                        <CircularProgress color="inherit" size="40px" />
                    </Stack>
                </div>
                ) : (
                    <TableContainer component={Paper} sx={{ maxHeight: '74vh' }}>

                        <Table size="small" stickyHeader className="border-l border-r border-[#e0e0e0]">
                            <TableHead>
                                <TableRow>
                                    <TableCell className="custom-th ">#</TableCell> {/* ✅ index column */}
                                    {columns?.map((col) => (
                                        <TableCell key={col} className="custom-th ">{col}</TableCell>
                                    ))}
                                    <TableCell className="custom-th ">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows?.map((row, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="custom-cell">{idx + 1}</TableCell>
                                        {columns?.map((col) => (
                                            <TableCell key={col} className="custom-cell">
                                                {row[col] !== undefined ? String(row[col]) : "-"}
                                            </TableCell>
                                        ))}
                                        <TableCell className="custom-cell">
                                            <IconButton color="primary" size="small" onClick={() => handleEdit(row, activeTab)}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                            <IconButton color="error" size="small" onClick={() => handleEdit(row, activeTab)}>
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>)}
            </div>

            <div className="flex justify-end mt-1">
                <Pagination
                    count={Math.ceil(totalCounts / rowsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    color="primary"
                    className="member-pagination"
                />
            </div>
        </div>
    );
}

export default Members;
