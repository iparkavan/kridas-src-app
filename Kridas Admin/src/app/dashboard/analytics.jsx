import React, { useEffect } from "react";
import DashboardLayout from "../common/dashboard-layout";
import {
  useFetchApprovals,
  useFetchStatistics,
  useGraph,
  useTopUsers,
} from "../../hooks/analytics-hooks";
import { userPagesDetails } from "../data/analytics-users-data";
import { Skeleton } from "@mui/material";
import CountUp from "react-countup";
import { useState } from "react";
import UserLayout from "../common/user-layout";
import BarChart from "./charts/bar-chart";
import PieChart from "./charts/pie-chart";

const Analytics = () => {
  const { data: graphData = [], isLoading: isGraphDataLoading } = useGraph();
  const { data: fetchApprovals = [], isFetchApprovalsLoading } =
    useFetchApprovals();
  const { data: topUsersData, isTopUsersDataLoading } = useTopUsers();
  const { data: fetchStatistics, isLoading: isUserCountLoading } =
    useFetchStatistics();


  // const initialGraphData = [
  //   ["Month", "User Registered", "Page Registered"],
  //   ["Sep", 0, 0],
  //   ["Oct", 0, 0],
  //   ["Nov", 0, 0],
  //   ["Dec", 0, 0],
  //   ["Jan", 0, 0],
  //   ["Feb", 0, 0],
  // ];

  const [barValue, setBarValue] = useState();
  const [approvalData, setApprovalData] = useState();


  useEffect(() => {
    let arrayOfBarChartData = [];
    let title = ["Month", "User Registered", "Page Registered"];
    arrayOfBarChartData.push(title);

    for (let key of graphData) {
      let graphValue = [
        key.month.toString().substring(0, 3),
        Number(key.users),
        Number(key.pages),
      ];
      arrayOfBarChartData.push(graphValue);
    }
    setBarValue(arrayOfBarChartData);
  }, [graphData]);

  useEffect(() => {
    const pieChartContent = ["UnApprovals list", "Count"];
    const usersData = [
      "UnApproval Users",
      Number(fetchApprovals.pending_verified_users),
    ];
    let pagesData = [
      "UnApproval Pages",
      Number(fetchApprovals.pending_verified_company),
    ];
    setApprovalData([pieChartContent, usersData, pagesData]);
  }, [fetchApprovals]);

  const getOverAllUsersAndPages = (type) => {
    switch (type) {
      case "USERS":
        return fetchStatistics[0].total_users;
      case "VUSERS":
        return fetchStatistics[0].verified_users;
      case "PAGES":
        return fetchStatistics[0].total_pages;
      case "VPAGES":
        return fetchStatistics[0].verified_company;
    }
  };

  return (
    <UserLayout>
      <DashboardLayout heading="Analytics" isBackButton={true}>
        <div>
          {isUserCountLoading ||
          isGraphDataLoading ||
          isFetchApprovalsLoading ||
          isTopUsersDataLoading ? (
            <Skeleton />
          ) : (
            <div>
              <div className="flex flex-wrap justify-start gap-6 items-start">
                {userPagesDetails.map((item) => (
                  <div
                    key={item.title}
                    className="bg-white h-44 md:w-56 p-4 pt-9 rounded-2xl drop-shadow-xl  dark:bg-secondary-dark-bg"
                  >
                    <button
                      style={{
                        color: item.iconColor,
                        backgroundColor: item.iconBg,
                      }}
                      className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
                    >
                      {item.icon}
                    </button>
                    <span className="ml-10 font-semibold dark:text-white text-2xl">
                      <CountUp
                        end={getOverAllUsersAndPages(item.type)}
                        duration={3}
                      />
                    </span>
                    <p className="text-xl dark:text-gray ml-2 mt-5">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap justify-start gap-6 items-start">
                <div className="mt-6 p-6 bg-white rounded-2xl dark:bg-secondary-dark-bg drop-shadow-xl">
                  <BarChart barValue={barValue} />
                </div>
                <div className="mt-6 p-6 bg-white rounded-2xl dark:bg-secondary-dark-bg duration-300 drop-shadow-xl">
                  <PieChart approvalData={approvalData} />
                </div>
              </div>
            </div>
          )}

          <div className="bg-white w-full">{/* <UserPageBarChart /> */}</div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
};

export default Analytics;
