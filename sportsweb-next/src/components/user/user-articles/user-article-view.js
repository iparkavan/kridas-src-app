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
import ArticleView from "../../common/article/article-view";
import UserLayout from "../../layout/user-layout/user-layout";

const UserArticleView = () => {
  const { data: userData = [] } = useUser();
  return (
    <UserLayout>
      <ArticleView />
    </UserLayout>
  );
};

export default UserArticleView;
