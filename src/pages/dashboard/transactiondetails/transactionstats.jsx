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
import { useFetchTransactionStat } from '../../../hooks/queries/transaction'



const TransactionStatistics = () => {
  const { data: applicationData, isPending, isError } = useFetchTransactionStat()
  console.log(applicationData)

  if (isPending) {
    return <p className="text-center text-gray-600 py-10">Loading transaction statistics...</p>
  }

  if (isError) {
    return <p className="text-center text-red-500 py-10">Failed to load transaction statistics.</p>
  }

  const summary = [
    { label: "Total Transactions", value: applicationData?.summary?.total_transactions },
    { label: "Successful Transactions", value: applicationData?.summary?.successful_transactions },
    { label: "Failed Transactions", value: applicationData?.summary?.failed_transactions },
    { label: "Success Rate (%)", value: applicationData?.summary?.success_rate },
    { label: "Total Amount", value: `₦${applicationData?.summary?.total_amount?.toLocaleString()}` },
  ]

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Transaction Statistics</h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mb-8">
        {summary.map((stat, index) => (
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

      {/* Transactions by Status */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Transactions by Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {applicationData?.by_status?.map((status, i) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm flex justify-between items-center"
            >
              <p className="text-sm text-gray-600 capitalize">{status.status}</p>
              <p className="text-lg font-semibold text-gray-800">
                {status.count} (₦{status.total_amount.toLocaleString()})
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions by Provider */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Transactions by Provider</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {applicationData?.by_provider?.map((provider, i) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm flex justify-between items-center"
            >
              <p className="text-sm text-gray-600 capitalize">{provider.provider}</p>
              <p className="text-lg font-semibold text-gray-800">
                {provider.count} (₦{provider.total_amount.toLocaleString()})
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions by Type */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Transactions by Type</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {applicationData?.by_type?.map((type, i) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm flex justify-between items-center"
            >
              <p className="text-sm text-gray-600 capitalize">{type.type}</p>
              <p className="text-lg font-semibold text-gray-800">
                {type.count} (₦{type.total_amount.toLocaleString()})
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


export default TransactionStatistics
