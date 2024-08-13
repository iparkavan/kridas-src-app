import { Fragment, useState, useEffect } from "react";
import { GridItem, useDisclosure } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import { useUserByPlayerId } from "../../../hooks/user-hooks";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import PhoneNumberInput from "../../ui/phone-input/phone-number-input";
import SelectWithValidation from "../../ui/select/select-with-validation";
import DatePicker from "../../ui/pickers/date-picker";
import { useLookupTable } from "../../../hooks/lookup-table-hooks";
import IconButton from "../../ui/icon-button";
import { OptionsIcon } from "../../ui/icons";
import PlayerPreferencesModal from "./player-preferences-modal";

const EventRegisterPlayer = (props) => {
  const {
    player,
    index,
    preferencesOffered,
    arePreferencesPresent,
    isApparelPresent,
    isFoodPresent,
  } = props;
  const { values, handleBlur, setFieldValue, errors } = useFormikContext();
  const { data: genderData = [] } = useLookupTable("GEN", {
    select: (data) => {
      return data.filter(
        (lookup) => lookup.lookup_key === "M" || lookup.lookup_key === "F"
      );
    },
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [prefillPlayerId, setPrefillPlayerId] = useState("");
  const { data: playerData, isSuccess: isPlayerSuccess } =
    useUserByPlayerId(prefillPlayerId);

  useEffect(() => {
    if (isPlayerSuccess) {
      setFieldValue(`players[${index}].first_name`, playerData.first_name);
      setFieldValue(`players[${index}].last_name`, playerData.last_name);
      setFieldValue(`players[${index}].email_id`, playerData.user_email);
      if (playerData.user_phone) {
        setFieldValue(
          `players[${index}].contact_number`,
          playerData.user_phone
        );
      }
      if (playerData.user_gender) {
        setFieldValue(`players[${index}].gender`, playerData.user_gender);
      }
      setFieldValue(`players[${index}].dob`, new Date(playerData.user_dob));
    }
  }, [index, isPlayerSuccess, playerData, setFieldValue]);

  const handlePreferencesSubmit = (values) => {
    setFieldValue(`players[${index}].preferences_opted`, values);
  };

  return (
    <Fragment key={index}>
      <GridItem>{index + 1}</GridItem>
      <GridItem>
        <TextBoxWithValidation
          name={`players[${index}].player_id`}
          minW="100px"
          onBlur={(e) => {
            handleBlur(e);
            setPrefillPlayerId(player.player_id);
          }}
        />
      </GridItem>
      <GridItem>
        <TextBoxWithValidation
          name={`players[${index}].first_name`}
          minW="100px"
          disabled={isPlayerSuccess}
        />
      </GridItem>
      <GridItem>
        <TextBoxWithValidation
          name={`players[${index}].last_name`}
          minW="100px"
          disabled={isPlayerSuccess}
        />
      </GridItem>
      <GridItem>
        <TextBoxWithValidation
          name={`players[${index}].email_id`}
          type="email"
          minW="100px"
          disabled={isPlayerSuccess}
          validate={(value) => {
            const filteredEmails = values.players.filter(
              (player) => player.email_id.toLowerCase() === value.toLowerCase()
            );

            if (filteredEmails?.length > 1)
              return "Please enter a unique email";
          }}
        />
      </GridItem>
      <GridItem>
        <PhoneNumberInput
          name={`players[${index}].contact_number`}
          style={{ minWidth: "130px" }}
          disabled={isPlayerSuccess && playerData.user_phone}
        />
      </GridItem>
      <GridItem>
        <SelectWithValidation
          name={`players[${index}].gender`}
          minW="100px"
          disabled={isPlayerSuccess && playerData.user_gender}
        >
          <option hidden disabled value=""></option>
          {genderData?.map((gender) => (
            <option key={gender["lookup_key"]} value={gender["lookup_key"]}>
              {gender["lookup_value"]}
            </option>
          ))}
        </SelectWithValidation>
      </GridItem>
      <GridItem minW="100px">
        <DatePicker
          name={`players[${index}].dob`}
          portalId="date-portal"
          disabled={isPlayerSuccess}
        />
      </GridItem>
      {arePreferencesPresent && (
        <GridItem>
          <IconButton
            size="md"
            icon={<OptionsIcon fontSize="24px" />}
            onClick={onOpen}
            variant={
              errors?.players?.[index]?.preferences_opted ? "outline" : "ghost"
            }
            border={errors?.players?.[index]?.preferences_opted && "2px"}
            borderColor={errors?.players?.[index]?.preferences_opted && "red"}
          />
          <PlayerPreferencesModal
            isOpen={isOpen}
            onClose={onClose}
            preferencesOffered={preferencesOffered}
            isApparelPresent={isApparelPresent}
            isFoodPresent={isFoodPresent}
            handleSubmit={handlePreferencesSubmit}
            player={player}
          />
        </GridItem>
      )}
    </Fragment>
  );
};

export default EventRegisterPlayer;
