"use client"
import { React, useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';
import View from './view';

function UserAction() {
    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState([]);
    const [view, setView] = useState(false);
    const [search, setSearch] = useState(""); // search state

    const fetchUsers = async () => {
        try {
            const request = await axios.request("/api/admin/users");
            setData(request.data);
        } catch (error) {
            toast.error(error.message || "Failed to fetch users");
        }
    };

    useEffect(() => {
        fetchUsers();
        setSelectedData([]);
    }, []);

    // filter data by username or email
    const filteredData = data.filter(
        (item) =>
            item.username.toLowerCase().includes(search.toLowerCase()) ||
            item.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            {!view && (
                <>
                    {/* Search bar */}
                    <div className="mb-3">
                        <input
                            type="text"
                            placeholder="Search by username or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border px-3 py-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                        />
                    </div>

                    <table className='table table-bordered table-striped w-full'>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Balance</th>
                                <th>Access</th>
                                <th>Refunds</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index}</td>
                                        <td>{item.username}</td>
                                        <td>{item.email}</td>
                                        <td>{item.balance}</td>
                                        <td>
                                            {item.access === 'yes' ?
                                                <span className='text-green-500'>{item.access}</span> :
                                                <span className='text-red-500'>{item.access}</span>}
                                        </td>
                                        <td>{item.refund || 0}</td>
                                        <td>
                                            <button
                                                className='btns btn-sm btn-danger text-xs rounded-md'
                                                onClick={() => { setView(true); setSelectedData(item) }}
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center text-gray-500">No users found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </>
            )}

            {view && (
                <View data={selectedData} />
            )}
        </div>
    );
}

export default UserAction;
