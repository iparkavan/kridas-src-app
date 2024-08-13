import { useEffect, useState } from "react";
import { Box, Skeleton } from "@chakra-ui/react";
import SessionHelper from "../../src/helper/session";
import UserLayout from "../../src/components/layout/user-layout/user-layout";
import Error from "next/error";

const ShopIndex = () => {
  return <Error statusCode={404} />;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
  }, []);

  return (
    <UserLayout>
      <Skeleton isLoaded={!loading}>
        <Box
          as="iframe"
          src="https://shop.kridas.com"
          w="full"
          h="90vh"
          onLoad={() => setLoading(false)}
        />
      </Skeleton>
    </UserLayout>
  );
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default ShopIndex;
