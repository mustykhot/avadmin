import credit from "../../assets/icons/credit-card.svg";
import { ReactComponent as Fill } from "../../assets/icons/Fill.svg";
import "./style.scss";
const SummaryCard = ({
  icon,
  isAmount = false,
  increase,
  currency,
  btmText,
  midText,
  isFour,
  percent,
  children,
}) => {
  return (
    <div
      className={`summary ${isFour ? "four" : ""} ${isAmount ? "amount" : ""}`}
    >
      <div className="iconFlex">
        <img src={isAmount ? credit : icon} alt="trending" />
        {isAmount ? (
          ""
        ) : increase === "none" ? null : (
          <div className={`percent ${increase ? "inc" : "dec"}`}>
            <p>{percent}</p>
            <Fill className="fill" />
          </div>
        )}
      </div>
      {currency ? children : <p className="midText">{midText}</p>}

      <p className="btmText">{btmText}</p>
    </div>
  );
};

export default SummaryCard;
