import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Label } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../components/shared/button'
import { toast } from 'react-toastify'
import { useQueryClient } from "@tanstack/react-query";
import { useFetchSingleActivation, useFetchSingleVendorData } from '../../../hooks/queries/loan'
import { useFetchOneCustomer } from '../../../hooks/queries/customer'
import { handleDeleteVendor, handleUpdateLoanStatus, handleUpdateVendorStatus, handleUpdateverification } from '../../../services/loans'

function ViewActivation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false)
  const [isverfied, setisVerified] = useState(false)
  const [interest, setInterest] = useState(0)
  const [isLoad, setIsLoad] = useState(false)


  const { data: vendor, isPending, isError } = useFetchSingleVendorData(id)

  const [selectedStatus, setSelectedStatus] = useState(vendor?.status || "");
  const [selectedVerificationStatus, setSelectedVerificationStatus] = useState(vendor?.verification_status || "");
  const handleChangeStatus = (e) => {
    setSelectedStatus(e.target.value);
  };
  const handleChangeVerificationStatus = (e) => {
    setSelectedVerificationStatus(e.target.value);
  };
  const handleSms = (id) => {



    navigate(`/create_sms_notification/${id}`);

  }
  console.log(vendor)
  const handleUpdateStatus = async () => {
    if (selectedStatus === "") {
      toast.error("Please select the active status to proceed")
      return
    }
    setIsLoading(true)
    try {
      const response = await handleUpdateVendorStatus(id,
        {
          account_status: selectedStatus,

        }
      )
      if (response) {
        toast.success("Vendor Status updated successfully")
        queryClient.invalidateQueries(["getsinglevendors", id]);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }

  }
  const handleUpdateVerificationStatus = async () => {
    if (!interest) {
      toast.error("interest rate is required")
      return
    }
    if (selectedVerificationStatus === "") {
      toast.error("Please select the active status to proceed")
      return
    }

    setisVerified(true)
    try {
      const response = await handleUpdateverification(id,
        {
          verification_status: selectedVerificationStatus,
          verification_notes: "Verification approved by admin",
          interest_rate: Number(interest),

        }
      )
      if (response) {
        toast.success("Verification Status updated successfully")
        queryClient.invalidateQueries(["getsinglevendors", id]);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to delete application";

      toast.error(errorMessage);
    } finally {
      setisVerified(false)
    }

  }
  const handleDelete = async () => {
    setIsLoad(true)
    try {
      console.log(id)
      const response = await handleDeleteVendor(id, {
        force_delete: false
      })

      toast.success("Vendor deactivated successfully")


    } catch (error) {
      console.log(error)
      const errorMessage =
        error?.response?.data?.message || "Failed to delete application";

      toast.error(errorMessage);
    } finally {
      setIsLoad(false)
    }
  }
  const getStatusBadgeClasses = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-300 text-red-800';

      case 'deleted':
        return 'bg-red-100 text-red-800';
      case 'default':
        return 'bg-gray-500 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <div className="px-6">
      <div className="min-w-full rounded-lg overflow-hidden bg-white shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 border-b">
          <h2 className="text-3xl font-bold text-gray-800">
            Vendor Details ({vendor?.full_name})
          </h2>
          <span
            className={`ml-0 md:ml-4 mt-2 md:mt-0 inline-block px-4 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${getStatusBadgeClasses(
              vendor?.account_status
            )}`}
          >
            {vendor?.account_status}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <Input label="Full Name" value={vendor?.full_name} disabled />
              <Input label="Phone Number" value={vendor?.phone_number} disabled />
              <Input label="Email" value={vendor?.email} disabled />
              <Input label="Account Status" value={vendor?.account_status} disabled />
              <Input label="Verification Status" value={vendor?.verification_status} disabled />
            </div>
          </div>


          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Business Information</h3>
            <div className="space-y-4">
              <Input label="Business Name" value={vendor?.Business?.name} disabled />
              <div className="relative w-full">
                <Input
                  label="CAC Number"
                  value={vendor?.Business?.cac_number}
                  disabled
                  className="w-full pr-40"
                />

                <a
                  href="https://search.cac.gov.ng/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-0 bottom-1"
                >
                  <Button
                    label="Verify CAC"
                    variant="solid"
                    onClick={() => handleSms(id)}
                    size="md"
                    className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 mt-6 md:mt-0"
                  />
                </a>
              </div>

              <Input label="Category" value={vendor?.Business?.category} disabled />
              <Input label="Sub Category" value={vendor?.Business?.sub_category} disabled />
              <Input label="Monthly Revenue" value={vendor?.Business?.monthly_revenue} disabled />
              <Input label="Time in Business" value={vendor?.Business?.time_in_business} disabled />
            </div>
          </div>


          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Address</h3>
            <div className="space-y-4">
              <Input label="Street Address" value={vendor?.Business?.street_address} disabled />
              <Input label="LGA" value={vendor?.Business?.lga} disabled />
              <Input label="State" value={vendor?.Business?.state} disabled />
            </div>
          </div>


          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Statistics</h3>
            <div className="space-y-4">
              <Input label="Total Applications" value={vendor?.statistics?.total_applications} disabled />
              <Input label="Total Customers" value={vendor?.statistics?.total_customers} disabled />
              <Input label="Total Products" value={vendor?.statistics?.total_products} disabled />
            </div>
          </div>
          {Array.isArray(vendor?.business_photos) && vendor.business_photos.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Uploaded Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {vendor.business_photos.map((doc, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <img
                      src={doc.url}
                      alt={doc.label || `Document ${index + 1}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-3 bg-white border-t text-sm text-gray-600 font-medium text-center">
                      {doc.label || `Document ${index + 1}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Interest Rate</h3>
            <Input
              label="Interest Rate (Please input the interest rate)"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
            />
          </div>




          <div className="bg-gray-50 p-6 rounded-lg shadow-sm md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Account Status Update
            </h3>
            <label className="block text-sm text-gray-600 mb-1">Select Status to be updated</label>
            <select
              value={selectedStatus}
              onChange={handleChangeStatus}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an option</option>
              <option value="pending">Pending</option>
              <option value="active">active</option>

              <option value="suspended">suspended</option>
              <option value="inactive">inactive</option>



            </select>
            <div className="mt-5">
              <Button
                label="Update Status"
                onClick={handleUpdateStatus}
                variant="solid"
                size="md"
                className="text-sm px-6 py-3"
                loading={isLoading}
              />
            </div>
          </div>




          <div className="bg-gray-50 p-6 mt-5 rounded-lg shadow-sm md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Verification Status Update
            </h3>
            <label className="block text-sm text-gray-600 mb-1">Select Status to be updated</label>
            <select
              value={selectedVerificationStatus}
              onChange={handleChangeVerificationStatus}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an option</option>
              <option value="pending">pending</option>
              <option value="under_review">under_review</option>
              <option value="approved">approved</option>

              <option value="suspended">rejected</option>





            </select>
            <div className="mt-5">

              <Button
                label="Update Verification Status"
                onClick={handleUpdateVerificationStatus}
                variant="solid"
                size="md"
                className="text-sm px-6 py-3"
                loading={isverfied}
              />

            </div>
          </div>
          <div className="p-6 flex gap-10">

            <Button
              label="Deactivate Vendor"
              onClick={handleDelete}
              variant="transparent"
              size="md"
              className="text-sm px-6 py-3"
              loading={isLoad}
            />
            <Button
              label="Create Sms Application"
              variant="solid"
              onClick={() => handleSms(id)}
              size="md"
              className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 mt-4 md:mt-0"
            />

          </div>

        </div>

      </div>

    </div >
  )
}

const Input = ({ label, value, onChange, disabled }) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    <input
      type="text"
      disabled={disabled}
      onChange={onChange}
      value={value ?? '—'}
      className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
)
export default ViewActivation
