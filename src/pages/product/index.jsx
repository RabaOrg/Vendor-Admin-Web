import React, { useEffect, useState } from 'react';
import { FaSearch, FaEdit, FaEye } from 'react-icons/fa';
import axiosInstance from '../../../store/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../../components/shared/button';
import { useQueryClient } from "@tanstack/react-query";
import { handleArchive, handleDeletePro } from '../../services/product';
import { FaTrash } from 'react-icons/fa';
import { FaUndo } from 'react-icons/fa';
import { FaArchive } from 'react-icons/fa';

function Product() {
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingArchiveId, setLoadingArchiveId] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [product, setProduct] = useState([]);
    const queryClient = useQueryClient();
    const [productMeta, setMetaProduct] = useState([]);
    const itemsPerPage = 10;
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    const handleProduct = (id) => {
        navigate(`/editproduct/${id}`);
    };

    const handleViewProduct = (id) => {
        navigate(`/view_product_details/${id}`);
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearch(query);

        if (query === "") {
            setProduct(allProducts);
        } else {
            const filteredProducts = allProducts.filter((item) =>
                item.name.toLowerCase().includes(query)
            );
            setProduct(filteredProducts);
        }
    };
    const handleDelete = async (id) => {
        try {
            const response = await handleDeletePro(id)
            if (response) {
                toast.success("Product deleted successfully")
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleNextPage = () => {
        if (currentPage < productMeta?.meta?.total_pages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const toggleArchive = async (id, isArchived) => {
        try {
            setLoadingArchiveId(id);
            const formInfo = { is_archived: !isArchived };
            await handleArchive(id, formInfo);

            toast.success(isArchived ? "Product unarchived" : "Product archived");

            queryClient.invalidateQueries(["SingleProduct", id]);
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingArchiveId(null);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axiosInstance.get(`/api/admin/products?limit=${itemsPerPage}&page=${currentPage}&search=${search}`);
                console.log(response);
                setAllProducts(response.data.data);
                setProduct(response.data.data);
                setMetaProduct(response.data);
            } catch (error) {
                console.log('Error fetching products:', error);
            }
        };

        fetchProduct();
    }, [currentPage, itemsPerPage]);

    return (
        <div className="px-6">
            <div className="inline-block min-w-full rounded-lg overflow-hidden">
                <div className="flex justify-between flex-col md:flex-row w-full gap-4 py-6">
                    <h1 className="text-3xl font-semibold text-black mb-4 md:mb-0">Products</h1>
                    <div className="relative w-full md:w-[700px]">
                        <input
                            type="text"
                            placeholder="Search product name"
                            value={search}
                            onChange={handleSearch}
                            className="w-full px-3 py-2 pl-8 mt-1 text-xs font-[400] text-[#202224] rounded-full bg-white border border-gray-300 focus:ring-2 focus:ring-green-600 focus:outline-none"
                        />
                        <span className="absolute left-3 top-[22px] transform -translate-y-1/2 text-gray-400">
                            <FaSearch />
                        </span>
                    </div>
                    <Link to={"/addproduct"}>
                        <Button
                            label="Add New Product"
                            variant="solid"
                            size="md"
                            className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 mt-4 md:mt-0"
                        />
                    </Link>
                    <Link to={"/product_statistics"}>
                        <Button
                            label="View Product Statistics"
                            variant="solid"
                            size="md"
                            className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 mt-4 md:mt-0"
                        />
                    </Link>
                </div>

                <div className="overflow-x-auto hidden md:block">
                    <table className="min-w-full leading-normal rounded-md rounded-t-md border-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black tracking-wider">Id</th>
                                <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black tracking-wider">Image</th>
                                <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black tracking-wider">Product Name</th>
                                <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black tracking-wider">Category</th>
                                <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black tracking-wider">Price</th>
                                <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black tracking-wider">Action</th>
                                <th className="px-4 pl-12  py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(product) && product.length > 0 ? (
                                product.map((item) => {
                                    const { id, display_attachment_url, name, price, category_id,
                                        is_archived } = item;
                                    return (
                                        <tr className="bg-white" key={id}>
                                            <td className="px-4 py-4 border-b border-gray-200 bg-white text-xs">
                                                <p className="font-[500] whitespace-no-wrap">{id}</p>
                                            </td>
                                            <td className="px-4 py-4 border-b border-gray-200 bg-white text-xs">
                                                <img className="w-11 h-11" src={display_attachment_url?.url} alt="Product" />
                                            </td>
                                            <td className="px-4 py-4 border-b border-gray-200 bg-white text-xs">
                                                <p className="font-[500] whitespace-no-wrap">{name}</p>
                                            </td>
                                            <td className="px-4 py-4 border-b border-gray-200 bg-white text-xs">
                                                <p className="font-[500] whitespace-no-wrap">{category_id}</p>
                                            </td>
                                            <td className="px-4 py-4 border-b border-gray-200 bg-white text-xs">
                                                <p className="font-[500] whitespace-no-wrap">{price}</p>
                                            </td>
                                            {is_archived ? <td className="px-4 py-4 border-b border-gray-200 bg-white text-xs">
                                                <span className="relative inline-flex items-center justify-center w-24 px-6 py-2 font-semibold bg-red-300 leading-tight rounded-md">
                                                    <span aria-hidden className="absolute inset-0 text-red-700 opacity-50 rounded-lg" />
                                                    <span className="relative text-red-700">Archived</span>
                                                </span>
                                            </td> : <td className="px-4 py-4 border-b border-gray-200 bg-white text-xs">
                                                <span className="relative inline-flex items-center justify-center w-24 px-6 py-2 font-semibold bg-[#ccf0eb] leading-tight rounded-md">
                                                    <span aria-hidden className="absolute inset-0 text-[#00B69B] opacity-50 rounded-lg" />
                                                    <span className="relative text-[#00B69B]">Active</span>
                                                </span>
                                            </td>}
                                            <td className="px-7 py-4 border-b gap-2 border-gray-200 bg-white flex justify-center">
                                                <button
                                                    className="flex items-center justify-center w-12 h-10 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none"
                                                    aria-label="View"
                                                    onClick={() => handleViewProduct(id)}
                                                >
                                                    <FaEye className="text-gray-500 text-lg" />
                                                </button>
                                                <button
                                                    className="flex items-center justify-center w-12 h-10 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none"
                                                    aria-label="Edit"
                                                    onClick={() => handleProduct(id)}
                                                >
                                                    <FaEdit className="text-gray-500 text-lg" />
                                                </button>
                                                <button
                                                    className="flex items-center justify-center w-12 h-10 bg-red-100 border border-red-300 rounded-lg hover:bg-red-200 focus:outline-none"
                                                    aria-label="Delete"
                                                    onClick={() => handleDelete(id)}
                                                >
                                                    <FaTrash className="text-red-500 text-lg" />
                                                </button>
                                                <button
                                                    className={`flex items-center justify-center w-12 h-10 ${is_archived
                                                        ? "bg-green-100 border border-green-300 hover:bg-green-200"
                                                        : "bg-yellow-100 border border-yellow-300 hover:bg-yellow-200"
                                                        } rounded-lg focus:outline-none`}
                                                    aria-label={is_archived ? "Unarchive" : "Archive"}
                                                    onClick={() => toggleArchive(id, is_archived)}
                                                    disabled={loadingArchiveId === id}
                                                >
                                                    {loadingArchiveId === id ? (
                                                        <span className="text-sm text-gray-500">...</span>
                                                    ) : is_archived ? (
                                                        <FaUndo className="text-green-600 text-lg" />
                                                    ) : (
                                                        <FaArchive className="text-yellow-600 text-lg" />
                                                    )}
                                                </button>
                                            </td>

                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-gray-500">
                                        No products found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-[#0f5d30] text-white rounded-md hover:bg-[#0e4c24] disabled:bg-gray-200 disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-sm">
                    Page {currentPage} of {productMeta?.meta?.total_pages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === productMeta?.meta?.total_pages}
                    className="px-4 py-2 bg-[#0f5d30] text-white rounded-md hover:bg-[#0e4c24] disabled:bg-gray-200 disabled:opacity-50"
                >
                    Next
                </button>
            </div>

        </div>
    );
}

export default Product;
