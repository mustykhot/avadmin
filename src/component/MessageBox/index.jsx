import moment from "moment";
import truncateString from "../utils/trunc";
import { useState, useEffect } from "react";
import "./style.scss";
import { Avatar } from "@mui/material";
import { useSelector } from "react-redux";

import { motion } from "framer-motion/dist/framer-motion";
import { moveIn } from "../../utils/variants";
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
  console.log(user, "currentMsg");
  useEffect(() => {
    const sendernew = members
      ? members.filter((item) => {
          return item._id !== user.id;
        })
      : "";

    setSender(sendernew[0]);
  }, [members]);
  console.log(sender, "senderner");
  return (
    <motion.div
      variants={moveIn}
      animate="visible"
      initial="hidden"
      onClick={() => {
        setActive(id);
        setId(members[0]._id, members[1]._id);
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
    </motion.div>
  );
};

export default MessageBox;
