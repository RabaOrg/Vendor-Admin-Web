import { useQuery } from "@tanstack/react-query";
import { handleGetAllTrnsaction, handleGetSingleRecurring, handleGetSingleTransaction, handleGetTransaction, handleGetTransactionStatistics } from "../../services/transaction";
import { handleGetRecurring } from "../../services/transaction";

export const useFetchTransactionDetails = (start_date, end_date, page, perPage) => {
  
    return useQuery({
        queryFn: () => handleGetAllTrnsaction(start_date, end_date, page, perPage),
        queryKey: ["businesstransaction", { start_date, end_date, page, perPage}],
        
        
    })

}
export const useFetchTransaction= () => {
  
    return useQuery({
        queryFn: () => handleGetTransaction(),
        queryKey: ["transaction"],
        
        
    })

}
export const useFetchSingleTransaction= (id) => {
  
    return useQuery({
        queryFn: () => handleGetSingleTransaction(id),
        queryKey: ["singletransaction", id],
        
        
    })

}
export const useFetchTransactionStat= () => {
  
    return useQuery({
        queryFn: () => handleGetTransactionStatistics(),
        queryKey: ["stattransaction"],
        
        
    })

}
export const useFetchAllTransactionDetails = ( page, perPage) => {
  
    return useQuery({
        queryFn: () => handleGetAllTrnsaction( page, perPage),
        queryKey: ["businessAlltransaction", { page, perPage}],
        
        
    })

}
export const useFetchAllRecurring = () => {
  
    return useQuery({
        queryFn: () => handleGetRecurring(),
        queryKey: ["recurring"],
        
        
    })

}
export const useFetchAllSingleRecurring = (id) => {
  
    return useQuery({
        queryFn: () => handleGetSingleRecurring(id),
        queryKey: ["singlerecurring"],
        
        
    })

}