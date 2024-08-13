import { TextMedium, TextSmall } from "./text";

const LabelText = ({ children, ...props }) => {
  return (
    <TextMedium className="font-medium text-[#2f80ed]" {...props}>
      {children}
    </TextMedium>
  );
};

export default LabelText;
