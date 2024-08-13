import { ButtonGroup, useRadioGroup } from "@chakra-ui/react";
import RadioButton from "../../ui/radio-button";

const PlayerPreferencesButtons = (props) => {
  const { name, lookupData, type, value, onChange } = props;

  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    value,
    onChange,
  });

  return (
    <ButtonGroup spacing={0} gap={2} flexWrap="wrap" {...getRootProps()}>
      {lookupData?.map((size) => {
        let buttonText;
        if (type === "apparel") {
          const inches = size.lookup_value.slice(-4);
          buttonText = `${size.lookup_key} ${inches}`;
        } else if (type === "food") {
          buttonText = size.lookup_value;
        }
        return (
          <RadioButton
            key={size.lookup_key}
            {...getRadioProps({ value: size.lookup_key })}
          >
            {buttonText}
          </RadioButton>
        );
      })}
    </ButtonGroup>
  );
};

export default PlayerPreferencesButtons;
