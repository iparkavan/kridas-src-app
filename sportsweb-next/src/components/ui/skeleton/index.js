import { Skeleton as SkeletonCommon } from "@chakra-ui/react";

const Skeleton = (props) => {
  return (
    <SkeletonCommon
      w="full"
      startColor="whitesmoke"
      endColor="primary.100"
      minH="100vh"
      borderRadius={"10px"}
      {...props}
    >
      Loading..
    </SkeletonCommon>
  );
};

export default Skeleton;
