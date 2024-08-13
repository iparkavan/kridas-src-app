import {
  Box,
  Button,
  Stack,
  CircularProgress,
  Typography,
  IconButton,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import CloseIcon from "@mui/icons-material/Close";
import xmlIcon from "../../img/xml-icon.jpg";
import Axios from "axios";
import { ToastError, ToastSuccess } from "../../service/toast/Toast";

const Dropzone = ({ files, setFiles }) => {
  // const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log("files", files);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (acceptedFiles?.length) {
        setFiles((previousFile) => [
          ...previousFile,
          ...acceptedFiles.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
          ),
        ]);
      }
    },
    [setFiles]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: [".xml", ".xlsx", ".xls"],
  });

  const removeFromUploaded = (name) => {
    const remainingFiles = files.filter((file) => file.name !== name);
    setFiles(remainingFiles);
  };

  const fileNameSplit = (name) => {
    let split = name.split(".");
    let filename = split[0];
    let extention = split[1];

    if (filename.length > 10) {
      filename = filename.substring(0, 10);
    }

    return `${filename}.${extention}`;
  };

  const uploadFiles = async (e) => {
    e.preventDefault();
    // const filenames = Array.from(selectedFiles).map(file => file.name);

    setIsLoading(true);
    try {
      const filenames = files.map((file) => file.name);
      const response = await Axios({
        method: "PUT",
        url: "https://vx15rapzx4.execute-api.us-east-2.amazonaws.com/Stage/getS3SignedUrl",
        data: {
          filenames,
        },
      });
      const { presignedUrls } = response.data;

      const responses = await Promise.all(
        presignedUrls.map((url, index) => {
          const file = files[index];
          return Axios({
            method: "PUT",
            url: url,
            data: file,
          });
        })
      );

      if (responses.every(({ status }) => status === 200)) {
        ToastSuccess("Files are uploaded to the server for processing");
        setFiles([]);
        setIsLoading(false);
      }
    } catch (error) {
      ToastError("Upload Failed");
    }
  };

  return (
    <form>
      <Stack>
        <Box
          {...getRootProps()}
          my={5}
          border={2}
          p={12}
          borderColor={"#e0e3ea"}
          width={"700px"}
          borderRadius={2}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>
              Drag & drop only XML files here, or click to select only XML files
            </p>
          )}
        </Box>
        <Box>
          <Button
            disabled={!files.length || isLoading}
            type="submit"
            variant="outlined"
            onClick={uploadFiles}
            startIcon={
              isLoading && <CircularProgress color="inherit" size="20px" />
            }
          >
            {isLoading ? "Files are getting uploaded" : "Upload Files"}
          </Button>
        </Box>
      </Stack>
      <Typography variant="h5" my={3}>
        Uploaded Files
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={2}>
        {files.map((file, i) => (
          <Stack
            key={file.name}
            border={1}
            p={1}
            borderColor="#e0e3ea"
            direction="row"
            alignItems="center"
            gap={2}
            borderRadius={2}
            width="300px"
          >
            <Box>
              <img src={xmlIcon} width="50px" height="50px" alt="xml-icon" />
            </Box>
            <Box textAlign="center">{fileNameSplit(file.name)}</Box>
            <IconButton
              aria-label="delete"
              color="error"
              sx={{ marginLeft: "auto" }}
              onClick={() => removeFromUploaded(file.name)}
            >
              <CloseIcon fontSize="12px" />
            </IconButton>
          </Stack>
        ))}
      </Stack>
    </form>
  );
};

export default Dropzone;
