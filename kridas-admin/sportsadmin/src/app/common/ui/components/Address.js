import BodyText from "./BodyText";

const Address = (props) => {
  const address = { ...props.address };

  const displayAddress = () => {
    if (address?.state === undefined) {
      return (
        <>
          <BodyText>No data available to display</BodyText>
        </>
      );
    } else {
      return (
        <>
          <BodyText>{address.line1}</BodyText>
          <BodyText>{address.line2}</BodyText>
          <BodyText>{address.city}</BodyText>
          <BodyText>{address.state}</BodyText>
          <BodyText>{address.country}</BodyText>
          <BodyText>{address.pincode}</BodyText>
        </>
      );
    }
  };

  return <>{displayAddress()}</>;
};

export default Address;
