import ExternalLink from "./ExternalLink";
import BodyText from "./BodyText";

const LinkListWithKey = (props) => {
  const { listItems } = props;

  if (Array.isArray(listItems)) {
    return listItems.map((item, index) => {
      return (
        <ExternalLink url={Object.values(item)[0]} key={index}>
          {Object.keys(item)[0]}
        </ExternalLink>
      );
    });
  } else {
    return <BodyText>No social media details available on file.</BodyText>;
  }
};

export default LinkListWithKey;
