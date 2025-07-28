import React, { useState } from "react";
import { Icons } from "../icons/icon";
import Button from "./button";
import { useAuthStore } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FaSignOutAlt } from 'react-icons/fa';
import OrderList from "../../pages/dashboard/order/orderList";
import { ChevronDown, ChevronUp } from 'lucide-react';

const SidebarComponent = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logOut } = useAuthStore();

    const menuItems = [
        { name: "Dashboard", icon: <Icons.Dashboard />, path: "/" },
        { name: "Customer", icon: <Icons.Customer />, path: "/customer" },
        { name: "Vendor Management", icon: <Icons.Activation />, path: "/vendor_management" },
        { name: "Applications", icon: <Icons.Application />, path: "/application" },
        { name: "Guarantor Management", icon: <Icons.RepaymentPlan />, path: "/guarantor_list" },
        { name: "Payment Details", icon: <Icons.Order />, path: "/payment_details" },
        { name: "Recurring Debits", icon: <Icons.Transaction />, path: "/recurring_debits" },
        { name: "Repayment Schedules", icon: <Icons.Category />, path: "/repayment-plan" },
        // Settings handled separately below
    ];

    const [activeItem, setActiveItem] = useState(() => {
        const currentPath = location.pathname;
        const currentItem = menuItems.find((item) => item.path === currentPath);
        return currentItem ? currentItem.name : "Dashboard";
    });

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleItemClick = (item, path) => {
        setActiveItem(item);
        toggleSidebar();
        navigate(path);
    };

    const handleSettingsToggle = () => {
        setIsSettingsOpen((prev) => !prev);
        setActiveItem("Settings");
    };

    return (
        <div>
            <div className={`${isOpen ? "block" : "hidden"} fixed top-0 left-0 w-64 h-full bg-white z-50 md:block`}>
                <div className="flex flex-col p-5">
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden mb-4 p-2 text-2xl text-gray-700 hover:bg-gray-200 rounded focus:outline-none"
                        aria-label="Close sidebar"
                    >
                        &times;
                    </button>

                    <div>
                        <img src="/raba.png" alt="Logo" />
                    </div>

                    <ul className="space-y-1 mt-14">
                        {menuItems.map((item) => (
                            <li
                                key={item.name}
                                className={`flex items-center text-[#202224] font-medium text-sm space-x-2 px-4 py-3 rounded cursor-pointer ${activeItem === item.name ? "bg-[#0f5d30] text-white" : "text-gray-700 hover:bg-gray-200"
                                    }`}
                                onClick={() => handleItemClick(item.name, item.path)}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.name}</span>
                            </li>
                        ))}

                        {/* Settings Dropdown */}
                        <li
                            className={`flex flex-col text-sm px-4 py-3 rounded cursor-pointer ${activeItem === "Settings" ? "bg-[#0f5d30] text-white" : "text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            <div onClick={handleSettingsToggle} className="flex justify-between items-center">
                                <div className="flex gap-2 items-center">
                                    <span className="text-lg"><Icons.Category /></span>
                                    <span>Settings</span>
                                </div>
                                {isSettingsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>

                            {isSettingsOpen && (
                                <ul className="mt-2 ml-6 space-y-2 transition-all duration-200">
                                    <li
                                        className="text-white hover:text-green-800 hover:underline cursor-pointer"
                                        onClick={() => handleItemClick("Notification", "/notification")}
                                    >
                                        Admin Notification Management
                                    </li>
                                    <li
                                        className="text-white hover:text-[#0f5d30] hover:underline cursor-pointer"
                                        onClick={() => handleItemClick("", "/email_notification")}
                                    >
                                        SMS Notification Management
                                    </li>
                                    {/* Add more sub-items as needed */}
                                </ul>
                            )}
                        </li>
                    </ul>

                    <hr className="mt-10" />

                    <div onClick={() => logOut()} className="flex gap-3 py-14 px-5 cursor-pointer">
                        <FaSignOutAlt className="mt-1" />
                        <p>Logout</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SidebarComponent
