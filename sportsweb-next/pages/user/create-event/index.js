import React from "react";
import SessionHelper from "../../../src/helper/session";
import PageEventCreate from "../../../src/components/pages/page-event/page-event-create";
import UserLayout from "../../../src/components/layout/user-layout/user-layout";
import PageEventCreateNew from "../../../src/components/pages/page-event/page-event-create-new";

function CreateEvent() {
  return (
    <UserLayout>
      {/* <PageEventCreate /> */}
      <PageEventCreateNew />
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default CreateEvent;
