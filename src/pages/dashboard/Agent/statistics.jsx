import React from 'react'
import { useFetchVendor } from '../../../hooks/queries/loan'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import dayjs from 'dayjs'
import { useFetchAgentStatistics } from '../../../hooks/queries/agent'



const AgentStatistics = () => {
  const { data: applicationData, isPending, isError } = useFetchAgentStatistics()
  console.log(applicationData)

  const stats = [
    { label: "Total Agents", value: applicationData?.total },
    { label: "Active Agents", value: applicationData?.active },
    { label: "Inactive Agents", value: applicationData?.inactive },
    { label: "Terminated Agents", value: applicationData?.terminated },
  ]

  if (isPending) {
    return <p className="text-center text-gray-600 py-10">Loading agent statistics...</p>
  }

  if (isError) {
    return <p className="text-center text-red-500 py-10">Failed to load agent statistics.</p>
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Agent Statistics</h2>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow transition"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-semibold text-gray-800 mt-2">
              {stat.value ?? "—"}
            </p>
          </div>
        ))}
      </div>


      <div className="mt-10">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Agents by Department</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {applicationData?.byDepartment?.map((dept, i) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm flex justify-between items-center"
            >
              <p className="text-sm text-gray-600">{dept.department}</p>
              <p className="text-lg font-semibold text-gray-800">{dept.count}</p>
            </div>
          ))}
        </div>
      </div>


      <div className="mt-10">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Agents by Position</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {applicationData?.byPosition?.map((pos, i) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm flex justify-between items-center"
            >
              <p className="text-sm text-gray-600">{pos.position}</p>
              <p className="text-lg font-semibold text-gray-800">{pos.count}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default AgentStatistics
