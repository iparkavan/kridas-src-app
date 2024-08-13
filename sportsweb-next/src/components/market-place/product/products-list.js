import { SimpleGrid } from "@chakra-ui/react";
import routes from "../../../helper/constants/route-constants";
import { TextMedium } from "../../ui/text/text";
import MarketplaceCard from "../marketplace-card";

const ProductsList = ({ productsData, isTypeVouchers }) => {
  const areProductsPresent = productsData.pages[0] !== "";

  return areProductsPresent ? (
    <SimpleGrid
      mt={5}
      w="full"
      justifyItems="center"
      columns={{
        base: 1,
        sm: 2,
        md: 1,
        lg: 2,
        xl: 3,
      }}
      rowGap={10}
      columnGap={5}
    >
      {productsData.pages.map((page) => {
        if (page) {
          return page.map((product) => {
            let href, categoryName, sportName;
            if (isTypeVouchers) {
              href = routes.voucher(product.productId);
              categoryName = product.categoryName[0];
              sportName = null;
            } else {
              href = routes.product(product.productId);
              categoryName = product.categoryName[1];
              sportName = product.categoryName[0];
            }

            return (
              <MarketplaceCard
                key={product.productId}
                href={href}
                image={product.productMediaUrl}
                title={product.productName}
                description={product.productDesc}
                categoryName={categoryName}
                sportName={sportName}
                basePrice={product.productBasePrice}
                splPrice={product.productSplPrice}
                priceCurrency={product.productPriceCurrency}
              />
            );
          });
        }
      })}
    </SimpleGrid>
  ) : (
    <TextMedium>No products are present</TextMedium>
  );
};

export default ProductsList;
