export const TextHighlight = (props) => {
  return (
    <TextXtraSmall className="text-[#1d212f] font-light"  {...props}>
      {props.children}
    </TextXtraSmall>
  );
};

export const TextMedium = (props) => {
  return (
    <TextCustom className="font-medium dark:text-white" {...props}>
      {props.children}
    </TextCustom>
  );
};

export const TextSmall = (props) => {
  return (
    <TextCustom className="font-normal" {...props}>
      {props.children}
    </TextCustom>
  );
};

export const TextXtraSmall = (props) => {
  return (
    <TextCustom className="font-extralight" {...props}>
      {props.children}
    </TextCustom>
  );
};

export const TextCustom = (props) => {
  return <p {...props}>{props.children}</p>;
};
