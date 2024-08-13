import { forwardRef, IconButton as CIconButton } from "@chakra-ui/react";
import Tooltip from "../tooltip";

const IconButton = forwardRef(
  ({ tooltipLabel, tooltipProps = {}, ...props }, ref) => {
    return tooltipLabel ? (
      <Tooltip label={tooltipLabel} {...tooltipProps}>
        <CIconButton size="sm" variant="ghost" {...props} ref={ref} />
      </Tooltip>
    ) : (
      <CIconButton size="sm" variant="ghost" {...props} ref={ref} />
    );
  }
);

export default IconButton;
