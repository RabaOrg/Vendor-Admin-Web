import React, { useState } from 'react'
import { Label } from 'flowbite-react'
import Button from '../../components/shared/button'
import Card from '../../components/shared/card'
import { FaMinus } from 'react-icons/fa'

import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

import { BiUpload } from 'react-icons/bi'
import { handleCreateProduct, handleDisplayProductImage, handleProductImage } from '../../services/product';
import { Formik } from 'formik'
import { useFetchCat, useFetchCategory } from '../../hooks/queries/product'
import { useFetchRepayment } from '../../hooks/queries/loan'

function Addproduct() {
    const [loading, setIsLoading] = useState(false)
    const [isload, setIsLoad] = useState(false)
    const { data: category, isPending, isError } = useFetchCat()
    console.log(category)
    const { data: repaymentPlan } = useFetchRepayment()
    console.log(repaymentPlan)
    const [imageId, setImageId] = useState('')
    const [load, setLoad] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [selectedImageDisplay, setSelectedImageDisplay] = useState(null)
    const [preview, setPreview] = useState(null)


    const [previews, setPreviews] = useState(null)
    const Navigate = useNavigate()
    const [product, setProduct] = useState({
        name: "",
        description: "",
        shipping_days_min: null,
        shipping_days_max: null,
        category_id: "",
        repayment_plan_id: "",
        stock: null,
        status: "",
        vendor_id: null,
        featured: "",
        price: "",
        sub_category: "",
        specifications: [],
        loan_terms: {
            down_payment_percentage: null,
            max_tenure_months: null,
            interest_rate: null,
            processing_fee: null,
        },
        display_image: null,


    })






    const addInterestRule = () => {
        setProduct(prevProduct => ({
            ...prevProduct,
            interest_rule: [...prevProduct.interest_rule, { min: null, max: null, rate: null, interval: null }]
        }));
    };
    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const newSpecifications = [...product.specifications];
        newSpecifications[index][name] = value;
        setProduct({ ...product, specifications: newSpecifications });
    };

    const addSpecification = () => {
        setProduct({
            ...product,
            specifications: [...product.specifications, { attribute: "", value: "" }]
        });
    };
    const handleChangeInterest = (index, e) => {
        const newInterestRules = [...product.interest_rule];
        newInterestRules[index][e.target.name] = e.target.value;
        setProduct({ ...product, interest_rule: newInterestRules });
    };


    const handleInput = (e) => {
        const { name, value } = e.target
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value
        }))
    }
    const handleInputBoolean = (e) => {
        const { name, value } = e.target;

        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: name === "featured" ? value === "true" : value,
        }));
    };

    const handleInputs = (e) => {
        const { name, value } = e.target;
        const keys = name.split(".");
        setProduct((prevProduct) => {
            let updatedProduct = { ...prevProduct };
            let current = updatedProduct;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return updatedProduct;
        });
    };

    const removeSpecification = (index) => {
        const updatedSpecifications = product.specifications.filter((_, i) => i !== index);
        setProduct({
            ...product,
            specifications: updatedSpecifications,
        });
    };
    const removeInterestRule = (index) => {
        const updatedInterestRule = product.interest_rule.filter((_, i) => i !== index);
        setProduct({
            ...product,
            interest_rule: updatedInterestRule,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();


            formData.append("name", product.name);
            formData.append("description", product.description);
            formData.append("shipping_days_min", Number(product.shipping_days_min));
            formData.append("shipping_days_max", Number(product.shipping_days_max));
            formData.append("category_id", product.category_id || "2");
            formData.append("status", product.status);
            formData.append("stock", product.stock);
            formData.append("vendor_id", product.vendor_id || 0);

            formData.append("lease_eligible", product.lease_eligible ? "true" : "false");
            formData.append("featured", product.featured ? "true" : "false");

            formData.append("price", product.price);
            formData.append("repayment_plan_id", product.repayment_plan_id);

            const specsObj = product.specifications.reduce((acc, spec) => {
                if (spec.attribute) {
                    acc[spec.attribute.toLowerCase()] = spec.value;
                }
                return acc;
            }, {});
            formData.append("specifications", JSON.stringify(specsObj));


            const loanTerms = {
                down_payment_percentage: Number(product.loan_terms.down_payment_percentage),
                max_tenure_months: Number(product.loan_terms.max_tenure_months),
                interest_rate: Number(product.loan_terms.interest_rate),
                processing_fee: Number(product.loan_terms.processing_fee),
            };
            formData.append("loan_terms", JSON.stringify(loanTerms));


            if (product.display_image) {
                formData.append("display_image", product.display_image);

            }

            setIsLoading(true);

            const response = await handleCreateProduct("/api/admin/products", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data) {
                toast.success("Product created successfully");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to create product");
        } finally {
            setIsLoading(false);
        }
    };


    const handleRepaymentPlanSelect = (e) => {
        const selectedPlanId = e.target.value;
        const selectedPlan = repaymentPlan?.data?.repayment_plans?.find(
            (plan) => plan.id === selectedPlanId
        );

        if (selectedPlan) {
            setProduct((prevState) => ({
                ...prevState,
                repayment_plan_id: selectedPlanId,
                repayment_policies: {
                    ...prevState.repayment_policies,
                    tenure_unit: selectedPlan.tenure_unit,
                    weekly_tenure: {
                        min: selectedPlan.weekly_tenure_min,
                        max: selectedPlan.weekly_tenure_max,
                    },
                    monthly_tenure: {
                        min: selectedPlan.monthly_tenure_min,
                        max: selectedPlan.monthly_tenure_max,
                    },
                    down_percentage: {
                        min: selectedPlan.down_percent_min,
                        max: selectedPlan.down_percent_max,
                    },
                    description: selectedPlan.description,
                },
            }));
        }
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProduct((prev) => ({
                ...prev,
                display_image: file,
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!preview) {
            toast.error('Please select an image to upload.');
            return;
        }

        const base64Image = preview.split(',')[1];

        try {
            setIsLoad(true)
            console.log(base64Image);
            console.log(imageId)
            const response = await handleProductImage(imageId, { attachment_type: 'products', image: base64Image });
            console.log(response);
            if (response && response.status === 200) {
                toast.success('Image uploaded successfully!');
            } else {
                toast.error('Failed to upload the image. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('An error occurred while uploading the image.');
        } finally {
            setIsLoad(false)
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

    const handleUploadDisplay = async () => {
        if (!previews) {
            toast.error('Please select an image to upload.');
            return;
        }

        const base64Image = previews.split(',')[1];

        try {
            setLoad(true)
            console.log(base64Image);
            const response = await handleDisplayProductImage(imageId, { attachment_type: 'products', image: base64Image });
            console.log(response);
            if (response && response.status === 200) {
                toast.success('Image uploaded successfully!');
            } else {
                toast.error('Failed to upload the image. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('An error occurred while uploading the image.');
        } finally {
            setLoad(false)
        }
    };


    return (
        <div>
            <div className="flex items-center justify-between p-4">
                <h1 className="text-3xl font-semibold">
                    Products <span className="text-black-400">{'>'}</span> Add Products
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
                    <h3 className='p-3 px-10'>Product Information</h3>
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
                                            placeholder="Enter Product name"
                                            value={product.name}
                                            name='name'
                                            onChange={handleInput}
                                        />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="shipping_days_max" value="Shipping Days Max" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            id="shipping_days_max"
                                            type="number"
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            value={product.shipping_days_max}
                                            name='shipping_days_max'
                                            onChange={handleInput}
                                            placeholder='Enter shipping_days_max'

                                        />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="shipping_days_max" value="Shipping Days Max" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            id="stock"
                                            type="number"
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            value={product.stock}
                                            name='stock'
                                            onChange={handleInput}
                                            placeholder='Enter Stock'

                                        />
                                    </div>

                                </div>
                                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="category" value="Category" />
                                        </div>
                                        <select
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            id="tenure_unit"
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            name="repayment_policies.tenure_unit"
                                            value={product.repayment_plan_id ?? ""}
                                            onChange={handleRepaymentPlanSelect}
                                        >
                                            <option value="">Select a Repayment Plan</option>
                                            {isPending ? (
                                                <option disabled>Loading...</option>
                                            ) : isError ? (
                                                <option disabled>Error loading categories</option>
                                            ) : (
                                                repaymentPlan?.data?.repayment_plans?.map((plan) => (
                                                    <option key={plan.id} value={plan.id}>
                                                        ({plan.tenure_unit})  {plan.description}
                                                    </option>
                                                ))
                                            )}
                                        </select>

                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="shipping_days_min" value="Shipping Days Min" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            id="shipping_days_min"
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            type="number"
                                            value={product.shipping_days_min}
                                            name='shipping_days_min'
                                            onChange={handleInput}
                                            placeholder='Enter shipping_days_min'
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
                                            type="text"
                                            value={product.price}
                                            name='price'
                                            onChange={handleInput}
                                            placeholder='Enter product price'
                                        />

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
                                            onChange={handleInputs}
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        >
                                            <option value="true">True</option>
                                            <option value="false">False</option>
                                        </select>
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="status" value="Status" />
                                        </div>
                                        <select
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            id="status"
                                            name="status"
                                            value={product.status ? 'true' : 'false'}
                                            onChange={handleInputs}
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        >
                                            <option value="true">Active</option>
                                            <option value="false">Inactive</option>
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
                                            value={product.description}
                                            onChange={handleInput}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className='p-4'>


                                <Card className="w-full bg-white rounded-2xl shadow-sm border border-gray-200">

                                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                        <h3 className="text-lg font-semibold text-gray-800">Loan Terms</h3>
                                    </div>


                                    <div className="p-6 space-y-6">

                                        <div className="flex flex-col gap-2">
                                            <Label
                                                htmlFor="down_payment_percentage"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Down Payment Percentage (%)
                                            </Label>
                                            <input
                                                id="down_payment_percentage"
                                                type="number"
                                                name="loan_terms.down_payment_percentage"
                                                placeholder="Enter down payment %"
                                                value={product.loan_terms.down_payment_percentage}
                                                onChange={handleInput}
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-green-700 focus:ring-2 focus:ring-green-700/30 focus:outline-none transition"
                                            />
                                        </div>


                                        <div className="flex flex-col gap-2">
                                            <Label
                                                htmlFor="max_tenure_months"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Maximum Tenure (Months)
                                            </Label>
                                            <input
                                                id="max_tenure_months"
                                                type="number"
                                                name="loan_terms.max_tenure_months"
                                                placeholder="Enter max tenure in months"
                                                value={product.loan_terms.max_tenure_months}
                                                onChange={handleInput}
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-green-700 focus:ring-2 focus:ring-green-700/30 focus:outline-none transition"
                                            />
                                        </div>


                                        <div className="flex flex-col gap-2">
                                            <Label
                                                htmlFor="interest_rate"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Interest Rate (%)
                                            </Label>
                                            <input
                                                id="interest_rate"
                                                type="number"
                                                step="0.01"
                                                name="loan_terms.interest_rate"
                                                placeholder="Enter interest rate"
                                                value={product.loan_terms.interest_rate}
                                                onChange={handleInput}
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-green-700 focus:ring-2 focus:ring-green-700/30 focus:outline-none transition"
                                            />
                                        </div>


                                        <div className="flex flex-col gap-2">
                                            <Label
                                                htmlFor="processing_fee"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Processing Fee
                                            </Label>
                                            <input
                                                id="processing_fee"
                                                type="number"
                                                name="loan_terms.processing_fee"
                                                placeholder="Enter processing fee"
                                                value={product.loan_terms.processing_fee}
                                                onChange={handleInput}
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-green-700 focus:ring-2 focus:ring-green-700/30 focus:outline-none transition"
                                            />
                                        </div>
                                    </div>
                                </Card>
                            </div>




                            <div className='p-4'>
                                <Card className='w-full h-full bg-white'>
                                    <h3 className='p-3 px-7 flex items-center justify-between'>
                                        <span>Specifications</span>
                                        <button
                                            type="button"
                                            className="bg-[#0f5d30] text-white px-4 py-2 rounded"
                                            onClick={addSpecification}
                                        >
                                            + Add Specification
                                        </button>
                                    </h3>
                                    <div className='w-full border-t-2 border-gray-200'></div>
                                    <div className='flex flex-col lg:flex-row gap-12 px-7 pb-14 mt-5'>
                                        {product.specifications.length === 0 ? (
                                            <div className="p-10 flex justify-center items-center text-center text-gray-500">No specifications added yet</div>
                                        ) : (
                                            product.specifications.map((spec, index) => (
                                                <div key={index} className=" flex-col lg:flex-row gap-4 w-full">
                                                    <div className="flex-1">
                                                        <div className="mb-2 block">
                                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor={`attribute-${index}`} value="Attribute" />
                                                        </div>
                                                        <input
                                                            id={`attribute-${index}`}
                                                            type="text"
                                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                            placeholder="Enter attribute (e.g., Weight, Colour)"
                                                            name="attribute"
                                                            value={spec.attribute}
                                                            onChange={(e) => handleChange(index, e)}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="mb-2 block">
                                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor={`value-${index}`} value="Value" />
                                                        </div>
                                                        <input
                                                            id={`value-${index}`}
                                                            type="text"
                                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                            placeholder="Enter value (e.g., 0.15 kg, white)"
                                                            name="value"
                                                            value={spec.value}
                                                            onChange={(e) => handleChange(index, e)}
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSpecification(index)}
                                                        className="text-red-500 hover:text-red-700 mt-3 flex items-center gap-2"
                                                    >
                                                        <FaMinus /> Remove
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </Card>

                                <div className='p-4'>
                                    <Card className='w-full h-full bg-white'>
                                        <h3 className='p-3 px-11'>Upload Images</h3>
                                        <div className='w-full border-t-2 border-gray-200'></div>
                                        <div className='flex gap-10  py-5 px-11'>
                                            <div className='w-[17rem] flex gap-10 h-12 py-1 mt-4 px-4 rounded-md border-1 border-gray-200 shadow bg-white '>

                                                <div className='flex gap-2'>
                                                    <input
                                                        type="file"
                                                        accept='image/*'
                                                        hidden
                                                        id="imageInput"
                                                        onChange={handleImageChange}
                                                    />
                                                    <button
                                                        className="flex items-center justify-center mt-1 w-8 h-8 bg-gray-100 border-0 border-gray-300 rounded-full hover:bg-gray-200 focus:outline-none"
                                                        aria-label="Edit"
                                                        onClick={() => document.getElementById('imageInput').click()}
                                                    >
                                                        <BiUpload className="text-gray-500 w-5 h-5 text-lg" />
                                                    </button>
                                                    <p className='text-xs mt-3 text-[#0A0F0C] font-[500]'>Product Image</p>
                                                    {preview && (
                                                        <img src={preview} alt="Uploaded Image" className='w-6 h-6 mt-2 rounded-md' />
                                                    )}

                                                </div>
                                            </div>


                                        </div>
                                        <div className='px-11 pb-5 flex gap-2'>
                                            <div>
                                                <Button
                                                    label="Upload"
                                                    variant="solid"
                                                    loading={isload}
                                                    onClick={handleUpload}
                                                    size="md"
                                                    className="text-sm px-6 py-5"
                                                />
                                            </div>
                                            <div className='mb-7  px-11'>
                                                <Button type="submit" size='lg' className="text-sm w-[150px]" label='Create Product' loading={loading} />


                                            </div>
                                        </div>



                                    </Card>

                                </div>
                            </div>








                        </div>
                    </form>



                </Card>
            </div>





        </div>
    )
}

export default Addproduct
