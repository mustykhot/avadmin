import { useState, useEffect, useRef } from "react";
import TableDrop from "../TableDrop";
import moment from "moment";
import "./style.scss";
import { useForm } from "react-hook-form";
import Input from "../input";
import { ReactComponent as SendIcon } from "../../assets/icons/sendIcon.svg";
import { Avatar } from "@mui/material";
import { ReactComponent as Fileicon } from "../../assets/icons/fileIcon.svg";
import NoProduct from "../NoProduct";
import { faCommentSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toastr } from "react-redux-toastr";
import { useSendChatMutation } from "../../services/api";
import uploadImg from "../../hook/UploadImg";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import { useSelector } from "react-redux";
import Loader from "../Loader";
import { moveIn } from "../../utils/variants";
import { motion } from "framer-motion/dist/framer-motion";

const ChatBox = ({ currentMsg, messages, loading }) => {
  const { register, formState, handleSubmit, reset } = useForm({
    reValidateMode: "onChange",
    mode: "onSubmit",
    shouldUnregister: true,
  });
  // send message
  const [create, { isLoading }] = useSendChatMutation();
  const { user } = useSelector((state) => state.auth);

  // upload

  const uploader = async (file) => {
    let url = await uploadImg(file, "n3mtymsx");
    let payload = {
      sender: user.id,
      file: {
        url: url.url,
        name: url.name,
        mimeType: url.format,
      },
    };
    try {
      const response = await create({
        credentials: payload,
        id: currentMsg.id,
      }).unwrap();
      console.log(response);
    } catch (err) {
      if (err.status === "FETCH_ERROR")
        toastr.error("Error", "Something went wrong, please try again...");
      else toastr.error("Error", err.data._meta.error.message);
    }
  };

  const onSubmit = async (values) => {
    let payload = {
      text: values.message,
      sender: user.id,
    };

    console.log(payload, "payload");
    try {
      const response = await create({
        credentials: payload,
        id: currentMsg.id,
      }).unwrap();
      console.log(response);
    } catch (err) {
      if (err.status === "FETCH_ERROR")
        toastr.error("Error", "Something went wrong, please try again...");
      else toastr.error("Error", err.data._meta.error.message);
    }
    reset({ message: "" });
  };
  const [sender, setSender] = useState(null);
  useEffect(() => {
    const sendernew = currentMsg
      ? currentMsg.members.filter((item) => {
          return item._id !== user.id;
        })
      : "";

    setSender(sendernew[0]);
  }, [currentMsg, user]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    // currentMsg && messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages) {
      scrollToBottom();
    }
  }, [messages]);

  return (
    <>
      {currentMsg ? (
        loading ? (
          <Loader />
        ) : (
          <div className="chatBox">
            <div className="chatDetails">
              <div className="userDetail">
                <Avatar
                  alt={"user"}
                  src={sender && sender.image}
                  sx={{ width: 31, height: 31 }}
                />
                <div className="textPart">
                  <p className="name">
                    {sender ? `${sender.firstName} ${sender.lastName}` : "N/A"}
                  </p>
                  {currentMsg.isActive && (
                    <p className="userActive">
                      <span></span> Active Now
                    </p>
                  )}
                </div>
              </div>
              <TableDrop extra={true} />
            </div>
            <div className="line"></div>
            <div className="allMessageBox">
              {messages && !messages.length ? (
                <NoProduct msg="No Message...">
                  <FontAwesomeIcon icon={faCommentSlash} />
                </NoProduct>
              ) : (
                messages.map((item) => {
                  return (
                    <motion.div
                      variants={moveIn}
                      animate="visible"
                      initial="hidden"
                      className={`eachMsg ${
                        item.sender._id === user.id ? "left" : ""
                      }`}
                      key={item.id}
                    >
                      {item.file && item.file.url && (
                        <img
                          src={item.file.url}
                          style={{ width: "150px" }}
                          alt="chat"
                        />
                      )}

                      <p className="time">
                        {" "}
                        {moment(item.createdAt).format("LT")}
                      </p>
                      {item.text && <p className="msg">{item.text}</p>}
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef}></div>
            </div>

            {/* chat footer */}
            <div className="chat-footer ">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  type="text"
                  name="message"
                  placeholder="Type a Message..."
                  id="message"
                  register={register}
                  errors={formState.errors}
                />
                {/* <button className="btn round-btn">
                <AttachIcon className="attachIcon" />
              </button> */}
                <input
                  onChange={(e) => {
                    uploader(e.target.files[0]);
                  }}
                  type="file"
                  name="url"
                  hidden
                  id="url"
                />
                <label htmlFor="url" className="btn round-btn">
                  <Fileicon className="fileIcon" />
                </label>
                <button className="btn round-btn sendBtn">
                  {isLoading ? (
                    <FontAwesomeIcon icon={faSpinner} pulse spin />
                  ) : (
                    <>
                      {" "}
                      Send
                      <SendIcon className="sendIcon" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )
      ) : (
        <NoProduct msg="No Chats Selected...">
          <FontAwesomeIcon icon={faCommentSlash} />
        </NoProduct>
      )}
    </>
  );
};

export default ChatBox;
