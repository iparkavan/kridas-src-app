import BodyText from "./BodyText";

const ExternalLink = (props) => {
  const { url, children } = props;

  return url !== null ? (
    <BodyText>
      <a target="_blank" rel="noreferrer" href={url}>
        {children}
      </a>
    </BodyText>
  ) : (
    ""
  );
};

export default ExternalLink;
