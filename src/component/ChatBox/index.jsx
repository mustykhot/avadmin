import { useState } from "react";
import action from "../../assets/icons/action.svg";
import TableDrop from "../TableDrop";
import moment from "moment";
import "./style.scss";
import { useForm } from "react-hook-form";
import Input from "../input";
import { ReactComponent as SendIcon } from "../../assets/icons/sendIcon.svg";
import { ReactComponent as AttachIcon } from "../../assets/icons/attachIcon.svg";
import { ReactComponent as Fileicon } from "../../assets/icons/fileIcon.svg";
import NoProduct from "../NoProduct";
import { faCommentSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const ChatBox = ({ currentMsg }) => {
  const [show, setShow] = useState(false);
  const { register, formState, handleSubmit, reset } = useForm({
    reValidateMode: "onChange",
    mode: "onSubmit",
    shouldUnregister: true,
  });
  const onSubmit = (values) => {
    console.log(values);
    reset({ message: "" });
  };
  const userId = "1234";
  return (
    <>
      {currentMsg ? (
        <div className="chatBox">
          <div className="chatDetails">
            <div className="userDetail">
              <img src={currentMsg.img} alt="user" />
              <div className="textPart">
                <p className="name">{currentMsg.name}</p>
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
            {currentMsg.msgList.map((item) => {
              return (
                <div
                  className={`eachMsg ${
                    item.senderId === userId ? "left" : ""
                  }`}
                >
                  <p className="time"> {moment(item.time).format("LT")}</p>
                  <p className="msg">{item.msg}</p>
                </div>
              );
            })}
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
              <button className="btn round-btn">
                <AttachIcon className="attachIcon" />
              </button>
              <button className="btn round-btn">
                <Fileicon className="fileIcon" />
              </button>
              <button className="btn round-btn sendBtn">
                Send
                <SendIcon className="sendIcon" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <NoProduct msg="No Chats Selected...">
          <FontAwesomeIcon icon={faCommentSlash} />
        </NoProduct>
      )}
    </>
  );
};

export default ChatBox;
