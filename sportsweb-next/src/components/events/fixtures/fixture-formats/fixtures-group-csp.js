import { useEffect } from "react";
import { Divider, GridItem, HStack, IconButton } from "@chakra-ui/react";
import { FieldArray, useFormikContext } from "formik";
import SelectWithValidation from "../../../ui/select/select-with-validation";
import { getNumberSuffix } from "../../../../helper/constants/event-fixtures-constants";
import { AddIcon, MinusIcon } from "../../../ui/icons";

const formatObj = {
  level: "",
  prize: "",
  format: "",
};

const FixturesGroupCsp = () => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    if (values.knockout_format === "CSP" && values.inner_format.length === 0) {
      setFieldValue("inner_format", [formatObj]);
    }
  }, [setFieldValue, values.inner_format.length, values.knockout_format]);

  return (
    <>
      <GridItem w="full" gridColumn="1 / -1">
        <Divider borderColor="gray.400" />
      </GridItem>
      <FieldArray
        name="inner_format"
        render={(formatHelpers) => {
          return (
            <GridItem w="full" gridColumn="1 / -1">
              {values.inner_format.map((format, formatIndex) => (
                <HStack
                  key={formatIndex}
                  alignItems="flex-start"
                  spacing={5}
                  mb={2}
                >
                  <SelectWithValidation
                    name={`inner_format[${formatIndex}].level`}
                    label="Teams at"
                  >
                    <option selected hidden disabled value=""></option>
                    {values.inner_format.map((_, i) => (
                      <option
                        key={i}
                        value={`${i + 1}${getNumberSuffix(i + 1)} Place`}
                      >
                        {i + 1}
                        {getNumberSuffix(i + 1)} Place
                      </option>
                    ))}
                  </SelectWithValidation>

                  <SelectWithValidation
                    name={`inner_format[${formatIndex}].prize`}
                    label="Prize"
                  >
                    <option selected hidden disabled value=""></option>
                    <option value="CUP">Cup</option>
                    <option value="SHIELD">Shield</option>
                    <option value="PLATE">Plate</option>
                  </SelectWithValidation>

                  <SelectWithValidation
                    name={`inner_format[${formatIndex}].format`}
                    label="Format"
                  >
                    <option selected hidden disabled value=""></option>
                    <option value="CHAIN">Chain</option>
                    <option value="PLAYOFFS">Playoffs</option>
                  </SelectWithValidation>

                  <IconButton
                    icon={<AddIcon fontSize="20px" />}
                    size="sm"
                    colorScheme="primary"
                    isRound={true}
                    alignSelf="center"
                    // disabled={values.inner_format.length >= 3}
                    onClick={() => formatHelpers.push(formatObj)}
                  />

                  <IconButton
                    icon={<MinusIcon fontSize="20px" />}
                    size="sm"
                    colorScheme="primary"
                    isRound={true}
                    alignSelf="center"
                    disabled={values.inner_format.length <= 1}
                    onClick={() => formatHelpers.remove(formatIndex)}
                  />
                </HStack>
              ))}
            </GridItem>
          );
        }}
      />
    </>
  );
};

export default FixturesGroupCsp;
