import moment from "moment";
import truncateString from "../utils/trunc";
import "./style.scss";
const MessageBox = ({
  image,
  name,
  id,
  latestMessage = "alsksl",
  active,
  numberOfNew,
  time,
  setActive,
  setId,
  members,
}) => {
  console.log(members[1], members[0]);
  return (
    <div
      onClick={() => {
        setActive(id);
        setId(members[0], members[1]);
      }}
      className={`message_box ${active ? "active" : ""}`}
    >
      <img src={image} alt="user" />
      <div className="textBox">
        <div className="nameSide">
          {/* <p className="name">{name}</p>
          <p className="time">{moment(time).fromNow()}</p> */}
        </div>
        <div className="messageSide">
          <p className="message">{truncateString(latestMessage, 66)}</p>
          <p className="numberCircle">{numberOfNew}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
