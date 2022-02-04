import AdminDashboardLayout from "../../../../component/adminDashboardLayout";
import "./style.scss";
import { ReactComponent as Fill } from "../../../../assets/icons/Fill.svg";

import shape from "../../../../assets/icons/shape.svg";

import { useState } from "react";

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
import {
  useGetEachTransactionQuery,
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
    data: wallet = null,
    isLoading: isWallet,
    isError: isWalletError,
    error: walletError,
  } = useGetWalletQuery(id);
  console.log(wallet, "wallet");
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
                  <button>Suspend</button>
                  <button>Activate</button>
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
                    midText={"12"}
                    btmText={"Auctions participated"}
                    percent={"12%"}
                  />
                  <SummaryCard
                    icon={check}
                    increase={false}
                    midText={"12"}
                    btmText={"Winning Bids"}
                    percent={"12%"}
                  />
                  <SummaryCard
                    midText={"530,504,000"}
                    currency={"₦"}
                    btmText={"Total Amount Spent"}
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
                    midText={"12"}
                    btmText={"No of Products"}
                    percent={"12%"}
                  />
                  <SummaryCard
                    icon={check}
                    increase={false}
                    midText={"12"}
                    btmText={"Product sold"}
                    percent={"12%"}
                  />
                  <SummaryCard
                    midText={"530,504,000"}
                    currency={"₦"}
                    btmText={"Total Amount Spent"}
                    isAmount={true}
                  />
                </div>

                <div className="overflowTable">
                  <div className="tableHead">
                    <p className="tableTitle">Sales Performance</p>
                  </div>
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
                          Quantity <img src={shape} alt="shape" />{" "}
                        </th>

                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((item) => {
                        return (
                          <tr>
                            <td className="phone">8974-8743</td>
                            <td className="role">₦ 54,000</td>
                            <td className="statusTd">
                              <p className="status active">In-stock</p>
                            </td>
                            <td className="role">5</td>

                            <td className="action">
                              <TableDrop extra={true} />
                            </td>
                          </tr>
                        );
                      })}
                      <tr></tr>
                    </tbody>
                  </table>
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
