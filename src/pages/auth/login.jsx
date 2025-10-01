import React from 'react'
import { useState } from 'react';
import { Card } from 'flowbite-react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../../store/axiosInstance"
import { toast } from 'react-toastify';

import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useAuthStore } from '../../../store/store';

function Login() {
    const [user, setUsers] = useState({
        username: "",
        password: "",
    });
    const { login } = useAuthStore()
    const Navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const handleInput = (e) => {
        const { name, value } = e.target
        setUsers({ ...user, [name]: value })


    }
    const handleSubmitForm = async (e) => {
        e.preventDefault()
        console.log("go")


        if (!user.username || !user.password) {
            toast.error("All fields are required")
            return;
        }
        try {
            setLoading(true)
            const { data } = await axiosInstance.post("/api/admin/auth/login", {
                username: user.username,
                password: user.password
            })

            console.log(data)
            console.log(data.data.token)
            login(data.data.token, data.data.admin)
            Navigate("/")
            toast.success(data.message)
        } catch (error) {
            console.log(error)
            if (error.response && error.response.data) {
                toast.error(error.response.data.message)
            } else {
                toast.error("An unexpected error occured")
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="background relative w-full h-screen bg-center">
            <Card
                className="absolute px-4 top-1/2 pb-14 pt-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg bg-white  rounded-2xl
                w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md"
            >
                <div>
                    <h2
                        style={{ fontWeight: "700" }}
                        className="text-center text-[#202224] leading-10 font-bold 
               text-lg sm:text-sm md:text-lg lg:text-2xl"
                    >
                        Raba Admin Dashboard
                    </h2>
                    <p style={{ fontWeight: "500" }} className="text-gray-600 mt-1 text-sm sm:text-xs md:text-sm lg-text-sm break-words text-center leading-8 ">
                        Please enter your email and password to continue
                    </p>
                </div>
                <form className="flex flex-col gap-4" onSubmit={(e) => handleSubmitForm(e)}>
                    <div>
                        <div className="mb-2 block">

                            <Label className="text-gray-600 font-medium" htmlFor="email2" value="Username" />
                        </div>
                        <TextInput style={{
                            backgroundColor: "#f1f4f9",
                            color: "#202224",
                            borderRadius: "8px",

                        }} id="email2"
                            onChange={(e) => handleInput(e)}
                            type="text"
                            name='username'
                            value={user.username}
                            className="bg-[#f1f4f9]!important text-sm text-gray-700 border 
                                rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none"
                            placeholder="username" required shadow />
                    </div>
                    <div>
                        <div className="mb-2 block mt-2">
                            <Label className="font-medium text-gray-600" htmlFor="password2" value="Password" />
                        </div>
                        <TextInput style={{
                            backgroundColor: "#f1f4f9",
                            color: "#202224",
                            borderRadius: "8px",

                        }} id="password"
                            value={user.password}
                            onChange={(e) => handleInput(e)} name="password" className="bg-[#f1f4f9]!important text-sm text-gray-700 borderrounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none" type="password" required shadow />
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="agree" />
                        <Label htmlFor="agree" className="font-medium text-gray-600 flex">
                            Remember Password
                        </Label>
                    </div>
                    <div className='flex justify-center'>
                        <Button type="submit" disabled={loading} className="bg-[#0f5d30] w-80 mt-7 focus:outline-none focus:ring-0 active:bg-[#0e4d28]">
                            {loading ? (
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8z"
                                    ></path>
                                </svg>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>

    )
}

export default Login
