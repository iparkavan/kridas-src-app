import { Fragment, useState, useEffect } from "react";
import { GridItem, useDisclosure } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import PhoneNumberInput from "../../ui/phone-input/phone-number-input";
import SelectWithValidation from "../../ui/select/select-with-validation";
import { useLookupTable } from "../../../hooks/lookup-table-hooks";
import DatePicker from "../../ui/pickers/date-picker";
import IconButton from "../../ui/icon-button";
import { OptionsIcon, RemoveIcon } from "../../ui/icons";
import { useUserByPlayerId } from "../../../hooks/user-hooks";
import PlayerPreferencesModal from "./player-preferences-modal";

const EventRegisterTeamPlayer = (props) => {
  const {
    index,
    teamMember,
    minPlayers,
    teamHelpers,
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
      setFieldValue(`team_members[${index}].first_name`, playerData.first_name);
      setFieldValue(`team_members[${index}].last_name`, playerData.last_name);
      setFieldValue(`team_members[${index}].email_id`, playerData.user_email);
      if (playerData.user_phone) {
        setFieldValue(
          `team_members[${index}].contact_number`,
          playerData.user_phone
        );
      }
      if (playerData.user_gender) {
        setFieldValue(`team_members[${index}].gender`, playerData.user_gender);
      }
      setFieldValue(
        `team_members[${index}].dob`,
        new Date(playerData.user_dob)
      );
    }
  }, [index, isPlayerSuccess, playerData, setFieldValue]);

  const handlePreferencesSubmit = (values) => {
    setFieldValue(`team_members[${index}].preferences_opted`, values);
  };

  const [isSelectedContactNo, setIsSelectedContactNo] = useState(null);
  useEffect(() => {
    if (teamMember.isSelected && isSelectedContactNo === null) {
      setIsSelectedContactNo(Boolean(teamMember.contact_number));
    }
  }, [isSelectedContactNo, teamMember.contact_number, teamMember.isSelected]);

  const [isSelectedGender, setIsSelectedGender] = useState(null);
  useEffect(() => {
    if (teamMember.isSelected && isSelectedGender === null) {
      setIsSelectedGender(Boolean(teamMember.gender));
    }
  }, [isSelectedGender, teamMember.gender, teamMember.isSelected]);

  const [isSelectedPlayerId, setIsSelectedPlayerId] = useState(null);
  useEffect(() => {
    if (teamMember.isSelected && isSelectedPlayerId === null) {
      setIsSelectedPlayerId(teamMember.player_id);
    }
  }, [isSelectedPlayerId, teamMember.isSelected, teamMember.player_id]);

  const isSelectedDisabled =
    Boolean(teamMember.isSelected) &&
    teamMember.player_id === isSelectedPlayerId;

  return (
    <Fragment key={index}>
      <GridItem>{index + 1}</GridItem>
      <GridItem>
        <TextBoxWithValidation
          name={`team_members[${index}].player_id`}
          minW="100px"
          onBlur={(e) => {
            handleBlur(e);
            setPrefillPlayerId(teamMember.player_id);
          }}
        />
      </GridItem>
      <GridItem>
        <TextBoxWithValidation
          name={`team_members[${index}].first_name`}
          minW="100px"
          disabled={isPlayerSuccess || isSelectedDisabled}
        />
      </GridItem>
      <GridItem>
        <TextBoxWithValidation
          name={`team_members[${index}].last_name`}
          minW="100px"
          disabled={isPlayerSuccess || isSelectedDisabled}
        />
      </GridItem>
      <GridItem>
        <TextBoxWithValidation
          name={`team_members[${index}].email_id`}
          type="email"
          minW="100px"
          disabled={isPlayerSuccess || isSelectedDisabled}
          validate={(value) => {
            const filteredEmails = values.team_members?.filter(
              (member) => member.email_id.toLowerCase() === value.toLowerCase()
            );

            if (filteredEmails?.length > 1)
              return "Please enter a unique email";
          }}
        />
      </GridItem>
      <GridItem>
        <PhoneNumberInput
          name={`team_members[${index}].contact_number`}
          style={{ minWidth: "130px" }}
          disabled={
            (isPlayerSuccess && Boolean(playerData.user_phone)) ||
            (isSelectedDisabled && isSelectedContactNo)
          }
        />
      </GridItem>
      <GridItem>
        <SelectWithValidation
          name={`team_members[${index}].gender`}
          minW="100px"
          disabled={
            (isPlayerSuccess && playerData.user_gender) ||
            (isSelectedDisabled && isSelectedGender)
          }
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
          name={`team_members[${index}].dob`}
          portalId="date-portal"
          disabled={isPlayerSuccess || isSelectedDisabled}
        />
      </GridItem>
      {arePreferencesPresent && (
        <GridItem>
          <IconButton
            size="md"
            icon={<OptionsIcon fontSize="24px" />}
            onClick={onOpen}
            variant={
              errors?.team_members?.[index]?.preferences_opted
                ? "outline"
                : "ghost"
            }
            border={errors?.team_members?.[index]?.preferences_opted && "2px"}
            borderColor={
              errors?.team_members?.[index]?.preferences_opted && "red"
            }
          />
          <PlayerPreferencesModal
            isOpen={isOpen}
            onClose={onClose}
            preferencesOffered={preferencesOffered}
            isApparelPresent={isApparelPresent}
            isFoodPresent={isFoodPresent}
            handleSubmit={handlePreferencesSubmit}
            player={teamMember}
          />
        </GridItem>
      )}
      <GridItem>
        <IconButton
          size="md"
          icon={<RemoveIcon fontSize="24px" />}
          colorScheme="red"
          disabled={values.team_members.length <= minPlayers}
          onClick={() => teamHelpers.remove(index)}
        />
      </GridItem>
    </Fragment>
  );
};

export default EventRegisterTeamPlayer;
