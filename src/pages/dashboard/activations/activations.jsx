import React, { useState } from 'react'
import { useFetchVendorData } from '../../../hooks/queries/loan'
import { Link } from 'react-router-dom'
import { FaEye, } from 'react-icons/fa'
import Button from '../../../components/shared/button'
import { useNavigate } from 'react-router-dom'
import ApplicationList from '../application/application'

function ActivationLists() {
  const [page, setPage] = useState(1);
  const { data: activationList, isPending, isError } = useFetchVendorData({ page, limit: 10 })
  console.log(activationList)
  const [selectedId, setSelectedId] = useState(null);
  const Navigate = useNavigate()

  const handleRowClick = (id) => {

    setSelectedId(id);

    Navigate(`/view_activation/${id}`);

  };
  const handleViewCustomer = (id) => {
    Navigate(`/view_activation/${id}`)
  }
  if (isPending)
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  if (isError)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        Error loading application.
      </div>
    );
  if (!activationList)
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        No vendor data found.
      </div>
    );
  return (
    <div className='px-6'>


      <div className="inline-block min-w-full  rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 mt-3">
          <h1 className="text-[30px] font-semibold text-black mt-6 mb-4 ">Vendor Management</h1>
          <Link to={"/vendor_statistics"}>
            <Button
              label="View Vendor statistics"
              variant="solid"
              size="md"
              className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 mt-4 md:mt-0"
            />
          </Link>
        </div>
        <table className="min-w-full leading-normal">
          <thead className="bg-[#D5D5D5]">
            <tr>
              <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">Full Name</th>
              <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">Business Name</th>
              <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">Email</th>
              <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">Business Category</th>
              <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">Monthly Revenue</th>
              <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">CAC Number</th>
              <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">Account Status</th>
              <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">View</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(activationList?.data?.data) &&
              activationList.data.data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleRowClick(item.id)}
                  className={`cursor-pointer transition-all duration-200 ${selectedId === item.id ? 'bg-blue-200' : 'bg-white'
                    } hover:bg-gray-200`}
                >
                  <td className="px-4 py-4 border-b border-gray-200 text-xs">{item.first_name} {item.last_name}</td>
                  <td className="px-4 py-4 border-b border-gray-200 text-xs">{item.business_name}</td>
                  <td className="px-4 py-4 border-b border-gray-200 text-xs">{item.email}</td>
                  <td className="px-4 py-4 border-b border-gray-200 text-xs">{item.business_category}</td>
                  <td className="px-4 py-4 border-b border-gray-200 text-xs">{item.monthly_revenue}</td>
                  <td className="px-4 py-4 border-b border-gray-200 text-xs">{item.cac_number}</td>
                  <td className="px-4 py-4 border-b border-gray-200 text-xs">
                    <button
                      className={`font-medium text-xs px-3 py-1 rounded ${item.account_status === 'approved'
                        ? 'bg-[#ccf0eb] text-[#00B69B]'
                        : item.account_status === 'pending'
                          ? 'bg-orange-100 text-[#FFA756]'
                          : item.account_status === 'submitted'
                            ? 'bg-green-100 text-green-700'
                            : item.account_status === 'active'
                              ? 'bg-green-100 text-green-600'
                              : item.account_status === 'awaiting_downpayment' || item.account_status === 'awaiting delivery'
                                ? 'bg-orange-100 text-[#FFA756]'
                                : item.account_status === 'processing'
                                  ? 'bg-purple-100 text-purple-700'
                                  : item.account_status === 'cancelled' || item.account_status === 'Rejected'
                                    ? 'bg-red-100 text-red-600'
                                    : item.account_status === 'completed'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                      {item.account_status}
                    </button>
                  </td>
                  <td className="px-4 py-4 border-b border-gray-200 flex">
                    <button
                      className="flex items-center justify-center w-12 h-10 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none"
                      aria-label="View"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent triggering row click
                        handleViewCustomer(item.id);
                      }}
                    >
                      <FaEye className="text-gray-500 text-lg" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>





      </div>
      {activationList?.data?.meta?.total_pages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`px-4 py-2 text-white ${page === 1 ? 'bg-gray-400' : 'bg-green-700 hover:bg-green-700'} rounded-lg`}
          >
            Previous
          </button>
          <span className="text-sm font-medium">
            Page {page} of {activationList?.data?.meta?.total_pages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, activationList?.data?.meta?.total_pages))}
            disabled={page === activationList?.data?.meta?.total_pages}
            className={`px-4 py-2 text-white ${page === activationList?.data?.meta?.total_pages ? 'bg-gray-400' : 'bg-green-800 hover:bg-green-700'} rounded-lg`}
          >
            Next
          </button>
        </div>
      )}
      <br />
      <br />

    </div >
  )
}

export default ActivationLists
