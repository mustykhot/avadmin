import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./style.scss";
const SubmitBtn = ({ isLoading, btnText, style }) => {
  return (
    <button style={style} type="submit" className="submit" disabled={isLoading}>
      {isLoading ? <FontAwesomeIcon icon={faSpinner} pulse spin /> : btnText}
    </button>
  );
};

export default SubmitBtn;
