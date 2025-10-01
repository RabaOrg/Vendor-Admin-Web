import React, { useState } from 'react'
import Button from '../../../components/shared/button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import { useFetchOrder } from '../../../hooks/queries/order'
import { useFetchTransaction, useFetchTransactionDetails } from '../../../hooks/queries/transaction';

function TransactionDetails() {
  const [loading, setloading] = useState([]);
  const { data: OrderList, isPending, isError } = useFetchTransaction()
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();
  console.log(OrderList)
  const handleRowClick = (id) => {

    setSelectedId(id);

    navigate(`/single_transaction/${id}`);
  };
  return (
    <div className='px-6'>
      <div className="inline-block min-w-full  rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 mt-3">
          <h1 className="text-3xl font-semibold">
            Payment Details<span className="text-black-400"></span>
          </h1>
          <div className='flex gap-5'>
            <div className=''>

              <Link to={'/transaction_statistics'}> <Button
                label="View transaction statistics"
                variant="solid"

                size="md"
                className="text-sm px-6 py-5"
              /></Link>
            </div>

          </div>
        </div>
        <table className="min-w-full leading-normal mt-3 ">
          <thead className='bg-[#D5D5D5]'>
            <tr>

              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase  tracking-wider">
                ID
              </th>

              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Amount
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Customer's Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Vendor's Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Created At
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Transaction type
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Status
              </th>


            </tr>
          </thead>

          {Array.isArray(OrderList) && OrderList.map((item, index) => {
            const { Product, User, State, amount, id } = item
            return (
              <tr
                key={id}
                onClick={() => handleRowClick(id)}

                className={`cursor-pointer transition-all duration-200 
                    ${selectedId === id ? 'bg-blue-200' : 'bg-white'} 
                    hover:bg-gray-200`}>

                <td className="px-5 py-5 border-b border-gray-200  text-xs">
                  <p className="font-[500] whitespace-no-wrap text-xs">
                    {item.id}
                  </p>
                </td>


                <td className="px-5 py-5 border-b border-gray-200  text-xs">
                  <p className="font-[500] whitespace-no-wrap text-xs">
                    {item.amount}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200  text-xs">
                  <p className="font-[500] whitespace-no-wrap text-xs">
                    {item.customer.name}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200  text-xs">
                  <p className="font-[500] whitespace-no-wrap text-xs">
                    {item.vendor.name}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200  text-xs">
                  <p className="font-[500] whitespace-no-wrap text-xs">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200  text-xs">
                  <p className="font-[500] whitespace-no-wrap text-xs">
                    {item.type}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-xs">
                  <button
                    className={`font-medium whitespace-no-wrap text-xs px-3 py-1 rounded ${item.status === 'approved'
                      ? 'bg-[#ccf0eb] text-[#00B69B] font-semibold'
                      : item.status === 'pending'
                        ? 'bg-orange-100 text-[#FFA756] font-semibold'
                        : item.status === 'success'
                          ? 'bg-green-100 text-green-700 font-semibold'
                          : item.status === 'active'
                            ? 'bg-green-100 text-green-600 font-semibold'
                            : item.status === 'awaiting_downpayment'
                              ? 'bg-orange-100 text-[#FFA756] font-semibold'
                              : item.status === 'awaiting delivery'
                                ? 'bg-orange-100 text-[#FFA756] font-semibold'
                                : item.status === 'processing'
                                  ? 'bg-purple-100 text-purple-700 font-semibold'
                                  : item.status === 'cancelled'
                                    ? 'bg-red-100 text-red-600 font-semibold'

                                    : item.status === 'completed'

                                      ? 'bg-green-100 text-green-800 font-semibold'
                                      : item.status === 'Rejected'
                                        ? 'bg-red-300 text-[#EF3826] font-semibold'
                                        : 'bg-gray-200 text-gray-700'
                      }`}
                  >
                    {item.status}
                  </button>

                </td>


              </tr>
            )
          })}



          <tbody>




          </tbody>
        </table>

      </div>
    </div>
  )
}

export default TransactionDetails
