import { useState, useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Carousel } from "react-responsive-carousel";
import { HeadingSmall } from "../../ui/heading/heading";
import { TextSmall } from "../../ui/text/text";
import MarketplaceCard from "../../market-place/marketplace-card";
import { useLocation } from "../../../hooks/location-hooks";
import { useCountryByISOCode } from "../../../hooks/country-hooks";
import { useCategoriesByType } from "../../../hooks/category-hooks";
import { useSearchProducts } from "../../../hooks/product-hooks";
import routes from "../../../helper/constants/route-constants";

const EventProductsCarousel = ({ sportType }) => {
  const [sportCategoryId, setSportCategoryId] = useState("");

  const { data: locationData } = useLocation();
  const { data: countryData } = useCountryByISOCode(locationData?.countryCode);

  const { data: sportsCategoryData } = useCategoriesByType("PCS");

  const filteredSportsCategory = sportsCategoryData?.filter((category) =>
    sportType.find((type) => type === category.category_type)
  );

  const { data: productsData, isSuccess } = useSearchProducts({
    productType: "VCH",
    availability: "AVL",
    location: countryData?.country_code,
    limit: 5,
    ...(sportCategoryId && { category: sportCategoryId }),
  });

  useEffect(() => {
    if (filteredSportsCategory?.length > 0 && !sportCategoryId) {
      setSportCategoryId(filteredSportsCategory[0].category_id);
    }
  }, [filteredSportsCategory, sportCategoryId]);

  const areProductsPresent = isSuccess && productsData.pages[0] !== "";

  if (!areProductsPresent) return null;

  return (
    <Box bg="white" p={6} borderRadius="lg">
      <HeadingSmall>Marketplace</HeadingSmall>
      <TextSmall>Products</TextSmall>

      <Box mt={4}>
        <Carousel
          showStatus={false}
          infiniteLoop={true}
          showThumbs={false}
          autoPlay={true}
          stopOnHover={false}
          showIndicators={false}
        >
          {productsData.pages.map((page) => {
            if (page) {
              return page.map((product) => {
                return (
                  <Flex key={product.productId} justifyContent="center">
                    <MarketplaceCard
                      href={routes.product(product.productId)}
                      image={product.productMediaUrl}
                      title={product.productName}
                      description={product.productDesc}
                      categoryName={product.categoryName[1]}
                      sportName={product.categoryName[0]}
                      price={product.productBasePrice}
                      priceCurrency={product.productPriceCurrency}
                    />
                  </Flex>
                );
              });
            }
          })}
        </Carousel>
      </Box>
    </Box>
  );
};

export default EventProductsCarousel;
