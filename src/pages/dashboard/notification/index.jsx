import React, { useState } from 'react'
import { Bell, Send, Trash, Plus, Upload } from "lucide-react";
import { useFetchGetNotification, useFetchGetNotificationSettings } from '../../../hooks/queries/notification';

import { handleAddNotification, handleDeleteNotification, handleAddBulkNotification } from '../../../services/notification';
import { toast } from 'react-toastify';
import { useQueryClient } from "@tanstack/react-query";
import Button from '../../../components/shared/button';

function Notification() {
  const { data: getNotification } = useFetchGetNotification();
  const { data: getNotificationSettings } = useFetchGetNotificationSettings();
  const [emails, setEmail] = useState();
  const queryClient = useQueryClient();
  const [bulkEmails, setBulkEmails] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadings, setIsLoadings] = useState(false);

  const handleDelete = async (email) => {
    try {
      const response = await handleDeleteNotification(email);
      if (response) {
        toast.success("Email deleted successfully");
        queryClient.invalidateQueries(["notification"]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async () => {
    setIsLoading(true);
    try {
      const response = await handleAddNotification({
        email: emails,
      });
      if (response) {
        toast.success("Email added successfully");
        queryClient.invalidateQueries(["notification"]);
        setEmail("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkAdd = async () => {
    const emailList = bulkEmails
      .split(",")
      .map(email => email.trim())
      .filter(email => email.length > 0);

    if (emailList.length === 0) {
      toast.error("Please enter at least one valid email.");
      return;
    }

    setIsLoadings(true);
    try {
      const response = await handleAddBulkNotification({ emails: emailList });
      if (response) {
        toast.success("Bulk emails added successfully.");
        queryClient.invalidateQueries(["notification"]);
        setBulkEmails("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while adding bulk emails.");
    } finally {
      setIsLoadings(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-10">

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Notification Settings</h1>
        <p className="text-gray-600 mt-2 text-sm">Manage who receives system alerts and notification types.</p>
      </div>


      <section className="bg-white p-6 rounded-2xl shadow space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Add Admin Email</h2>
        <div className="flex gap-4">
          <input
            type="email"
            value={emails}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Enter admin email"
          />
          <Button
            label="Add Email"
            onClick={handleAdd}
            variant="solid"
            size="md"
            className="text-sm px-6 py-2"
            loading={isLoading}
          />
        </div>
      </section>


      <section className="bg-white p-6 rounded-2xl shadow space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Bulk Add Emails</h2>
        <textarea
          rows="4"
          value={bulkEmails}
          onChange={(e) => setBulkEmails(e.target.value)}
          placeholder="Enter emails separated by commas (e.g. admin@raba.com, support@raba.com)"
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleBulkAdd}
          disabled={isLoadings}
          className="inline-flex items-center gap-2 bg-green-800 hover:bg-green-900 text-white px-5 py-2 rounded-md transition text-sm disabled:opacity-60"
        >
          <Upload className="w-4 h-4" />
          {isLoadings ? "Uploading..." : "Add Bulk Emails"}
        </button>
      </section>


      <section className="bg-white p-6 rounded-2xl shadow space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Current Admin Emails</h2>
        <ul className="space-y-3">
          {getNotification?.emails?.map((email, index) => (
            <li
              key={`${email}-${index}`}
              className="flex items-center justify-between bg-gray-50 border border-gray-200 px-4 py-2 rounded-md"
            >
              <span className="text-sm text-gray-700">{email}</span>
              <button
                onClick={() => handleDelete(email)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white p-6 rounded-2xl shadow space-y-5">
        <h2 className="text-lg font-semibold text-gray-800">Notification Types</h2>
        <ul className="space-y-4">
          {getNotificationSettings?.notification_types?.map((notif, index) => (
            <li
              key={index}
              className="flex items-start justify-between p-4 border border-gray-100 rounded-lg hover:shadow-sm transition"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-800 capitalize">
                  {notif.type.replace(/_/g, " ")}
                </p>
                <p className="text-xs text-gray-500">{notif.description}</p>
              </div>
              <input
                type="checkbox"
                checked={notif.enabled}
                onChange={() => { }}
                disabled
                className="w-5 h-5 mt-1 accent-blue-600"
              />
            </li>
          ))}
        </ul>
      </section>


    </div>
  );

}

export default Notification
