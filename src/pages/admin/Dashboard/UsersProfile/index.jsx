import AdminDashboardLayout from "../../../../component/adminDashboardLayout";
import "./style.scss";
import { ReactComponent as Fill } from "../../../../assets/icons/Fill.svg";

import shape from "../../../../assets/icons/shape.svg";

import { useEffect, useState } from "react";

import TableDrop from "../../../../component/TableDrop";
import userProfile from "../../../../assets/images/userprofile.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import chat from "../../../../assets/icons/chat2.svg";
import SummaryCard from "../../../../component/SummaryCard";
import trendingUp from "../../../../assets/icons/trending-up.svg";
import clock from "../../../../assets/icons/clock.svg";
import check from "../../../../assets/icons/check-circle.svg";
import Bitmap from "../../../../assets/icons/Bitmap.svg";
import NoProduct from "../../../../component/NoProduct";
import ProfileBox from "../../../../component/ProfileBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentSlash } from "@fortawesome/free-solid-svg-icons";
import { toastr } from "react-redux-toastr";
import {
  useUpdateMutation,
  useGetUserDealQuery,
  useGetUserQuery,
  useGetUserTransQuery,
  useGetUserAuctionQuery,
} from "../../../../services/api";
import LoadingTable from "../../../../component/loadingTable";
import moment from "moment";
import { moveIn } from "../../../../utils/variants";
import { motion } from "framer-motion/dist/framer-motion";
import Loader from "../../../../component/Loader";
import { Pagination } from "@mui/material";
const UsersProfile = () => {
  const list = [1, 2, 3];
  const [show, setShow] = useState(false);
  const [activeAction, setActiveAction] = useState("overview");
  const navigate = useNavigate();
  const handleActiveAction = (type) => {
    setActiveAction(type);
  };
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(1);
  const [page3, setPage3] = useState(1);
  const handlePage1 = (e, value) => {
    setPage1(value);
  };
  const handlePage2 = (e, value) => {
    setPage2(value);
  };
  const handlePage3 = (e, value) => {
    setPage3(value);
  };
  const { id } = useParams();
  const [showCard, setShowCard] = useState(false);
  const {
    data: user,
    isLoading: loading,
    isError,
    error,
  } = useGetUserQuery(id);
  console.log(user);

  const {
    data: transaction = null,
    isLoading,
    isError: istransError,
    error: transError,
  } = useGetUserTransQuery({ id, page: page1 });
  console.log(transaction, "trans");

  const {
    data: deal = null,
    isLoading: isDealLoading,
    isError: isdealError,
    error: dealError,
  } = useGetUserDealQuery({ id, page: page2 });
  console.log(deal, "deal");

  const {
    data: auction = null,
    isLoading: isStatAuctionLoading,
    isError: isStatAuctionError,
    error: statErrorAuction,
  } = useGetUserAuctionQuery({ id, page: page3 });
  console.log(auction, "statAuction");

  // activate

  const [update, { isLoading: activateLoading }] = useUpdateMutation();

  // useEffect(() => {
  //   if (id) {
  //     onSubmit();
  //   }
  // }, [id]);

  const onSubmit = async (bool) => {
    const payload = {
      active: bool,
    };
    try {
      // call login trigger from rtk query
      const response = await update({
        credentials: payload,
        id: id,
      }).unwrap();
      console.log(response);
      toastr.success("Success", "Successful");
    } catch (err) {
      if (err.status === "FETCH_ERROR")
        toastr.error("Error", "Something went wrong, please try again...");
      else toastr.error("Error", err.data._meta.error.message);
    }
  };

  const handleView = (id, place) => {
    if (place === "trans") {
      navigate(`/transaction/details/${id}`);
    } else if (place === "auction") {
      navigate(`/auction/auction_detail/${id}`);
    } else if (place === "sale") {
      navigate(`/transaction/details/${id}`);
    }
  };

  return (
    <AdminDashboardLayout active="user">
      {loading ? (
        <Loader />
      ) : (
        <motion.div
          variants={moveIn}
          animate="visible"
          initial="hidden"
          className="pd-userprofile"
        >
          <div className="topicPart">
            <p className="pageTitle">Customer’s Profile</p>
          </div>

          <div className="profileFlex">
            <ProfileBox
              name={user && `${user.data.firstName} ${user.data.lastName}`}
              email={user && user.data.email}
              account={id}
              tel={user && user.data.mobile}
              // billing={
              //   " 235 Ikorodu road, Anthony-iyanaoworo, Lagos state, Nigeria"
              // }
              img={user && user.data.image}
            />

            <div className="activityBox">
              <div style={{ marginBottom: "10px" }} className="userNav">
                <div className="left">
                  <p
                    onClick={() => {
                      handleActiveAction("overview");
                    }}
                    className={`eachnav ${
                      activeAction === "overview" ? "active" : ""
                    }`}
                  >
                    Overview
                  </p>
                  <p
                    onClick={() => {
                      handleActiveAction("auction");
                    }}
                    className={`eachnav ${
                      activeAction === "auction" ? "active" : ""
                    }`}
                  >
                    Auction Activities
                  </p>
                  <p
                    onClick={() => {
                      handleActiveAction("selling");
                    }}
                    className={`eachnav ${
                      activeAction === "selling" ? "active" : ""
                    }`}
                  >
                    My Auction
                  </p>
                </div>
                <div className="action">
                  <button
                    onClick={() => {
                      setShow(!show);
                    }}
                    className="actionbtn"
                  >
                    Action <Fill className="fill" />
                  </button>
                  <div className={`actionDrop ${show ? "show" : ""}`}>
                    <button
                      onClick={() => {
                        onSubmit(false);
                      }}
                    >
                      Deactivate
                    </button>
                    <button
                      onClick={() => {
                        onSubmit(true);
                      }}
                    >
                      Activate
                    </button>
                  </div>
                </div>
              </div>
              {activeAction === "overview" && (
                <motion.div
                  variants={moveIn}
                  animate="visible"
                  initial="hidden"
                  className="whiteContainer"
                >
                  <div className="tableHead">
                    <p className="tableTitle">Transactions</p>
                    <input type="date" placeholder="" className="search" />
                  </div>

                  <div className="summaryFlex">
                    <SummaryCard
                      icon={trendingUp}
                      currency={"₦"}
                      increase={true}
                      midText={transaction ? transaction.data.totalRevenue : 0}
                      btmText={"Total Revenue"}
                      percent={"12%"}
                    />
                    <SummaryCard
                      icon={trendingUp}
                      currency={"₦"}
                      increase={false}
                      midText={transaction ? transaction.data.totalExpense : 0}
                      btmText={"Total Expense"}
                      percent={"12%"}
                    />
                    <SummaryCard
                      midText={transaction ? transaction.data.totalBalance : 0}
                      currency={"₦"}
                      btmText={"Wallet Balance"}
                      isAmount={true}
                    />
                  </div>

                  <div className="overflowTable">
                    <div className="tableHead">
                      <p className="tableTitle">Recent Activities</p>
                    </div>
                    {isError ? (
                      <NoProduct msg="Something went wrong...">
                        <FontAwesomeIcon icon={faCommentSlash} />
                      </NoProduct>
                    ) : isLoading ? (
                      <LoadingTable />
                    ) : transaction.data.transactions.length ? (
                      <table>
                        <thead>
                          <tr>
                            <th>Transaction ID</th>
                            <th>Mobile No</th>
                            <th className="extraTh">Amount</th>
                            <th className="extraTh">Status</th>
                            <th className="extraTh">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transaction.data.transactions.map((item) => {
                            return (
                              <tr
                                onClick={() => {
                                  handleView(item.id, "trans");
                                }}
                                key={item.id}
                                className="bgDark"
                              >
                                <td className="phone">{item.id}</td>
                                <td className={`amount green`}>
                                  {item.user.phone}
                                </td>
                                <td className="role">₦ {item.amount}</td>
                                <td className="statusTd">
                                  <p className="status active">Successful</p>
                                </td>
                                <td className="role">
                                  {moment(item.createdAt).format("L")}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <NoProduct msg="No Transaction yet...">
                        <FontAwesomeIcon icon={faCommentSlash} />
                      </NoProduct>
                    )}
                    <div className="pagination-wrap">
                      <Pagination
                        color="primary"
                        onChange={handlePage1}
                        count={
                          transaction &&
                          Math.ceil(
                            parseInt(transaction._meta.pagination.total_count) /
                              10
                          )
                        }
                        shape="rounded"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              {activeAction === "auction" && (
                <motion.div
                  variants={moveIn}
                  animate="visible"
                  initial="hidden"
                  className="whiteContainer"
                >
                  <div className="tableHead">
                    <p className="tableTitle">Auction Activities</p>
                    <input type="date" placeholder="" className="search" />
                  </div>

                  <div className="summaryFlex">
                    <SummaryCard
                      icon={clock}
                      increase={true}
                      midText={deal ? deal.data.totalAuctionsParticipated : 0}
                      btmText={"Auctions participated"}
                      percent={"12%"}
                    />
                    <SummaryCard
                      icon={check}
                      increase={false}
                      midText={deal ? deal.data.totalAmountSpent : 0}
                      btmText={"Total Amount Spent"}
                      percent={"12%"}
                    />
                    <SummaryCard
                      midText={deal ? deal.data.totalWinningBid : 0}
                      currency={"₦"}
                      btmText={"Total Winning Bid"}
                      isAmount={true}
                    />
                  </div>

                  <div className="overflowTable">
                    <div className="tableHead">
                      <p className="tableTitle">Auction Participated</p>
                    </div>
                    {isdealError ? (
                      <NoProduct msg="Something is wrong...">
                        <FontAwesomeIcon icon={faCommentSlash} />
                      </NoProduct>
                    ) : isDealLoading ? (
                      <LoadingTable />
                    ) : deal.data.dealHistory.length ? (
                      <table>
                        <thead>
                          <tr>
                            <th>Item ID</th>

                            <th className="extraTh">
                              Amount <img src={shape} alt="shape" />{" "}
                            </th>
                            <th className="extraTh">
                              Status <img src={shape} alt="shape" />{" "}
                            </th>
                            <th className="extraTh">
                              Date <img src={shape} alt="shape" />{" "}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {deal.data.dealHistory.map((item) => {
                            return (
                              <tr
                                onClick={() => {
                                  handleView(item.id, "auction");
                                }}
                                key={item.id}
                                className="bgDark"
                              >
                                <td className="phone">8974-8743</td>
                                <td className="role">₦ 54,000</td>
                                <td className="statusTd">
                                  <p className="status active">Auction Won</p>
                                </td>
                                <td className="role">10 Nov, 2021</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <NoProduct msg="No Deals...">
                        <FontAwesomeIcon icon={faCommentSlash} />
                      </NoProduct>
                    )}
                    <div className="pagination-wrap">
                      <Pagination
                        color="primary"
                        onChange={handlePage2}
                        count={
                          deal &&
                          Math.ceil(
                            parseInt(deal._meta.pagination.total_count) / 10
                          )
                        }
                        shape="rounded"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeAction === "selling" && (
                <motion.div
                  variants={moveIn}
                  animate="visible"
                  initial="hidden"
                  className="whiteContainer"
                >
                  <div className="tableHead">
                    <p className="tableTitle">Auction</p>
                    <input type="date" placeholder="" className="search" />
                  </div>

                  <div className="summaryFlex">
                    <SummaryCard
                      icon={clock}
                      increase={true}
                      midText={auction ? auction.data.totalProducts : 0}
                      btmText={"No of Products"}
                      percent={"12%"}
                    />
                    <SummaryCard
                      icon={check}
                      increase={false}
                      midText={auction ? auction.data.totalSold : 0}
                      btmText={"Product sold"}
                      percent={"12%"}
                    />
                    <SummaryCard
                      midText={auction ? auction.data.revenue : 0}
                      currency={"₦"}
                      btmText={"Total Revenue"}
                      isAmount={true}
                    />
                  </div>

                  <div className="overflowTable">
                    <div className="tableHead">
                      <p className="tableTitle">Deals</p>
                    </div>
                    {isStatAuctionError ? (
                      <NoProduct msg="Something is wrong...">
                        <FontAwesomeIcon icon={faCommentSlash} />
                      </NoProduct>
                    ) : isStatAuctionLoading ? (
                      <LoadingTable />
                    ) : auction.data.deals.length ? (
                      <table>
                        <thead>
                          <tr>
                            <th>Item ID</th>
                            <th className="extraTh">Amount</th>
                            <th className="extraTh">Quantity</th>
                            <th className="extraTh">Status</th>

                            <th className="extraTh">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {auction.data.deals.map((item) => {
                            return (
                              <tr key={item.id}>
                                <td className="phone">{item._id}</td>
                                <td className="role">₦ {item.finalPrice}</td>
                                <td>{item.quantity}</td>
                                <td className="statusTd">
                                  <p
                                    className={`status ${
                                      item.status === "pending"
                                        ? "yellow"
                                        : "active"
                                    }`}
                                  >
                                    {item.status}
                                  </p>
                                </td>
                                <td className="role">
                                  {moment(item.createdAt).format("L")}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <NoProduct msg="No Deals...">
                        <FontAwesomeIcon icon={faCommentSlash} />
                      </NoProduct>
                    )}

                    <div className="pagination-wrap">
                      <Pagination
                        color="primary"
                        onChange={handlePage3}
                        count={
                          auction &&
                          Math.ceil(
                            parseInt(auction._meta.pagination.total_count) / 10
                          )
                        }
                        shape="rounded"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AdminDashboardLayout>
  );
};

export default UsersProfile;
