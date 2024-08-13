import BodyText from "../../../common/ui/components/BodyText";

const CategoryNameList = (props) => {
  const { selectedCategories, categoryList } = props;

  const getCategoryName = (categoryId) => {
    const categoryObj =
      categoryList !== null &&
      categoryList.find((x) => x.categoryId === categoryId);
    return !(categoryObj == null) ? categoryObj.categoryName : null;
  };

  return selectedCategories.map((cat) => {
    return <BodyText key={cat.categoryId}>{getCategoryName(cat)}</BodyText>;
  });
};

export default CategoryNameList;
