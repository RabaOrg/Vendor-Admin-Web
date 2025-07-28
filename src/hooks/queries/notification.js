import { useQuery } from "@tanstack/react-query"
import { handleGetNotification, handleGetSettingNotification, handleGetSmsNotification, handleGetVendorNotification } from "../../services/notification"

export const useFetchGetNotification = () => {
   
    return useQuery({
        queryFn: () => handleGetNotification(),
        queryKey: ["notification"],
        
        
    })

}

export const useFetchGetNotificationSettings = () => {
   
    return useQuery({
        queryFn: () => handleGetSettingNotification(),
        queryKey: ["notificationsettings"],
        
        
    })


}
export const useFetchGetSmsNotification = () => {
   
    return useQuery({
        queryFn: () => handleGetSmsNotification(),
        queryKey: ["smsnotification"],
        
        
    })
}
export const useFetchGetVendorNotification = (id) => {
   
    return useQuery({
        queryFn: () => handleGetVendorNotification(id),
        queryKey: ["vendornotification", id],
        
        
    })
}

