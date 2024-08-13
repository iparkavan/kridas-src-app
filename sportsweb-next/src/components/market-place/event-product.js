import { useState, useEffect, useRef } from "react";
import { Box, CircularProgress, Select, Skeleton } from "@chakra-ui/react";
import { useCategoriesByType } from "../../hooks/category-hooks";
import { useCountryByISOCode } from "../../hooks/country-hooks";
import { useLocation } from "../../hooks/location-hooks";
import { useSearchProducts } from "../../hooks/product-hooks";
import LabelText from "../ui/text/label-text";
import ProductsList from "./product/products-list";
import { useIntersectionObserver } from "../../hooks/common-hooks";

const EventProduct = ({ sportType }) => {
  const [sportCategoryId, setSportCategoryId] = useState("");
  // const [productType, setProductType] = useState("VCH");
  const { data: sportsCategoryData } = useCategoriesByType("PCS");
  const { data: locationData } = useLocation();
  const { data: countryData } = useCountryByISOCode(locationData?.countryCode);

  const filteredSportsCategory = sportsCategoryData?.filter((category) =>
    sportType.find((type) => type === category.category_type)
  );

  useEffect(() => {
    if (filteredSportsCategory?.length > 0 && !sportCategoryId) {
      setSportCategoryId(filteredSportsCategory[0].category_id);
    }
  }, [filteredSportsCategory, sportCategoryId]);

  const sportsHandler = (e) => {
    setSportCategoryId(e.target.value);
  };

  const {
    data: productsData,
    isSuccess,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSearchProducts({
    productType: "VCH",
    availability: "AVL",
    location: countryData?.country_code,
    limit: 9,
    ...(sportCategoryId && { category: sportCategoryId }),
  });

  const loadMoreRef = useRef();

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });

  return (
    <Box>
      <Box maxW="xs" mb={5}>
        <LabelText mb={1}>Sport</LabelText>
        <Select
          // placeholder="Select Sport"
          value={sportCategoryId}
          onChange={sportsHandler}
        >
          {filteredSportsCategory?.map((sport) => (
            <option key={sport.category_id} value={sport.category_id}>
              {sport.category_name}
            </option>
          ))}
        </Select>
      </Box>
      <Skeleton w="full" isLoaded={!isLoading}>
        {isSuccess && (
          <ProductsList productsData={productsData} isTypeVouchers={false} />
        )}
        <span ref={loadMoreRef} />
        {isFetchingNextPage && (
          <Box textAlign="center" mt={5}>
            <CircularProgress isIndeterminate size="28px" />
          </Box>
        )}
      </Skeleton>
    </Box>
  );
};

export default EventProduct;
