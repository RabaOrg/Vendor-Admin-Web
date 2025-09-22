import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Label } from 'flowbite-react'
import Button from '../../../components/shared/button'
import { toast } from 'react-toastify'
import { useFetchCategory, useFetchSingleProduct } from '../../../hooks/queries/product'
import axiosInstance from '../../../../store/axiosInstance'
import { handleApproveProduct, handleRejectProd } from '../../../services/product'

function ViewProductDetails() {
  const { id } = useParams()

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const { data: oneProduct, isPending, isError } = useFetchSingleProduct(id)
  const { data: category } = useFetchCategory()
  console.log(category)
  const [isLoad, setIsLoad] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const categoryDetails = Array.isArray(category)
    ? category.find(cat => cat.id === oneProduct?.category_id) || {}
    : {};
  console.log(categoryDetails)

  useEffect(() => {
    handleGetSingleProduct()
  }, [])

  const handleGetSingleProduct = async () => {
    const data = await axiosInstance.get(`api/admin/products/${id}`);
    console.log(data)
  }
  const handleRejectWithReason = async () => {
    if (!rejectionReason.trim()) return;

    setIsRejecting(true);
    try {
      const response = await handleRejectProd(id, { rejection_reason: rejectionReason });
      toast.success("Product rejected successfully");
      setShowRejectModal(false);
      setRejectionReason("");

    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to reject product";
      toast.error(errorMessage);
    } finally {
      setIsRejecting(false);
    }
  };


  const handleApprove = async () => {
    setIsLoading(true)
    try {
      console.log(id)
      const response = await handleApproveProduct(id)

      toast.success("Vendor approved successfully")


    } catch (error) {
      console.log(error)
      const errorMessage =
        error?.response?.data?.message || "Failed to delete application";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="px-6">
      <div className="inline-block min-w-full rounded-lg overflow-hidden">
        <div className="flex justify-between flex-col md:flex-row w-full gap-4 py-6">
          <h1 className="text-3xl font-semibold text-black mb-4 md:mb-0">
            PRODUCT DETAILS <span className="text-black-400">{'>'}</span> {oneProduct?.full_name}
          </h1>
        </div>

        <div className="p-4">
          <div className="w-full h-full bg-white shadow-md rounded-lg p-6">
            <h4 className="text-lg font-semibold pb-3">PRODUCT DETAILS</h4>
            <div className="w-full border-t-2 border-gray-200 mb-4"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 pb-10 mt-5">
              <div className="flex flex-col gap-4">
                <DetailItem label="Product Name" value={oneProduct?.name} />
                <DetailItem label="Product Price" value={oneProduct?.price} />
                <DetailItem label="Description" value={oneProduct?.description} />
                <DetailItem label="Category" value={categoryDetails.name} />
              </div>

              <div className="flex flex-col gap-4">
                <DetailItem label="Shipping Days Min" value={oneProduct?.shipping_days_min} />
                <DetailItem label="Shipping Days Max" value={oneProduct?.shipping_days_max} />
                <DetailItem label="Repayment plan ID" value={oneProduct?.repayment_policies?.id} />
              </div>
            </div>

            {oneProduct?.specifications && typeof oneProduct.specifications === "object" && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-[#212C25] mb-4">
                  Product Specifications
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(oneProduct.specifications).map(([attribute, value]) => (
                    <div
                      key={attribute}
                      className="flex flex-col bg-gray-100 p-4 border border-[#A0ACA4] rounded-md"
                    >
                      <p className="text-sm text-gray-700">
                        <strong>{attribute}:</strong>{" "}
                        {typeof value === "object" ? (
                          Object.entries(value).map(([subKey, subValue]) => (
                            <span key={subKey}>
                              {subKey}: {subValue}{" "}
                            </span>
                          ))
                        ) : (
                          value
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {oneProduct?.interest_rule && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-[#212C25] mb-4">Product Interest Rule</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(oneProduct?.interest_rule || {}).map(([interval, rules], index) => (
                    <div
                      key={index}
                      className="flex flex-col bg-gray-100 p-4 border border-[#A0ACA4] rounded-md"
                    >
                      <span className="text-xs font-semibold text-[#212C25]">Interval</span>
                      <p className="text-sm text-gray-700">{interval}</p>
                      {Array.isArray(rules) && rules.map((rule, ruleIndex) => (
                        <div key={ruleIndex} className="mt-2 p-3 bg-white border rounded-md">
                          <span className="text-xs font-semibold text-[#212C25]">Min Duration:</span>
                          <p className="text-sm text-gray-700">{rule.min}</p>
                          <span className="text-xs font-semibold text-[#212C25] mt-2">Max Duration:</span>
                          <p className="text-sm text-gray-700">{rule.max}</p>
                          <span className="text-xs font-semibold text-[#212C25] mt-2">Rate:</span>
                          <p className="text-sm text-gray-700">{rule.rate}%</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {oneProduct?.repayment_policies && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-[#212C25] mb-4">Repayment Policies</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {oneProduct.repayment_policies.monthly_tenure && (
                    <div className="flex flex-col bg-gray-100 p-4 border border-[#A0ACA4] rounded-md">
                      <span className="text-xs font-semibold text-[#212C25]">Monthly Tenure</span>
                      <p className="text-sm text-gray-700">Min: {oneProduct.repayment_policies.monthly_tenure.min}</p>
                      <p className="text-sm text-gray-700">Max: {oneProduct.repayment_policies.monthly_tenure.max}</p>
                    </div>
                  )}
                  {oneProduct.repayment_policies.weekly_tenure && (
                    <div className="flex flex-col bg-gray-100 p-4 border border-[#A0ACA4] rounded-md">
                      <span className="text-xs font-semibold text-[#212C25]">Weekly Tenure</span>
                      <p className="text-sm text-gray-700">Min: {oneProduct.repayment_policies.weekly_tenure.min}</p>
                      <p className="text-sm text-gray-700">Max: {oneProduct.repayment_policies.weekly_tenure.max}</p>
                    </div>
                  )}
                  {oneProduct.repayment_policies.down_percentage && (
                    <div className="flex flex-col bg-gray-100 p-4 border border-[#A0ACA4] rounded-md">
                      <span className="text-xs font-semibold text-[#212C25]">Down Percentage</span>
                      <p className="text-sm text-gray-700">Min: {oneProduct.repayment_policies.down_percentage.min}</p>
                      <p className="text-sm text-gray-700">Max: {oneProduct.repayment_policies.down_percentage.max}</p>
                    </div>
                  )}
                  {oneProduct.repayment_policies.description && (
                    <div className="col-span-3 flex flex-col bg-gray-100 p-4 border border-[#A0ACA4] rounded-md">
                      <span className="text-xs font-semibold text-[#212C25]">Description</span>
                      <p className="text-sm text-gray-700">{oneProduct.repayment_policies.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {oneProduct?.display_attachment && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Main Display Attachment</h4>
                <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-lg">
                  <div className="w-full h-80 rounded-lg overflow-hidden flex justify-center items-center bg-gray-50">
                    <img
                      src={oneProduct.display_attachment}
                      alt="Main Display Attachment"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            )}

            {oneProduct?.attachments && oneProduct.attachments.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-[#212C25] mb-4">Product Attachments</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {oneProduct.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex flex-col bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden"
                    >
                      <div className="w-full h-52 flex justify-center items-center bg-gray-100">
                        <img
                          src={attachment.url}
                          alt={attachment.title || `Attachment ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="p-4">
                        <h5 className="text-md font-semibold text-gray-900">
                          {attachment.title || `Attachment ${index + 1}`}
                        </h5>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
      <div className="p-6 flex gap-10">
        <Button
          label="Reject Product"
          onClick={() => setShowRejectModal(true)}
          variant="transparent"
          size="md"
          className="text-sm px-6 py-3"
        />
        <Button
          label="Approve Product"
          onClick={handleApprove}
          variant="solid"
          size="md"
          loading={isLoading}
          className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 mt-4 md:mt-0"
        />
      </div>
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Reject Product</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection"
              className="w-full p-3 border border-gray-300 rounded-md mb-4"
              rows={4}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectWithReason}
                disabled={!rejectionReason.trim() || isRejecting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isRejecting ? "Rejecting..." : "Reject Product"}
              </button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div>
    <label className="text-[#212C25] text-xs font-semibold">{label}</label>
    <p className="bg-gray-100 text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md w-full">
      {value || "N/A"}
    </p>
  </div>
);

export default ViewProductDetails;
