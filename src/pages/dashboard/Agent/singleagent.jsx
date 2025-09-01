import React from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '../../../components/shared/button'
import { useNavigate } from 'react-router-dom'
import { useFetchSingleAgent } from '../../../hooks/queries/agent'
import { handleDeleteAgent, handleUpdateAgent } from '../../../services/agent'

function SingleAgent() {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const Navigate = useNavigate()
  const { data: vendor } = useFetchSingleAgent(id)
  const [commissionRate, setCommissionRate] = useState("");
  const [monthlySales, setMonthlySales] = useState("");
  const [notes, setNotes] = useState("");

  console.log(vendor)
  const [isLoad, setIsLoad] = useState(false)
  const [selectedVerificationStatus, setSelectedVerificationStatus] = useState(vendor?.verification_status || "");
  const [selectedStatus, setSelectedStatus] = useState(vendor?.status || "");

  const handleChangeStatus = (e) => {
    setSelectedStatus(e.target.value);
  };
  const handleChangeVerificationStatus = (e) => {
    setSelectedVerificationStatus(e.target.value);
  };
  const handleUpdateStatus = async () => {
    if (commissionRate === "" || monthlySales == "") {
      toast.error("Please fill the fields to proceed")
      return
    }
    setIsLoading(true)
    try {
      const response = await handleUpdateAgent(id, {
        commission_rate: parseFloat(commissionRate),
        target_monthly_sales: parseFloat(monthlySales),
        notes: "Updated notes for the agent",
      });
      if (response) {
        toast.success("Vendor Status updated successfully")
        queryClient.invalidateQueries(["AgentSingle", id]);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }

  }
  const handleDelete = async () => {
    setIsLoad(true)
    try {
      console.log(id)
      const response = await handleDeleteAgent(id)

      toast.success("Agent deactivated successfully")
      Navigate("/agent_management")


    } catch (error) {
      console.log(error)
      const errorMessage =
        error?.response?.data?.message || "Failed to delete application";

      toast.error(errorMessage);
    } finally {
      setIsLoad(false)
    }
  }
  return (
    <div className="px-6">
      <div className="min-w-full rounded-lg overflow-hidden bg-white shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 border-b">
          <h2 className="text-3xl font-bold text-gray-800">
            Vendor Details ({vendor?.first_name}{vendor?.last_name})
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <Input label="ID" value={vendor?.id} disabled />
              <Input label="Employee ID" value={vendor?.employee_id} disabled />
              <Input label="Employee ID" value={vendor?.first_name} disabled />
              <Input label="Department" value={vendor?.department} disabled />
              <Input label="Phone Number" value={vendor?.phone_number} disabled />
              <Input label="Email" value={vendor?.position} disabled />

            </div>
          </div>



          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Address</h3>
            <div className="space-y-4">
              <Input label="Hire Date" value={new Date(vendor?.hire_date).toLocaleDateString()} disabled />
              <Input label="Target Monthly Sales" value={vendor?.target_monthly_sales} disabled />
              <Input label="Notes" value={vendor?.notes} disabled />
              <Input label="Commission Rate" value={vendor?.commission_rate} disabled />
              <Input label="Account Status" value={vendor?.status} disabled />
              <Input label="Vendor Count" value={vendor?.vendor_count} disabled />

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
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Agent Update
            </h3>
            <label className="block text-sm text-gray-600 mb-3">
              Select Status to be updated
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Commission Rate (%)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 7.5"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Target Monthly Sales
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1200000"
                  value={monthlySales}
                  onChange={(e) => setMonthlySales(e.target.value)}
                  className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                />
              </div>
            </div>

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





          {/* <div className="bg-gray-50 p-6 mt-5 rounded-lg shadow-sm md:col-span-2">
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
          </div> */}
          <div className="p-6 flex gap-10">

            <Button
              label="Deactivate Agent"
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

export default SingleAgent
