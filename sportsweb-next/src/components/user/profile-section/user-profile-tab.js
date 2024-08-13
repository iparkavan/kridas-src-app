import {
  Button,
  Flex,
  Icon,
  useMultiStyleConfig,
  useTab,
} from "@chakra-ui/react";
import { forwardRef } from "react";

const UserProfileTab = forwardRef(({ tabIcon, ...props }, ref) => {
  // 1. Reuse the `useTab` hook
  const tabProps = useTab({ ...props, ref });
  const isSelected = !!tabProps["aria-selected"];

  // 2. Hook into the Tabs `size`, `variant`, props
  const styles = useMultiStyleConfig("Tabs", tabProps);

  const tabStyles = isSelected
    ? {
        ...styles.tab,
        _selected: {
          ...styles.tab._selected,
          color: "inherit",
          borderColor: "transparent",
          backgroundColor: "white",
        },
        _focus: { boxShadow: "none", outline: "transparent" },
      }
    : styles.tab;

  return (
    <Button __css={tabStyles} {...tabProps}>
      <Flex gap={3} alignItems="center">
        <Icon as={tabIcon} h={5} w={5} />
        {tabProps.children}
      </Flex>
    </Button>
  );
});

UserProfileTab.displayName = "UserProfileTab";
export default UserProfileTab;
