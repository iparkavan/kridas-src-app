import { Tooltip as CTooltip } from "@chakra-ui/react";

const Tooltip = ({ children, ...props }) => {
  return (
    <CTooltip
      hasArrow
      placement="top"
      arrowSize="6"
      fontSize="xs"
      aria-label={props.label}
      {...props}
    >
      {children}
    </CTooltip>
  );
};

export default Tooltip;
