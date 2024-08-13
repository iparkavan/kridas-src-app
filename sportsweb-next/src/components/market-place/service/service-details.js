// import { useState } from "react";
import { HStack, Radio, RadioGroup, Stack, useToast } from "@chakra-ui/react";
import { differenceInYears, format } from "date-fns";
import { Field, Form, Formik, useFormikContext } from "formik";
import { useRouter } from "next/router";
import * as yup from "yup";

import routes from "../../../helper/constants/route-constants";
import {
  useAddToCart,
  useDeleteUserCart,
  useUserCart,
} from "../../../hooks/cart-hooks";
import {
  useGetBookedService,
  useGetService,
  // useProductCount,
} from "../../../hooks/product-hooks";
import { useUser } from "../../../hooks/user-hooks";
import Button from "../../ui/button";
import { HeadingMedium } from "../../ui/heading/heading";
import DatePicker from "../../ui/pickers/date-picker";
import SelectWithValidation from "../../ui/select/select-with-validation";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import FieldLayout from "../../user/profile-section/user-profile-edit/field-layout";
import { getCalendarServiceYupSchema } from "../../../helper/constants/product-constants";
import helper from "../../../helper/helper";
import { deleteItemsFromCart } from "../../../helper/constants/cart-constants";
import {
  convertDateToUTCString,
  covertTimeToUTCDate,
} from "../../../helper/constants/common-constants";
import { TextMedium } from "../../ui/text/text";

const ServiceDateTime = ({ productData }) => {
  const { values, setFieldTouched, setFieldValue } = useFormikContext();
  const serviceId = productData.services.serviceId;
  let serviceDate;
  if (values.date) {
    serviceDate = format(values.date, "yyyy-MM-dd");
  }
  const { data: bookedServices } = useGetService(serviceId, serviceDate);

  let timeOptions = [];
  let serviceWeeklySchedule;
  if (values.date) {
    const selectedDay = format(values.date, "EEE").toUpperCase();
    serviceWeeklySchedule = productData.services.serviceWeeklySchedules.find(
      (schedule) =>
        schedule.weekDay === selectedDay &&
        schedule.weeklyScheduleDetails.length > 0
    );
    if (serviceWeeklySchedule) {
      const weeklyScheduleDetails = serviceWeeklySchedule.weeklyScheduleDetails;
      const availableWeeklyScheduleDetails = weeklyScheduleDetails.filter(
        (ts) =>
          !Boolean(
            bookedServices?.find((bs) => {
              const startTimeStr = convertDateToUTCString(
                new Date(bs.startTime)
              );
              const endTimeStr = convertDateToUTCString(new Date(bs.endTime));
              return startTimeStr === ts.startTime && endTimeStr === ts.endTime;
            })
          )
      );
      timeOptions = availableWeeklyScheduleDetails.map((timeSchedule) => {
        const startDate = covertTimeToUTCDate(timeSchedule.startTime);
        const endDate = covertTimeToUTCDate(timeSchedule.endTime);
        const startDateTime = new Date(
          new Date(values.date).setHours(
            startDate.getHours(),
            startDate.getMinutes(),
            startDate.getSeconds()
          )
        );
        const endDateTime = new Date(
          new Date(values.date).setHours(
            endDate.getHours(),
            endDate.getMinutes(),
            endDate.getSeconds()
          )
        );
        const startTime = format(startDate, "hh:mm aa");
        const endTime = format(endDate, "hh:mm aa");
        const label = `${startTime} - ${endTime}`;
        const value = {
          shoppingCartAttrList: [
            {
              // dateScheduled: helper.getJSDateObject(values.date),
              startTime: startDateTime,
              endTime: endDateTime,
              recordStatus: "INSERT",
              serviceWeeklySchedule: {
                ...serviceWeeklySchedule,
                weeklyScheduleDetails: [
                  { ...timeSchedule, recordStatus: "INSERT" },
                ],
              },
              shoppingCartAttrId: null,
              shoppingCartId: null,
              weeklyScheduleDetailId: timeSchedule.weeklyScheduleDetailId,
            },
          ],
          weeklyScheduleDetailId: timeSchedule.weeklyScheduleDetailId,
        };
        return { label, value };
      });
    }
  }

  return (
    <>
      <FieldLayout label="Date">
        <DatePicker
          name="date"
          minDate={new Date()}
          onChange={(date) => {
            setFieldTouched("time", false);
            setFieldValue("time", "");
            // Added this as resetting time was validating old date
            setFieldValue("date", date);
          }}
        />
      </FieldLayout>
      <FieldLayout label="Time">
        <SelectWithValidation
          name="time"
          validate={(value) => {
            if (timeOptions.length === 0 && serviceWeeklySchedule) {
              return "All time slots have been booked";
            }
            if (!value) {
              return "Please select the time slot";
            }
          }}
        >
          <option hidden disabled value=""></option>
          {timeOptions.map((timeOption) => (
            <option
              key={timeOption.label}
              value={JSON.stringify(timeOption.value)}
            >
              {timeOption.label}
            </option>
          ))}
        </SelectWithValidation>
      </FieldLayout>
    </>
  );
};

