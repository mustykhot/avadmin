import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/slice/AuthSlice";

export const useGetUser = () => {
  const user = useSelector(selectCurrentUser);
  let currency = user?.country === "NIGERIA" ? "en-NG" : "en-GB";
  return useMemo(() => ({ user, currency }), [user, currency]);
};
