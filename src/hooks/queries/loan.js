import { useQuery } from "@tanstack/react-query"
import {  handleGetloanApplication, handleGetRepayment, handleGetActivation, handleGetSingleloanApplication, handleGetSingleLoan, handleGetBankStatement, handleGetPaymentOrder, handleGetApplicationStatistics, handleGetVendortatistics, handleGetVendors, handleGetSingleVendor, handleGetGuarantor, handleGetSingleGuarantor, handleGetGuarantortatistics, handleGetGuarantorVerification, handleGetApplicationPayment } from "../../services/loans"


export const useFetchRepayment = () => {
   
    return useQuery({
        queryFn: () => handleGetRepayment(),
        queryKey: ["repayment"],
        
        
    })

}
export const useFetchProductOrder= () => {
   
    return useQuery({
        queryFn: () => handleGetPaymentOrder(),
        queryKey: ["productLoan"],
        
        
    })

}
export const useFetchLoanApplication= (id) => {
   
    return useQuery({
        queryFn: () => handleGetloanApplication(id),
        queryKey: ["Application", id],
        
        
    })

}
export const useFetchGuarantor= (id) => {
   
    return useQuery({
        queryFn: () => handleGetGuarantor(id),
        queryKey: ["Guarantor", id],
        
        
    })

}
export const useFetchGuarantorVerification = (id) => {
   
    return useQuery({
        queryFn: () => handleGetGuarantorVerification(id),
        queryKey: ["Guarantorverification", id],
        
        
    })

}
export const useFetchSingleGuarantor= (id) => {
   
    return useQuery({
        queryFn: () => handleGetSingleGuarantor(id),
        queryKey: ["singleguarantor", id],
        
        
    })

}

export const useFetchApplication= () => {
   
    return useQuery({
        queryFn: () => handleGetApplicationStatistics(),
        queryKey: ["ApplicationStatistics"],
        
        
    })

}
export const useFetchVendor= () => {
   
    return useQuery({
        queryFn: () => handleGetVendortatistics(),
        queryKey: ["ApplicationStatistics"],
        
        
    })

}
export const useFetchGuarantorVendor= () => {
   
    return useQuery({
        queryFn: () =>handleGetGuarantortatistics(),
        queryKey: ["guarantorStatistics"],
        
        
    })

}

export const useFetchSingleLoan= (id) => {
  return useQuery({
    queryFn: () => handleGetSingleLoan(id),
    queryKey: ["singleLoanApplication", id]
  });
}
// export const useFetchBankStatement= (id) => {
//   return useQuery({
//     queryFn: () => handleGetBankStatement(id),
//     queryKey: ["singleBankStatement", id]
//   });
// }



export const useFetchVendorData = ({ page, limit  }) => {
   
    return useQuery({
        queryFn: () => handleGetVendors({ page, limit  }),
        queryKey: ["getvendors",page, limit]
        
        
    })

}
export const useFetchSingleVendorData = (id) => {
   
    return useQuery({
        queryFn: () => handleGetSingleVendor(id),
        queryKey: ["getsinglevendors"]
        
        
    })

}
export const useFetchApplicationPayment = (id) => {
   
    return useQuery({
        queryFn: () => handleGetApplicationPayment(id),
        queryKey: ["getapplicationpayment"]
        
        
    })

}
export const useFetchSingleActivation = (id) => {
   
    return useQuery({
        queryFn: () => handleGetSingleloanApplication(id),
        queryKey: ["activations", id]
        
        
    })

}
