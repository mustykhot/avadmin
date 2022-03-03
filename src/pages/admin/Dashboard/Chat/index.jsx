import { useEffect, useRef, useState } from "react";
import AdminDashboardLayout from "../../../../component/adminDashboardLayout";
import ChatBox from "../../../../component/ChatBox";
import MessageBox from "../../../../component/MessageBox";
import Modal from "../../../../component/Modal";
import { ReactComponent as Close } from "../../../../assets/icons/close.svg";
import { ReactComponent as Users } from "../../../../assets/icons/sidebar/users.svg";
import { ReactComponent as Chat1 } from "../../../../assets/icons/sidebar/chat1.svg";
import {
  currentMsg,
  messageBoxList,
} from "../../../../component/utils/chatList";
import "./style.scss";
import NoProduct from "../../../../component/NoProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentSlash } from "@fortawesome/free-solid-svg-icons";
import {
  useCreateChatMutation,
  useGetAdminsQuery,
  useGetConversationBtwUsersQuery,
  useGetConversationQuery,
} from "../../../../services/api";
import { Avatar, CardHeader } from "@mui/material";
import { useSelector } from "react-redux";
import { toastr } from "react-redux-toastr";
import Skeleton from "@mui/material/Skeleton";
import io from "socket.io-client";
import { AnimatePresence } from "framer-motion/dist/framer-motion";

