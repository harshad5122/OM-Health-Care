import React, { useEffect, useState } from "react";
import {
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Pagination,
    Select,
    MenuItem,
    IconButton,
    CircularProgress,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useDoctorApi } from "../../api/doctorApi";
import { useUserApi } from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';

// 🔹 Flatten object helper
const flattenObject = (obj, parentKey = "", res) => {
    if (!obj || typeof obj !== "object") return res; // guard

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const newKey = parentKey ? `${parentKey}.${key}` : key;

            if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
                flattenObject(obj[key], newKey, res); // recursive
            } else {
                res[newKey] = obj[key];
            }
        }
    }
    return res;
};


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
    const rowsPerPage = 10; // show 10 per page
    const [skip, setSkip] = useState(0)

    // paginate data
    // const paginatedRows = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    // 🔹 Fetch staff data
    const fetchStaff = async (skip) => {
        try {
            setLoading(true);
            const data = await getDoctor({ skip, limit: rowsPerPage, search }); // API response
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

    const fetchUser = async (skip) => {
        try {
            setLoading(true);
            const data = await getUserList({ skip, limit: rowsPerPage, search }); // API response
            setUserData(data?.rows);
            setTotalCounts(data?.total_count)
        } catch (err) {
            console.error("Error fetching user:", err);
        } finally {
            setLoading(false);
        }
    }

    // 🔹 Dummy user data (can be replaced by API)
    // useEffect(() => {
    //     const rawUsers = [
    //         { id: 1, name: "Alice Johnson", email: "alice@example.com" },
    //         { id: 2, name: "Bob Williams", email: "bob@example.com" },
    //     ];
    //     const flattened = rawUsers?.map((u) => flattenObject(u));
    //     setUserData(flattened);
    // }, []);

    // 🔹 Decide which dataset to use
    const rows = activeTab === "staff" ? staffData : userData;

    // 🔹 Recompute columns whenever rows change


    // 🔹 Search filter
    // const filteredRows = rows?.filter((row) =>
    //     Object.values(row)?.some((val) =>
    //         String(val)?.toLowerCase()?.includes(search?.toLowerCase())
    //     )
    // );

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
        rows.forEach((row) => {
            Object.keys(row).forEach((key) => {
                if (key !== "_id") {   // 🚫 exclude _id
                    allKeys.add(key);
                }
            });
        });
        setColumns(Array.from(allKeys));
    }, [rows]);

    return (
        <div className="p-6">
            {/* Top Controls */}
            <div className="flex justify-between items-center mb-4 space-x-4">
                {/* Tabs */}
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


                {/* Search + Dropdown */}
                <div className="flex space-x-2 items-center">
                    <div className="flex items-center min-w-[250px] rounded-md border border-gray-300 overflow-hidden">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="Search..."
                            className="flex-grow px-3 py-2  outline-none"
                        />

                        {/* Search button */}
                        <button
                            onClick={handleSearch}
                            className="bg-[#1a6f8b] hover:bg-[#155d73] text-white px-3 py-2"
                        >
                            <SearchIcon />
                        </button>
                    </div>
                    <Select
                        size="small"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <MenuItem value="thisMonth">This Month</MenuItem>
                        <MenuItem value="lastMonth">Last Month</MenuItem>
                        <MenuItem value="thisWeek">This Week</MenuItem>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <CircularProgress />
                    </div>
                ) : (
                    <TableContainer component={Paper} sx={{ maxHeight: '75vh' }}>
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell className="custom-th ">#</TableCell> {/* ✅ index column */}
                                    {columns.map((col) => (
                                        <TableCell key={col} className="custom-th ">{col}</TableCell>
                                    ))}
                                    <TableCell className="custom-th ">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="custom-cell">{idx + 1}</TableCell>
                                        {columns.map((col) => (
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

            {/* Pagination */}
            <div className="flex justify-end mt-4">
                <Pagination
                    count={Math.ceil(totalCounts / rowsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    color="primary"
                />
            </div>
        </div>
    );
}

export default Members;
