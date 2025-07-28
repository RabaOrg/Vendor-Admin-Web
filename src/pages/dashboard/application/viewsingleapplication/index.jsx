import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from "@tanstack/react-query";
import { useFetchSingleLoan } from '../../../../hooks/queries/loan';
import Button from '../../../../components/shared/button';
import axiosInstance from '../../../../../store/axiosInstance';
import { handleDeleteApplication, handleUpdateStatus } from '../../../../services/loans';

function SingleApplication() {
  const { id } = useParams();
  const Navigate = useNavigate()
  const [loanData, setLoanData] = useState(null);
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false)
  const { data: singleLoan, isPending, isError } = useFetchSingleLoan(id);
  const [showPreview, setShowPreview] = useState(false);
  const [bankId, setBankId] = useState('')
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const imageUrl = singleLoan?.documents?.id_card?.s3_key
    ? `https://rabaserver-development.s3.amazonaws.com/${singleLoan?.documents?.id_card?.s3_key}`
    : null;



  console.log(singleLoan)
  const handleChangeStatus = (e) => {
    setSelectedStatus(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/api/admin/applications/${id}`,);
        console.log(response.data)

        setLoanData(response.data);

        setBankId(response.data.customer)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    try {
      console.log(id)
      const response = await handleDeleteApplication(id, {
        reason: "Invalid application data"
      })
      if (response) {
        toast.success("Application deleted successfully")
        Navigate("/application")
      }
    } catch (error) {
      console.log(error)
      const errorMessage =
        error?.response?.data?.message || "Failed to delete application";

      toast.error(errorMessage);
    }
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
  if (!loanData)
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        No application data found.
      </div>
    );
  const handleUpdateLoanStatus = async () => {
    if (selectedStatus === singleLoan?.status) {
      toast.error("Please select a different status to update");
      return;
    }

    setIsLoading(true)
    try {
      const response = await handleUpdateStatus(id, {
        status: selectedStatus,
      })
      if (response) {
        toast.success("Status updated successfully")
        setLoanData((prevData) => ({
          ...prevData,
          status: selectedStatus,
        }));
        queryClient.invalidateQueries(["singleLoanApplication", id]);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const { id: ID, Customer, Product, application_data, repayment_dates, status, created_at } =
    singleLoan;
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
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 border-b flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="text-3xl font-bold text-gray-800">
            View Application Details ({Customer?.full_name})
          </h2>
          <span
            className={`inline-block px-4 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${getStatusBadgeClasses(
              status
            )}`}
          >
            {status}
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Customer Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Vendor_id</label>
                <input
                  type="text"
                  disabled
                  value={Customer?.vendor_id}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Customer Name</label>
                <input
                  type="text"
                  disabled
                  value={Customer?.full_name}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Address</label>
                <input
                  type="text"
                  disabled
                  value={Customer?.address}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Customer Status</label>
                <input
                  type="text"
                  disabled
                  value={status}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Customer Email</label>
                <input
                  type="text"
                  disabled
                  value={Customer?.email}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Customer Phone_Number</label>
                <input
                  type="text"
                  disabled
                  value={Customer?.phone_number}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Created At</label>
                <input
                  type="text"
                  disabled
                  value={new Date(Customer?.created_at).toLocaleDateString()}
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
                  value={Product?.id}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Category</label>
                <input
                  type="text"
                  disabled
                  value={Product?.category}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <input
                  type="text"
                  disabled
                  value={Product?.description}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  disabled
                  value={Product?.name}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Price</label>
                <input
                  type="text"
                  disabled
                  value={Product?.price}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Shipping_days_min</label>
                <input
                  type="text"
                  disabled
                  value={Product?.shipping_days_min}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Shipping_days_max</label>
                <input
                  type="text"
                  disabled
                  value={Product?.shipping_days_max}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Status</label>
                <input
                  type="text"
                  disabled
                  value={Product?.status}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>


          <div className="bg-gray-50 p-6 rounded-lg shadow-sm md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Application_type</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Account_Number</label>
                <input
                  type="text"
                  disabled
                  value={application_data?.account_number}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Link Token</label>
                <input
                  type="text"
                  disabled
                  value={application_data?.application_link_token}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Aplication Source</label>
                <input
                  type="text"
                  disabled
                  value={application_data?.application_source}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Bank Name</label>
                <input
                  type="text"
                  disabled
                  value={application_data?.bank_name}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Customer Email</label>
                <input
                  type="text"
                  disabled
                  value={application_data?.customer_email}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Customer Name</label>
                <input
                  type="text"
                  disabled
                  value={application_data?.customer_name}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Customer Phone</label>
                <input
                  type="text"
                  disabled
                  value={application_data?.customer_phone}

                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Guarantor's Address</label>
                <input
                  type="text"
                  disabled
                  value={application_data?.guarantor_address}

                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Guarantor's Name</label>
                <input
                  type="text"
                  disabled
                  value={application_data?.guarantor_name}

                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Guarantor's Phone</label>
                <input
                  type="text"
                  disabled
                  value={application_data?.guarantor_phone}

                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Product Description</label>
                <input
                  type="text"
                  disabled
                  value={application_data?.product_description}

                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Product Name</label>
                <input
                  type="text"
                  disabled
                  value={application_data?.product_name}

                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tenure</label>
                <input
                  type="text"
                  disabled
                  value={application_data?.product_price}

                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Uploaded Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  ID Card
                </label>
                <div className="border rounded-md p-3 bg-white shadow-sm">
                  {imageUrl ? (
                    <>

                      <img
                        src={imageUrl}
                        alt="ID Card"
                        className="w-full h-60 object-contain rounded-md mb-3 cursor-pointer hover:opacity-90 transition"
                        onClick={() => setIsViewerOpen(true)}
                      />


                      <a
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 text-sm underline"
                        download
                      >
                        Download ID Card
                      </a>


                      {isViewerOpen && (
                        <div
                          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                          onClick={() => setIsViewerOpen(false)}
                        >
                          <div className="relative">
                            <img
                              src={imageUrl}
                              alt="ID Card Large View"
                              className="max-w-[90vw] max-h-[90vh] rounded-md shadow-lg"
                            />
                            <button
                              className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:bg-gray-200 transition"
                              onClick={() => setIsViewerOpen(false)}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">No ID card uploaded.</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Bank Statement</label>
                <div className="border rounded-md p-4 bg-white shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-gray-700 text-sm font-medium">
                      {singleLoan?.documents?.bank_statement?.original_filename || 'Bank Statement'}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Uploaded on {new Date(singleLoan?.documents?.bank_statement?.upload_timestamp).toLocaleDateString()}
                    </p>
                  </div>

                  {singleLoan?.documents?.bank_statement?.s3_key ? (
                    <a
                      href={`https://rabaserver-development.s3.amazonaws.com/${singleLoan?.documents?.bank_statement?.s3_key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="text-sm text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors"
                    >
                      Download
                    </a>
                  ) : (
                    <p className="text-sm text-red-500">No file available</p>
                  )}
                </div>
              </div>


            </div>
          </div>



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
              <option value="approved">approved</option>
              <option value="submitted">submitted</option>
              <option value="pending">pending</option>
              <option value="completed">completed</option>
              <option value="cancelled">cancelled</option>
              <option value="rejected">rejected</option>
              <option value="awaiting_downpayment">awaiting downpayment</option>
              <option value="awaiting_delivery">awaiting delivery</option>
              <option value="processing">processing</option>

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
          <Button
            label="Delete Application"
            onClick={handleDelete}
            variant="transparent"
            size="md"
            className="text-sm px-6 py-3"
            loading={isLoading}
          />
        </div>
      </div>
    </div>

  );
}

export default SingleApplication;
