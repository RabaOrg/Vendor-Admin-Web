import axiosInstance from "../../store/axiosInstance";
export const handleGetAllTrnsaction = async (start_date, end_date, page, perPage) => {
   
    const { data } = await axiosInstance.get(`/admin/transaction?start_date=${start_date}&end_date=${end_date}&page=${page}&perPage=${perPage}`);
    
    return data.data
}
export const handleGetTransaction = async () => {
   
    const { data } = await axiosInstance.get(`/api/admin/transactions`);
    
    return data.data
}
export const handleGetSingleTransaction = async (id) => {
   
    const { data } = await axiosInstance.get(`/api/admin/transactions/${id}`);
    
    return data.data
}
export const handleGetTransactionStatistics = async () => {
   
    const { data } = await axiosInstance.get(`/api/admin/transactions/stats`);
    
    return data.data
}
export const handleGetTrnsaction = async ( page, perPage) => {
   
    const { data } = await axiosInstance.get(`/admin/transaction?page=${page}&perPage=${perPage}`);
    
    return data.data
}
export const handleGetRecurring = async () => {
   
    const { data } = await axiosInstance.get(`/api/admin/payments/recurring-debits?page=1&limit=20`);
    
    return data.data
}
export const handleGetSingleRecurring = async (id) => {
   
    const { data } = await axiosInstance.get(`/api/admin/payments/recurring-debits/${id}`);
    
    return data.data
}
