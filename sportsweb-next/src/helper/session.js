import { getSession } from "next-auth/react";
import { dehydrate, QueryClient } from "react-query";
import routes from "./constants/route-constants";
import userService from "../services/user-service";

class SessionHelper {
  async checkSessionForAuthenicatedPage(context) {
    const session = await getSession({ req: context.req });
    const queryClient = new QueryClient();

    if (!session) {
      const redirectUrl = `${routes.login}?redir=${context.resolvedUrl}`;
      return {
        redirect: { destination: redirectUrl, permanent: false },
      };
    }

    await queryClient.prefetchQuery(["user"], () =>
      userService.getUser(session.user.userId)
    );

    return {
      props: { sessionData: session, dehydratedState: dehydrate(queryClient) },
    };
  }

  async checkSessionForUnAuntenticatedPage(context) {
    const session = await getSession({ req: context.req });

    if (session) {
      return {
        redirect: { destination: routes.home, permanent: false },
      };
    }
    return {
      props: {},
    };
  }
}

export default new SessionHelper();
