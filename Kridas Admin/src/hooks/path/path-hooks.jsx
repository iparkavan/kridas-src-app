import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const usePrefillPath = (setExpand, listItems) => {
  const location = useLocation();

  useEffect(() => {
    console.log("location", location);
    const { pathname } = location;
    const index = listItems.findIndex((item) => pathname.includes(item.path));
    if (index !== -1) {
      setExpand(index);
    }

    // if (pathname.includes("/marketplace")) {
    //   setExpand(7);
    // } else if (pathname.includes("/pages")) {
    //   setExpand(2);
    // }
  }, []);
};

export { usePrefillPath };
