import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from "@tanstack/react-query";

import Button from '../../../components/shared/button'


import axiosInstance from '../../../../store/axiosInstance';
import { handleDeleteApplication, handleDeleteGuarantorApplication, handleUpdateGuarantorStatus, handleUpdateStatus } from '../../../services/loans';
import { useFetchSingleGuarantor } from "../../../hooks/queries/loan"

function ViewGuarantor() {
  const { id } = useParams();
  const Navigate = useNavigate()

  const [loanData, setLoanData] = useState(null);
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false)
  const { data: singleGuarantor, isPending, isError } = useFetchSingleGuarantor(id);

  const [showPreview, setShowPreview] = useState(false);
  const [bankId, setBankId] = useState('')
  const [selectedStatus, setSelectedStatus] = useState(singleGuarantor?.data?.verification_status || "");
  // const { data: bankStatement } = useFetchBankStatement(bankId)


  console.log(singleGuarantor)
  const handleChangeStatus = (e) => {
    setSelectedStatus(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/api/admin/guarantors/${id}`,);
        console.log(response.data)

        setLoanData(response.data);
        // console.log(response.data.data.customer.id)
        setBankId(response.data.customer)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  // const handleDelete = async () => {
  //   try {
  //     console.log(id)
  //     const response = await handleDeleteGuarantorApplication(id, {
  //       reason: "Invalid application data"
  //     })
  //     if (response) {
  //       toast.success("Application deleted successfully")
  //       Navigate("/application")
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     const errorMessage =
  //       error?.response?.data?.message || "Failed to delete application";

  //     toast.error(errorMessage);
  //   }
  // }
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
  if (!loanData)
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        No application data found.
      </div>
    );
  const handleEdit = () => {
    Navigate(`/edit_guarantor/${id}`)
  }
  const handleUpdateLoanStatus = async () => {
    if (selectedStatus === singleGuarantor?.status) {
      toast.error("Please select a different status to update");
      return;
    }

    setIsLoading(true)
    try {
      const response = await handleUpdateGuarantorStatus(id, {
        verification_status: selectedStatus,
      })
      if (response) {
        toast.success("Status updated successfully")
        setLoanData((prevData) => ({
          ...prevData,
          status: selectedStatus,
        }))
        queryClient.invalidateQueries(["singleguarantor", id]);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const { id: ID, Customer, Product, application_data, repayment_dates, status: verification_status, created_at } =
    singleGuarantor;
  const getStatusBadgeClasses = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'in_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'awaiting_downpayment':
        return 'bg-yellow-100 text-yellow-800';
      case 'awaiting_delivery':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  // const handleViewStatement = async () => {
  //   try {
  //     const statementUrl = bankStatement.data[0].statement_url;
  //     const response = await axiosInstance.get(statementUrl, { responseType: 'blob' });
  //     const fileBlob = new Blob([response.data], { type: response.data.type || 'application/pdf' });
  //     const localUrl = URL.createObjectURL(fileBlob);
  //     setPreviewUrl(localUrl);
  //     setShowPreview(true);
  //   } catch (error) {
  //     console.error("Error fetching statement for preview:", error);
  //     toast.error("Unable to load statement preview.");
  //   }
  // };

  return (
    <div className="max-w-6xl mx-auto p-10">
      <div className='flex justify-end'>
        <Button
          label="Edit Guarantor"
          onClick={handleEdit}
          variant="outline"
          size="sm"
          className="px-4 py-2 text-sm"
        />
      </div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-2">
        <div className="p-6 border-b flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="text-3xl font-bold text-gray-800">
            View Guarantor Details ({singleGuarantor?.data?.name})
          </h2>
          <span
            className={`inline-block px-4 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${getStatusBadgeClasses(
              singleGuarantor?.data?.verification_status
            )}`}
          >
            {singleGuarantor?.data?.verification_status}
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Customer Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input
                  type="text"
                  disabled
                  value={singleGuarantor?.data?.application?.customer?.id}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Customer Name</label>
                <input
                  type="text"
                  disabled
                  value={singleGuarantor?.data?.application?.customer?.name}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Customer Email</label>
                <input
                  type="text"
                  disabled
                  value={singleGuarantor?.data?.application?.customer?.email}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Customer Phone number</label>
                <input
                  type="text"
                  disabled
                  value={singleGuarantor?.data?.application?.customer?.phone_number}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>


            </div>
          </div>


          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Product Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">ID</label>
                <input
                  type="text"
                  disabled
                  value={singleGuarantor?.data?.application?.product?.id}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Category</label>
                <input
                  type="text"
                  disabled
                  value={singleGuarantor?.data?.application?.product?.name}

                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <input
                  type="text"
                  disabled
                  value={singleGuarantor?.data?.application?.product?.price}

                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  disabled
                  value={singleGuarantor?.data?.application?.product?.description}

                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>





            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Guarantor's Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Address</label>
                <input
                  type="text"
                  disabled
                  value={singleGuarantor?.data?.address}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  disabled
                  value={singleGuarantor?.data?.name}


                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                <input
                  type="text"
                  disabled
                  value={singleGuarantor?.data?.phone_number}


                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Relationship</label>
                <input
                  type="text"
                  disabled
                  value={singleGuarantor?.data?.relationship}


                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Verification Status</label>
                <input
                  type="text"
                  disabled
                  value={singleGuarantor?.data?.verification_status}


                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>





            </div>
          </div>



          <div className="bg-gray-50 p-6 rounded-lg shadow-sm md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Verifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Backup contact info</label>
                <input
                  type="text"
                  disabled
                  value={singleGuarantor?.data?.verifications[0]?.backup_contact_info}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Communication Method</label>
                <input
                  type="text"
                  disabled
                  value={singleGuarantor?.data?.verifications[0]?.communication_method}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Contact Info</label>
                <input
                  type="text"
                  disabled
                  value={singleGuarantor?.data?.verifications[0]?.contact_info}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Status</label>
                <input
                  type="text"
                  disabled
                  value={singleGuarantor?.data?.verifications[0]?.status}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>

            </div>
          </div>


          {/* <div className="bg-gray-50 p-6 rounded-lg shadow-sm md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Repayment Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                <input
                  type="text"
                  disabled
                  value={repayment_dates?.start_date}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">End Date</label>
                <input
                  type="text"
                  disabled
                  value={repayment_dates?.end_date}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
            </div>
          </div> */}
          <div className="bg-gray-50 p-6 rounded-lg shadow md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Status Update</h3>
            <label className="block text-sm text-gray-600 mb-1">
              Select Status to be updated
            </label>
            <select
              value={selectedStatus}
              onChange={handleChangeStatus}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an option</option>

              <option value="pending">pending</option>

              <option value="rejected">rejected</option>
              <option value="rejected">verified</option>


            </select>
          </div>

        </div>

        <div className="p-6 flex justify-items-end gap-10">
          <Button
            label="Update Status"
            onClick={handleUpdateLoanStatus}
            variant="solid"
            size="md"
            className="text-sm px-6 py-3"
            loading={isLoading}
          />
          {/* <Button
            label="Delete Application"
            onClick={handleDelete}
            variant="transparent"
            size="md"
            className="text-sm px-6 py-3"
            loading={isLoading}
          /> */}
        </div>
      </div>
    </div>

  );
}

export default ViewGuarantor;