const ServiceDetails = (props) => {
  const { productData, isProductInCountry, isServiceCalendarType } = props;
  const router = useRouter();
  const toast = useToast();
  const { data: userData } = useUser();
  // const [currentQuantity, setCurrentQuantity] = useState(productData.quantity);
  const { mutate: cartMutate, isLoading: isCartLoading } = useAddToCart();
  // const { mutate: countMutate, isLoading: isCountLoading } = useProductCount();
  const { refetch: refetchCart } = useUserCart(userData?.user_id);
  const { mutateAsync: deleteMutateAsync, isLoading: isDeleteLoading } =
    useDeleteUserCart();
  const { mutate: bookedServiceMutate, isLoading: isServiceLoading } =
    useGetBookedService();
  const isLoading = isCartLoading || isDeleteLoading || isServiceLoading;
  // || isCountLoading

  // const isQuantityValid = currentQuantity > 0;

  const showWeekDays = (days) => {

    const customSort = (a, b) => {
      const order = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
      return order.indexOf(a) - order.indexOf(b);
    };
    const sortedWeekDays = Object.values(days).sort(customSort);
    console.log(sortedWeekDays);
    return sortedWeekDays;


    // switch (days) {
    //   case "MON" && "TUE" && "WED" && "THU" && "FRI" && !"SAT" && !"SUN":
    //     console.log(days);
    //     return "Only on WeekDays";
    //   // case "MON" && "TUE" && "WED" && "THU" && "FRI" && "SAT" && "SUN":
    //   //   console.log(days);
    //   //   return "All Days in a Week";
    //   case "SAT" && "SUN" && !"MON" && !"TUE" && !"WED" && !"THU" && !"FRI":
    //     console.log(days);
    //     return "Only on Weekends";
    //   default:
    //     console.log("days");
    //     return days;
    // }
  };

  return (
    <Stack w="full" h="full" spacing={5}>
      <HeadingMedium>Fill your details</HeadingMedium>
      <Formik
        initialValues={{
          name: userData?.full_name,
          gender: userData?.user_gender || "M",
          age:
            userData?.user_dob &&
            differenceInYears(new Date(), new Date(userData.user_dob)),
          email: userData?.user_email,
          date: "",
          time: "",
          isServiceCalendarType,
        }}
        validationSchema={getCalendarServiceYupSchema(yup, productData)}
        onSubmit={async (values) => {
          const { data: cartData, isSuccess: isCartSuccess } =
            await refetchCart();
          let updatedCart = cartData;
          if (isCartSuccess && cartData === "") {
            updatedCart = [];
          }
          await deleteItemsFromCart(
            updatedCart,
            deleteMutateAsync,
            userData.user_id,
            "SER"
          );
          if (isServiceCalendarType) {
            const { shoppingCartAttrList, weeklyScheduleDetailId } = JSON.parse(
              values.time
            );
            const shoppingCartAttr = shoppingCartAttrList[0];
            const serviceId = productData.services.serviceId;
            // const serviceDate = shoppingCartAttr.dateScheduled;
            const serviceDate = helper.getJSDateObject(values.date);
            const serviceStartTime =
              shoppingCartAttr.serviceWeeklySchedule.weeklyScheduleDetails[0]
                .startTime;
            const serviceEndTime =
              shoppingCartAttr.serviceWeeklySchedule.weeklyScheduleDetails[0]
                .endTime;

            bookedServiceMutate(
              { serviceId, serviceDate },
              {
                onSuccess: (bookedServices) => {
                  const isServiceSlotBooked = bookedServices.find((bs) => {
                    const startTimeStr = convertDateToUTCString(
                      new Date(bs.startTime)
                    );
                    const endTimeStr = convertDateToUTCString(
                      new Date(bs.endTime)
                    );
                    return (
                      startTimeStr === serviceStartTime &&
                      endTimeStr === serviceEndTime
                    );
                  });

                  if (isServiceSlotBooked) {
                    toast({
                      title: `This time slot has been booked. Please select another time slot`,
                      status: "error",
                      isClosable: true,
                    });
                  } else {
                    cartMutate(
                      {
                        productId: productData.productId,
                        qty: 1,
                        serviceId: productData.services.serviceId,
                        shoppingCartAttrList,
                        shoppingCartId: null,
                        userId: userData?.user_id,
                        weeklyScheduleDetailId,
                      },
                      {
                        onSuccess: () => router.push(routes.checkoutService),
                      }
                    );
                  }
                },
              }
            );
          } else {
            // countMutate(productData.productId, {
            // onSuccess: (productQuantity) => {
            // setCurrentQuantity(productQuantity);
            // if (productQuantity >= 1) {
            cartMutate(
              {
                productId: productData.productId,
                qty: 1,
                serviceId: productData.services.serviceId,
                shoppingCartAttrList: null,
                shoppingCartId: null,
                userId: userData?.user_id,
                weeklyScheduleDetailId: null,
              },
              {
                onSuccess: () => router.push(routes.checkoutService),
              }
            );
            // }
            // },
            // });
          }
        }}
      >
        {() => {
          return (
            <Form style={{ height: "100%" }}>
              <Stack spacing={5} justifyContent="space-between" h="full">
                <Stack spacing={6}>
                  <FieldLayout label="Name">
                    <TextBoxWithValidation name="name" />
                  </FieldLayout>
                  <FieldLayout label="Gender">
                    <Field name="gender">
                      {({ field }) => (
                        <RadioGroup colorScheme="primary" {...field}>
                          <HStack spacing={10}>
                            <Radio {...field} value="M">
                              Male
                            </Radio>
                            <Radio {...field} value="F">
                              Female
                            </Radio>
                          </HStack>
                        </RadioGroup>
                      )}
                    </Field>
                  </FieldLayout>
                  <FieldLayout label="Age">
                    <TextBoxWithValidation name="age" />
                  </FieldLayout>
                  <FieldLayout label="Email">
                    <TextBoxWithValidation name="email" type="email" />
                  </FieldLayout>
                  <FieldLayout label={"Available Days"}>
                    <HStack
                      bg={"primary.500"}
                      p={2}
                      borderRadius={10}
                      minW={"fit-content"}
                    >
                      {productData.services.serviceWeeklySchedules.map(
                        (item) => {
                          return (
                            <HStack
                              key={item.serviceId}
                              textColor={"white"}
                              alignItems={"center"}
                            >
                              <TextMedium>
                                {showWeekDays(item.weekDay)}
                              </TextMedium>
                            </HStack>
                          );
                        }
                      )}
                    </HStack>
                  </FieldLayout>
                  {isServiceCalendarType && (
                    <ServiceDateTime productData={productData} />
                  )}
                </Stack>

                {/* {!isQuantityValid && !isServiceCalendarType && (
                  <HeadingMedium>Service Unavailable</HeadingMedium>
                )} */}

                <HStack spacing={5} justify="flex-start">
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    disabled={
                      !isProductInCountry ||
                      // (!isQuantityValid && !isServiceCalendarType) ||
                      isLoading
                    }
                  >
                    Book Now
                  </Button>
                  <Button variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </HStack>
              </Stack>
            </Form>
          );
        }}
      </Formik>
    </Stack>
  );
};

export default ServiceDetails;
