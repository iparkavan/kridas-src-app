import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";

const BreadcrumbList = (props) => {
  const { rootRoute, rootPageName, currentPageName } = props;

  return (
    <Breadcrumb separator=">">
      <BreadcrumbItem>
        <BreadcrumbLink href={rootRoute} color="#2F80ED">
          {rootPageName}
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink href="#">{currentPageName}</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
};

export default BreadcrumbList;
