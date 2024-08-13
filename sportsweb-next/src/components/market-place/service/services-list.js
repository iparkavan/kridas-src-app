import { SimpleGrid } from "@chakra-ui/react";
import routes from "../../../helper/constants/route-constants";
import { TextMedium } from "../../ui/text/text";
import MarketplaceCard from "../marketplace-card";

const ServicesList = ({ servicesData }) => {
  const areServicesPresent = servicesData.pages[0] !== "";

  return areServicesPresent ? (
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
      {servicesData.pages.map((page) => {
        if (page) {
          return page.map((service) => (
            <MarketplaceCard
              key={service.productId}
              href={routes.service(service.productId)}
              image={service.productMediaUrl}
              title={service.productName}
              description={service.productDesc}
              categoryName={service.categoryName[1]}
              sportName={service.categoryName[0]}
              basePrice={service.productBasePrice}
              splPrice={service.productSplPrice}
              priceCurrency={service.productPriceCurrency}
            />
          ));
        }
      })}
    </SimpleGrid>
  ) : (
    <TextMedium>No services are present</TextMedium>
  );
};

export default ServicesList;
