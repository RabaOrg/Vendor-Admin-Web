import React from 'react'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import Button from '../../../../components/shared/button'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useFetchSingleLoan } from '../../../../hooks/queries/loan'
import { handleEditApplication } from '../../../../services/loans'

function EditApplication() {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const { data: singleLoan, isPending, isError } = useFetchSingleLoan(id);
  const [preview, setPreview] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState("");
  console.log(singleLoan)
  const [formData, setFormData] = useState({
    amount: 0,
    down_payment_percent: 0,
    interest_rate: 0,
    status_notes: "",
    shipping_address: "",
    approved_amount: 0,
    credit_score: 0,
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_bvn: "",
    guarantor_name: "",
    guarantor_phone: "",
    guarantor_email: "",
    guarantor_address: "",
    product_name: "",
    product_price: "",
    product_description: "",
    bank_name: "",
    bank_code: "",
    account_number: "",
    account_name: "",
    calculation_breakdown: {
      display_price: 0,
      management_fee: 0,
      total_with_management_fee: 0,
      down_payment: 0,
      financed_amount: 0,
      monthly_interest_rate: 0,
      total_interest: 0,
      monthly_payment: 0,
      lease_term_months: 0
    },
    admin_notes: "",
    last_review_date: "",
    review_status: "",
    internal_comments: "",
    metadata: {
      documents: [],
    },
    documents: [],
  });

  useEffect(() => {
    if (singleLoan) {
      setFormData(prev => ({
        ...prev,
        amount: singleLoan?.amount || 0,
        down_payment_percent: singleLoan?.down_payment_percent || 0,
        interest_rate: singleLoan?.interest_rate || 0,
        status_notes: singleLoan?.status_notes || "",
        shipping_address: singleLoan?.shipping_address || "",
        approved_amount: singleLoan?.approved_amount || 0,
        credit_score: singleLoan?.credit_score || 0,
        customer_name: singleLoan?.Customer?.full_name || "",
        customer_email: singleLoan?.Customer?.email || "",
        customer_phone: singleLoan?.Customer?.phone_number || "",
        customer_bvn: singleLoan?.Customer?.bvn || "",
        guarantor_name: singleLoan?.application_data?.guarantor_name || "",
        guarantor_phone: singleLoan?.application_data?.guarantor_phone || "",
        guarantor_email: singleLoan?.application_data?.guarantor_email || "",
        guarantor_address: singleLoan?.application_data?.guarantor_address || "",
        product_name: singleLoan?.application_data?.product_name || "",
        product_price: singleLoan?.application_data?.product_price || "",
        product_description: singleLoan?.application_data?.product_description || "",
        bank_name: singleLoan.application_data?.bank_name || "",
        bank_code: singleLoan?.application_data?.bank_code || "",
        account_number: singleLoan.customer_details?.bank_details?.account_number || "",
        account_name: singleLoan.customer_details?.bank_details?.account_name || "",
        calculation_breakdown: singleLoan?.application_data?.calculation_breakdown || prev.calculation_breakdown,
        admin_notes: singleLoan?.admin_notes || "",
        last_review_date: singleLoan?.updated_at || "",
        review_status: singleLoan?.status || "",
        internal_comments: singleLoan?.status_description || ""
      }));
    }
  }, [singleLoan]);

  if (!singleLoan) {
    return <p>Loading application...</p>;
  }

  const {
    Customer,
    Product,
    application_data,
    repayment_dates,
    status,
    created_at,
    amount,
    down_payment_percent,
    interest_rate,
    shipping_address,
  } = singleLoan;

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };
  const documentTypes = [
    { value: "id_card", label: "ID Card" },
    { value: "utility_bill", label: "Utility Bill" },
    { value: "payslip", label: "Payslip" },
    { value: "bank_statement", label: "Bank Statement" },
    { value: "other", label: "Other" },
  ];

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedDocType) return;

    const base64File = await fileToBase64(file);

    const newDoc = {
      file: base64File,
      filename: file.name,
      contentType: file.type,
      type: selectedDocType,
    };

    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, newDoc],
      metadata: {
        ...prev.metadata,
        documents: [...(prev.metadata.documents || []), newDoc],
      },
    }));

    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
      metadata: {
        ...prev.metadata,
        documents: prev.metadata.documents.filter((_, i) => i !== index),
      },
    }));
    setPreview(null);
  };
  const handleEdit = async () => {
    setIsLoading(true)
    try {
      const response = await handleEditApplication(id, formData)
      if (response) {
        toast.success("Application edited successfully")
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-10">
      <div className='flex justify-end'>
        <Link to={'/application'}>
          <Button
            label="View Application List"

            variant="outline"
            size="sm"
            className="px-4 py-2 text-sm"
          />
        </Link>
      </div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-2">

        <div className="p-6 border-b flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="text-3xl font-bold text-gray-800">
            Edit Application Details ({singleLoan?.Customer?.full_name})
          </h2>

        </div>


        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Customer's Information</h3>
            <div className="space-y-4">

              <div>
                <label className="block text-sm text-gray-600 mb-1">Customer Name</label>
                <input
                  type="text"
                  onChange={(e) =>
                    setFormData({ ...formData, customer_name: e.target.value })
                  }
                  value={formData.customer_name}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">BVN</label>
                <input
                  type="text"
                  onChange={(e) => setFormData({ ...formData, customer_bvn: e.target.value })}
                  value={formData?.customer_bvn}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1"> Status Note</label>
                <input
                  type="text"

                  value={status}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Customer Email</label>
                <input
                  type="text"
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  value={formData.customer_email}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Customer Phone_Number</label>
                <input
                  type="text"
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  value={formData.customer_phone}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Created At</label>
                <input
                  type="text"

                  value={new Date(Customer.created_at).toLocaleDateString()}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>


          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Product Information</h3>
            <div className="space-y-4">
              ``
              <div>
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <input
                  type="text"
                  onChange={(e) => setFormData({ ...formData, product_description: e.target.value })}
                  value={formData?.product_description}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}

                  value={formData?.product_name}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Price</label>
                <input
                  type="text"
                  onChange={(e) => setFormData({ ...formData, product_price: e.target.value })}


                  value={formData?.product_price}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Shipping Address</label>
                <input
                  type="text"

                  onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                  value={formData?.shipping_address}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>


            </div>
          </div>


          <div className="bg-gray-50 p-6 rounded-lg shadow-sm md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Application_type</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Account_Number</label>
                <input
                  type="text"
                  onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}

                  value={application_data?.account_number}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>


              <div>
                <label className="block text-sm text-gray-600 mb-1">Bank Name</label>
                <input
                  type="text"
                  onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                  value={formData?.bank_name}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Bank Code</label>
                <input
                  type="text"
                  onChange={(e) => setFormData({ ...formData, bank_code: e.target.value })}
                  value={formData?.bank_code}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>



              <div>
                <label className="block text-sm text-gray-600 mb-1">Guarantor's Address</label>
                <input
                  type="text"

                  value={formData?.guarantor_address}
                  onChange={(e) => setFormData({ ...formData, guarantor_address: e.target.value })}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Guarantor's Name</label>
                <input
                  type="text"

                  value={formData?.guarantor_name}
                  onChange={(e) => setFormData({ ...formData, guarantor_name: e.target.value })}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Guarantor's Phone</label>
                <input
                  type="text"

                  value={formData?.guarantor_phone}
                  onChange={(e) => setFormData({ ...formData, guarantor_phone: e.target.value })}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Guarantor's   Email</label>
                <input
                  type="text"

                  value={formData?.guarantor_email}
                  onChange={(e) => setFormData({ ...formData, guarantor_email: e.target.value })}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Display Price</label>
                <input
                  type="text"
                  value={formData?.calculation_breakdown.display_price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      calculation_breakdown: {
                        ...formData.calculation_breakdown,
                        display_price: e.target.value
                      }
                    })
                  }
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>

              {/* Down Payment */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Down Payment</label>
                <input
                  type="text"
                  value={formData.calculation_breakdown.down_payment}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      calculation_breakdown: {
                        ...formData.calculation_breakdown,
                        down_payment: e.target.value
                      }
                    })
                  }
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>

              {/* Down Payment Percent */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Down Payment Percent</label>
                <input
                  type="text"
                  value={formData.down_payment_percent}
                  onChange={(e) =>
                    setFormData({ ...formData, down_payment_percent: e.target.value })
                  }
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>

              {/* Financed Amount */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Financed Amount</label>
                <input
                  type="text"
                  value={formData?.calculation_breakdown.financed_amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      calculation_breakdown: {
                        ...formData.calculation_breakdown,
                        financed_amount: e.target.value
                      }
                    })
                  }
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Lease Tenure Month</label>
                <input
                  type="text"

                  value={formData?.calculation_breakdown?.lease_term_months}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      calculation_breakdown: {
                        ...formData.calculation_breakdown,
                        lease_term_months: e.target.value
                      }
                    })
                  }
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Monthly Interest Rate</label>
                <input
                  type="text"

                  value={formData?.calculation_breakdown?.monthly_interest_rate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      calculation_breakdown: {
                        ...formData.calculation_breakdown,
                        monthly_interest_rate: e.target.value
                      }
                    })
                  }
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Raba Markup</label>
                <input
                  type="text"

                  value={formData?.calculation_breakdown?.raba_markup}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      calculation_breakdown: {
                        ...formData.calculation_breakdown,
                        raba_markup: e.target.value
                      }
                    })
                  }
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Total Interest</label>
                <input
                  type="text"

                  value={formData?.calculation_breakdown?.total_interest}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      calculation_breakdown: {
                        ...formData.calculation_breakdown,
                        total_interest: e.target.value
                      }
                    })
                  }
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Total With Markup</label>
                <input
                  type="text"

                  value={formData?.calculation_breakdown?.total_with_markup}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      calculation_breakdown: {
                        ...formData.calculation_breakdown,
                        total_with_markup: e.target.value
                      }
                    })
                  }
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Monthly Interest Rate</label>
                <input
                  type="text"

                  value={formData?.calculation_breakdown?.monthly_interest_rate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      calculation_breakdown: {
                        ...formData.calculation_breakdown,
                        monthly_interest_rate: e.target.value
                      }
                    })
                  }
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Last review date</label>
                <input
                  type="text"

                  value={
                    formData?.last_review_date
                      ? new Date(formData.last_review_date).toLocaleDateString()
                      : ""
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      calculation_breakdown: {
                        ...formData.calculation_breakdown,
                        last_review_date: e.target.value
                      }
                    })
                  }


                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Credit Score</label>
                <input
                  type="text"

                  value={
                    formData?.credit_score

                  }
                  onChange={(e) => setFormData({ ...formData, credit_score: e.target.value })}


                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Internal comments</label>
                <input
                  type="text"

                  value={formData?.internal_comments}
                  onChange={(e) => setFormData({ ...formData, internal_comments: e.target.value })}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Admin notes</label>
                <input
                  type="text"

                  value={formData?.admin_notes}
                  onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}

                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Review Status</label>
                <input
                  type="text"

                  value={formData?.review_status}
                  onChange={(e) => setFormData({ ...formData, review_status: e.target.value })}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
            </div>
          </div>






          <div className="bg-gray-50 p-6 rounded-lg shadow-sm md:col-span-2 mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Application Type & Documents
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm text-gray-600 mb-1">Document Type</label>
                <select
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Type</option>
                  {documentTypes.map((doc) => (
                    <option key={doc.value} value={doc.value}>
                      {doc.label}
                    </option>
                  ))}
                </select>
              </div>


              <div>
                <label className="block text-sm text-gray-600 mb-1">Upload Document</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>


            <div className="mt-6 space-y-4">
              {formData.documents.map((doc, index) => (
                <div key={index} className="flex items-center gap-4">
                  {doc.contentType.startsWith("image/") ? (
                    <img
                      src={`data:${doc.contentType};base64,${doc.file}`}
                      alt={doc.filename}
                      className="w-20 h-20 object-cover rounded-md shadow"
                    />
                  ) : (
                    <a
                      href={`data:${doc.contentType};base64,${doc.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-sm"
                    >
                      {doc.filename}
                    </a>
                  )}
                  <span className="text-sm text-gray-700">{doc.type}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 flex justify-items-end gap-10">
          <Button
            label=" Edit Application"
            onClick={handleEdit}
            variant="solid"
            size="md"
            className="text-sm px-6 py-3"
            loading={isLoading}
          />

        </div>
      </div>
    </div>
  )
}

export default EditApplication
