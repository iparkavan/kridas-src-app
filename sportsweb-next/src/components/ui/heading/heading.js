import { Heading } from "@chakra-ui/react";

export const HeadingLarge = (props) => {
  return (
    <Heading size="lg" {...props}>
      {props.children}
    </Heading>
  );
};

export const HeadingMedium = (props) => {
  return (
    <Heading size="md" {...props}>
      {props.children}
    </Heading>
  );
};

export const HeadingSmall = (props) => {
  return (
    <Heading size="sm" {...props}>
      {props.children}
    </Heading>
  );
};

export const HeadingXtraSmall = (props) => {
  return (
    <Heading size="xs" {...props}>
      {props.children}
    </Heading>
  );
};
