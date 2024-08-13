import ExternalLink from "./ExternalLink";
import BodyText from "./BodyText";

const LinkListWithObject = (props) => {
  const { listItems } = props;

  if (listItems !== null && Object.entries(listItems).length > 0) {
    return Object.entries(listItems).map(([key, value], index) => {
      return (
        <ExternalLink url={`${value.type}`} key={index}>
          {`${value.type}`}
        </ExternalLink>
      );
    });
  } else {
    return <BodyText>No details available on file.</BodyText>;
  }
};

export default LinkListWithObject;
