import React from 'react'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import Button from '../../../../components/shared/button'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useFetchSingleGuarantor, useFetchSingleLoan } from '../../../../hooks/queries/loan'
import { handleDeleteCustomer, handleDeleteGuarantor, handleEditGuarantorsApp, handleRestoreCustomer, handleRestoreGuarantor } from '../../../../services/customer'

function EditGuarantorApplication() {
  const { id } = useParams();
  const [isloads, setIsLoads] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState("");
  const { data: singleLoan } = useFetchSingleGuarantor(id);
  console.log(singleLoan)

  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    relationship: "",
    address: "",
    verification_status: "",
    documents: [],
    metadata: { documents: [] },
  });

  useEffect(() => {
    if (singleLoan) {
      setFormData({
        ...formData,
        ...singleLoan.data,
        documents: singleLoan.documents || [],
        metadata: singleLoan.metadata || { documents: [] },
      });
    }
  }, [singleLoan]);
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
    setIsLoading(true);
    try {
      const response = await handleEditGuarantorsApp(id, formData);
      if (response) toast.success("Customer edited successfully");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to edit customer";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const handleRes = async () => {
    setIsLoads(true);
    try {
      const response = await handleRestoreGuarantor(id);


      if (response.status === "error") {
        toast.error(response.message);
      } else {
        toast.success("Customer restored successfully");
      }
    } catch (error) {

      const errorMessage =
        error?.response?.data?.message || "Failed to edit customer";

      toast.error(errorMessage);
    } finally {
      setIsLoads(false);
    }
  };

  const handleDelete = async () => {
    try {
      console.log(id)
      const response = await handleDeleteGuarantor(id, {
        reason: "Invalid Customer data"
      })
      if (response) {
        toast.success("Customer deleted successfully")
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
        Edit Customer Application
      </h1>

      <div className="bg-white shadow-xl rounded-xl p-8 space-y-8">
        {/* Customer Information */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">
            Customer Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "name",
              "phone_number",
              "email",
              "relationship",
              "address",
              "verification_status",
            ].map((field) => (
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
          <div className="p-2 flex justify-start gap-5">

            <Button
              label="Delete Guarantor"
              onClick={handleDelete}
              variant="solid"
              size="md"
              className="text-sm px-6 py-3 text-red-600 hover:text-red-800"
              loading={isLoading}
            />
            <Button
              label="Restore Guarantor"
              onClick={handleRes}
              variant="outline"
              size="md"
              className="text-sm px-6 py-3 text-green-600 border-green-600 hover:bg-green-50"
              loading={isLoading}
            />
            <Button
              label="Edit Guarantor"
              onClick={handleEdit}
              variant="solid"
              size="md"
              className="text-sm px-6 py-3 text-green-600 border-green-600 hover:bg-green-50"
              loading={isLoading}
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Upload Additional Documents
            </label>
            <input
              type="file"
              onChange={handleFileUpload}
              className="w-full p-2 border border-gray-300 rounded-md cursor-pointer"
            />
            <ul className="mt-2 text-gray-600 space-y-1">
              {formData.documents.map((doc, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="material-icons text-blue-500">attach_file</span>
                  {doc.filename}
                </li>
              ))}
            </ul>
          </div> */}
        </section>



      </div>
    </div>
  );
}

export default EditGuarantorApplication
