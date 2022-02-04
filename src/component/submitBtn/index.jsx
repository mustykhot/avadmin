import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./style.scss";
const SubmitBtn = ({ isLoading, btnText, style, disable }) => {
  return (
    <button
      style={style}
      type="submit"
      className="submit"
      disabled={disable ? disable : false}
    >
      {isLoading ? <FontAwesomeIcon icon={faSpinner} pulse spin /> : btnText}
    </button>
  );
};

export default SubmitBtn;
