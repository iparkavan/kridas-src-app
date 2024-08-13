import { useEffect, useState } from "react";
import useHttp from "../../../hooks/useHttp";
import MUIDataTable from "mui-datatables";
import ArticleConfig from "../config/ArticleConfig";
import PageContainer from "../../common/layout/components/PageContainer";
import Switch from "@material-ui/core/Switch";

const ArticleList = () => {
  const [articleList, setArticleList] = useState([]);
  const { isLoading, sendRequest } = useHttp();
  const [, setClear] = useState({});
  const [reload, setReload] = useState(false);
  const label = { inputProps: { "aria-label": "Switch demo" } };

  useEffect(() => {
    const config = ArticleConfig.getAllArticles();
    const transformDate = (data) => {
      let resultDataArray = [];
      let resultData = data;
      resultData.map((r) => {
        var obj = {};
        obj["article_id"] = r.article_id;
        obj["article_heading"] = r.article_heading;
        obj["name"] = r.name;
        obj["company_id"] = r.company_id;
        obj["is_featured"] = r.is_featured;

        let status;
        if (r.is_featured === true && r.is_featured !== undefined) {
          status = "Featured";
        } else {
          status = "Not Featured";
        }
        obj["is_featured"] = status;
        resultDataArray.push(obj);
        return null;
      });
      setArticleList(resultDataArray);
    };
    sendRequest(config, transformDate);
    return () => {
      setClear({});
    };
  }, [sendRequest, reload]);

  const handleChange = (e, rowData) => {
    let body = {
      is_featured: e.target.checked,
      article_id: rowData[0],
    };

    const config = ArticleConfig.updateArticleIsFeature(body);
    const transformData = (data) => {
      setReload(!reload);
    };
    sendRequest(config, transformData);
  };

  const columns = [
    {
      name: "article_id",
      label: "Article ID",
      options: {
        filter: false,
        sort: false,
        display: false,
      },
    },
    {
      name: "article_heading",
      label: "Article Heading",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "name",
      label: "Created By",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "company_id",
      label: "Type",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (data, tableMeta) => {
          return <>{data === null ? "U" : "C"}</>;
        },
      },
    },
    {
      name: "is_featured",
      label: "Featured",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (data, tableMeta) => {
          return (
            <>
              <Switch
                {...label}
                name="is_featured"
                checked={data === "Featured" ? true : false}
                onChange={(e) => handleChange(e, tableMeta.rowData)}
              />
            </>
          );
        },
      },
    },
  ];

  const options = {
    filter: true,
    search: true,
    print: false,
    download: false,
    viewColumns: false,
    selectableRows: "none",
    textLabels: {
      body: {
        noMatch: isLoading ? "Loading..." : "Sorry , No Matching Records Found",
      },
    },
    setTableProps: () => {
      return {
        size: "small",
      };
    },
  };

  return (
    <>
      <div>
        <PageContainer>
          <MUIDataTable
            data={articleList}
            columns={columns}
            options={options}
          />
        </PageContainer>
      </div>
    </>
  );
};

export default ArticleList;
