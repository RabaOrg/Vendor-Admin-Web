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
import { useFetchSingleTransaction } from '../../../hooks/queries/transaction'

function SingleTransaction() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false)
  const [isverfied, setisVerified] = useState(false)
  const [interest, setInterest] = useState(0)
  const [isLoad, setIsLoad] = useState(false)


  const { data: vendor, isPending, isError } = useFetchSingleTransaction(id)
  console.log(vendor)

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
      case 'success':
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
            Transaction Details ({vendor?.vendor?.name})
          </h2>
          <span className={`ml-0 md:ml-4 mt-2 md:mt-0 inline-block px-4 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${getStatusBadgeClasses(vendor?.status)}`}>
            {vendor?.status || "—"}
          </span>
        </div>


        <div className="p-6 mt-4 bg-white rounded-xl">
          {/* <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 Transaction Details</h2> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Transaction Type", value: vendor?.type },
              { label: "Amount", value: vendor?.amount },
              { label: "Status", value: vendor?.status },
              { label: "Reference", value: vendor?.reference },
            ].map((stat, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow transition">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-800 mt-2">{stat.value ?? "—"}</p>
              </div>
            ))}
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Customer Information</h3>
            <div className="space-y-4">
              <Input label="Name" value={vendor?.customer?.name} disabled />
              <Input label="Email" value={vendor?.customer?.email} disabled />
              <Input label="Phone" value={vendor?.customer?.phone} disabled />
              <Input label="Address" value={vendor?.customer?.address} disabled />
              <Input label="BVN" value={vendor?.customer?.bvn} disabled />
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Application Information</h3>
            <div className="space-y-4">
              <Input label="Reference" value={vendor?.application?.reference} disabled />
              <Input label="Status" value={vendor?.application?.status} disabled />
              <Input label="Amount" value={vendor?.application?.amount} disabled />
              <Input label="Down Payment" value={vendor?.application?.downPaymentAmount} disabled />
              <Input label="Monthly Repayment" value={vendor?.application?.monthlyRepayment} disabled />
              <Input label="Lease Tenure" value={vendor?.application?.leaseTenure} disabled />
            </div>
          </div>


          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Payment Information</h3>
            <div className="space-y-4">
              <Input label="Provider" value={vendor?.provider} disabled />
              <Input label="Payment Method" value={vendor?.paymentMethod} disabled />
              <Input label="Processed At" value={vendor?.processedAt} disabled />
              <Input label="Gateway Response" value={vendor?.gatewayResponse?.gateway_response} disabled />
              <Input label="Fees" value={vendor?.gatewayResponse?.fees} disabled />
            </div>
          </div>
        </div>


      </div>
    </div>
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
export default SingleTransaction
