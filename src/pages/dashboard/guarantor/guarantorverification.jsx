import React from 'react'
import { useState } from 'react'
import Button from '../../../components/shared/button'
import { Link } from 'react-router-dom'
import { FaEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useFetchGuarantor, useFetchGuarantorVerification } from '../../../hooks/queries/loan'


function GuarantorVerification() {
  const [page, setPage] = useState(1);
  const { data: guarantorList, isPending, isError } = useFetchGuarantorVerification({ page, limit: 10 })
  console.log(guarantorList)
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const handleRowClick = (id) => {

    setSelectedId(id);

    navigate(`/view_guarantor/${id}`);

  };
  return (
    <div className='px-6'>
      <div className="inline-block min-w-full rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 mt-3">
          <h1 className="text-3xl font-semibold">
            Guarantor<span className="text-black-400">{'>'}</span> View Guarantor's Details
          </h1>
          <Link to={"/guarantor_statistics"}>
            <Button
              label="View Guarantor statistics"
              variant="solid"
              size="md"
              className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 mt-4 md:mt-0"
            />
          </Link>
        </div>

        <table className="min-w-full leading-normal mt-3">
          <thead className='bg-[#D5D5D5]'>
            <tr>
              <th className="px-5 py-3 border-b-2 bg-white text-left text-xs font-bold text-black uppercase">ID</th>
              <th className="px-5 py-3 border-b-2 bg-white text-left text-xs font-bold text-black uppercase">Vendor's Name</th>
              <th className="px-5 py-3 border-b-2 bg-white text-left text-xs font-bold text-black uppercase">Guarantor's Name</th>
              <th className="px-5 py-3 border-b-2 bg-white text-left text-xs font-bold text-black uppercase">Phone Number</th>
              <th className="px-5 py-3 border-b-2 bg-white text-left text-xs font-bold text-black uppercase">Method</th>
              <th className="px-5 py-3 border-b-2 bg-white text-left text-xs font-bold text-black uppercase">Status</th>
              <th className="px-5 py-3 border-b-2 bg-white text-left text-xs font-bold text-black uppercase">Date</th>

            </tr>
          </thead>

          <tbody>
            {Array.isArray(guarantorList?.data?.data) &&
              guarantorList.data.data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleRowClick(item.id)}
                  className={`cursor-pointer transition-all duration-200 
                  ${selectedId === item.id ? 'bg-blue-200' : 'bg-white'} 
                  hover:bg-gray-200`}
                >
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">{item.id}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">{item.application?.vendor_name}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">{item.guarantor?.name || 'N/A'}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">{item.contact_info || item.guarantor?.phone_number || 'N/A'}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs capitalize">{item.communication_method || 'N/A'}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <span
                      className={`font-medium text-xs px-3 py-1 rounded ${item.status === 'completed'
                        ? 'bg-[#ccf0eb] text-[#00B69B]' :
                        item.status === 'accessed'
                          ? 'bg-[#ccf0eb] text-[#00B69B]' :
                          item.status === 'sent'
                            ? 'bg-[#ccf0eb] text-[#00B69B]'
                            : item.status === 'pending'
                              ? 'bg-orange-100 text-[#FFA756]'
                              : item.status === 'rejected'
                                ? 'bg-red-300 text-[#EF3826]'
                                : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>

                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {guarantorList?.data?.meta?.total_pages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`px-4 py-2 text-white ${page === 1 ? 'bg-gray-400' : 'bg-green-700 hover:bg-green-700'} rounded-lg`}
          >
            Previous
          </button>
          <span className="text-sm font-medium">
            Page {page} of {guarantorList?.data?.meta?.total_pages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, guarantorList?.data?.meta?.total_pages))}
            disabled={page === guarantorList?.data?.meta?.total_pages}
            className={`px-4 py-2 text-white ${page === guarantorList?.data?.meta?.total_pages ? 'bg-gray-400' : 'bg-green-800 hover:bg-green-700'} rounded-lg`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )

}

export default GuarantorVerification
