import { TextSmall } from "./text";

const LabelText = ({ children, ...props }) => {
  return (
    <TextSmall fontWeight="medium" color="primary.500" {...props}>
      {children}
    </TextSmall>
  );
};

export default LabelText;
