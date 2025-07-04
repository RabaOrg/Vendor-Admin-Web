import axiosInstance from "../../store/axiosInstance";

export const handleCustomerForm = async (formInfo) => {
  return axiosInstance.post(
   "/admin/create-user",
    formInfo
  );
};
export const handleBusinessDetailsForm = async (Id, formInfo) => {
  
  return axiosInstance.post(
   `/admin/add-business/${Id}`,
    formInfo
  );
};
export const handleFinancialDetailsForm = async (Id, formInfo) => {
  console.log(Id)
  return axiosInstance.post(
   `/admin/add-financial-details/${Id}`,
    formInfo
  );
};

export const handleGuarantorDetailsForm = async (Id ,formInfo) => {
  return axiosInstance.post(
   `/admin/add-guarantor/${Id}`,
    formInfo
  );
};
export const handleEditCustomer = async (Id ,formInfo) => {
  return axiosInstance.put(
   `/admin/user/${Id}`,
    formInfo
  );
};
export const handleEditCustomerBusiness = async (user_Id , Id, formInfo) => {
  return axiosInstance.put(
   `/admin/user/${user_Id}/business/${Id}`,
    formInfo
  );
};

export const handleOneCustomer = async (Id) => {
   
    const { data } = await axiosInstance.get(`/admin/user/${Id}`);
    
    return data.data
}
export const handleVendorCustomer = async (Id) => {
   
    const { data } = await axiosInstance.get(`/api/admin/customers/${Id}`);
    
    return data.data
}


export const handleGetCustomer = async (page, perPage, search) => {
   
    const { data } = await axiosInstance.get(`/api/admin/customers?page=${page}&limit=${perPage}`);
    
    return data.data
}
export const handleGetCustomerBusinessDetails = async (Id) => {
     const { data } = await axiosInstance.get(`/admin/user/${Id}`);
     
    return data.data.Business
}
export const handleGetCustomerStat= async (Id) => {
     const { data } = await axiosInstance.get(`/api/admin/customers/stats`);
     
    return data.data
}
export const handleCustomerImage = async (id, formInfo) => {
  return axiosInstance.post(
   `/admin/add-attachments/${id}`,
    formInfo
  );
};
export const handleGetCustomerFinancialDetails = async (Id) => {
     const { data } = await axiosInstance.get(`/admin/user/${Id}`);
     
    return data.data.FinancialAccounts[0]
}
export const handleGetStates = async () => {
     const { data } = await axiosInstance.get(`/admin/states`);
     
    return data.data
}
export const handleGetCustomerGuarantorDetails = async (Id) => {
     const { data } = await axiosInstance.get(`/admin/user/${Id}`);
     
    return data.data.Guarantors[0]
}
export const handleEditFinancialDetails = async (Id, fid, forminfo) => {
  const { data } = await axiosInstance.put(`admin/user/${Id}/financial-account/${fid}`, forminfo);
  return data
     
   
}
export const handleEditGuarantorDetails = async (Id, Gid, payload) => {
     const { data } = await axiosInstance.put(`/admin/user/${Id}/guarantor/${Gid}`, payload);
     
    return data
}




