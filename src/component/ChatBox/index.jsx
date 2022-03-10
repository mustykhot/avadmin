import { useState, useEffect, useRef } from "react";
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
import { toastr } from "react-redux-toastr";
import { useSendChatMutation } from "../../services/api";
import uploadImg from "../../hook/UploadImg";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import Loader from "../Loader";
import { moveIn } from "../../utils/variants";
import { motion } from "framer-motion/dist/framer-motion";

const ChatBox = ({ currentMsg, messages, loading }) => {
  const [show, setShow] = useState(false);
  const { register, formState, handleSubmit, reset } = useForm({
    reValidateMode: "onChange",
    mode: "onSubmit",
    shouldUnregister: true,
  });
  // send message
  const [create, { isLoading }] = useSendChatMutation();
  const [img, setImg] = useState(null);
  const [message, setMessage] = useState([]);
  const { user } = useSelector((state) => state.auth);

  // upload

  const uploader = async (file) => {
    let url = await uploadImg(file, "n3mtymsx");

    // setImg({
    //   url: url.secure_url,
    //   name: url.original_filename,
    //   format: url.format,
    // });
    let payload = {
      // text: "",
      sender: user.id,
      // conversation: currentMsg.id,
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
      //  closeModal();

      // toastr.success("Success", response.message);
    } catch (err) {
      if (err.status === "FETCH_ERROR")
        toastr.error("Error", "Something went wrong, please try again...");
      else toastr.error("Error", err.data._meta.error.message);
    }
  };
  // // sockett join-conversation
  // const socketRef = useRef(null);
  // useEffect(() => {
  //   if (currentMsg) {
  //     socketRef.current = io("wss://auction-village-be.herokuapp.com", {
  //       query: { conversationId: currentMsg.id },
  //       transports: ["websocket"],
  //     });

  //     socketRef.current.on("connect", () => {
  //       console.log(`Connected to ID ${socketRef.current.id}`);
  //     });
  //     // socketRef.current.emit("join-conversation", {
  //     //   conversationId: currentMsg.id,
  //     // });

  //     socketRef.current.on("chat-message", (newMsg) => {
  //       console.log(newMsg, "newMsg");
  //       setMessage((prev) => {
  //         return [...prev, newMsg];
  //       });
  //     });
  //     return () => {
  //       socketRef.current.disconnect();
  //     };
  //   }
  // }, [currentMsg]);
  const onSubmit = async (values) => {
    let payload = {
      text: values.message,
      sender: user.id,
      // conversation: currentMsg.id,
    };
    // if (img) {
    //   payload = {
    //     ...payload,
    //     file: {
    //       url: img.url,
    //       name: img.name,
    //       mimeType: img.format,
    //     },
    //   };
    // }
    console.log(payload, "payload");
    try {
      const response = await create({
        credentials: payload,
        id: currentMsg.id,
      }).unwrap();
      //  closeModal();

      toastr.success("Success", response.message);
    } catch (err) {
      if (err.status === "FETCH_ERROR")
        toastr.error("Error", "Something went wrong, please try again...");
      else toastr.error("Error", err.data._meta.error.message);
    }
    reset({ message: "" });
  };
  const [sender, setSender] = useState(null);
  // console.log(sender, "sender");
  // const userId = "61d57dbea7bc65c65b587c32";
  // console.log(currentMsg, "currentMsg");
  useEffect(() => {
    const sendernew = currentMsg
      ? currentMsg.members.filter((item) => {
          return item._id !== user.id;
        })
      : "";

    setSender(sendernew[0]);
  }, [currentMsg]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    currentMsg && messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
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
                <img
                  src={
                    sender
                      ? "https://res.cloudinary.com/dpiyqfdpk/image/upload/v1613435284/pmmnrbuspg9d8vl5cqqe.jpg"
                      : "https://res.cloudinary.com/dpiyqfdpk/image/upload/v1613435284/pmmnrbuspg9d8vl5cqqe.jpg"
                  }
                  alt="user"
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
