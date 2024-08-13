import { useQuery } from "@tanstack/react-query";
import analyticsService from "../services/analytics-service";

const useGraph = () => {
  return useQuery({
    queryKey: ["graph"],
    queryFn: () => analyticsService.getGraph(),
  });
};

const useTopUsers = () => {
  return useQuery({
    queryKey: ["top-users"],
    queryFn: () => analyticsService.getTopUsers(),
  });
};

const useFetchStatistics = () => {
  return useQuery({
    queryKey: ["user-count"],
    queryFn: () => analyticsService.getFetchStatistics(),
  });
};

const useFetchApprovals = () => {
  return useQuery({
    queryKey: ["approvals"],
    queryFn: () => analyticsService.getFetchApprovals(),
  });
};

export { useGraph, useTopUsers, useFetchStatistics, useFetchApprovals };
