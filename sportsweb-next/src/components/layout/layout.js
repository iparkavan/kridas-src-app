import Header from "./header";
import { useSession, signOut } from "next-auth/react";
import { Box } from "@chakra-ui/react";

const Layout = (props) => {
  const { status } = useSession();
  return (
    <>
      {/* {status === "authenticated" ? <Header /> : ""} */}
      <main>
        <Box backgroundColor="gray.100">{props.children}</Box>
      </main>
    </>
  );
};

export default Layout;
