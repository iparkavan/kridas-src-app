import { Text } from "@chakra-ui/react";

export const TextHighlight = (props) => {
  return (
    <TextXtraSmall color={"#1d212f"} fontSize="sm" {...props}>
      {props.children}
    </TextXtraSmall>
  );
};

export const TextMedium = (props) => {
  return (
    <TextCustom fontSize="md" {...props}>
      {props.children}
    </TextCustom>
  );
};

export const TextSmall = (props) => {
  return (
    <TextCustom fontSize="sm" {...props}>
      {props.children}
    </TextCustom>
  );
};

export const TextXtraSmall = (props) => {
  return (
    <TextCustom fontSize="xs" {...props}>
      {props.children}
    </TextCustom>
  );
};

export const TextCustom = (props) => {
  return <Text {...props}>{props.children}</Text>;
};
