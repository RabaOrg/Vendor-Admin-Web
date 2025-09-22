

import axios from "axios";
import axiosInstance from "../../store/axiosInstance";


export const handleGetRepayment = async () => {
     const { data } = await axiosInstance.get(`/api/admin/repayment-plans`);
     
    return data
}
export const handleDeleteApplication= async (id, forminfo) => {
  const { data } = await axiosInstance.delete(`/api/admin/applications/${id}`, {
         data: forminfo,
     });
     
    return data.data
}
export const handleDeleteGuarantorApplication= async (id, forminfo) => {
  const { data } = await axiosInstance.delete(`/admin/guarantors/${id}`, {
         data: forminfo,
     });
     
    return data.data
}
export const handleDeleteVendor= async (id, forminfo) => {
  const { data } = await axiosInstance.delete(`/api/admin/vendors/${id}`, {
         data: forminfo,
     });
     
    return data.data
}
export const handleDeleteCustomer= async (id, forminfo) => {
  const { data } = await axiosInstance.delete(`/api/admin/customers/${id}`, {
         data: forminfo,
     });
     
    return data.data
}
export const handleGetloanApplication = async ({ page = 1, limit = 10 }) => {
  const { data } = await axiosInstance.get(`/api/admin/applications?page=${page}&limit=${limit}`);
  return data;
};

export const handleGetGuarantor = async ({ page = 1, limit = 10 }) => {
     const  data  = await axiosInstance.get(`/api/admin/guarantors?page=${page}&limit=${limit}`);
     
    return data
}
export const handleGetGuarantorVerification = async ({ page = 1, limit = 10 }) => {
     const  data  = await axiosInstance.get(`/api/admin/guarantor-verifications?page=${page}&limit=${limit}`);
     
    return data
}
export const handleGetSingleGuarantor = async (id) => {
     const  data  = await axiosInstance.get(`/api/admin/guarantors/${id}`);
     
    return data.data
}

export const handleGetApplicationStatistics = async () => {
     const  data  = await axiosInstance.get("/api/admin/applications/stats");
     
    return data.data
}
export const handleGetVendortatistics = async () => {
     const  data  = await axiosInstance.get("/api/admin/vendors/stats");
     
    return data.data
}
export const handleGetGuarantortatistics = async () => {
     const  data  = await axiosInstance.get("/api/admin/guarantors/stats");
     
    return data.data
}



export const handleGetBankStatement = async (id) => {
     const  data  = await axiosInstance.get(`/admin/users/${id}/bank-statements`);
     
    return data.data
}
export const handleGetSingleLoan = async (id) => {
  const { data } = await axiosInstance.get(`/api/admin/applications/${id}`)
  return data.data;
}
export const handleGetActivation = async () => {
     const data  = await axiosInstance.get("/admin/loans");
     
    return data.data
}
export const handleGetVendors= async ({ page = 1, limit = 10 }) => {
     const data  = await axiosInstance.get(`/api/admin/vendors?page=${page}&limit=${limit}`);
     
    return data
}



export const  handleRepayment = async (formInfo) => {
  return axiosInstance.post(
   "/admin/repayment_plans",
    formInfo
  );
};
export const  handleUpdateStatus = async (id, formInfo) => {
  return axiosInstance.patch(
   `/api/admin/applications/${id}/status`, formInfo
  );
};
export const  handleUpdateGuarantorStatus = async (id, formInfo) => {
  return axiosInstance.patch(
   `/api/admin/guarantors/${id}/status`, formInfo
  );
};


export const  handleUpdateLoanStatus = async (id, formInfo) => {
  return axiosInstance.put(
   `/admin/loans/${id}/status`, formInfo
  );
};
export const  handleUpdateVendorStatus = async (id, formInfo) => {
  return axiosInstance.patch(
   `/api/admin/vendors/${id}/status`, formInfo
  );
};
export const  handleUpdateverification = async (id, formInfo) => {
  return axiosInstance.patch(
   `/api/admin/vendors/${id}/verification/approve`, formInfo
  );
};
export const  handleUpdateCustomerStatus = async (id, formInfo) => {
  return axiosInstance.patch(
   `/api/admin/customers/${id}/status`, formInfo
  );
}

export const  handleCreateLoanApplication = async (formInfo) => {
  return axiosInstance.post(
   "/admin/loanapplication/creation",
    formInfo
  );
};
export const handleGetSingleloanApplication = async (id) => {
     const  data  = await axiosInstance.get(`/admin/loans/${id}`);
     
    return data.data.data
}
export const handleGetSingleVendor = async (id) => {
     const  data  = await axiosInstance.get(`/api/admin/vendors/${id}`);
     
    return data.data.data
}
export const handleGetApplicationPayment= async (id) => {
     const  data  = await axiosInstance.get(`api/admin/applications/${id}/payments`);
     
    return data.data.data
}


export const handleGetPaymentOrder = async () => {
     const  data  = await axiosInstance.get(`/admin/payment-analytics`);
     
    return data
}

