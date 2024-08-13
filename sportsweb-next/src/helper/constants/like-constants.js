import {
  FillHeartIcon,
  FillLikeIcon,
  OutlineLikeIcon,
} from "../../components/ui/icons";

export const getLikeIcon = (type) => {
  switch (type) {
    case "like":
      return FillLikeIcon;
    case "love":
      return FillHeartIcon;
    case "care":
      return "🤗";
    case "haha":
      return "😆";
    case "wow":
      return "😲";
    case "sad":
      return "😢";
    case "angry":
      return "😡";
    default:
      return OutlineLikeIcon;
  }
};

export const getLikeColor = (type) => {
  switch (type) {
    case "like":
      return "primary.500";
    case "love":
      return "red.500";
    case "care":
    case "haha":
    case "wow":
    case "sad":
      return "yellow.600";
    case "angry":
      return "red.600";
  }
};
