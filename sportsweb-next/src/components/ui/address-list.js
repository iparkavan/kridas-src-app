import LabelValuePair from "./label-value-pair";

const Address = (props) => {
  const address = { ...props.address };

  const displayAddress = () => {
    if (address?.state === undefined) {
      return (
        <>
          <LabelValuePair label="Address Line 1"></LabelValuePair>
        </>
      );
    } else {
      return (
        <>
          <LabelValuePair>{address.line1}</LabelValuePair>
          <LabelValuePair>{address.line2}</LabelValuePair>
          <LabelValuePair>{address.city}</LabelValuePair>
          <LabelValuePair>{address.state}</LabelValuePair>
          <LabelValuePair>{address.country}</LabelValuePair>
          <LabelValuePair>{address.pincode}</LabelValuePair>
        </>
      );
    }
  };

  return <>{displayAddress()}</>;
};

export default Address;
