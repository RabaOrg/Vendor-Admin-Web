import React from 'react'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import Button from '../../../../components/shared/button'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useFetchVendorCustomer } from '../../../../hooks/queries/customer'
import { handleDeleteCustomer, handleUpdateCustomerStatus } from '../../../../services/loans'

function ViewCustomerDetails() {
  const { id } = useParams()
  const Navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoad, setIsLoad] = useState(false)
  const { data: oneCustomer, isPending, isError } = useFetchVendorCustomer(id)
  console.log(oneCustomer)
  const oneBusiness = oneCustomer?.Vendor?.Business
  const oneVendor = oneCustomer?.Vendor
  const oneStats = oneCustomer?.statistics
  const [selectedStatus, setSelectedStatus] = useState(oneCustomer?.customer_status || "");
  const handleChangeStatus = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleUpdateStatus = async () => {
    if (selectedStatus === "") {
      toast.error("Please select the active status to proceed")
      return
    }
    setIsLoading(true)
    try {
      const response = await handleUpdateCustomerStatus(id,
        {
          customer_status: selectedStatus,

        }
      )
      if (response) {
        toast.success("Vendor Status updated successfully")
        queryClient.invalidateQueries(["singleCustomer", id]);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }

  }
  const handleEdit = () => {
    Navigate(`/edit_customers/${id}`)
  }
  const handleDelete = async () => {
    setIsLoad(true)
    try {
      console.log(id)
      const response = await handleDeleteCustomer(id, {
        force_delete: false
      })

      toast.success("Customer deactivated successfully")


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
  if (isPending) return <p className="text-center py-10">Loading...</p>
  if (isError) return <p className="text-center py-10 text-red-500">Error fetching customer details</p>
  const { statistics, } = oneCustomer
  return (
    <div className="px-6">

      <div className="inline-block min-w-full rounded-lg overflow-hidden">
        <div className='flex justify-end mt-2'>
          <Button
            label="Edit Customer"
            onClick={handleEdit}
            variant="outline"
            size="sm"
            className="px-4 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 border-b">
          <h2 className="text-3xl font-bold text-gray-800">
            Customer Details ({oneCustomer?.full_name})
          </h2>
          <span
            className={`ml-0 md:ml-4 mt-2 md:mt-0 inline-block px-4 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${getStatusBadgeClasses(
              oneCustomer?.customer_status
            )}`}
          >
            {oneCustomer?.customer_status
            }
          </span>
        </div>

        {/* KYC Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h4 className="text-lg font-semibold pb-3">CUSTOMER KYC DETAILS</h4>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 mt-5">
            <DetailItem label="Customer ID" value={oneCustomer?.id ?? null} />
            <DetailItem label="Full Name" value={oneCustomer?.full_name ?? null} />
            <DetailItem label="Phone Number" value={oneCustomer?.phone_number ?? null} />
            <DetailItem label="Email" value={oneCustomer?.email ?? null} />
            <DetailItem label="BVN" value={oneCustomer?.bvn ?? null} />
            <DetailItem label="Date of Birth" value={oneCustomer?.dob ?? null} />
            <DetailItem label="Address" value={oneCustomer?.address ?? null} />
            <DetailItem label="State" value={oneCustomer?.state ?? null} />
            <DetailItem label="LGA" value={oneCustomer?.lga ?? null} />
            <DetailItem label="Customer Status" value={oneCustomer?.customer_status ?? null} />
            <DetailItem label="Created At" value={new Date(oneCustomer?.created_at ?? null).toLocaleDateString()} />
          </div>
        </div>

        {/* VENDOR Section */}
        {oneVendor && (
          <div className="bg-white shadow-md rounded-lg p-6 mt-6">
            <h4 className="text-lg font-semibold pb-3">VENDOR DETAILS</h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 mt-5">
              <DetailItem label="Vendor ID" value={oneVendor?.id} />

              <DetailItem label="Vendor Name" value={`${oneVendor?.first_name} ${oneVendor?.last_name}`} />
              <DetailItem label="Vendor Business" value={oneVendor?.Business?.name} />
            </div>
          </div>
        )}


        {/* STATISTICS Section */}
        {oneStats && (
          <div className="bg-white shadow-md rounded-lg p-6 mt-6">
            <h4 className="text-lg font-semibold pb-3">APPLICATION STATISTICS</h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 mt-5">
              <DetailItem label="Total Applications" value={statistics?.total_applications ?? 0} />
              <DetailItem label="Approved Applications" value={statistics?.approved_applications ?? 0} />
              <DetailItem label="Completed Applications" value={statistics?.completed_applications ?? 0} />
              <DetailItem label="Total Financed Amount" value={`₦${statistics?.total_financed_amount ?? 0}`} />
            </div>
          </div>
        )}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm md:col-span-2">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Status Update
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


            <option value="inactive">inactive</option>



          </select>
        </div>

        <div className="p-6 flex justify-start gap-10">
          <Button
            label="Update Status"
            onClick={handleUpdateStatus}
            variant="solid"
            size="md"
            className="text-sm px-6 py-3"
            loading={isLoading}
          />
          <Button
            label="Delete Vendor"
            onClick={handleDelete}
            variant="transparent"
            size="md"
            className="text-sm px-6 py-3"
            loading={isLoad}
          />
        </div>
      </div>
    </div>

  )

}
const DetailItem = ({ label, value }) => {
  let displayValue;

  if (value === null) {
    displayValue = 'null';
  } else if (value === undefined) {
    displayValue = 'N/A';
  } else {
    displayValue = value;
  }

  return (
    <div>
      <label className="text-[#212C25] text-xs font-semibold">{label}</label>
      <p className="bg-gray-100 text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md w-full">
        {displayValue}
      </p>
    </div>
  );
};


export default ViewCustomerDetails
