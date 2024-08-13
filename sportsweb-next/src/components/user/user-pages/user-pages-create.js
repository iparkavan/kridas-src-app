import {
  Text,
  Box,
  VStack,
  HStack,
  Flex,
  Avatar,
  Heading,
  Image,
  Link,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { Field, Form, Formik, useFormikContext } from "formik";
import { useRouter } from "next/router";
import * as yup from "yup";
import {
  useCategoriesByType,
  useCategoriesById,
} from "../../../hooks/category-hooks";
import { useSports } from "../../../hooks/sports-hooks";
import { useCreatePage } from "../../../hooks/page-hooks";
import { useUser } from "../../../hooks/user-hooks";
import TextboxWithValidation from "../../ui/textbox/textbox-with-validation";
import SelectWithValidation from "../../ui/select/select-with-validation";
import TextAreaWithValidation from "../../ui/textbox/textarea-with-validation";
import MultiSelect from "../../ui/select/multi-select";
import { getCreatePageYupSchema } from "../../../helper/constants/page-constants";
import LabelText from "../../ui/text/label-text";
import Button from "../../ui/button";
import { TextSmall } from "../../ui/text/text";

const UserPagesCreate = () => {
  const { data: categories = [] } = useCategoriesByType("CAT");
  const { data: userData = {} } = useUser();
  const { data: sportsData = [] } = useSports(
    {
      select: (data) => {
        return data?.map((sport) => ({
          ...sport,
          value: sport["sports_id"],
          label: sport["sports_name"],
        }));
      },
    },
    true
  );
  const { mutate, isLoading } = useCreatePage();
  const router = useRouter();
  // const pagePicRef = useRef();
  // const coverPicRef = useRef();

  const { data: nonSportingCategories = [] } = useCategoriesByType("NSC");
  const categoryOptions = nonSportingCategories?.map((category) => ({
    ...category,
    value: category.category_id,
    label: category.category_name,
  }));

  const MultiSelectCategories = (props) => {
    const { values } = useFormikContext();
    const categoryId = values?.["main_category_type"].split(",")[0];
    const { data: subCategories = [] } = useCategoriesById(categoryId, {
      select: (data) => {
        return data?.map((category) => ({
          ...category,
          value: category["category_id"],
          label: category["category_name"],
        }));
      },
    });
    return <MultiSelect {...props} options={subCategories} />;
  };

  return (
    <Formik
      initialValues={{
        company_name: "",
        main_category_type: "",
        company_type: [],
        company_desc: "",
        sports_interest: [],
        category_id: "0",
        company_category: [],
        // companyProfileImage: null,
        // image: null,
      }}
      validationSchema={getCreatePageYupSchema(yup)}
      onSubmit={(values, { setSubmitting }) => {
        values.company_name = values.company_name.trim();
        values.company_desc = values.company_desc.trim();
        const main_category_type = values.main_category_type.split(",")[0];
        const company_type = values.company_type.map((type) => type.value);
        const mutateObj = {
          ...values,
          main_category_type,
          company_type,
          user_id: userData?.user_id,
        };
        if (values.category_id === "0") {
          const sports_interest = values.sports_interest.map(
            (type) => type.value
          );
          mutateObj.sports_interest = sports_interest;
          delete mutateObj.company_category;
        } else {
          const company_category = values.company_category.map(
            (type) => type.value
          );
          mutateObj.company_category = company_category;
          delete mutateObj.sports_interest;
        }
        mutate(mutateObj, {
          onSuccess: (data) =>
            router.push(`/page/${data?.["company_id"]}?newPage=true`),
          onSettled: () => setSubmitting(false),
        });
      }}
    >
      {({ setFieldTouched, setFieldValue, values, handleChange }) => (
        <VStack align="stretch" spacing={8}>
          <Box>
            <Heading fontSize="2xl" fontWeight="normal" mb={5}>
              Create Page
            </Heading>
            <Box
              backgroundColor="white"
              borderTopRadius="10px"
              position="relative"
            >
              <Box
                h="120px"
                w="full"
                borderTopRadius="10px"
                bgColor="gray.300"
              />
              {/* <Image
                    // src={
                    //   values.image
                    //     ? URL.createObjectURL(values.image)
                    //     : "/images/createPageCard.png"
                    // }
                    src="/images/createPageCard.png"
                    objectFit="cover"
                    h="120px"
                    w="full"
                    borderTopRadius="10px"
                    alt="Page cover Image"
                  /> */}
              {/* <Input
                    type="file"
                    id="coverPic"
                    display="none"
                    ref={coverPicRef}
                    onChange={(e) => {
                      if (e.target.files[0] !== values.image) {
                        setFieldValue("image", e.target.files[0]);
                      }
                    }}
                  /> */}
              {/* <IconButton
                    aria-label="upload picture"
                    icon={<EditIcon color="white" />}
                    bg="none"
                    size="sm"
                    _hover={{ background: "none" }}
                    position="absolute"
                    top="10px"
                    right="10px"
                    onClick={() => coverPicRef.current.click()}
                  /> */}

              <Flex justifyContent={"flex-start"} mt={-14} py={3} px={10}>
                <HStack>
                  <Avatar
                    size={"xl"}
                    name="Page"
                    alt="Page profile image"
                    mt={-14}
                  >
                    {/* <Input
                          type="file"
                          id="pagePic"
                          display="none"
                          ref={pagePicRef}
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              setFieldValue(
                                "companyProfileImage",
                                e.target.files[0]
                              );
                            }
                          }}
                        /> */}
                    {/* <IconButton
                          aria-label="upload picture"
                          icon={<EditIcon color="white" />}
                          isRound
                          size="xs"
                          colorScheme="primary"
                          border="2px solid white"
                          position="absolute"
                          top="5px"
                          right="0px"
                          onClick={() => pagePicRef.current.click()}
                        /> */}
                  </Avatar>
                  <Box p={6} alignItems={"baseline"}>
                    <VStack>
                      <Box height="25px"></Box>
                      <VStack spacing={0} align={"flex-start"}>
                        <Text color="gray.500" fontWeight="bold">
                          {values.company_name
                            ? values.company_name
                            : "Page name"}
                        </Text>
                        <Text color="gray.500" fontSize="sm">
                          {values.main_category_type
                            ? categories?.find(
                                (cat) =>
                                  values.main_category_type ===
                                  `${cat["category_id"]},${cat["category_type"]}`
                              )?.["category_name"]
                            : "Category"}
                        </Text>
                        <Text color="gray.500" fontSize="sm">
                          {values.company_desc
                            ? values.company_desc
                            : "Introduction"}
                        </Text>
                      </VStack>
                    </VStack>
                  </Box>
                </HStack>
              </Flex>
            </Box>
          </Box>

          <Form>
            <Box p={3} bg="white">
              {/* <Box p={[2, 5, 5]} bg="white"> */}
              <VStack alignItems="flex-start" p={15}>
                {/* <VStack spacing={7} w={["100%", "100%", "70%", "50%", "30%"]}>
                    <TextboxWithValidation
                      name="company_name"
                      label="Page Name"
                      placeholder="Enter name"
                    />
                    <SelectWithValidation
                      name="main_category_type"
                      label="Select Category"
                      placeholder="Select"
                      variant="flushed"
                      onChange={(e) => {
                        handleChange(e);
                        setFieldValue("company_type", []);
                        setFieldTouched("company_type", false);
                      }}
                    >
                      {categories?.map((category) => (
                        <option
                          key={category["category_id"]}
                          value={`${category["category_id"]},${category["category_type"]}`}
                        >
                          {category["category_name"]}
                        </option>
                      ))}
                    </SelectWithValidation>
                    <MultiSelectCategories
                      isMulti
                      placeholder="Select"
                      label="Select Sub-Categories"
                      id="company_type"
                      instanceId="company_type"
                      name="company_type"
                    />
                    <MultiSelect
                      isMulti
                      placeholder="Select"
                      label="Select Sports Associated"
                      id="sports_interest"
                      instanceId="sports_interest"
                      name="sports_interest"
                      options={sportsData}
                    />
                    <TextAreaWithValidation
                      name="company_desc"
                      label="Introduction"
                      placeholder="Type an introduction"
                    />
                  </VStack> */}
                <VStack
                  w="full"
                  // gap={2}
                  p={3}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="lg"
                >
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    w="full"
                    gap={{ base: "1", md: "2", sm: "1" }}
                    // bg="red"
                  >
                    <LabelText
                      p={{ base: "1", md: "2", sm: "1", lg: "3" }}
                      minW="300px"
                    >
                      Page Name
                    </LabelText>
                    <Box w="full" mr={{ base: "4", md: "2" }}>
                      <TextboxWithValidation
                        name="company_name"
                        placeholder="Enter name"
                        // w={{ base: "none", lg: "xl" }}
                      />
                    </Box>
                  </Flex>
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    w="full"
                    gap={{ base: "1", md: "2", sm: "1" }}

                    // bg="red"
                  >
                    <LabelText
                      p={{ base: "1", md: "2", sm: "1", lg: "3" }}
                      minW="300px"
                    >
                      Page Category
                    </LabelText>
                    <Box w="full" mr={{ base: "4", md: "2" }}>
                      <SelectWithValidation
                        name="main_category_type"
                        placeholder="Select"
                        // w="xl"
                        onChange={(e) => {
                          handleChange(e);
                          setFieldValue("company_type", []);
                          setFieldTouched("company_type", false);
                          setFieldValue("category_id", "0");
                        }}
                      >
                        {categories?.map((category) => (
                          <option
                            key={category["category_id"]}
                            value={`${category["category_id"]},${category["category_type"]}`}
                          >
                            {category["category_name"]}
                          </option>
                        ))}
                      </SelectWithValidation>
                    </Box>
                  </Flex>
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    w="full"
                    gap={{ base: "1", md: "2", sm: "1" }}
                    // bg="red"
                  >
                    <LabelText
                      p={{ base: "1", md: "2", sm: "1", lg: "3" }}
                      minW="300px"
                    >
                      Page Sub-Categories
                    </LabelText>
                    <Box w="full" mr={{ base: "4", md: "2" }}>
                      <MultiSelectCategories
                        isMulti
                        placeholder="Select"
                        id="company_type"
                        instanceId="company_type"
                        name="company_type"
                      />
                    </Box>
                  </Flex>

                  {/* Display radio buttons only if page category is company */}
                  {values.main_category_type?.split(",")?.[1] === "CMP" && (
                    <Flex
                      direction={{ base: "column", md: "row" }}
                      justify="space-between"
                      alignItems="center"
                      w="full"
                      gap={{ base: "1", md: "2", sm: "1" }}
                      // bg="red"
                    >
                      <LabelText
                        p={{ base: "1", md: "2", sm: "1", lg: "3" }}
                        minW="300px"
                      >
                        Company Type
                      </LabelText>
                      <Box w="full" mr={{ base: "4", md: "2" }}>
                        <Field name="category_id">
                          {({ field }) => (
                            <RadioGroup colorScheme="primary" {...field}>
                              <Stack
                                direction={{ base: "column", lg: "row" }}
                                spacing={{ base: 2, lg: 10 }}
                              >
                                <Radio {...field} value="0">
                                  <TextSmall>Sporting Company</TextSmall>
                                </Radio>
                                <Radio {...field} value="1">
                                  <TextSmall>Non-Sporting Company</TextSmall>
                                </Radio>
                              </Stack>
                            </RadioGroup>
                          )}
                        </Field>
                      </Box>
                    </Flex>
                  )}

                  {/* <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    w="full"
                    gap={{ base: "1", md: "2", sm: "1" }}
                    // bg="red"
                  >
                    <LabelText
                      p={{ base: "1", md: "2", sm: "1", lg: "3" }}
                      minW="300px"
                    >
                      Sports Associated
                    </LabelText>
                    <Box w="full" mr={{ base: "4", md: "2" }}>
                      <MultiSelect
                        isMulti
                        placeholder="Select"
                        id="sports_interest"
                        instanceId="sports_interest"
                        name="sports_interest"
                        options={sportsData}
                      />
                    </Box>
                  </Flex> */}

                  {values.category_id === "0" ? (
                    <Flex
                      direction={{ base: "column", md: "row" }}
                      justify="space-between"
                      w="full"
                      gap={{ base: "1", md: "2", sm: "1" }}
                      // bg="red"
                    >
                      <LabelText
                        p={{ base: "1", md: "2", sm: "1", lg: "3" }}
                        minW="300px"
                      >
                        Sports Associated
                      </LabelText>
                      <Box w="full" mr={{ base: "4", md: "2" }}>
                        <MultiSelect
                          isMulti
                          placeholder="Select"
                          id="sports_interest"
                          instanceId="sports_interest"
                          name="sports_interest"
                          options={sportsData}
                        />
                      </Box>
                    </Flex>
                  ) : (
                    <Flex
                      direction={{ base: "column", md: "row" }}
                      justify="space-between"
                      w="full"
                      gap={{ base: "1", md: "2", sm: "1" }}
                      // bg="red"
                    >
                      <LabelText
                        p={{ base: "1", md: "2", sm: "1", lg: "3" }}
                        minW="300px"
                      >
                        Category Associated
                      </LabelText>
                      <Box w="full" mr={{ base: "4", md: "2" }}>
                        <MultiSelect
                          isMulti
                          placeholder="Select"
                          id="company_category"
                          instanceId="company_category"
                          name="company_category"
                          options={categoryOptions}
                        />
                      </Box>
                    </Flex>
                  )}
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    w="full"
                    gap={{ base: "1", md: "2", sm: "1" }}
                    // bg="red"
                  >
                    <LabelText
                      p={{ base: "1", md: "2", sm: "1", lg: "3" }}
                      minW="300px"
                    >
                      Introduction
                    </LabelText>
                    <Box w="full" mr={{ base: "4", md: "2" }}>
                      <TextAreaWithValidation
                        // w="xl"
                        name="company_desc"
                        placeholder="Type an introduction"
                      />
                    </Box>
                  </Flex>
                </VStack>
                {/* <Box
                    border={10}
                    bg="red.200"
                    borderColor="blackAlpha.700"
                    w={{ sm: "80%", md: "90%", lg: "100%" }}
                  >
                    <HStack display={{ md: "flex" }}>
                      <Box
                        mr={{ sm: "50%", md: "25%", lg: "40%" }}
                        p={[3, 5, 6]}
                      >
                        <LabelText>Page Name</LabelText>
                      </Box>
                      <Box mt={{ md: 0 }} w="full">
                        <TextboxWithValidation
                          name="company_name"
                          placeholder="Enter name"
                          // w={{ base: "none", lg: "xl" }}
                        />
                      </Box>
                    </HStack>
                  </Box>
                  <Box
                    border={10}
                    bg="red.200"
                    borderColor="blackAlpha.700"
                    w={{ sm: "80%", md: "90%", lg: "100%" }}
                  >
                    <HStack display={{ md: "flex" }}>
                      <Box
                        mr={{ sm: "50%", md: "25%", lg: "38%" }}
                        p={[3, 5, 6]}
                      >
                        <LabelText>Select Category</LabelText>
                      </Box>
                      <Box mt={{ md: 0 }}>
                        <SelectWithValidation
                          name="main_category_type"
                          placeholder="Select"
                          variant="flushed"
                          // w="xl"
                          onChange={(e) => {
                            handleChange(e);
                            setFieldValue("company_type", []);
                            setFieldTouched("company_type", false);
                          }}
                        >
                          {categories?.map((category) => (
                            <option
                              key={category["category_id"]}
                              value={`${category["category_id"]},${category["category_type"]}`}
                            >
                              {category["category_name"]}
                            </option>
                          ))}
                        </SelectWithValidation>
                      </Box>
                    </HStack>
                  </Box>
                  <Box
                    border={10}
                    bg="red.200"
                    borderColor="blackAlpha.700"
                    w={{ sm: "80%", md: "90%", lg: "100%" }}
                  >
                    <HStack display={{ md: "flex" }}>
                      <Box
                        mr={{ sm: "50%", md: "25%", lg: "35%" }}
                        p={[3, 5, 6]}
                      >
                        <LabelText>Select Sub-Categories</LabelText>
                      </Box>
                      <Box mt={{ md: 0 }}>
                        <MultiSelectCategories
                          isMulti
                          placeholder="Select"
                          id="company_type"
                          instanceId="company_type"
                          name="company_type"
                        />
                      </Box>
                    </HStack>
                  </Box>
                  <Box
                    border={10}
                    bg="red.200"
                    borderColor="blackAlpha.700"
                    w={{ sm: "80%", md: "90%", lg: "100%" }}
                  >
                    <HStack display={{ md: "flex" }}>
                      <Box
                        mr={{ sm: "50%", md: "25%", lg: "34%" }}
                        p={[3, 5, 6]}
                      >
                        <LabelText>Select Sports Associated</LabelText>
                      </Box>
                      <Box mt={{ md: 0 }}>
                        <MultiSelect
                          isMulti
                          placeholder="Select"
                          id="sports_interest"
                          instanceId="sports_interest"
                          name="sports_interest"
                          options={sportsData}
                        />
                      </Box>
                    </HStack>
                  </Box>
                  <Box
                    border={10}
                    bg="red.200"
                    borderColor="blackAlpha.700"
                    w={{ sm: "80%", md: "90%", lg: "100%" }}
                  >
                    <HStack display={{ md: "flex" }}>
                      <Box
                        mr={{ sm: "50%", md: "25%", lg: "40%" }}
                        p={[3, 5, 6]}
                      >
                        <LabelText>Introduction</LabelText>
                      </Box>
                      <Box mt={{ md: 0 }}>
                        <TextAreaWithValidation
                          // w="xl"
                          name="company_desc"
                          placeholder="Type an introduction"
                        />
                      </Box>
                    </HStack>
                  </Box> */}
                <HStack p={5}>
                  <Button
                    colorScheme="primary"
                    type="submit"
                    isLoading={isLoading}
                  >
                    Save
                  </Button>
                  <Button
                    colorScheme="primary"
                    variant="outline"
                    onClick={() => router.push("/user/pages")}
                  >
                    Cancel
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </Form>
        </VStack>
      )}
    </Formik>
  );
};

export default UserPagesCreate;
