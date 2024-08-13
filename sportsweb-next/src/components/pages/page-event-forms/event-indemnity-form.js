import { useEffect } from "react";
import { Box, ModalBody, ModalFooter, Text, VStack } from "@chakra-ui/react";
import { convertFromRaw, convertToRaw, Editor, EditorState } from "draft-js";
import React, { useRef, useState } from "react";
import Button from "../../ui/button";
import Modal from "../../ui/modal";

function EventIndemnityForm(props) {
  const { isOpen, onClose, setPublish, formik } = props;

  useEffect(() => {
    setEditorState(
      formik.values.tournaments[0].tournamentCategories[0].indemnityClause
    );
  }, [formik.values.tournaments]);

  const formState = {
    entityMap: {},
    blocks: [
      {
        key: "fgfg",
        text: "1. I acknowledge and agree that participating in Singapore Regional Badminton Open on 25th March, 2018 at Singapore Badminton Hall, come with inherent risks and that I am physically and mentally fit to join the event.",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "9k4gq",
        text: "2. I have full Knowledge of the foregoing risks and I assume all such risks to myself. In consideration of my participant in the event, Iwill not hold Skiya Sports. ",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      // {
      //   key: "31g5",
      //   text: "In consideration of my participant in the event, Iwill not hold Skiya Sports.",
      //   type: "unstyled",
      //   depth: 0,
      //   inlineStyleRanges: [],
      //   entityRanges: [],
      //   data: {},
      // },
      {
        key: "7scbh",
        text: "3. I indemnify Skiya Sports and their appointed officials, staff and employees against any actions, proceedings, liabilities, claims, damages and expenses by any party howsoever arising out of any connection with the above said activity.",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      //   {
      //     key: "8obrt",
      //     text: "employees against any actions, proceedings, liabilities, claims,",
      //     type: "unstyled",
      //     depth: 0,
      //     inlineStyleRanges: [],
      //     entityRanges: [],
      //     data: {},
      //   },
      //   {
      //     key: "9j7m9",
      //     text: "damages and expenses by any party howsoever arising out of any",
      //     type: "unstyled",
      //     depth: 0,
      //     inlineStyleRanges: [],
      //     entityRanges: [],
      //     data: {},
      //   },
      //   {
      //     key: "9rok5",
      //     text: "connection with the above said activity.",
      //     type: "unstyled",
      //     depth: 0,
      //     inlineStyleRanges: [],
      //     entityRanges: [],
      //     data: {},
      //   },
      {
        key: "fho5m",
        text: "4. I undertake to ensure strict compliance with all rules, regulations, requirements and instructions related to the event.",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "69quq",
        text: "5. I represent that I am at least 18 years of age.",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      //   {
      //     key: "ov3r",
      //     text: "1.I acknowledge and agree that participating in Singapore Regional Badminton Open on 25th March, 2018 at Singapore Badminton Hall, comes",
      //     type: "unstyled",
      //     depth: 0,
      //     entityRanges: [],
      //     data: {},
      //   },
    ],
  };
  const ref = useRef(null);
  const defaultContentState = convertFromRaw(formState);
  const [editorState, setEditorState] = useState(
    () => formik.values.tournaments[0].tournamentCategories[0].indemnityClause
    // () => EditorState?.createWithContent(defaultContentState)
    // formik.values.indemnityClause ||
    // EditorState.createEmpty()
  );

  // const contentState = editorState.getCurrentContent();
  // const raw = convertToRaw(contentState);

  return (
    <Modal
      title="Event Indemnity Form"
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"

      //   scrollBehavior="inside"
    >
      {/* <DefaultText /> */}
      <ModalBody>
        <Box
          onClick={() => {
            ref.current.focus();
          }}
        >
          <Editor
            editorKey={"editor"}
            editorState={editorState}
            onChange={setEditorState}
            ref={ref}
          />
        </Box>
      </ModalBody>
      <ModalFooter>
        <Button
          colorScheme="primary"
          onClick={() => {
            setPublish(true);
            formik.setFieldValue(
              "tournaments[0].tournamentCategories[0].indemnityClause",
              editorState
            );
            // formik.setFieldValue("indemnityClause", JSON.stringify(raw));
            onClose();
            // handlePublish();
          }}
        >
          Publish
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default EventIndemnityForm;
