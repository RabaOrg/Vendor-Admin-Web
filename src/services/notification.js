import axiosInstance from "../../store/axiosInstance";

export const handleGetNotification = async () => {
   
    const { data } = await axiosInstance.get(`/api/admin/notifications/emails`);
    
    return data.data
}

export const handleAddNotification = async (formInfo) => {
  return axiosInstance.post(
   "/api/admin/notifications/emails",
    formInfo
  );
};

export const handleAddBulkNotification = async (formInfo) => {
  return axiosInstance.post(
   "/api/admin/notifications/emails/bulk",
    formInfo
  );
};
export const handleAddSmsNotification = async (formInfo) => {
  return axiosInstance.post(
   "/api/admin/sms-applications",
    formInfo
  );
};
export const handleGetSettingNotification = async () => {
   
    const { data } = await axiosInstance.get(`/api/admin/notifications/settings`);
    
    return data.data
}
export const handleGetVendorNotification = async (id) => {
   
    const { data } = await axiosInstance.get(`/api/admin/vendors/${id}/sms-applications?limit=10&offset=0`);
    
    return data.data
}
export const handleGetSmsNotification = async () => {
   
    const { data } = await axiosInstance.get(`/api/admin/sms-applications?limit=20&offset=0`);
    
    return data.data
}
export const handleDeleteNotification = async (email) => {
  return axiosInstance.delete(
   `/api/admin/notifications/emails/${email}`
  );
};
