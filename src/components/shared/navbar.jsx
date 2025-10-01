import React from "react";
import { Navbar, Dropdown, Avatar } from "flowbite-react";
import { useAuthStore } from "../../../store/store";

const NavbarComponent = ({ toggleSidebar }) => {
    const { isLoggedIn, user } = useAuthStore();
    const { logOut } = useAuthStore();


    return (
        <Navbar fluid rounded className="bg-white shadow-sm border-gray-200 p-4">
            <div className="flex items-center justify-between w-full">
                {/* Sidebar Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="md:hidden text-xl text-gray-700"
                >
                    &#9776;
                </button>

                {/* Spacer for Large Screens */}
                <div className="flex-1"></div>

                {/* Avatar and Name */}
                <div className="flex items-center gap-3">
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar
                                alt="User settings"
                                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                rounded
                            />
                        }
                    >
                        <Dropdown.Item>Profile</Dropdown.Item>
                        <Dropdown.Item>Settings</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={logOut}>Logout</Dropdown.Item>
                    </Dropdown>

                    <div>
                        <p className="text-gray-700 font-semibold">{user?.username}</p>
                        <p className="text-sm text-gray-500">{user?.role}</p>
                    </div>
                </div>
            </div>
        </Navbar>


    );
};

export default NavbarComponent;
