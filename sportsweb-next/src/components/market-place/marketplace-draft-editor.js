import { useRef } from "react";
import { Box } from "@chakra-ui/react";
import Editor from "@draft-js-plugins/editor";
import { TextSmall } from "../ui/text/text";
import editorStyles from "./marketplace-draft-editor.module.css";

const MarketplaceDraftEditor = (props) => {
  const { formik, name, placeholder } = props;
  const ref = useRef(null);
  const { values, setFieldValue, setFieldTouched, errors, touched } = formik;

  const isError = touched[name] && errors[name];

  return (
    <Box w="full">
      <Box
        className={editorStyles.editor}
        onClick={() => {
          ref.current.focus();
        }}
        h={28}
        overflow="scroll"
        fontSize="sm"
        border={
          isError
            ? "2px solid var(--chakra-colors-red-500)"
            : "1px solid var(--chakra-colors-gray-300)"
        }
      >
        <Editor
          editorKey="editor"
          editorState={values[name]}
          onChange={(editorState) => setFieldValue(name, editorState)}
          ref={ref}
          placeholder={placeholder}
          onBlur={() => setFieldTouched(name, true)}
        />
      </Box>
      {isError && (
        <TextSmall mt={1} color="red.500">
          {errors[name]}
        </TextSmall>
      )}
    </Box>
  );
};

export default MarketplaceDraftEditor;
