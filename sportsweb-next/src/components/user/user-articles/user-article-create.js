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
import CreateArticle from "../../common/article/article-create";
import UserLayout from "../../layout/user-layout/user-layout";

const UserArticleCreate = () => {
  const { data: userData = [] } = useUser();
  return (
    <UserLayout>

        <CreateArticle type="user" Id={userData?.user_id}/>
  
    </UserLayout>
  );
};

export default UserArticleCreate;
