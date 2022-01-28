import {useState} from "react";
import "./style.scss";

const DropDownWrapper = ({action, children, className}) => {
  const [showDropDown, setshowDropDown] = useState(false);

  return (
    <div className={`drop-down-wrapper ${className || ""}`}>
      <div
        onClick={() => setshowDropDown(!showDropDown)}
        className="drop-down-action"
      >
        {action}
      </div>
      <div
        className={`drop-down-content ${showDropDown ? "show-drop-down" : ""} `}
      >
        {children}
      </div>
    </div>
  );
};

export default DropDownWrapper;
