import { useState, useRef } from "react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Checkbox,
  CircularProgress,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Radio,
  RadioGroup,
  SimpleGrid,
  Skeleton,
  Spacer,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import Button from "../../ui/button";
import VouchersFilter from "./vouchers-filter";
import { useSearchProducts } from "../../../hooks/product-hooks";
import VoucherModal from "../../market-place/voucher/voucher-modal";
import { TextMedium } from "../../ui/text/text";
import MarketplaceCard from "../../market-place/marketplace-card";
import routes from "../../../helper/constants/route-constants";
import { useIntersectionObserver } from "../../../hooks/common-hooks";
import AddToEventMarketplaceModal from "../../market-place/voucher/add-to-event-marketplace-modal";

const VouchersTab = ({ currentPage, pageData, isNonSportingPage }) => {
  const [voucherName, setVoucherName] = useState("");
  const [sportCategoryId, setSportCategoryId] = useState("");

  const [select, setSelect] = useState("");
  const [selectedVoucher, setSelectedVoucher] = useState([]);

  const [voucherId, setVoucherId] = useState([]);

  // const allChecked = selectedVoucher.every(Boolean);
  // const isIndeterminate = selectedVoucher.some(Boolean) && !allChecked;

  const category = sportCategoryId || null;

  const {
    data: vouchersData,
    isSuccess,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSearchProducts({
    productType: "CVCH",
    availability: "AVL",
    vendor: pageData.company_id,
    limit: 8,
    ...(voucherName && { productName: voucherName }),
    ...(category && { category }),
  });

  const loadMoreRef = useRef();

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEventOpen,
    onOpen: onEventOpen,
    onClose: onEventClose,
  } = useDisclosure();

  const handleSearchName = (e) => {
    setVoucherName(e.target.value);
  };

  const checkBoxHandler = (voucherId, isChecked) => {
    if (isChecked) {
      setSelectedVoucher((prevSelected) => [...prevSelected, voucherId]);
    } else {
      setSelectedVoucher((prevSelected) =>
        prevSelected.filter((id) => id !== voucherId)
      );
    }
  };

  const areVouchersPresent = isSuccess && vouchersData.pages[0] !== "";

  return (
    <Box w="full" bg="white" p={5} borderRadius="md">
      <HStack spacing={5}>
        {currentPage && (
          <>
            <Button onClick={onOpen} leftIcon={<AddIcon />}>
              Add Voucher
            </Button>
            <VoucherModal
              isOpen={isOpen}
              onClose={onClose}
              type="add"
              pageData={pageData}
              onEventOpen={onEventOpen}
              setVoucherId={setVoucherId}
              isNonSportingPage={isNonSportingPage}
            />

            <Button variant="outline" onClick={onEventOpen}>
              Add to Event MarketPlace
            </Button>
            <AddToEventMarketplaceModal
              isOpen={isEventOpen}
              onClose={onEventClose}
              voucherId={voucherId}
              selectedVoucher={selectedVoucher}
            />
            <Spacer />
          </>
        )}

        <RadioGroup onChange={setSelect} value={select}>
          <Stack direction="row" gap={6}>
            <Radio value="1">Select</Radio>
            <Radio value="2">Select All</Radio>
          </Stack>
        </RadioGroup>

        <Spacer />
        <InputGroup maxW="250px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon />
          </InputLeftElement>
          <Input
            type="search"
            placeholder="Search Vouchers"
            value={voucherName}
            onChange={handleSearchName}
          />
        </InputGroup>
        <VouchersFilter
          sportCategoryId={sportCategoryId}
          setSportCategoryId={setSportCategoryId}
        />
      </HStack>

      <Skeleton isLoaded={!isLoading}>
        {areVouchersPresent ? (
          <SimpleGrid columns={{ lg: 2, xl: 3, "2xl": 4 }} mt={10} rowGap={10}>
            {vouchersData.pages.map((page) => {
              if (page) {
                return page.map((voucher) => (
                  <HStack key={voucher.productId}>
                    <Box>
                      {select === "1" && (
                        <Box cursor={"pointer"} position={"relative"}>
                          <Checkbox
                            isChecked={selectedVoucher.voucherId}
                            onChange={(e) =>
                              checkBoxHandler(
                                voucher.productId,
                                e.target.checked
                              )
                            }
                            bottom={"133px"}
                            left={3}
                            size="lg"
                            zIndex={10}
                            position={"absolute"}
                          />
                        </Box>
                      )}
                      {select === "2" && (
                        <Box cursor={"pointer"} position={"relative"}>
                          <Checkbox
                            defaultChecked
                            // isChecked={allChecked}
                            // isIndeterminate={isIndeterminate}
                            size="lg"
                            // onChange={(e) =>
                            //   checkBoxHandler(
                            //     voucher.productId,
                            //     e.target.checked
                            //   )
                            // }
                            bottom={"133px"}
                            left={3}
                            zIndex={10}
                            position={"absolute"}
                          />
                        </Box>
                      )}
                    </Box>

                    <Box>
                      <MarketplaceCard
                        href={routes.voucher(voucher.productId)}
                        image={voucher.productMediaUrl}
                        title={voucher.productName}
                        description={voucher.productDesc}
                        categoryName={voucher.categoryName[0]}
                        sportName={null}
                        basePrice={voucher.productBasePrice}
                        splPrice={voucher.productSplPrice}
                        priceCurrency={voucher.productPriceCurrency}
                      />
                    </Box>
                  </HStack>
                ));
              }
            })}
          </SimpleGrid>
        ) : (
          <TextMedium mt={5}>No vouchers are present</TextMedium>
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

export default VouchersTab;
