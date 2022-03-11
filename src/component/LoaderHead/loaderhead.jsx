import { memo } from "react";
import "./style.scss";
const LoadingHead = ({ status }) => {
  return (
    <>
      <div
        className="loader-line"
        style={{ display: status ? "block" : "none" }}
      ></div>
    </>
  );
};

export default memo(LoadingHead);
