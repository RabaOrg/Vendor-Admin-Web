import React from 'react'
import { useState } from 'react'
import { useFetchGetSmsNotification } from '../../../../hooks/queries/notification'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { FaEye } from 'react-icons/fa'
import Button from '../../../../components/shared/button'

function SmsApplication() {
  const { data: smsapplication } = useFetchGetSmsNotification()
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState(null);
  console.log(smsapplication)

  const handleRowClick = (id) => {

    setSelectedId(id);


    navigate(`/vendor_sms_application/${id}`);

  };

  const handleSms = (id) => {



    navigate(`/create_sms_notification/${id}`);

  };
  return (
    <div className='px-6'>
      <div className="inline-block min-w-full rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 mt-3">
          <h1 className="text-3xl font-semibold">
            Product Token Management <span className="text-black-400">{'>'}</span> View Tokens
          </h1>

        </div>

        <table className="min-w-full leading-normal mt-3">
          <thead className="bg-[#D5D5D5]">
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Vendor
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Price
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Created Date
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                View
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Created sms
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(smsapplication) &&
              smsapplication.map((item) => (
                <tr
                  key={item.id}

                >
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">{item.id}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">{item.vendor?.name || '—'}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">{item.product_name}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">
                      ₦{Number(item.product_price).toLocaleString()}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <button
                      className={`font-medium whitespace-no-wrap text-xs px-3 py-1 rounded ${item.status === 'active'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                      {item.status}
                    </button>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(item?.vendor?.id);
                      }}
                      className="flex items-center justify-center w-10 h-10 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                      title="View Payment"
                    >
                      <FaEye className="text-gray-500" />
                    </button>
                  </td>
                  <td>

                    <Button
                      label="Create Sms Application"
                      variant="solid"
                      onClick={() => handleSms(item?.vendor?.id)}
                      size="md"
                      className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 mt-4 md:mt-0"
                    />

                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );

}

export default SmsApplication
