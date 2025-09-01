import { useQuery } from "@tanstack/react-query"
import { handleAgentActive, handleAgentStatistics, handleAllAgent, handleDeleteAgent, handleSingleAgent } from "../../services/agent"
export const useFetchAgent = () => {
  
    return useQuery({
        queryFn: () => handleAllAgent(),
        queryKey: ["AgentAll"],
        
        
    })

}
export const useFetchSingleAgent = (id) => {
  
    return useQuery({
        queryFn: () => handleSingleAgent(id),
        queryKey: ["AgentSingle", id],
        
        
    })

}
export const useFetchAgentStatistics= () => {
  
    return useQuery({
        queryFn: () => handleAgentStatistics(),
        queryKey: ["AgentStatistics"],
        
        
    })

}
export const useFetchAgentActive= () => {
  
    return useQuery({
        queryFn: () => handleAgentActive(),
        queryKey: ["AgentActive"],
        
        
    })

}
export const useFetchDeleteAgent = (id) => {
  
    return useQuery({
        queryFn: () => handleDeleteAgent(id),
        queryKey: ["DeleteAgent", id],
        
        
    })

}
