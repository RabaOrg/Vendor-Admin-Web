import React from 'react'
import { useFormik } from 'formik'
import { Card, Label, } from 'flowbite-react'
import Button from '../../../../components/shared/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { handleAddSmsNotification } from '../../../../services/notification'
import { useParams } from 'react-router-dom'

function CreateSmsApplication() {
  const { id } = useParams();
  const navigate = useNavigate()
  const [apiResponse, setApiResponse] = React.useState(null);

  const formik = useFormik({
    initialValues: {
      vendor_id: id || "",
      recipient_phone: "",
      product_name: "",
      product_price: "",
      custom_message: "",
    },
    validationSchema: Yup.object({
      vendor_id: Yup.string().required("Vendor ID is required"),
      recipient_phone: Yup.string().required("Recipient phone is required"),
      product_name: Yup.string().required("Product name is required"),
      product_price: Yup.string().required("Product price is required"),
      custom_message: Yup.string().required("Custom message is required"),
    }),
    onSubmit: async (values) => {
      onMutate(values);
    },
  });

  const { mutate: onMutate, isPending } = useMutation({
    mutationFn: async (values) => handleAddSmsNotification(values),
    onSuccess: ({ data }) => {
      setApiResponse(data);
      toast.success(data.message);
      navigate("/email_notification");
    },
    onError: (error) => {
      const errMsg = error.response?.data?.message || error.message;
      setApiResponse({ status: "error", message: errMsg });
      toast.error(errMsg);
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <h1 className="text-3xl font-semibold">
          SMS Application <span className="text-black-400">{'>'}</span> Create SMS
        </h1>
      </div>

      <div className="p-4">
        <Card className="w-full h-full bg-white">
          <h3 className="p-3 px-10">Create SMS Application</h3>
          <div className="w-full border-t-2 border-gray-200"></div>


          {apiResponse && (
            <div
              className={`p-3 mb-4 text-sm rounded-md ${apiResponse.status === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
                }`}
            >
              {apiResponse.message}
            </div>
          )}

          <form className="px-10" onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">

              <div>
                <Label
                  className="text-[#212C25] text-xs font-[500] mb-2 block"
                  htmlFor="vendor_id"
                  value="Vendor ID"
                />
                <input
                  type="text"
                  name="vendor_id"
                  value={formik.values.vendor_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                  placeholder="Enter Vendor ID"
                />
                {formik.touched.vendor_id && formik.errors.vendor_id && (
                  <small className="text-red-500">{formik.errors.vendor_id}</small>
                )}
              </div>


              <div>
                <Label
                  className="text-[#212C25] text-xs font-[500] mb-2 block"
                  htmlFor="recipient_phone"
                  value="Recipient Phone"
                />
                <input
                  type="text" // Now string
                  name="recipient_phone"
                  value={formik.values.recipient_phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                  placeholder="Enter Recipient Phone"
                />
                {formik.touched.recipient_phone && formik.errors.recipient_phone && (
                  <small className="text-red-500">{formik.errors.recipient_phone}</small>
                )}
              </div>


              <div>
                <Label
                  className="text-[#212C25] text-xs font-[500] mb-2 block"
                  htmlFor="product_name"
                  value="Product Name"
                />
                <input
                  type="text"
                  name="product_name"
                  value={formik.values.product_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                  placeholder="Enter Product Name"
                />
                {formik.touched.product_name && formik.errors.product_name && (
                  <small className="text-red-500">{formik.errors.product_name}</small>
                )}
              </div>


              <div>
                <Label
                  className="text-[#212C25] text-xs font-[500] mb-2 block"
                  htmlFor="product_price"
                  value="Product Price"
                />
                <input
                  type="text"
                  name="product_price"
                  value={formik.values.product_price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                  placeholder="Enter Product Price"
                />
                {formik.touched.product_price && formik.errors.product_price && (
                  <small className="text-red-500">{formik.errors.product_price}</small>
                )}
              </div>
            </div>


            <div className="mb-6">
              <Label
                className="text-[#212C25] text-xs font-[500] mb-2 block"
                htmlFor="custom_message"
                value="Custom Message"
              />
              <textarea
                name="custom_message"
                rows="4"
                value={formik.values.custom_message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                placeholder="Enter Custom Message"
              />
              {formik.touched.custom_message && formik.errors.custom_message && (
                <small className="text-red-500">{formik.errors.custom_message}</small>
              )}
            </div>

            <div className="mb-7">
              <Button
                type="submit"
                size="lg"
                className="text-sm w-[150px]"
                label="Send SMS"
                loading={isPending}
              />
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}



export default CreateSmsApplication
