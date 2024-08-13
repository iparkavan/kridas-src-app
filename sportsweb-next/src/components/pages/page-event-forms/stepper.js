import { Flex, Heading, Text } from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { useRouter } from "next/router";
import { useState } from "react";
import Button from "../../ui/button";
import EventCreateFormFour from "./event-create-form-four";
import EventCreateFormOne from "./event-create-form-one";
import EventCreateFormThree from "./event-create-form-three";
import EventCreateFormTwo from "./event-create-form-two";
import { useLookupTable } from "../../../hooks/lookup-table-hooks";

export const Horizontal = (props) => {
  const {
    nextStep,
    prevStep,
    activeStep,
    isTypeEdit,
    profileImage,
    coverImage,
  } = props;
  // TEMP CHANGES
  const router = useRouter();
  const { eventId: routerEventId } = router.query;
  const [eventid, setEventId] = useState(routerEventId);

  const { data: apparelData } = useLookupTable("APP");
  const { data: foodData } = useLookupTable("FDP");

  const steps = [
    {
      label: "Basic Information",
      component: EventCreateFormOne,
    },
    {
      label: "Venue",
      component: EventCreateFormTwo,
    },
    {
      label: "Sports",
      component: EventCreateFormThree,
    },
    {
      label: "Summary",
      component: EventCreateFormFour,
    },
  ];
  return (
    <Flex flexDir="column" p={5} width="100%">
      <Steps
        labelOrientation="vertical"
        activeStep={activeStep}
        colorScheme="blue"
      >
        {steps.map((step, index) => {
          const Component = step.component;
          return (
            <Step label={step.label} key={step.label}>
              <Component
                // eventData={eventData}
                nextStep={nextStep}
                prevStep={prevStep}
                activeStep={activeStep}
                steps={steps}
                eventid={eventid}
                setEventId={setEventId}
                isTypeEdit={isTypeEdit}
                profileImage={profileImage}
                coverImage={coverImage}
                apparelData={apparelData}
                foodData={foodData}
              />
            </Step>
          );
        })}
      </Steps>
    </Flex>
  );
};

export default Horizontal;
