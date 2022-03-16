import { useEffect, useRef, useState } from "react";
import AdminDashboardLayout from "../../../../component/adminDashboardLayout";
import ChatBox from "../../../../component/ChatBox";
import MessageBox from "../../../../component/MessageBox";
import Modal from "../../../../component/Modal";
import { ReactComponent as Close } from "../../../../assets/icons/close.svg";
import { ReactComponent as Users } from "../../../../assets/icons/sidebar/users.svg";
import { ReactComponent as Chat1 } from "../../../../assets/icons/sidebar/chat1.svg";
import "./style.scss";
import NoProduct from "../../../../component/NoProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentSlash } from "@fortawesome/free-solid-svg-icons";
import LoadingHead from "../../../../component/LoaderHead/loaderhead";
import {
  useCreateChatMutation,
  useGetConversationBtwUsersQuery,
  useGetConversationQuery,
  useGetUsersInChatQuery,
  useGetChatAdminsQuery,
} from "../../../../services/api";
import { Avatar, CardHeader } from "@mui/material";
import { useSelector } from "react-redux";
import { toastr } from "react-redux-toastr";
import Skeleton from "@mui/material/Skeleton";
import io from "socket.io-client";
import { AnimatePresence } from "framer-motion/dist/framer-motion";
import { useLocation } from "react-router-dom";
import { useCallback } from "react";

const Chat = () => {
  const [activeMsg, setActiveMsg] = useState("");
  const { user } = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [search2] = useState("");
  const [adminSearch, setAdminSearch] = useState("");

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
  } = useGetChatAdminsQuery({ search: adminSearch, page: 1 });
  const {
    data: users = null,
    isLoading: loadingUsers,
    isError: isErrorUsers,
  } = useGetUsersInChatQuery({ search, page: 1 });
  // create chat
  const [createResponse, { isLoading: createLoading }] =
    useCreateChatMutation();
  const startChat = async (id) => {
    const payload = {
      senderId: user.id,
      receiverId: id,
    };

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
  const { data: conversation, isLoading: convLoading } =
    useGetConversationQuery({
      id: user.id,
      search: search2,
    });

  const [realConv, setRealConv] = useState(null);
  useEffect(() => {
    if (conversation) {
      setRealConv(conversation.data);
    }
  }, [conversation]);

  const searchConv = useCallback(
    (value) => {
      if (value && !!value.trim() && conversation?.data) {
        const newConv = [...conversation.data].filter((item) => {
          let mem = item.members.find((member) => member._id !== user.id);

          return (
            mem._id === value ||
            mem.firstName.toLowerCase().includes(value.toLowerCase()) ||
            mem.lastName.toLowerCase().includes(value.toLowerCase())
          );
        });
        console.log(newConv, "newConv");
        setRealConv(newConv);
      } else {
        setRealConv(conversation.data);
      }
    },
    [conversation, user.id]
  );

  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const fname = urlParams.get("id");

  useEffect(() => {
    if (fname && conversation) {
      searchConv(fname);
    }
  }, [conversation, fname, searchConv]);

  const [firstId, setFirstId] = useState("");
  const [secondId, setSecondId] = useState("");
  const [skip, setSkip] = useState(true);

  const [message, setMessage] = useState([]);
  const setId = (id1, id2) => {
    setFirstId(id1);
    setSecondId(id2);
  };

  const { data: twoconversation, isLoading: twoconvLoading } =
    useGetConversationBtwUsersQuery(
      {
        idFirst: firstId,
        idSecond: secondId,
      },
      {
        skip,
      }
    );

  // socket

  // sockett join-conversation
  const [currentId, setCurrentId] = useState(null);

  const socketRef = useRef(null);
  useEffect(() => {
    if (currentId) {
      socketRef.current = io("wss://auction-backend-api.herokuapp.com", {
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
        <LoadingHead status={createLoading || twoconvLoading ? true : false} />
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

              <input
                type="text"
                placeholder="Search"
                onChange={(e) => {
                  searchConv(e.target.value);
                  console.log(realConv);
                }}
                className="search"
              />
              <p className="recent">Recent</p>
            </div>
            <div className="msgDiv">
              {!isError ? (
                !convLoading ? (
                  realConv ? (
                    !realConv.length ? (
                      <NoProduct msg="No Chats Yet...">
                        <FontAwesomeIcon icon={faCommentSlash} />
                      </NoProduct>
                    ) : (
                      realConv.map((item) => {
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
                    )
                  ) : (
                    <NoProduct msg="No Chats Yet...">
                      <FontAwesomeIcon icon={faCommentSlash} />
                    </NoProduct>
                  )
                ) : (
                  // <p>Loading</p>
                  <>
                    {Array(5)
                      .fill("")
                      .map((_, i) => (
                        <CardHeader
                          key={`skeleton_${i}`}
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
                            <Skeleton
                              animation="wave"
                              height={10}
                              width="40%"
                            />
                          }
                        />
                      ))}
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
              <input
                type="text"
                placeholder="Search"
                onChange={(e) => {
                  if (toggleChat === "customers") {
                    setSearch(e.target.value);
                  } else {
                    setAdminSearch(e.target.value);
                  }
                }}
                className="search"
              />
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
                    {isErrorUsers ? (
                      <NoProduct msg="There is a problem...">
                        <FontAwesomeIcon icon={faCommentSlash} />
                      </NoProduct>
                    ) : loadingUsers ? (
                      <p>Loading</p>
                    ) : !users.data.length ? (
                      <NoProduct msg="No Data Yet...">
                        <FontAwesomeIcon icon={faCommentSlash} />
                      </NoProduct>
                    ) : (
                      users.data
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
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </AdminDashboardLayout>
  );
};

export default Chat;
