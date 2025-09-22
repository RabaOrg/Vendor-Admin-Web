import React, { useState } from 'react'
import { AiFillDelete } from "react-icons/ai";
import { useEffect } from 'react'
import { Label } from 'flowbite-react'
import Button from '../../components/shared/button'
import Card from '../../components/shared/card'
import { FaMinus, FaTrash } from 'react-icons/fa'
import { useFetchRepayment } from '../../hooks/queries/loan';

import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useFetchCat, useFetchCategory } from '../../hooks/queries/product';
import { useParams } from 'react-router-dom'
import { BiUpload } from 'react-icons/bi'
import { useQueryClient } from "@tanstack/react-query";
import { handleCreateProduct, handleDeleteImage, handleDeleteImageDisplay, handleDeleteProduct, handleDisplayProductImage, handleProductImage, handleUpdateProduct } from '../../services/product';
import { useFetchSingleProduct } from '../../hooks/queries/product'

function EditProduct() {
  const [loading, setIsLoading] = useState()
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageDisplay, setSelectedImageDisplay] = useState(null);
  const [preview, setPreview] = useState(null);
  const [previews, setPreviews] = useState(null);
  const [isLoad, setIsLoad] = useState(false);
  const [isLoads, setIsLoads] = useState(false);
  const { id } = useParams()
  const [newImage, setNewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const { data: singleProduct } = useFetchSingleProduct(id)
  const Navigate = useNavigate()
  const { data: category, isPending, isError } = useFetchCat()
  console.log(category)
  const [imageId, setImageId] = useState("")
  const [product, setProduct] = useState({
    id: id,
    name: '',
    description: '',
    shipping_days_min: null,
    shipping_days_max: null,
    category_id: '',
    price: '',
    stock: 0,
    lease_eligibility: false,
    featured: false,
    specifications: [],
    interest_rule: [],
    repayment_policies: {
      description: "",
      tenure_unit: "",
      weekly_tenure: { min: null, max: null },
      monthly_tenure: { min: null, max: null },
      down_percentage: { min: null, max: null }
    },

  });

  console.log(singleProduct)



  const [specifications, setSpecifications] = useState(singleProduct?.specifications || {});
  const [newSpecificationKey, setNewSpecificationKey] = useState("");
  const queryClient = useQueryClient();
  const { data: repaymentPlan } = useFetchRepayment()
  console.log(repaymentPlan)
  const [newSpecifications, setNewSpecifications] = useState([]);
  const [newSpecificationValue, setNewSpecificationValue] = useState("");

  const MAX_ATTACHMENTS = 5;
  useEffect(() => {
    if (singleProduct) {
      let normalizedInterest = [];
      if (singleProduct.interest_rule) {
        if (!Array.isArray(singleProduct.interest_rule)) {
          normalizedInterest = [
            ...((singleProduct.interest_rule.weekly || []).map(rule => ({ ...rule, interval: 'weekly' }))),
            ...((singleProduct.interest_rule.monthly || []).map(rule => ({ ...rule, interval: 'monthly' })))
          ];
        } else {
          normalizedInterest = singleProduct.interest_rule;
        }
      }

      setProduct({
        id: singleProduct.id,
        name: singleProduct.name || '',
        description: singleProduct.description || '',
        shipping_days_min: singleProduct.shipping_days_min ?? null,
        shipping_days_max: singleProduct.shipping_days_max ?? null,
        category_id: singleProduct.category_id || '',
        price: singleProduct.price || '',
        stock: singleProduct.stock || 0,
        featured: singleProduct.featured,
        lease_eligibility: singleProduct.lease_eligibility,
        specifications: singleProduct.specifications || {},
        interest_rule: normalizedInterest,
        isArchived: singleProduct.is_archived,
        repayment_policies: {

          ...singleProduct.repayment_policies,
          tenure_unit:
            singleProduct.repayment_policies.tenure_unit
        }
      });
    }
  }, [singleProduct]);
  const addSpecification = () => {
    setNewSpecifications([...newSpecifications, { attribute: "", value: "" }]);
  };

  const handleExistingSpecChange = (oldAttribute, field, newValue) => {
    setProduct((prevProduct) => {
      const specs = { ...prevProduct.specifications };
      if (field === "attribute") {

        if (!newValue) return prevProduct;
        const currentValue = specs[oldAttribute];

        delete specs[oldAttribute];
        specs[newValue] = currentValue;
      } else if (field === "value") {
        specs[oldAttribute] = newValue;
      }
      return { ...prevProduct, specifications: specs };
    });
  };
  const handleRemoveSpec = (attributeToRemove) => {
    setProduct((prev) => {
      const updatedSpecs = { ...prev.specifications };
      delete updatedSpecs[attributeToRemove];
      return {
        ...prev,
        specifications: updatedSpecs
      };
    });
  };


  const handleNewSpecChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSpecs = [...newSpecifications];
    updatedSpecs[index][name] = value;
    setNewSpecifications(updatedSpecs);
  };

  const removeNewSpecification = (index) => {
    setNewSpecifications(newSpecifications.filter((_, i) => i !== index));
  };
  const handleRepaymentPlanSelect = (e) => {
    const { name, value } = e.target;


    if (name === 'repayment_policies.tenure_unit') {

      const selectedPlan = repaymentPlan.find(plan => plan.id === value);
      console.log(value)
      if (selectedPlan) {
        setProduct(prev => ({
          ...prev,
          repayment_policies: {
            ...prev.repayment_policies,
            tenure_unit: value,
            weekly_tenure: {
              min: selectedPlan.weekly_tenure_min,
              max: selectedPlan.weekly_tenure_max
            },
            monthly_tenure: {
              min: selectedPlan.monthly_tenure_min,
              max: selectedPlan.monthly_tenure_max
            },
            down_percentage: {
              min: selectedPlan.down_percent_min,
              max: selectedPlan.down_percent_max
            },
            description: selectedPlan.description || ""
          }
        }));
      } else {

        setProduct(prev => ({
          ...prev,
          repayment_policies: {
            ...prev.repayment_policies,
            tenure_unit: ""
          }
        }));
      }
    } else {

      setProduct(prev => ({
        ...prev,

        repayment_policies: {
          ...prev.repayment_policies,
          [name.split('.')[1]]: {
            ...prev.repayment_policies[name.split('.')[1]],
            [name.split('.')[2]]: value
          }
        }
      }));
    }
  };


  const handleDelete = async (attachmentId, url) => {

    try {


      const response = await handleDeleteImage(id, attachmentId, { attachment_type: 'products', image: url })


      if (response && response.status === 200) {
        toast.success("Image deleted successfully!");
        queryClient.invalidateQueries(["SingleProduct", id]);


      } else {
        toast.error("Failed to delete the image. Please try again.");
      }
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error("An error occurred while updating the image.");
    } finally {
      setIsLoad(false);
    }
  };
  const handleDeleteDisplay = async (url) => {

    try {


      const response = await handleDeleteImageDisplay(id, { attachment_type: 'products', image: url })


      if (response && response.status === 200) {
        toast.success("Image deleted successfully!");
        queryClient.invalidateQueries(["SingleProduct", id]);


      } else {
        toast.error("Failed to delete the image. Please try again.");
      }
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error("An error occurred while updating the image.");
    } finally {
      setIsLoad(false);
    }
  };

  const handleChangeInterest = (index, e) => {
    const updatedRules = [...product.interest_rule];
    updatedRules[index][e.target.name] = e.target.value;
    setProduct({ ...product, interest_rule: updatedRules });
  };


  const addInterestRule = () => {
    setProduct(prevProduct => ({
      ...prevProduct,
      interest_rule: [
        ...prevProduct.interest_rule,
        { min: null, max: null, rate: null, interval: null }
      ]
    }));
  };

  const removeInterestRule = (index) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      interest_rule: prevProduct.interest_rule.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleImageChangeDisplay = (event) => {
    const file = event.target.files[0];
    setSelectedImageDisplay(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviews(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!preview) {
      toast.error("Please select an image to upload.");
      return;
    }

    const base64Image = preview.split(",")[1];

    try {
      setIsLoad(true);
      console.log(base64Image);
      const response = await handleProductImage(id, { attachment_type: 'products', image: base64Image })


      if (response && response.status === 200) {
        toast.success("Image uploaded successfully!");
        queryClient.invalidateQueries(["SingleProduct", id]);
      } else {
        toast.error("Failed to upload the image. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("An error occurred while uploading the image.");
    } finally {
      setIsLoad(false);
      setSelectedImage(null);
      setPreview(null);
    }
  };
  const handleUploadDisplay = async () => {
    if (!previews) {
      toast.error("Please select an image to upload.");
      return;
    }

    const base64Image = previews.split(",")[1];

    try {
      setIsLoads(true);
      console.log(base64Image);
      const response = await handleDisplayProductImage(id, { attachment_type: 'products', image: base64Image })


      if (response && response.status === 200) {
        toast.success("Image uploaded successfully!");
        queryClient.invalidateQueries(["SingleProduct", id]);
      } else {
        toast.error("Failed to upload the image. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("An error occurred while uploading the image.");
    } finally {
      setIsLoads(false);
      setSelectedImageDisplay(null);
      setPreviews(null);
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value
    }))
  }
  const handleInputs = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');

    setProduct((prevProduct) => {
      let updatedProduct = { ...prevProduct };
      let nested = updatedProduct;


      for (let i = 0; i < keys.length - 1; i++) {
        nested[keys[i]] = { ...nested[keys[i]] };
        nested = nested[keys[i]];
      }

      nested[keys[keys.length - 1]] = value;

      return updatedProduct;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const groupedInterest = product.interest_rule.reduce((acc, rule) => {
      if (rule.interval === 'weekly') {
        acc.weekly.push({
          min: rule.min ? Number(rule.min) : 0,
          max: rule.max ? Number(rule.max) : 0,
          rate: rule.rate ? Number(rule.rate) : 0,
        });
      } else if (rule.interval === 'monthly') {
        acc.monthly.push({
          min: rule.min ? Number(rule.min) : 0,
          max: rule.max ? Number(rule.max) : 0,
          rate: rule.rate ? Number(rule.rate) : 0,
        });
      }
      return acc;
    }, { weekly: [], monthly: [] });


    const existingSpecifications = Object.entries(product.specifications || {}).map(
      ([attribute, value]) => ({ attribute, value })
    );
    const updatedSpecifications = [...existingSpecifications, ...newSpecifications];
    const payload = {
      id: id,
      name: product.name || singleProduct?.name,
      featured: product.featured,
      lease_eligibility: product.lease_eligibility,
      stock: product.stock,
      description: product.description || singleProduct?.description,
      shipping_days_min: Number(product.shipping_days_min) || singleProduct?.shipping_days_min,
      shipping_days_max: Number(product.shipping_days_max) || singleProduct?.shipping_days_max,
      category_id: Number(product.category_id),
      price: product.price || singleProduct?.price,
      specifications: updatedSpecifications.reduce((acc, spec) => {
        if (spec.attribute && spec.value) {
          acc[spec.attribute] = spec.value;
        }
        return acc;
      }, {}),

      repayment_policies: {
        description: product.repayment_policies.description,
        tenure_unit: "week",
        weekly_tenure: {
          min: Number(product.repayment_policies.weekly_tenure.min),
          max: Number(product.repayment_policies.weekly_tenure.max)
        },
        monthly_tenure: {
          min: Number(product.repayment_policies.monthly_tenure.min),
          max: Number(product.repayment_policies.monthly_tenure.max)
        },
        down_percentage: {
          min: Number(product.repayment_policies.down_percentage.min),
          max: Number(product.repayment_policies.down_percentage.max)
        }
      },
      is_archived: product.isArchived !== undefined
        ? (product.isArchived === true ? "true" : "false")
        : (singleProduct?.is_archived ? true : "false"),

    };

    console.log(payload);

    try {
      const response = await handleUpdateProduct(id, payload);
      if (response.data) {
        setImageId(response.data.id);
        toast.success("Product updated successfully");
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };






  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <h1 className="text-3xl font-semibold">
          Products <span className="text-black-400 ">{'>'}</span> Update Products
        </h1>
        <div className='flex gap-3'>
          <Button
            label="Cancel"
            variant="transparent"
            size="lg"
            className="text-sm w-[150px]"
          />
          <Button
            label="Add Products"
            variant="solid"
            size="md"
            className="text-sm px-6 py-5"
          />
        </div>
      </div>
      <div className='p-4'>
        <Card className='w-full h-full bg-white'>
          <h3 className='p-3 px-10 font-semibold'>Update Product Information</h3>
          <div className='w-full border-t-2 border-gray-200'></div>

          <form onSubmit={(e) => handleSubmit(e)} >
            <div>
              <div className='flex flex-col lg:flex-row gap-12 px-10 pb-14 mt-5'>
                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="name" value="Product name" />
                    </div>
                    <input
                      style={{ color: "#202224", borderRadius: "8px" }}
                      id="name"
                      type="text"
                      className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                      placeholder="Enter Business name"
                      defaultValue={singleProduct?.name || product.name}
                      name='name'
                      onChange={handleInput}
                    />
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="shipping_days_min" value="Shipping Days Min" />
                    </div>
                    <input
                      style={{ color: "#202224", borderRadius: "8px" }}
                      id="shipping_days_min"
                      className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                      type="number"
                      defaultValue={singleProduct?.shipping_days_max
                        || product.shipping_days_min}
                      name='shipping_days_min'
                      onChange={handleInput}
                    />
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="price" value="Stock" />
                    </div>

                    <input
                      style={{ color: "#202224", borderRadius: "8px" }}
                      id="stock"
                      className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                      type="number"

                      defaultValue={singleProduct?.stock || product.stock}
                      name='stock'
                      onChange={handleInput}
                    />
                  </div>

                </div>
                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="shipping_days_max" value="Shipping Days Max" />
                    </div>
                    <input
                      style={{ color: "#202224", borderRadius: "8px" }}
                      id="shipping_days_max"
                      type="number"
                      className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                      defaultValue={singleProduct?.shipping_days_max || product.shipping_days_max}
                      name='shipping_days_max'
                      onChange={handleInput}
                    />
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="price" value="Price" />
                    </div>
                    <input
                      style={{ color: "#202224", borderRadius: "8px" }}
                      id="price"
                      className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                      type="number"
                      defaultValue={singleProduct?.price || product.price}
                      name='price'
                      onChange={handleInput}
                    />
                  </div>




                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="lease_eligibility" value="Lease Eligibility" />
                    </div>
                    <select
                      style={{ color: "#202224", borderRadius: "8px" }}
                      id="lease_eligibility"
                      name="lease_eligibility"
                      value={product.lease_eligibility ? 'true' : 'false'}
                      onChange={handleInput}
                      className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                    >
                      <option value="true">Eligible</option>
                      <option value="false">Not Eligible</option>
                    </select>
                  </div>

                </div>

                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                  <div>
                    <div className="mb-2 block">
                      <Label
                        className="text-[#212C25] text-xs font-[500]"
                        htmlFor="category"
                        value="Category"
                      />
                    </div>
                    <select
                      style={{ color: "#202224", borderRadius: "8px" }}
                      id="category"
                      name="category_id"
                      value={product.category_id}
                      onChange={handleInput}
                      className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                    >
                      <option value="">Select a category</option>
                      {isPending ? (
                        <option disabled>Loading...</option>
                      ) : isError ? (
                        <option disabled>Error loading categories</option>
                      ) : (
                        category?.data?.categories?.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="featured" value="Featured" />
                    </div>
                    <select
                      style={{ color: "#202224", borderRadius: "8px" }}
                      id="featured"
                      name="featured"
                      value={product.featured ? 'true' : 'false'}
                      onChange={handleInput}
                      className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>
                </div>


              </div>
              <div className='p-10'>
                <div className=' flex mt-[-75px]'>
                  <div className="w-full lg:w-[65%] sm:w-[90%]">
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="description" value="Description" />
                    </div>
                    <textarea
                      style={{ color: "#202224", borderRadius: "8px" }}
                      id="description"
                      className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full h-40 resize-none"
                      placeholder="Describe your product, services, or business needs here..."
                      name='description'
                      defaultValue={singleProduct?.description || product.description}
                      onChange={handleInput}
                    ></textarea>
                  </div>
                </div>
                <div className="flex items-center gap-4">




                  <div className="flex items-center gap-2 mt-3">
                    <label className="text-sm font-medium text-gray-700">Archived:</label>
                    <input
                      type="checkbox"
                      checked={product.isArchived}
                      onChange={(e) => setProduct({ ...product, isArchived: e.target.checked })}
                      className="w-5 h-5"
                    />
                  </div>
                </div>
              </div>




              <div className="p-4">
                <Card className="w-full h-full bg-white p-4 rounded-md shadow-md">
                  <div className='flex justify-between'>
                    <h3 className="p-3 px-7 flex items-center justify-between">
                      <span className='font-semibold'>Update Specifications</span>
                    </h3>
                    <div className="flex justify-center py-4">
                      <button
                        onClick={addSpecification}
                        type="button"
                        className="bg-[#0f5d30] text-white px-4 py-2 rounded"
                      >
                        + Add Specification
                      </button>
                    </div>
                  </div>


                  <div className="w-full border-t-2 border-gray-200"></div>

                  <div className="flex flex-col lg:flex-row gap-12 px-7 pb-14 mt-5">
                    {singleProduct?.specifications && typeof singleProduct?.specifications === "object" ? (
                      <div className="mt-8 w-full">
                        <h4 className="text-lg font-semibold text-[#212C25] mb-4">
                          Product Specifications
                        </h4>
                        <div className="flex flex-col gap-6">
                          {Object.entries(product.specifications).map(([attribute, value]) => (
                            <div key={attribute} className="flex flex-col md:flex-row items-start md:items-end gap-4 w-full">
                              <div className="w-full md:w-1/2">
                                <label className="text-[#212C25] text-xs font-[500] mb-1 block">
                                  Attribute
                                </label>
                                <input
                                  type="text"
                                  value={attribute}
                                  onChange={(e) =>
                                    handleExistingSpecChange(attribute, "attribute", e.target.value)
                                  }
                                  className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                  placeholder="Enter attribute (e.g., Weight, Colour)"
                                />
                              </div>

                              <div className="w-full md:w-1/2">
                                <label className="text-[#212C25] text-xs font-[500] mb-1 block">
                                  Value
                                </label>
                                <input
                                  type="text"
                                  value={value}
                                  onChange={(e) =>
                                    handleExistingSpecChange(attribute, "value", e.target.value)
                                  }
                                  className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                  placeholder="Enter value (e.g., 0.15 kg, white)"
                                />
                              </div>

                              <button
                                onClick={() => handleRemoveSpec(attribute)}
                                className="bg-red-400 hover:bg-red-600 text-white px-4 py-2 rounded"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-10 flex justify-center items-center text-center text-gray-500">
                        No specifications added yet
                      </div>
                    )}
                  </div>





                  {newSpecifications.length > 0 && (
                    <div className="px-7 mt-[-20px]">

                      {newSpecifications.map((spec, index) => (
                        <div
                          key={`new-${index}`}
                          className="flex flex-col lg:flex-row gap-4 w-full items-center border-0"
                        >
                          <div className="flex-1">
                            <label className="text-[#212C25] text-xs font-[500]">Attribute</label>
                            <input
                              name="attribute"
                              type="text"
                              onChange={(e) => handleNewSpecChange(index, e)}
                              className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                              placeholder="Enter attribute (e.g., Weight, Colour)"
                              value={spec.attribute || ""}
                            />
                          </div>

                          <div className="flex-1">
                            <label className="text-[#212C25] text-xs font-[500]">Value</label>
                            <input
                              name="value"
                              type="text"
                              onChange={(e) => handleNewSpecChange(index, e)}
                              className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                              placeholder="Enter value (e.g., 0.15 kg, white)"
                              value={spec.value || ""}
                            />
                          </div>

                          <div className="py-4 mt-5">
                            <button
                              onClick={() => removeNewSpecification(index)}
                              type="button"
                              className="bg-red-400 hover:bg-red-600 text-white px-4 py-2 rounded"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}



                </Card>
              </div>









              <div className='p-4'>
                <Card className='w-full h-full bg-white'>
                  <h3 className='p-3 px-7 font-semibold'>Update Repayment Plan</h3>
                  <div className='w-full border-t-2 border-gray-200'></div>

                  <div className='flex flex-col lg:flex-row gap-7 pb-7 mt-5 px-7'>
                    <div className="flex flex-col gap-4 w-full lg:w-1/2">
                      <div>
                        <div className="mb-2 block">
                          <Label className="text-[#212C25] text-xs font-[500]" htmlFor="tenure_unit" value="Tenure Unit" />
                        </div>
                        <select
                          style={{ color: "#202224", borderRadius: "8px" }}
                          id="tenure_unit"
                          className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                          name="repayment_policies.tenure_unit"
                          value={product.repayment_policies.tenure_unit ?? ""}
                          onChange={handleRepaymentPlanSelect}
                        >

                          {isPending ? (
                            <option disabled>Loading...</option>
                          ) : isError ? (
                            <option disabled>Error loading categories</option>
                          ) : (
                            repaymentPlan?.data?.repayment_plans?.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.tenure_unit}
                              </option>
                            ))
                          )}
                        </select>

                      </div>

                      <div>
                        <div className="mb-2 block">
                          <Label className="text-[#212C25] text-xs font-[500]" htmlFor="weekly_tenure" value="Weekly Tenure" />
                        </div>
                        <div className='flex gap-2'>
                          <input
                            style={{ color: "#202224", borderRadius: "8px" }}
                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                            type="number"
                            value={product.repayment_policies.weekly_tenure.min ?? ""}
                            name='repayment_policies.weekly_tenure.min'
                            onChange={handleRepaymentPlanSelect}
                            placeholder='min'
                          />
                          <input
                            style={{ color: "#202224", borderRadius: "8px" }}
                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                            type="number"
                            value={product.repayment_policies.weekly_tenure.max ?? ""}
                            name='repayment_policies.weekly_tenure.max'
                            onChange={handleRepaymentPlanSelect}
                            placeholder='max'
                          />
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 block">
                          <Label className="text-[#212C25] text-xs font-[500]" htmlFor="description" value="Description" />
                        </div>
                        <textarea
                          style={{ color: "#202224", borderRadius: "8px" }}
                          value={product.repayment_policies.description ?? ""}
                          name='repayment_policies.description'
                          onChange={handleRepaymentPlanSelect}
                          className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full h-40 resize-none"
                          placeholder='Enter description'
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 w-full lg:w-1/2">
                      <div>
                        <div className="mb-2 block">
                          <Label className="text-[#212C25] text-xs font-[500]" htmlFor="down_percentage" value="Down Percentage" />
                        </div>
                        <div className='flex gap-2'>
                          <input
                            style={{ color: "#202224", borderRadius: "8px" }}
                            type="number"
                            value={product.repayment_policies.down_percentage?.min ?? ""}
                            name='repayment_policies.down_percentage.min'
                            onChange={handleRepaymentPlanSelect}
                            placeholder="min"
                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                          />
                          <input
                            style={{ color: "#202224", borderRadius: "8px" }}
                            type="number"
                            value={product.repayment_policies.down_percentage?.max ?? ""}
                            name='repayment_policies.down_percentage.max'
                            onChange={handleRepaymentPlanSelect}
                            placeholder="max"
                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 block">
                          <Label className="text-[#212C25] text-xs font-[500]" htmlFor="monthly_tenure" value="Monthly Tenure" />
                        </div>
                        <div className='flex gap-2'>
                          <input
                            style={{ color: "#202224", borderRadius: "8px" }}
                            type="number"
                            value={product.repayment_policies.monthly_tenure?.min ?? ""}
                            name='repayment_policies.monthly_tenure.min'
                            onChange={handleRepaymentPlanSelect}
                            placeholder='min'
                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                          />
                          <input
                            style={{ color: "#202224", borderRadius: "8px" }}
                            type="number"
                            value={product.repayment_policies.monthly_tenure?.max ?? ""}
                            name='repayment_policies.monthly_tenure.max'
                            onChange={handleRepaymentPlanSelect}
                            placeholder='max'
                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>






              <div className='mb-7 px-10'>
                <Button type="submit" size='lg' className="text-sm w-[150px]" label="Update Product" loading={loading} />


              </div>
            </div>
          </form>



        </Card >
      </div >
      <div className="p-4">
        <Card className="w-full h-full bg-white">
          <h3 className="p-3 px-10 font-semibold">Update Attachment Image</h3>
          <div className="w-full border-t-2 border-gray-200"></div>


          <div className="flex flex-wrap gap-4 p-6">
            {singleProduct?.display_attachment && (
              <div

                className="relative w-40 h-40 border border-gray-200 rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={singleProduct?.display_attachment}
                  alt="Attachment"
                  className="w-full h-full object-cover"
                />

                <button
                  className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700 transition cursor-pointer"
                  onClick={() => handleDeleteDisplay()}
                >
                  <FaTrash size={18} />
                </button>

              </div>
            )}

            <div className="flex gap-10">
              <div className="relative w-40 h-40 flex items-center justify-center border border-dashed border-gray-400 rounded-lg hover:bg-gray-100 transition">
                <label className="flex flex-col items-center cursor-pointer">
                  <BiUpload size={24} className="text-gray-500" />
                  <span className="text-sm text-gray-600">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChangeDisplay}
                  />
                </label>
              </div>
              {previews && (
                <div className="flex flex-col items-center">
                  <img
                    src={previews}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-lg border border-gray-200 shadow-md"
                  />
                  <div className="mt-3">
                    <Button
                      onClick={handleUploadDisplay}
                      size="sm"
                      label="Upload"
                      className="mt-2"
                      disabled={isLoads}
                    >
                      {isLoads ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

          </div>


        </Card>
      </div>

      <div className="p-4">
        <Card className="w-full h-full bg-white">
          <h3 className="p-3 px-10 font-semibold">Update Attachment Image</h3>
          <div className="w-full border-t-2 border-gray-200"></div>


          <div className="flex flex-wrap gap-4 p-6">
            {singleProduct?.attachments?.map((attachment) => (
              <div
                key={attachment.id}
                className="relative w-40 h-40 border border-gray-200 rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={attachment.url}
                  alt="Attachment"
                  className="w-full h-full object-cover"
                />

                <button
                  className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700 transition cursor-pointer"
                  onClick={(e) => handleDelete(attachment.id, attachment.url, e)}
                >
                  <FaTrash size={18} />
                </button>

              </div>
            ))}


            <div className="flex gap-10">
              <div className="relative w-40 h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <label className="flex flex-col items-center cursor-pointer">
                  <BiUpload size={28} className="text-gray-600" />
                  <span className="mt-2 text-sm font-medium text-gray-700">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              {preview && (
                <div className="flex flex-col items-center">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-lg border border-gray-200 shadow-lg"
                  />
                  <div className="mt-3">
                    <Button
                      onClick={handleUpload}
                      size="sm"
                      label="Upload"
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      disabled={isLoad}
                    >
                      {isLoad ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

          </div>



        </Card>
      </div>




    </div >
  )
}

export default EditProduct
