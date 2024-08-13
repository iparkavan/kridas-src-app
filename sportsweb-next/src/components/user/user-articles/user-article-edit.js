import {
  Text,
  Box,
  Button,
  Image,
  VStack,
  HStack,
  Flex,
  Avatar,
  Container,
  Heading,
  Input,
} from "@chakra-ui/react";
//import { Form, Formik, useFormikContext } from "formik";
import "@draft-js-plugins/static-toolbar/lib/plugin.css";
import { useUser } from "../../../hooks/user-hooks";
import EditArticle from "../../common/article/article-edit";
import UserLayout from "../../layout/user-layout/user-layout";

const UserArticleEdit = () => {
  const { data: userData = [] } = useUser();
  return (
    <UserLayout>
      <EditArticle type="user" Id={userData?.user_id} />
    </UserLayout>
  );
};

export default UserArticleEdit;
