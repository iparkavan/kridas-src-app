import { useState } from "react";
import {
  VStack,
  Input,
  Popover,
  PopoverTrigger,
  IconButton,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Box,
  Portal,
  Grid,
  GridItem,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import ReactSelect from "react-select";
import { GoSettings } from "react-icons/go";

import { useSports } from "../../hooks/sports-hooks";
import { useUser } from "../../hooks/user-hooks";
import { TextSmall } from "../ui/text/text";
import routes from "../../helper/constants/route-constants";
import BreadcrumbList from "../ui/breadcrumb/breadcrumb-list";
import VoucherCard from "./voucher-card";
import { useSearchVouchers } from "../../hooks/voucher-hooks";

const VouchersList = () => {
  const [voucherName, setVoucherName] = useState("");
  const [location, setLocation] = useState();
  const [sports, setSports] = useState([]);
  const [vendors, setVendors] = useState([]);
  const { data: userData } = useUser();
  const { data: vouchersData, isSuccess } = useSearchVouchers();
  const { data: sportsData = [] } = useSports({
    select: (data) => {
      return data?.map((sport) => ({
        ...sport,
        value: sport["sports_id"],
        label: sport["sports_name"],
      }));
    },
  });

  // console.log("vouchers", vouchersData);

  const isFilterSelected =
    voucherName || location || sports.length > 0 || vendors.length > 0;

  const selectedTab = {
    color: "white",
    bg: "primary.500",
    borderRadius: "md",
  };

  return (
    <Box>
      <BreadcrumbList
        rootRoute={routes.profile(userData["user_name"])}
        rootPageName={userData["full_name"]}
        currentPageName="Vouchers"
      />
      <Box mt={4} bg="white" borderRadius="md">
        <Tabs p={4}>
          <TabList>
            <Tab
              fontWeight="500"
              _selected={selectedTab}
              _focus={{ boxShadow: "none" }}
            >
              Vouchers
            </Tab>
            <Popover>
              <PopoverTrigger>
                <IconButton
                  ml="auto"
                  icon={<GoSettings />}
                  aria-label="Filters"
                  transform="rotate(270deg)"
                  colorScheme={isFilterSelected ? "primary" : "gray"}
                  variant={isFilterSelected ? "solid" : "ghost"}
                />
              </PopoverTrigger>
              <Portal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>FILTER</PopoverHeader>
                  <PopoverBody p={4}>
                    <VStack spacing={5}>
                      <Input
                        type="search"
                        placeholder="Search for vouchers"
                        value={voucherName}
                        onChange={(e) => setVoucherName(e.target.value)}
                      />
                      <Box w="full">
                        <TextSmall color="primary.500" mb={1}>
                          Location
                        </TextSmall>

                        <Input
                          type="search"
                          placeholder="Location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </Box>
                      <Box w="full">
                        <TextSmall color="primary.500" mb={1}>
                          Sports
                        </TextSmall>
                        <ReactSelect
                          isMulti
                          placeholder="Select Sports"
                          options={sportsData}
                        />
                      </Box>
                      <Box w="full">
                        <TextSmall color="primary.500" mb={1}>
                          Vendors
                        </TextSmall>
                        <ReactSelect
                          isMulti
                          placeholder="Select Vendors"
                          options={sportsData}
                        />
                      </Box>
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
          </TabList>
          <TabPanels>
            <TabPanel p={2} mt={4}>
              {isSuccess && (
                <Grid
                  w="full"
                  gap={8}
                  templateColumns="repeat(auto-fill, 250px)"
                  justifyContent={{ base: "center", md: "revert" }}
                >
                  {vouchersData.map((voucher) => (
                    <GridItem key={voucher.id}>
                      <VoucherCard voucher={voucher} />
                    </GridItem>
                  ))}
                </Grid>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default VouchersList;
