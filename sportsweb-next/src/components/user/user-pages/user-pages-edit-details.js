import { Container } from "@chakra-ui/react";
import NewPageAlert from "../../pages/new-page-alert";
import Header from "./edit-page-component/user-pages-header";

function UserPageEditDetails(props) {
  return (
    <Container maxW="container.xl" h="100%" p={3} bg="#edf2f6">
      <NewPageAlert />
      <Header {...props} />
    </Container>
  );
}
export default UserPageEditDetails;
