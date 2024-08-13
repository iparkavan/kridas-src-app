import { useState } from "react";
import {
  Box,
  Checkbox,
  HStack,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import { useSearchProducts } from "../../hooks/product-hooks";
import ProductsList from "./product/products-list";
import ServicesList from "./service/services-list";
import { TextCustom } from "../ui/text/text";
import LabelText from "../ui/text/label-text";
import ProductsFilter from "../pages/products/products-filter";
import SelectWithValidation from "../ui/select/select-with-validation";
import { useCategoriesByType } from "../../hooks/category-hooks";
import EventProduct from "./event-product";
import EventService from "./event-service";
import EventSponsers from "./event-sponsors";

const EventMarketPlace = ({ sportType }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [productType, setProductType] = useState("VCH");

  const tabsHandler = (index) => {
    if (index === 0) {
      setProductType("VCH");
    } else if (index === 1) {
      setProductType("SER");
    }
    setTabIndex(index);
  };

  return (
    <Box>
      <Tabs variant="unstyled" index={tabIndex} onChange={tabsHandler} isLazy>
        <TabList>
          <Tab
            bg="gray.200"
            _selected={{
              fontWeight: "medium",
              bg: "primary.500",
              color: "white",
            }}
          >
            Sponsors
          </Tab>
          <Tab
            bg="gray.200"
            _selected={{
              fontWeight: "medium",
              bg: "primary.500",
              color: "white",
            }}
          >
            Products
          </Tab>
          <Tab
            bg="gray.200"
            _selected={{
              fontWeight: "medium",
              bg: "primary.500",
              color: "white",
            }}
          >
            Services
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <EventSponsers sportType={sportType} />
          </TabPanel>
          <TabPanel>
            <EventProduct sportType={sportType} />
          </TabPanel>
          <TabPanel>
            <EventService sportType={sportType} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default EventMarketPlace;