const Chat = () => {
  const [activeMsg, setActiveMsg] = useState("");
  const { user } = useSelector((state) => state.auth);
  console.log(user);
  const userList = [
    {
      id: 1,
      image:
        "https://res.cloudinary.com/dpiyqfdpk/image/upload/v1626305258/gabriel-benois-qnWPjzewewA-unsplash_vuppvi.jpg",
      name: "Raji Mustapha",
      email: "rajimustapha30@gmail.com",
      isOnline: false,
    },
    {
      id: 1,
      image:
        "https://res.cloudinary.com/dpiyqfdpk/image/upload/v1626305258/gabriel-benois-qnWPjzewewA-unsplash_vuppvi.jpg",
      name: "Raji Mustapha",
      email: "rajimustapha30@gmail.com",
      isOnline: true,
    },
    {
      id: 1,
      image:
        "https://res.cloudinary.com/dpiyqfdpk/image/upload/v1626305258/gabriel-benois-qnWPjzewewA-unsplash_vuppvi.jpg",
      name: "Raji Mustapha",
      email: "rajimustapha30@gmail.com",
      isOnline: false,
    },
    {
      id: 1,
      image:
        "https://res.cloudinary.com/dpiyqfdpk/image/upload/v1626305258/gabriel-benois-qnWPjzewewA-unsplash_vuppvi.jpg",
      name: "Raji Mustapha",
      email: "rajimustapha30@gmail.com",
      isOnline: true,
    },
    {
      id: 1,
      image:
        "https://res.cloudinary.com/dpiyqfdpk/image/upload/v1626305258/gabriel-benois-qnWPjzewewA-unsplash_vuppvi.jpg",
      name: "Raji Mustapha",
      email: "rajimustapha30@gmail.com",
      isOnline: false,
    },
    {
      id: 1,
      image:
        "https://res.cloudinary.com/dpiyqfdpk/image/upload/v1626305258/gabriel-benois-qnWPjzewewA-unsplash_vuppvi.jpg",
      name: "Raji Mustapha",
      email: "rajimustapha30@gmail.com",
      isOnline: true,
    },
  ];
  const [toggleChat, setToggleChat] = useState("admin");
  const handleToggleChat = (type) => {
    setToggleChat(type);
  };
  const [modal, setModal] = useState(false);
  const closeModal = () => {
    setModal(!modal);
  };

  const {
    data: admins = null,
    isLoading: loading,
    isError,
    error,
  } = useGetAdminsQuery({ search: "", page: 1 });
  // create chat
  const [createResponse, { isLoading: createLoading }] =
    useCreateChatMutation();
  const startChat = async (id) => {
    const payload = {
      senderId: user.id,
      receiverId: id,
    };
    console.log(payload);
    try {
      const response = await createResponse(payload).unwrap();

      toastr.success("Success", response.message);
    } catch (err) {
      if (err.status === "FETCH_ERROR")
        toastr.error("Error", "Something went wrong, please try again...");
      else toastr.error("Error", err.data._meta.error.message);
    }
  };

  // get converstion
  const {
    data: conversation,
    isLoading: convLoading,
    isError: convIsError,
    error: convError,
  } = useGetConversationQuery(user.id);
  console.log(conversation);
  // 61d57dbea7bc65c65b587c32
  // get converstaion between two users

  const [firstId, setFirstId] = useState("");
  const [secondId, setSecondId] = useState("");
  const [skip, setSkip] = useState(true);
  console.log(firstId, secondId, "ggggggg");
  const [message, setMessage] = useState([]);
  const setId = (id1, id2) => {
    setFirstId(id1);
    setSecondId(id2);
    // setSkip()
  };
  const {
    data: twoconversation,
    isLoading: twoconvLoading,
    isError: twoconvIsError,
    error: twoconvError,
  } = useGetConversationBtwUsersQuery(
    {
      idFirst: firstId,
      idSecond: secondId,
    },
    {
      skip,
    }
  );
  console.log(twoconversation, "twoconversation");

  console.log(conversation, "conversation");

  // socket

  // sockett join-conversation
  const [currentId, setCurrentId] = useState(null);

  const socketRef = useRef(null);
  useEffect(() => {
    if (currentId) {
      socketRef.current = io("wss://auction-village-be.herokuapp.com", {
        query: { conversationId: currentId },
        transports: ["websocket"],
      });

      socketRef.current.on("connect", () => {
        console.log(currentId, "currentId");
        console.log(`Connected to ID ${socketRef.current.id}`);
      });
      // socketRef.current.emit("join-conversation", {
      //   conversationId: currentMsg.id,
      // });

      socketRef.current.on("new-message", (newMsg) => {
        console.log(newMsg, "newMsg");
        setMessage((prev) => {
          return [...prev, newMsg.message];
        });
      });
      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [currentId]);

  useEffect(() => {
    if (twoconversation) {
      setMessage(twoconversation.data[0].messages);
      setCurrentId(twoconversation.data[0].id);
    }
  }, [twoconversation]);

  return (
    <AdminDashboardLayout active={"chat"}>
      <div className="pd-chat">
        <div className="topicPart">
          <p className="pageTitle">Chats</p>
        </div>
        <div className="whiteContainer">
          <div className="messageList">
            <div className="messageTop">
              <div className="new">
                <p>Conversations</p>
                <button onClick={closeModal} className="newMessageBtn">
                  New Message
                </button>
              </div>

              <input type="text" placeholder="Search" className="search" />
              <p className="recent">Recent</p>
            </div>
            <div className="msgDiv">
              {!isError ? (
                !convLoading ? (
                  !conversation.length ? (
                    conversation.data.map((item) => {
                      return (
                        <MessageBox
                          image={item.img}
                          name={item.name}
                          key={item._id}
                          id={item._id}
                          // latestMessage={item.latestMessage}
                          numberOfNew={item.numberOfNew}
                          time={item.createdAt}
                          setActive={setActiveMsg}
                          active={item._id === activeMsg}
                          members={item.members}
                          setId={setId}
                          skipper={setSkip}
                        />
                      );
                    })
                  ) : (
                    <NoProduct msg="No Chats Yet...">
                      <FontAwesomeIcon icon={faCommentSlash} />
                    </NoProduct>
                  )
                ) : (
                  // <p>Loading</p>
                  <>
                    <CardHeader
                      avatar={
                        <Skeleton
                          animation="wave"
                          variant="circular"
                          width={40}
                          height={40}
                        />
                      }
                      title={
                        <Skeleton
                          animation="wave"
                          height={10}
                          width="80%"
                          style={{ marginBottom: 6 }}
                        />
                      }
                      subheader={
                        <Skeleton animation="wave" height={10} width="40%" />
                      }
                    />
                    <CardHeader
                      avatar={
                        <Skeleton
                          animation="wave"
                          variant="circular"
                          width={40}
                          height={40}
                        />
                      }
                      title={
                        <Skeleton
                          animation="wave"
                          height={10}
                          width="80%"
                          style={{ marginBottom: 6 }}
                        />
                      }
                      subheader={
                        <Skeleton animation="wave" height={10} width="40%" />
                      }
                    />
                    <CardHeader
                      avatar={
                        <Skeleton
                          animation="wave"
                          variant="circular"
                          width={40}
                          height={40}
                        />
                      }
                      title={
                        <Skeleton
                          animation="wave"
                          height={10}
                          width="80%"
                          style={{ marginBottom: 6 }}
                        />
                      }
                      subheader={
                        <Skeleton animation="wave" height={10} width="40%" />
                      }
                    />
                  </>
                )
              ) : (
                <NoProduct msg="There is a problem...">
                  <FontAwesomeIcon icon={faCommentSlash} />
                </NoProduct>
              )}
            </div>
          </div>
          <div className="chatBoxDiv">
            <ChatBox
              currentMsg={twoconversation && twoconversation.data[0]}
              messages={message}
              loading={twoconvLoading}
            />
          </div>
        </div>
      </div>

      {/* adding new chat */}
      <AnimatePresence>
        {modal && (
          <Modal>
            <div className="new-chat">
              <div className="titleBox">
                <p className="title">New Chat</p>
                <Close onClick={closeModal} className="close" />
              </div>
              <div className="toggleBox">
                <div
                  onClick={() => {
                    handleToggleChat("admin");
                  }}
                  className={`eachToggle ${
                    toggleChat === "admin" ? "active" : ""
                  }`}
                >
                  <Users className="icon" />
                  <p>Administrators</p>
                </div>
                <div
                  onClick={() => {
                    handleToggleChat("customers");
                  }}
                  className={`eachToggle ${
                    toggleChat === "customers" ? "active" : ""
                  }`}
                >
                  <Chat1 className="icon" />
                  <p>Customers</p>
                </div>
              </div>
              {/* <input type="text" placeholder="Search" className="search" /> */}
              <div className="coverMemberAll">
                <div
                  className={`memberList  ${
                    toggleChat === "admin" ? "showUp2" : "leftShow2"
                  }`}
                >
                  <p className="title">Administrative Members</p>
                  <div className="coverMember">
                    {isError ? (
                      <NoProduct msg="There is a problem...">
                        <FontAwesomeIcon icon={faCommentSlash} />
                      </NoProduct>
                    ) : loading ? (
                      <p>Loading</p>
                    ) : !admins.data.length ? (
                      <NoProduct msg="No Data Yet...">
                        <FontAwesomeIcon icon={faCommentSlash} />
                      </NoProduct>
                    ) : (
                      admins.data
                        .filter((item) => {
                          return user.id !== item._id;
                        })
                        .map((item) => {
                          return (
                            <div
                              className="eachMember"
                              onClick={() => {
                                startChat(item._id);
                              }}
                              key={item._id}
                            >
                              {/* <img src={item.image} alt="user" /> */}

                              <Avatar alt="Remy Sharp" src="" />
                              <div className="textPart">
                                <p className="name">
                                  {`${item.firstName} ${item.lastName}`}{" "}
                                  {
                                    <span
                                      className={item.isOnline ? "active" : ""}
                                    ></span>
                                  }
                                </p>
                                <p className="email">{item.email}</p>
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>

                <div
                  className={`memberList ${
                    toggleChat === "customers" ? "showUp" : "leftShow"
                  }`}
                >
                  <p className="title">Customers</p>
                  <div className="coverMember">
                    {userList.map((item) => {
                      return (
                        <div
                          onClick={() => {
                            startChat(item.id);
                          }}
                          key={item.id}
                          className="eachMember"
                        >
                          <img src={item.image} alt="user" />
                          <div className="textPart">
                            <p className="name">
                              {item.name}{" "}
                              {
                                <span
                                  className={item.isOnline ? "active" : ""}
                                ></span>
                              }
                            </p>
                            <p className="email">{item.email}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </AdminDashboardLayout>
  );
};

export default Chat;
