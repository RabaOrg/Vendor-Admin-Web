import React from 'react'
import { useFetchProductStat } from '../../../hooks/queries/product'

const ProductStats = () => {
  const { data: productStats, isPending, isError } = useFetchProductStat()
  console.log(productStats)
  const stats = [
    { label: 'Total Products', value: productStats?.total },
    { label: 'Active Products', value: productStats?.active },
    { label: 'Inactive Products', value: productStats?.inactive },
    { label: 'Archived Products', value: productStats?.archived }
  ]

  if (isPending) {
    return <p className="text-center text-gray-600 py-10">Loading product statistics...</p>
  }

  if (isError) {
    return <p className="text-center text-red-500 py-10">Failed to load product statistics.</p>
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📦 Product Statistics</h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow transition"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-semibold text-gray-800 mt-2">{stat.value ?? '—'}</p>
          </div>
        ))}
      </div>

      {/* By Category */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">🗂️ Products by Category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {productStats?.byCategory?.length ? (
            productStats?.byCategory.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <p className="text-sm text-gray-500">Category</p>
                <p className="text-lg font-medium text-gray-800">{item.category}</p>
                <p className="text-sm text-gray-600 mt-1">Products: {item.count}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No category data available.</p>
          )}
        </div>
      </div>

      {/* By Vendor */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">🏷️ Products by Vendor</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {productStats?.byVendor?.length ? (
            productStats?.byVendor.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <p className="text-sm text-gray-500">Vendor</p>
                <p className="text-lg font-medium text-gray-800">
                  {item.Vendor?.name || `Vendor ID: ${item.vendor_id}`}
                </p>
                <p className="text-sm text-gray-600 mt-1">Products: {item.count}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No vendor data available.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductStats
