import React from 'react'
import { useFetchGetVendorNotification } from '../../../../hooks/queries/notification'
import Button from '../../../../components/shared/button'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'

function EachSmsNotification() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: tokens } = useFetchGetVendorNotification(id)


  const getStatusBadgeClasses = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
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
  return (
    <div className="px-6 pb-7 space-y-6">
      {Array.isArray(tokens) && tokens.length > 0 ? (
        tokens.map((token, index) => (
          <div
            key={token.id}
            className="min-w-full rounded-lg overflow-hidden bg-white shadow-md"
          >

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 border-b">
              <h2 className="text-3xl font-bold text-gray-800">
                Sms Application #{index + 1} ({token.product_name || 'No Product Name'})
              </h2>
              <span
                className={`ml-0 md:ml-4 mt-2 md:mt-0 inline-block px-4 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${getStatusBadgeClasses(token.status)
                  }`}
              >
                {token.status}
              </span>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Product Information
                </h3>
                <div className="space-y-4">
                  <Input label="Product Name" value={token.product_name} disabled />
                  <Input
                    label="Price"
                    value={token.product_price ? `₦${Number(token.product_price).toLocaleString()}` : 'N/A'}
                    disabled
                  />
                  <Input label="Application ID" value={token.application_id} disabled />
                </div>
              </div>


              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Recipient Information
                </h3>
                <div className="space-y-4">
                  <Input label="Recipient Email" value={token.recipient_email} disabled />
                  <Input label="Recipient Phone" value={token.recipient_phone} disabled />
                  <Input label="Vendor ID" value={token.vendor_id} disabled />
                </div>
              </div>


              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Token Details
                </h3>
                <div className="space-y-4">
                  <Input label="Token" value={token.token} disabled />
                  <Input
                    label="Created At"
                    value={new Date(token.created_at).toLocaleString()}
                    disabled
                  />
                  <Input
                    label="Expires At"
                    value={new Date(token.expires_at).toLocaleString()}
                    disabled
                  />
                </div>
              </div>


            </div>

          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No tokens found</p>
      )}

    </div>



  )

}

export default EachSmsNotification
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