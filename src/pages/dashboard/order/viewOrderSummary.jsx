import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFetchSingleOrder } from '../../../hooks/queries/order';
import Button from '../../../components/shared/button';
import { useQueryClient } from "@tanstack/react-query";

import { handleUpdateOrders } from '../../../services/order';
// import { useFetchOrderSummary } from '../../../hooks/queries/order'

function ViewOrderSummary() {
  const { id } = useParams();
  const { data: singleOrder, isPending, isError } = useFetchSingleOrder(id);
  const [selectedStatus, setSelectedStatus] = useState("");

  const stats = [
    {
      label: "Total Daily Amount",
      value: singleOrder?.daily_trend?.[0]?.amount,
    },
    {
      label: "Daily Transactions Count",
      value: singleOrder?.daily_trend?.[0]?.count,
    },
    {
      label: "Recurring Debits - Active",
      value: singleOrder?.recurring_debits?.active,
    },
    {
      label: "Recurring Debits - Total",
      value: singleOrder?.recurring_debits?.total,
    },
    {
      label: "Recurring Debits - Completion Rate",
      value: `${singleOrder?.recurring_debits?.completion_rate ?? 0}%`,
    },
    {
      label: "Scheduled Payments - Pending",
      value: singleOrder?.scheduled_payments?.pending,
    },
    {
      label: "Scheduled Payments - Due Today",
      value: singleOrder?.scheduled_payments?.due_today,
    },
    {
      label: "Scheduled Payments - This Month",
      value: singleOrder?.scheduled_payments?.this_month,
    },
    {
      label: "Transactions - Successful This Month",
      value: singleOrder?.transactions?.successful_this_month,
    },
    {
      label: "Transactions - Total Amount",
      value: `₦${Number(singleOrder?.transactions?.total_amount_this_month).toLocaleString()}`,
    },
    {
      label: "Transactions - Success Rate",
      value: `${singleOrder?.transactions?.success_rate ?? 0}%`,
    },
    {
      label: "Reminders Sent This Month",
      value: singleOrder?.reminders?.sent_this_month,
    },
  ];

  if (isPending) {
    return <p className="text-center text-gray-600 py-10">Loading payment statistics...</p>;
  }

  if (isError) {
    return <p className="text-center text-red-500 py-10">Failed to load statistics.</p>;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Payment Statistics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-semibold text-gray-800 mt-2">
              {stat.value ?? '—'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}




export default ViewOrderSummary
