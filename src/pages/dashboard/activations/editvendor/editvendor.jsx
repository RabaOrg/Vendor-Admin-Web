import React from 'react'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import Button from '../../../../components/shared/button'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useFetchSingleLoan, useFetchSingleVendorData } from '../../../../hooks/queries/loan'
import { handleDeleteVendor, handleEditApplication, handleEditCustomerApp } from '../../../../services/loans'
import { useFetchOneCustomer, useFetchVendorCustomer } from '../../../../hooks/queries/customer'
import { handleDeleteCustomer, handleEditVendorApp, handleRestoreCustomer, handleRestoreVendor } from '../../../../services/customer'

function EditVendor() {
  const { id } = useParams();
  const [isloads, setIsLoads] = useState(false)
  const [preview, setPreview] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: singleLoan } = useFetchSingleVendorData(id);
  console.log(singleLoan)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    interest_rate: "",
    verification_status: "",
    business_name: "",
    location: "",
    state: "",
    business_description: "",
    website: "",
    business: {
      name: "",
      category: "",
      state: "",
      monthly_revenue: "",
      cac_number: ""
    },
    metadata: {
      documents: [],
    },
    documents: [],
    include_attachments: false
  });


  useEffect(() => {
    if (singleLoan) {
      setFormData((prev) => ({
        ...prev,
        ...singleLoan,
        business: {
          ...prev.business,
          ...singleLoan.Business,
        },
        documents: singleLoan.documents || [],
        metadata: singleLoan.metadata || { documents: [] },
      }));
    }
  }, [singleLoan]);


  const handleEdit = async () => {
    setIsLoading(true);
    try {
      console.log(formData)
      const response = await handleEditVendorApp(id, formData);
      if (response) toast.success("Vendor edited successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to edit customer");
    } finally {
      setIsLoading(false);
    }
  };
  const handleRes = async () => {
    setIsLoads(true);
    try {
      const response = await handleRestoreVendor(id);


      if (response.status === "error") {
        toast.error(response.message);
      } else {
        toast.success("Vendor restored successfully");
      }
    } catch (error) {

      const errorMessage =
        error?.response?.data?.message || "Failed to delete application";

      toast.error(errorMessage);
    } finally {
      setIsLoads(false);
    }
  };
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
  const handleDelete = async () => {
    try {
      console.log(id)
      const response = await handleDeleteVendor(id, {
        reason: "Invalid Vendor data"
      })
      if (response) {
        toast.success("Vendor deleted successfully")
        Navigate("/customer")
      }
    } catch (error) {
      console.log(error)
      const errorMessage =
        error?.response?.data?.message || "Failed to delete application";



      toast.error(errorMessage);
    }
  }
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64File = reader.result.split(",")[1];
      setFormData((prev) => ({
        ...prev,
        documents: [
          ...prev.documents,
          {
            file: base64File,
            filename: file.name,
            contentType: file.type,
            type: "additional_document",
          },
        ],
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Edit Vendor ({singleLoan.first_name} {singleLoan.last_name})
      </h1>

      <div className="bg-white shadow-xl rounded-xl p-8 space-y-8">

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">
            Vendor's Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["first_name", "last_name", "email", "phone_number"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-bold text-black mb-1">
                  {field.replace("_", " ").toLowerCase()}
                </label>
                <input
                  type="text"
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Interest Rate
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.interest_rate}
                onChange={(e) =>
                  setFormData({ ...formData, interest_rate: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Verification Status
              </label>
              <input
                type="text"
                value={formData.verification_status}
                onChange={(e) =>
                  setFormData({ ...formData, verification_status: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>
        </section>


        <section className="space-y-4 mt-8">
          <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">
            Business Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Business Name */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">Business Name</label>
              <input
                type="text"
                value={formData.business.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    business: { ...formData.business, name: e.target.value },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>

            {/* Business Category */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">Business Category</label>
              <input
                type="text"
                value={formData.business.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    business: { ...formData.business, category: e.target.value },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>

            {/* Monthly Revenue */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">Monthly Revenue</label>
              <input
                type="number"
                value={formData.business.monthly_revenue}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    business: { ...formData.business, monthly_revenue: e.target.value },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>

            {/* CAC Number */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">CAC Number</label>
              <input
                type="text"
                value={formData.business.cac_number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    business: { ...formData.business, cac_number: e.target.value },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">State</label>
              <input
                type="text"
                value={formData.business.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    business: { ...formData.business, state: e.target.value },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">Website</label>
              <input
                type="text"
                value={formData.business.website}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    business: { ...formData.business, website: e.target.value },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>

            {/* Business Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-black mb-1">Business Description</label>
              <textarea
                value={formData.business.business_description || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    business: { ...formData.business, business_description: e.target.value },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 h-24"
              />
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

        </section>



        <div className="p-2 flex justify-start gap-5">
          <Button
            label="Delete Vendor"
            onClick={handleDelete}
            variant="solid"
            size="md"
            className="text-sm px-6 py-3 text-red-600 hover:text-red-800"
            loading={isLoading}
          />
          <Button
            label="Restore Vendor"
            onClick={handleRes}
            variant="outline"
            size="md"
            className="text-sm px-6 py-3 text-green-600 border-green-600 hover:bg-green-50"
            loading={isLoading}
          />
          <Button
            label="Edit Vendor"
            onClick={handleEdit}
            variant="solid"
            size="md"
            className="text-sm px-6 py-3 text-green-600 border-green-600 hover:bg-green-50"
            loading={isLoading}
          />
        </div>
      </div>
    </div>

  );
}

export default EditVendor
