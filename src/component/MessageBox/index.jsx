import moment from "moment";
import truncateString from "../utils/trunc";
import { useState, useEffect } from "react";
import "./style.scss";
import { Avatar } from "@mui/material";
import { useSelector } from "react-redux";
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
  skipper,
}) => {
  const [sender, setSender] = useState(null);
  // console.log(sender, "sender");
  const { user } = useSelector((state) => state.auth);
  // const userId = "61d57dbea7bc65c65b587c32";
  // console.log(currentMsg, "currentMsg");
  useEffect(() => {
    const sendernew = members
      ? members.filter((item) => {
          return item.id !== user.id;
        })
      : "";

    setSender(sendernew[0]);
  }, [members]);
  return (
    <div
      onClick={() => {
        console.log(members[1].id, members[0].id, "here");
        setActive(id);
        setId(members[0].id, members[1].id);
        skipper(false);
      }}
      className={`message_box ${active ? "active" : ""}`}
    >
      <Avatar
        alt={"user"}
        src={sender && sender.image}
        sx={{ width: 35, height: 35 }}
      />
      <div className="textBox">
        <div className="nameSide">
          <p className="name">
            {sender && `${sender.firstName} ${sender.lastName}`}
          </p>
          <p className="time">{moment(time).fromNow()}</p>
        </div>
        <div className="messageSide">
          {/* <p className="message">{truncateString(latestMessage, 66)}</p> */}
          {/* <p className="numberCircle">{numberOfNew}</p> */}
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
