import axiosInstance from "../../store/axiosInstance";
export const handleAllAgent = async () => {
   
    const { data } = await axiosInstance.get("/api/admin/agents?page=1&limit=20&status=active");
    
    return data.data
}
export const handleSingleAgent = async (id) => {
   
    const { data } = await axiosInstance.get(`/api/admin/agents/${id}`);
    
    return data.data
}
export const handleAgentStatistics = async () => {
   
    const { data } = await axiosInstance.get(`/api/admin/agents/stats`);
    
    return data.data
}
export const handleAgentActive = async () => {
   
    const { data } = await axiosInstance.get(`/api/admin/agents/active`);
    
    return data.data
}
export const handleDeleteAgent = async (id) => {
   
    const { data } = await axiosInstance.delete(`/api/admin/agents/${id}`);
    
    return data.data
}

export const handleUpdateAgent = async (id) => {
   
    const { data } = await axiosInstance.put(`/api/admin/agents/${id}`);
    
    return data.data
}
export const handleCreateAgent = async (forminfo) => {
   
    const { data } = await axiosInstance.post(`/api/admin/agents`, forminfo);
    
    return data.data
}
