import { useQuery } from "@tanstack/react-query"
import { handleGetNotification, handleGetSettingNotification } from "../../services/notification"

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
