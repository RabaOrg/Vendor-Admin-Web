import React from 'react'
import { useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useFetchAgent } from '../../../hooks/queries/agent';
import { Link } from 'react-router-dom';
import Button from '../../../components/shared/button';

function AgentManagement() {
  const { data: agentAll } = useFetchAgent()
  const Navigate = useNavigate()
  const [selectedId, setSelectedId] = useState(null);
  console.log(agentAll)

  const handleRowClick = (id) => {

    setSelectedId(id);

    Navigate(`/single_agent/${id}`);

  };
  return (
    <div>
      <div className='px-6'>


        <div className="inline-block min-w-full  rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-4 mt-3">
            <h1 className="text-[30px] font-semibold text-black mt-6 mb-4 ">Agent Management</h1>
            <div className='flex gap-3'>
              <Link to={"/agent_statistics"}>
                <Button
                  label="View Agent statistics"
                  variant="solid"
                  size="md"
                  className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 mt-4 md:mt-0"
                />
              </Link>
              <Link to={"/create_agent"}>
                <Button
                  label="Create Agent"
                  variant="solid"
                  size="md"
                  className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 mt-4 md:mt-0"
                />
              </Link>
            </div>
          </div>
          <table className="min-w-full leading-normal">
            <thead className="bg-[#D5D5D5]">
              <tr>
                <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">Full_Name</th>
                <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">Email</th>
                <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">Phone_number</th>
                <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">Department</th>
                <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">Position</th>
                <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">Status</th>
                <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">View</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(agentAll) &&
                agentAll.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleRowClick(item.id)}
                    className={`cursor-pointer transition-all duration-200 ${selectedId === item.id ? 'bg-blue-200' : 'bg-white'
                      } hover:bg-gray-200`}
                  >
                    <td className="px-4 py-4 border-b border-gray-200 text-xs">{item.first_name} {item.last_name}</td>
                    <td className="px-4 py-4 border-b border-gray-200 text-xs">{item.email}</td>
                    <td className="px-4 py-4 border-b border-gray-200 text-xs">{item.phone_number}</td>
                    <td className="px-4 py-4 border-b border-gray-200 text-xs">{item.department}</td>
                    <td className="px-4 py-4 border-b border-gray-200 text-xs">{item.position}</td>
                    <td className="px-4 py-4 border-b border-gray-200 text-xs">
                      <button
                        className={`font-medium text-xs px-3 py-1 rounded ${item.status === 'approved'
                          ? 'bg-[#ccf0eb] text-[#00B69B]'
                          : item.status === 'pending'
                            ? 'bg-orange-100 text-[#FFA756]'
                            : item.status === 'submitted'
                              ? 'bg-green-100 text-green-700'
                              : item.status === 'active'
                                ? 'bg-green-100 text-green-600'
                                : item.status === 'awaiting_downpayment' || item.status === 'awaiting delivery'
                                  ? 'bg-orange-100 text-[#FFA756]'
                                  : item.status === 'processing'
                                    ? 'bg-purple-100 text-purple-700'
                                    : item.status === 'cancelled' || item.status === 'Rejected'
                                      ? 'bg-red-100 text-red-600'
                                      : item.status === 'completed'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-200 text-gray-700'
                          }`}
                      >
                        {item.status}
                      </button>
                    </td>
                    <td className="px-4 py-4 border-b border-gray-200 flex">
                      <button
                        className="flex items-center justify-center w-12 h-10 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none"
                        aria-label="View"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent triggering row click
                          handleViewCustomer(item.id);
                        }}
                      >
                        <FaEye className="text-gray-500 text-lg" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>





        </div>
        {agentAll?.data?.meta?.total_pages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-4 py-2 text-white ${page === 1 ? 'bg-gray-400' : 'bg-green-700 hover:bg-green-700'} rounded-lg`}
            >
              Previous
            </button>
            <span className="text-sm font-medium">
              Page {page} of {agentAll?.data?.meta?.total_pages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, agentAll?.data?.meta?.total_pages))}
              disabled={page === agentAll?.data?.meta?.total_pages}
              className={`px-4 py-2 text-white ${page === agentAll?.data?.meta?.total_pages ? 'bg-gray-400' : 'bg-green-800 hover:bg-green-700'} rounded-lg`}
            >
              Next
            </button>
          </div>
        )}
        <br />
        <br />

      </div >
    </div>
  )
}

export default AgentManagement
