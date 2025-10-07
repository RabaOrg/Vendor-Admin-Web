import React from 'react'
import { useState } from 'react'
import Button from '../../../components/shared/button'
import { Link } from 'react-router-dom'
import { FaEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../../../store/axiosInstance'
import { toast } from 'react-toastify'
import { FaEdit } from 'react-icons/fa'
import { useFetchLoanApplication } from '../../../hooks/queries/loan'


function ApplicationList() {
  const [page, setPage] = useState(1);

  const { data: applicationData, isPending, isError } = useFetchLoanApplication({ page, limit: 10 })
  console.log(applicationData)
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const navigate = useNavigate();

  const handleRowClick = (id) => {

    setSelectedId(id);

    navigate(`/application-statistics/${id}`);

  };
  const handleViewPayment = (id) => {

    setSelectedId(id);

    navigate(`/application_payment/${id}`);

  };
  const handleUpdateApplication = async () => {
    try {


      if (editData.monthly_repayment !== undefined) {
        await axiosInstance.patch(`/api/admin/applications/${editData.id}/product-price`, {
          newMonthlyRepayment: Number(editData.monthly_repayment),
          newProductPrice: Number(editData.amount),
          newInterestRate: Number(editData.interest_rate),

          newDownPaymentAmount: Number(editData.down_payment_amount)

        });
      }




      toast.success('Application updated successfully!');
      setIsModalOpen(false);


    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application. Please try again.');
    }
  }

  return (
    <div className='px-6'>
      <div className="inline-block min-w-full rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 mt-3">
          <h1 className="text-3xl font-semibold">
            Application<span className="text-black-400">{'>'}</span> View Application
          </h1>
          <Link to={"/create_application"}>
            <Button
              label="View Application statistics"
              variant="solid"
              size="md"
              className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 mt-4 md:mt-0"
            />
          </Link>

        </div>
        <table className="table-auto leading-normal mt-3">
          <thead className="bg-[#D5D5D5]">
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Vendor's Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Customer's Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Amount
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Application Type
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Down Payment
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Date
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Edit
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                View App
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                View Payment
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(applicationData?.data) && applicationData.data.length > 0 ? (
              applicationData.data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleRowClick(item.id)}
                  className={`cursor-pointer transition-all duration-200 ${selectedId === item.id ? 'bg-blue-200' : 'bg-white'
                    } hover:bg-gray-200`}
                >
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-normal text-xs">{item.id}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-normal text-xs">{item.vendor?.name || '—'}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-normal text-xs">{item.customer?.name || '—'}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-normal text-xs">₦{Number(item.amount).toLocaleString()}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-normal text-xs">{item.application_type}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-normal text-xs">{item.down_payment_amount ?? '—'}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-normal text-xs">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </td>


                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <button
                      className={`font-medium whitespace-normal text-xs px-3 py-1 rounded ${item.status === 'approved'
                        ? 'bg-[#ccf0eb] text-[#00B69B]'
                        : item.status === 'pending'
                          ? 'bg-orange-100 text-[#FFA756]'
                          : item.status === 'submitted'
                            ? 'bg-green-100 text-green-700'
                            : item.status === 'active'
                              ? 'bg-green-100 text-green-600'
                              : item.status === 'awaiting_downpayment'
                                ? 'bg-orange-100 text-[#FFA756]'
                                : item.status === 'awaiting delivery'
                                  ? 'bg-orange-100 text-[#FFA756]'
                                  : item.status === 'processing'
                                    ? 'bg-purple-100 text-purple-700'
                                    : item.status === 'cancelled'
                                      ? 'bg-red-100 text-red-600'
                                      : item.status === 'completed'
                                        ? 'bg-green-100 text-green-800'
                                        : item.status === 'Rejected'
                                          ? 'bg-red-300 text-[#EF3826]'
                                          : 'bg-gray-200 text-gray-700'
                        } font-semibold`}
                    >
                      {item.status}
                    </button>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditData(item);
                        setIsModalOpen(true);
                      }}
                      className="flex items-center justify-center w-10 h-10 bg-blue-100 border border-blue-300 rounded-lg hover:bg-blue-200"
                      title="Edit Application"
                    >
                      <FaEdit className="text-blue-600" />
                    </button>
                  </td>

                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(item.id);
                      }}
                      className="flex items-center justify-center w-10 h-10 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                      title="View Application"
                    >
                      <FaEye className="text-gray-500" />
                    </button>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewPayment(item.id);
                      }}
                      className="flex items-center justify-center w-10 h-10 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                      title="View Payment"
                    >
                      <FaEye className="text-gray-500" />
                    </button>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={11}
                  className="text-center text-gray-500 text-sm py-6 border-b border-gray-200"
                >
                  No applications found at this time.
                </td>
              </tr>
            )}
          </tbody>


        </table>

      </div>
      <br />
      <br />
      {applicationData?.meta?.total_pages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`px-4 py-2 text-white ${page === 1 ? 'bg-gray-400' : 'bg-green-700 hover:bg-green-700'} rounded-lg`}
          >
            Previous
          </button>
          <span className="text-sm font-medium">
            Page {page} of {applicationData.meta.total_pages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, applicationData.meta.total_pages))}
            disabled={page === applicationData.meta.total_pages}
            className={`px-4 py-2 text-white ${page === applicationData.meta.total_pages ? 'bg-gray-400' : 'bg-green-800 hover:bg-green-700'} rounded-lg`}
          >
            Next
          </button>
        </div>

      )}
      {isModalOpen && editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">Edit Application</h2>

            <label>Amount</label>
            <input
              type="number"
              value={editData.amount || ''}
              onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
              className="border p-2 w-full mb-3"
            />

            <label>Down Payment</label>
            <input
              type="number"
              value={editData.down_payment_amount || ''}
              onChange={(e) => setEditData({ ...editData, down_payment_amount: e.target.value })}
              className="border p-2 w-full mb-3"
            />

            <label>Monthly Repayment</label>
            <input
              type="number"
              value={editData.monthly_repayment || ''}
              onChange={(e) => setEditData({ ...editData, monthly_repayment: e.target.value })}
              className="border p-2 w-full mb-3"
            />

            <label>Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={editData.interest_rate || ''}
              onChange={(e) => setEditData({ ...editData, interest_rate: e.target.value })}
              className="border p-2 w-full mb-3"
            />


            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateApplication}
                className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}

export default ApplicationList
