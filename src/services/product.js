import axiosInstance from "../../store/axiosInstance";

export const handleProduct = async (page , perPage, search ) => {
  const data = await axiosInstance.get(`/api/products?limit=${page}&page=${perPage}&status=active&search=${search}`);
  return data.data;
}
export const handleSingleProduct = async ( id) => {
  const data = await axiosInstance.get(`/api/products/${id}`);
  return data.data;
}


export const handleMetaProduct = async (page , perPage, search ) => {
  const { data } = await axiosInstance.get(`admin/products?page=${page}&perPage=${perPage}`);
  return data;
}
export const handleBulkProduct = async (url, formInfo) => {
  return axiosInstance.post(url, formInfo);
};

export const handleProductBulk = async () => {
  const { data } = await axiosInstance.get(`/admin/products/download`, {
    responseType: 'blob',  
  });
  return data;
};
export const handleProductVendor = async (id) => {
  const { data } = await axiosInstance.get(`/api/admin/products/vendor/${id}`)
  return data;
};
export const handleApproveProduct = async (id) => {
  const { data } = await axiosInstance.put(`/api/admin/products/${id}/approve`)
  return data;
};
export const handleRejectProd = async (id, formInfo) => {
  const { data } = await axiosInstance.put(`/api/admin/products/${id}/reject`, formInfo)
  return data;
};
export const handleArchive = async (id, formInfo) => {
  const { data } = await axiosInstance.put(`/api/admin/products/${id}/archive`, formInfo)
  return data;
};



export const handleProductBulkImages = async (formInfo) => {
  return axiosInstance.post(`/admin/bulk-upload-images`, formInfo);
 
}
export const handleProductEditBulk = async (url, formInfo) => {
  return axiosInstance.put(url, formInfo);
 
}
export const handleCreateProduct = async (url,formInfo) => {
  return axiosInstance.post(
   url,
    formInfo
  );
};

export const handleUpdateProduct = async (id, formInfo) => {
  return axiosInstance.put(
   `api/admin/product${id}`,
    formInfo
  );
};
export const handleDeleteProduct = async (id, productId) => {
  return axiosInstance.delete(
   `api/admin/products/${id}/attachments/${productId}`,
   
  );
};

export const handleDeletePro = async (id) => {
  return axiosInstance.delete(
   `/api/admin/products/${id}`,
   
  );
};

export const handleGetSingleProduct = async (Id) => {
     const { data } = await axiosInstance.get(`/api/admin/products/${Id}`);
     
    return data.data;
}
export const handleProductStatistics= async () => {
     const { data } = await axiosInstance.get(`/api/admin/products/stats`);
     
    return data.data;
}


export const handleGetCat = async () => {
     const { data } = await axiosInstance.get("/api/admin/categories");
     
    return data;
}
export const handleGetCategories = async () => {
     const { data } = await axiosInstance.get(`/api/admin/categories`);
     
    return data.data;
}

export const handleProductImage = async (id, formInfo) => {
  return axiosInstance.post(
   `api/admin/products/${id}/attachments`,
    formInfo
  );
};
export const handleDeleteImage = async (id, attachmentId, formInfo) => {
  return axiosInstance.delete(
   `api/admin/products/${id}/attachments/${attachmentId}`,
    formInfo
  );
};
export const handleDeleteImageDisplay = async (id,  formInfo) => {
  return axiosInstance.delete(
   `api/admin/products/${id}/display-attachment`,
    formInfo
  );
};

export const handleDisplayProductImage = async (id, formInfo) => {
  return axiosInstance.patch(
   `/api/products/1`,
    formInfo
  );
};
