import "./style.scss";
import action from "../../assets/icons/action.svg";
import { useState } from "react";
const TableDrop = ({
  extra,
  handleView,
  fbutton,
  fhandle,
  sbutton,
  shandle,
  tbutton,
  thandle,
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="popping">
      <img
        onClick={() => {
          setShow(!show);
        }}
        src={action}
        alt="action"
      />

      <div
        className={`actionPop ${show ? "show" : ""} ${extra ? "extra" : ""}`}
      >
        <button onClick={fhandle} className="pop">
          {fbutton}
        </button>
        <button onClick={shandle} className="pop">
          {sbutton}
        </button>
        {tbutton && (
          <button onClick={thandle} className="pop">
            {tbutton}
          </button>
        )}
        {handleView && (
          <button onClick={handleView} className="pop">
            View
          </button>
        )}
      </div>
    </div>
  );
};

export default TableDrop;
