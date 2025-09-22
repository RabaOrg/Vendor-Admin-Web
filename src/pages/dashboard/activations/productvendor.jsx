import React from 'react'
import { useFetchProductVendor } from '../../../hooks/queries/product';
import { useParams } from 'react-router-dom';
import { useState } from 'react';


function ProductVendor() {
  const { id } = useParams()
  const [page, setPage] = useState(1);
  const { data: activationList, isPending, isError } = useFetchProductVendor(id)
  console.log(activationList)
  const [selectedId, setSelectedId] = useState(null);



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
  if (!activationList.data)
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        No vendor data found.
      </div>
    );
  return (
    <div className='px-6'>


      <div className="inline-block min-w-full  rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 mt-3">
          <h1 className="text-[30px] font-semibold text-black mt-6 mb-4 ">Vendor Product</h1>

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
            </tr>
          </thead>

          <tbody>
            {Array.isArray(activationList?.data) && activationList.data.length > 0 ? (
              activationList.data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleRowClick(item.id)}
                  className={`cursor-pointer transition-all duration-200 ${selectedId === item.id ? 'bg-blue-200' : 'bg-white'
                    } hover:bg-gray-200`}
                >
                  <td className="px-4 py-4 border-b border-gray-200 text-xs">
                    {item.first_name} {item.last_name}
                  </td>
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No data available
                </td>
              </tr>
            )}
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

export default ProductVendor
