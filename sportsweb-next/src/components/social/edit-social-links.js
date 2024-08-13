import { VStack } from "@chakra-ui/react";

import TextBoxWithValidation from "../ui/textbox/textbox-with-validation";
import { useLookupTable } from "../../hooks/lookup-table-hooks";
import FieldLayout from "../user/profile-section/user-profile-edit/field-layout";

const EditSocialLinks = (props) => {
  const { data: socialData = [] } = useLookupTable("SOC");
  const { name } = props;

  return (
    <VStack alignItems="flex-start" width="full" spacing={6}>
      {socialData.map((soc, index) => (
        <FieldLayout key={soc["lookup_key"]} label={soc["lookup_value"]}>
          <TextBoxWithValidation
            name={`${name}[${index}].link`}
            placeholder="Enter link/url"
          />
        </FieldLayout>
      ))}
    </VStack>
  );
};

export default EditSocialLinks;
