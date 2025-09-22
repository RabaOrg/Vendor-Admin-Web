import { useQuery } from "@tanstack/react-query";
import { handleGetCat, handleGetCategories, handleGetSingleProduct, handleMetaProduct, handleProduct,handleProductBulk, handleProductStatistics, handleProductVendor  } from "../../services/product";

export const useFetchProduct = (page, perPage) => {
  return useQuery({
    queryFn: () => handleProduct(page, perPage),
    queryKey: ["Product", page, perPage]
  });
}
export const useFetchMetaProduct = (page, perPage) => {
  return useQuery({
    queryFn: () => handleMetaProduct(page, perPage),
    queryKey: ["ProductMeta", page, perPage]
  });
}

export const useFetchBulkDownload = () => {
  return useQuery({
    queryFn: handleProductBulk,
    queryKey: ["ProductBulk"]
  });
};
export const useFetchCat = () => {
  return useQuery({
    queryFn: handleGetCat,
    queryKey: ["Category"]
  });
};
export const useFetchProductVendor = (id) => {
  return useQuery({
    queryFn: () => handleProductVendor(id),
    queryKey: ["ProductVendor", id]
  });
};
export const useFetchProductStat = () => {
  return useQuery({
    queryFn: handleProductStatistics,
    queryKey: ["productStat"]
  });
};

export const useFetchSingleProduct = (id) => {
  return useQuery({
    queryFn: () => handleGetSingleProduct(id),
    queryKey: ["SingleProduct", id]
  });
}
export const useFetchCategory = () => {
  return useQuery({
    queryFn: () =>handleGetCategories(),
    queryKey: ["category"]
  });
}
