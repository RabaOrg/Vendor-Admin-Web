import React, { useState } from 'react';
import { FaEye, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import Button from '../../../components/shared/button';
import { Link, useParams } from 'react-router-dom';
import { useFetchBusinessCustomerDetails, useFetchCustomer } from '../../../hooks/queries/customer';
import { useNavigate } from 'react-router-dom';

function Customer() {
    const perPage = 20;
    const { id } = useParams()
    const [page, setPage] = useState(1);
    const navigate = useNavigate()
    const [search, setSearch] = useState("");

    const { data: customerData, isPending, isError } = useFetchCustomer(page, perPage, search);


    console.log(customerData)

    const totalCustomers = Array.isArray(customerData) ? customerData.length : 0;
    const totalPages = Math.ceil(totalCustomers / perPage);
    const handleViewCustomer = (id) => {
        navigate(`/view_details/${id}`)
    }

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };
    const handleCustomer = (id) => {
        navigate(`/customer-details/${id}`);
    }
    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    return (
        <div className="px-6">

            <div className="inline-block min-w-full rounded-lg overflow-hidden">
                <div className="flex justify-between flex-col md:flex-row w-full gap-4 py-6">
                    <h1 className="text-3xl font-semibold text-black mb-4 md:mb-0">Customer</h1>

                    {/* <div className="relative w-full md:w-[700px]">
                        <input
                            type="text"
                            name='search'
                            placeholder="Search customer name"
                            value={search}
                            onChange={handleSearch}
                            className="w-full px-3 py-2 pl-8 mt-1 text-xs font-[400] text-[#202224] rounded-full bg-white border border-gray-300 focus:ring-2 focus:ring-green-600 focus:outline-none"
                        />
                        <span className="absolute left-3 top-[22px] transform -translate-y-1/2 text-gray-400">
                            <FaSearch />
                        </span>
                    </div> */}
                    <Link to="/addcustomer">
                        <Button
                            label="View Customer Statistics"
                            variant="solid"
                            size="md"
                            className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 mt-4 md:mt-0"
                        />
                    </Link>
                </div>


                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-white-100 text-black-700">
                        <tr>
                            {["ID", "Name", "Address", "Email", "Created At", "Phone No", "View",].map((header, index) => (
                                <th key={index} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(customerData) &&
                            customerData.slice((page - 1) * perPage, page * perPage).map((item, index) => {
                                const { id, full_name, created_at, Business } = item;

                                return (
                                    <tr key={index} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-xs border-b border-gray-200">{id}</td>
                                        <td className="px-6 py-4 text-xs border-b border-gray-200">{item?.first_name}{item?.last_name}</td>
                                        <td className="px-6 py-4 text-xs border-b border-gray-200">{item?.address || "N/A"}</td>
                                        <td className="px-6 py-4 text-xs border-b border-gray-200">{item?.email || "N/A"}</td>
                                        <td className="px-6 py-4 text-xs border-b border-gray-200">{new Date(created_at).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-xs border-b border-gray-200">{item?.phone_number || "N/A"}</td>



                                        {/* View Button */}
                                        <td className="px-6 py-4 border-b border-gray-200 text-center">
                                            <button
                                                className="w-9 h-9 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none"
                                                aria-label="View"
                                                onClick={() => handleViewCustomer(id)}
                                            >
                                                <FaEye className="text-gray-600 text-base" />
                                            </button>
                                        </td>


                                    </tr>
                                );
                            })}
                    </tbody>
                </table>



                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                        className={`px-4 py-2 text-white ${page === 1 ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} rounded-lg`}
                    >
                        Previous
                    </button>
                    <span className="text-sm">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                        className={`px-4 py-2 text-white ${page === totalPages ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} rounded-lg`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Customer;
