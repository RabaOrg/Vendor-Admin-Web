import React, { useState, useEffect } from 'react'
import { Card, Label, } from 'flowbite-react'
import { Link } from 'react-router-dom'
import Button from '../../../components/shared/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'

import * as Yup from 'yup'
import { handleCreateAgent } from '../../../services/agent'


function CreateAgent() {
  const query = useQueryClient()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      employee_id: "",
      position: "",
      department: "",
      hire_date: "",
      commission_rate: "",
      target_monthly_sales: "",
      notes: "",
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("First name is required"),
      last_name: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone_number: Yup.string().required("Phone number is required"),
      employee_id: Yup.string().required("Employee ID is required"),
      position: Yup.string().required("Position is required"),
      department: Yup.string().required("Department is required"),
      hire_date: Yup.date().required("Hire date is required"),
      commission_rate: Yup.number().typeError("Must be a number").required("Commission rate is required"),
      target_monthly_sales: Yup.number().typeError("Must be a number").required("Target monthly sales is required"),
      notes: Yup.string().required("Notes are required"),
    }),
    onSubmit: async (values) => {
      console.log(values)
      onMutate(values)
    },
  })

  const { mutate: onMutate, isPending } = useMutation({
    mutationFn: async (values) => handleCreateAgent(values),
    onSuccess: ({ data }) => {
      toast.success("Agent created successfully")
      navigate("/agent_statistics")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleCancel = () => navigate("/agent_statistics")

  return (
    <div>

      <div className="flex items-center justify-between p-4">
        <h1 className="text-3xl font-semibold">
          Agent <span className="text-black-400">{">"}</span> Create Agent
        </h1>
        <div className="flex gap-3">
          <Button
            label="Cancel"
            variant="transparent"
            size="lg"
            onClick={handleCancel}
            className="text-sm w-[150px]"
          />
          <Button
            label="Create Agent"
            variant="solid"
            disabled={isPending}
            size="md"
            className="text-sm px-6 py-5"
          />
        </div>
      </div>


      <div className="p-4">
        <Card className="w-full h-full bg-white">
          <h3 className="p-3 px-10">Create Agent</h3>
          <div className="w-full border-t-2 border-gray-200"></div>

          <form className="px-10 py-6" onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <InputField formik={formik} name="first_name" label="First Name" placeholder="Enter first name" />

              <InputField formik={formik} name="last_name" label="Last Name" placeholder="Enter last name" />

              <InputField formik={formik} name="email" label="Email" placeholder="Enter email" type="email" />

              <InputField formik={formik} name="phone_number" label="Phone Number" placeholder="Enter phone number" />

              <InputField formik={formik} name="employee_id" label="Employee ID" placeholder="Enter employee ID" />

              <InputField formik={formik} name="position" label="Position" placeholder="Enter position" />

              <InputField formik={formik} name="department" label="Department" placeholder="Enter department" />

              <InputField formik={formik} name="hire_date" label="Hire Date" placeholder="Select hire date" type="date" />

              <InputField
                formik={formik}
                name="commission_rate"
                label="Commission Rate (%)"
                placeholder="Enter commission rate"
                type="number"
              />

              <InputField
                formik={formik}
                name="target_monthly_sales"
                label="Target Monthly Sales"
                placeholder="Enter target monthly sales"
                type="number"
              />

              <div className="col-span-2">
                <Label className="text-[#212C25] text-xs font-[500]" htmlFor="notes">
                  Notes
                </Label>
                <textarea
                  name="notes"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.notes}
                  placeholder="Type Experienced sales professional"
                  className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full h-24"
                />
                {formik.touched.notes && formik.errors.notes && (
                  <small className="text-red-500">{formik.errors.notes}</small>
                )}
              </div>
            </div>


            <div className="mt-8">
              <Button
                type="submit"
                size="lg"
                label="Create Agent"

                className="text-sm w-[180px]"
                loading={isPending}
              />
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}


const InputField = ({ formik, name, label, placeholder, type = "text" }) => (
  <div>
    <Label className="text-[#212C25] text-xs font-[500]" htmlFor={name}>
      {label}
    </Label>
    <input
      type={type}
      name={name}
      value={formik.values[name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      placeholder={placeholder}
      className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
    />
    {formik.touched[name] && formik.errors[name] && (
      <small className="text-red-500">{formik.errors[name]}</small>
    )}
  </div>
)


export default CreateAgent
