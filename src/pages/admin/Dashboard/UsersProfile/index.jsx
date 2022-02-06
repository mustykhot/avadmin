import AdminDashboardLayout from "../../../../component/adminDashboardLayout";
import "./style.scss";
import { ReactComponent as Fill } from "../../../../assets/icons/Fill.svg";

import shape from "../../../../assets/icons/shape.svg";

import { useEffect, useState } from "react";

import TableDrop from "../../../../component/TableDrop";
import userProfile from "../../../../assets/images/userprofile.png";
import { Link, useParams } from "react-router-dom";
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
  useGetEachTransactionQuery,
  useGetSellingQuery,
  useGetSellingStatQuery,
  useUpdateMutation,
  useGetUserDealQuery,
  useGetUserQuery,
  useGetUserTransQuery,
  useGetWalletQuery,
} from "../../../../services/api";
import LoadingTable from "../../../../component/loadingTable";
import moment from "moment";
const UsersProfile = () => {
  const list = [1, 2, 3];
  const [show, setShow] = useState(false);
  const [activeAction, setActiveAction] = useState("overview");
  const handleActiveAction = (type) => {
    setActiveAction(type);
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
  } = useGetUserTransQuery(id);
  console.log(transaction, "trans");

  const {
    data: deal = null,
    isLoading: isDealLoading,
    isError: isdealError,
    error: dealError,
  } = useGetUserDealQuery(id);
  console.log(deal, "deal");

  const {
    data: statAuction = null,
    isLoading: isStatAuction,
    isError: isStatAuctionError,
    error: statErrorAuction,
  } = useGetSellingStatQuery(id);
  console.log(statAuction, "statAuction");

  const {
    data: wallet = null,
    isLoading: isWallet,
    isError: isWalletError,
    error: walletError,
  } = useGetWalletQuery(id);
  console.log(wallet, "wallet");

  const {
    data: selling = null,
    isLoading: isSelling,
    isError: isSellingError,
    error: sellingError,
  } = useGetSellingQuery(id);
  console.log(selling, "selling");

  const {
    data: stat = null,
    isLoading: isStat,
    isError: isStatError,
    error: statError,
  } = useGetSellingStatQuery(id);
  console.log(stat, "stat");

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
      if (err.data) toastr.error("Error", err.data.message);
      else toastr.error("Error", "Something went wrong, please try again...");
    }
  };

  return (
    <AdminDashboardLayout active="user">
      <div className="pd-userprofile">
        <div className="topicPart">
          <p className="pageTitle">Customer’s Profile</p>
        </div>

        <div className="profileFlex">
          <ProfileBox
            name={user && `${user.firstName} ${user.lastName}`}
            email={user && user.email}
            account={id}
            tel={user && user.phone}
            billing={
              " 235 Ikorodu road, Anthony-iyanaoworo, Lagos state, Nigeria"
            }
            img={user && user.image}
          />

          <div className="activityBox">
            <div className="userNav">
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
                  Selling
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
              <div className="whiteContainer">
                <div className="tableHead">
                  <p className="tableTitle">Transactions</p>
                  <input type="date" placeholder="" className="search" />
                </div>

                <div className="summaryFlex">
                  <SummaryCard
                    icon={trendingUp}
                    currency={"₦"}
                    increase={true}
                    midText={"4,000"}
                    btmText={"Total Expense"}
                    percent={"12%"}
                  />
                  <SummaryCard
                    icon={trendingUp}
                    currency={"₦"}
                    increase={false}
                    midText={"4,000"}
                    btmText={"Total Expense"}
                    percent={"12%"}
                  />
                  <SummaryCard
                    midText={wallet && wallet.data.balance}
                    currency={"₦"}
                    btmText={"Wallet Balance"}
                    isAmount={true}
                  />
                </div>

                <div className="overflowTable">
                  <div className="tableHead">
                    <p className="tableTitle">Recent Activities</p>
                  </div>
                  {!isLoading ? (
                    !transaction ? (
                      <NoProduct msg="No Transactions...">
                        <FontAwesomeIcon icon={faCommentSlash} />
                      </NoProduct>
                    ) : transaction.data.rows ? (
                      <table>
                        <thead>
                          <tr>
                            <th>Transaction ID</th>
                            <th>Mobile No</th>
                            <th className="extraTh">
                              Amount <img src={shape} alt="shape" />{" "}
                            </th>
                            <th className="extraTh">
                              Status <img src={shape} alt="shape" />{" "}
                            </th>
                            <th className="extraTh">
                              Date <img src={shape} alt="shape" />{" "}
                            </th>

                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {transaction.data.rows.map((item) => {
                            return (
                              <tr key={item.id}>
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

                                <td className="action">
                                  <TableDrop extra={true} />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <NoProduct msg="No Transactions...">
                        <FontAwesomeIcon icon={faCommentSlash} />
                      </NoProduct>
                    )
                  ) : (
                    <LoadingTable />
                  )}
                </div>
              </div>
            )}
            {activeAction === "auction" && (
              <div className="whiteContainer">
                <div className="tableHead">
                  <p className="tableTitle">Auction Activities</p>
                  <input type="date" placeholder="" className="search" />
                </div>

                <div className="summaryFlex">
                  <SummaryCard
                    icon={clock}
                    increase={true}
                    midText={statAuction ? statAuction.data.totalItem : 0}
                    btmText={"Auctions participated"}
                    percent={"12%"}
                  />
                  <SummaryCard
                    icon={check}
                    increase={false}
                    midText={statAuction ? statAuction.data.totalSold : 0}
                    btmText={"Total Sold"}
                    percent={"12%"}
                  />
                  <SummaryCard
                    midText={statAuction ? statAuction.data.totalRevenue : 0}
                    currency={"₦"}
                    btmText={"Total Revenue"}
                    isAmount={true}
                  />
                </div>

                <div className="overflowTable">
                  <div className="tableHead">
                    <p className="tableTitle">Auction Participated</p>
                  </div>
                  {!isLoading ? (
                    !deal ? (
                      <NoProduct msg="No Deals...">
                        <FontAwesomeIcon icon={faCommentSlash} />
                      </NoProduct>
                    ) : deal.userDeals ? (
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

                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {deal.userDeals.map((item) => {
                            return (
                              <tr key={item.id}>
                                <td className="phone">8974-8743</td>
                                <td className="role">₦ 54,000</td>
                                <td className="statusTd">
                                  <p className="status active">Auction Won</p>
                                </td>
                                <td className="role">10 Nov, 2021</td>

                                <td className="action">
                                  <TableDrop extra={true} />
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
                    )
                  ) : (
                    <LoadingTable />
                  )}
                </div>
              </div>
            )}

            {activeAction === "selling" && (
              <div className="whiteContainer">
                <div className="tableHead">
                  <p className="tableTitle">Selling</p>
                  <input type="date" placeholder="" className="search" />
                </div>

                <div className="summaryFlex">
                  <SummaryCard
                    icon={clock}
                    increase={true}
                    midText={stat ? stat.data.totalItem : 0}
                    btmText={"No of Products"}
                    percent={"12%"}
                  />
                  <SummaryCard
                    icon={check}
                    increase={false}
                    midText={stat ? stat.data.totalSold : 0}
                    btmText={"Product sold"}
                    percent={"12%"}
                  />
                  <SummaryCard
                    midText={stat ? stat.data.totalRevenue : 0}
                    currency={"₦"}
                    btmText={"Total Revenue"}
                    isAmount={true}
                  />
                </div>

                <div className="overflowTable">
                  <div className="tableHead">
                    <p className="tableTitle">Sales Performance</p>
                  </div>
                  {!isSelling ? (
                    !selling ? (
                      <NoProduct msg="No Products...">
                        <FontAwesomeIcon icon={faCommentSlash} />
                      </NoProduct>
                    ) : selling.products ? (
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
                          {selling.products.map((item) => {
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
                    )
                  ) : (
                    <LoadingTable />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default UsersProfile;
