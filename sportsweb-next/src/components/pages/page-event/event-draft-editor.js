import { useRef } from "react";
import { Box } from "@chakra-ui/react";
import Editor from "@draft-js-plugins/editor";
import createLinkifyPlugin from "@draft-js-plugins/linkify";
import createLinkDetectionPlugin from "draft-js-link-detection-plugin";
import "@draft-js-plugins/linkify/lib/plugin.css";
import editorStyles from "./event-draft-editor.module.css";
import { TextSmall } from "../../ui/text/text";

const EventTermsEditor = (props) => {
  const {
    formik,
    name,
    placeholder,
    value = null,
    isError,
    errorMessage = "",
  } = props;
  const { values, setFieldValue, setFieldTouched, errors, touched } = formik;
  const editorValue = value || values[name];
  const ref = useRef(null);
  isError = isError ?? (touched[name] && errors[name]);
  errorMessage = errorMessage || errors[name];
  // errorMessage = typeof errorMessage === "string" ? errorMessage : errors[name];

  // For the link plugin
  const linkifyPlugin = createLinkifyPlugin();
  const linkDetectionPlugin = createLinkDetectionPlugin();

  return (
    <Box w="full" h="min-content" bg="white" borderRadius="10px">
      <Box
        className={editorStyles.editor}
        onClick={() => {
          ref.current.focus();
        }}
        w="100%"
        h={36}
        overflow="scroll"
        border={
          isError
            ? "2px solid var(--chakra-colors-red-500)"
            : "1px solid var(--chakra-colors-gray-300)"
        }
        fontSize="sm"
      >
        <Editor
          editorKey={"editor"}
          editorState={editorValue}
          onChange={(editorState) => {
            setFieldValue(name, editorState);
          }}
          plugins={[linkifyPlugin, linkDetectionPlugin]}
          ref={ref}
          placeholder={placeholder}
          onBlur={() => setFieldTouched(name, true)}
        />
      </Box>
      {isError && (
        <TextSmall mt={1} color="red.500">
          {errorMessage}
        </TextSmall>
      )}
    </Box>
  );
};

export default EventTermsEditor;
