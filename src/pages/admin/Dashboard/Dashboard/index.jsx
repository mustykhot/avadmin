/* eslint-disable array-callback-return */
import AdminDashboardLayout from "../../../../component/adminDashboardLayout";
import SummaryCard from "../../../../component/SummaryCard";
import "./style.scss";
import userImg from "../../../../assets/icons/user.svg";
import monitor from "../../../../assets/icons/monitor.svg";
import cart from "../../../../assets/icons/shopping-cart.svg";
import { ReactComponent as Fill } from "../../../../assets/icons/Fill.svg";
import { Line, Doughnut, Pie } from "react-chartjs-2";
import "./style.scss";
import top from "../../../../assets/images/top.png";
import { useState } from "react";
import DateRange from "../../../../component/DateRange";
import TopSeller from "../../../../component/TopSeller";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentSlash } from "@fortawesome/free-solid-svg-icons";
import { toCurrency } from "../../../../utils/utils";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useGetDashQuery } from "../../../../services/api";
// import ErrorMsg from "../../../../component/ErrorMsg";
import { useGetUser } from "../../../../hook/getUserHook";
import Loader from "../../../../component/Loader";
import NoProduct from "../../../../component/NoProduct";
import moment from "moment";
import { motion } from "framer-motion/dist/framer-motion";
import { moveIn } from "../../../../utils/variants";
import Currency from "../../../../component/Currency";
const Dashboard = () => {
  const [newDate, setNewDate] = useState("");
  const { user } = useGetUser();
  console.log(user);
  const handleSetDate = (dateRange) => {
    setNewDate({
      startDate: dateRange[0].startDate,
      endDate: dateRange[0].endDate,
    });
  };
  console.log(newDate, "pop");

  // get category
  const {
    data: dash = null,
    isLoading,
    isError,
    error,
  } = useGetDashQuery(newDate);
  console.log(dash, "dash");

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
  );

  const LineData = {
    labels: dash ? dash.data.lineChart.month : [],

    datasets: [
      {
        label: "Chart",
        data: dash ? dash.data.lineChart.data : [],
        borderColor: "#f98b2d",
        backgroundColor: "#F98B2D",
      },
    ],
  };

  const pieData = {
    labels: ["Auction", "Buy Now"],

    datasets: [
      {
        label: "",
        weight: 1,
        backgroundColor: ["#F98B2D", "#285ED3"],
        data: dash ? [dash.data.auction, dash.data.buyNow] : [0, 0],
      },
    ],
  };

  const donughtData = {
    labels: dash
      ? dash.data.topSellingCategory.length
        ? dash.data.topSellingCategory.map((item, el) => {
            if (el < 3) {
              return item.categoryName;
            } else {
              return "";
            }
          })
        : [0]
      : [0],

    datasets: [
      {
        label: "",
        borderWidth: 1,
        backgroundColor: ["#F98B2D", "#285ED3", "#FBCC40"],
        data: dash
          ? dash.data.topSellingCategory.length
            ? dash.data.topSellingCategory.map((item, el) => {
                if (el < 3) {
                  return item.totalCount;
                }
              })
            : [0]
          : [0],
      },
    ],
  };

  // if (isLoading) {
  //   return <Loader />;
  // }
  // if (isError) {
  //   return <ErrorMsg error={error} />;
  // }
  if (isError) {
    return <p>errror</p>;
  }

  const getPercent = (calc, total) => {
    if (total !== 0) {
      let perc = (calc / total) * 100;

      return perc;
    } else {
      return 0;
    }
  };

  return (
    <AdminDashboardLayout active="dashboard">
      {isLoading ? (
        <Loader />
      ) : (
        <motion.div
          variants={moveIn}
          animate="visible"
          initial="hidden"
          className="pd-dashboard"
        >
          <div className="topicPart">
            <p className="pageTitle">Dashboard</p>
            {/* <div className="btnBox">
            <button className="download">
              Download <Fill className="fill" />
            </button>
          </div> */}
          </div>
          <div className="topicPart sub">
            <p className="subTitle">General Report</p>
            <div className="btnBox">
              <DateRange handle={handleSetDate} position={`-700px`} />
            </div>
          </div>
          <div className="summaryFlex">
            <SummaryCard
              icon={userImg}
              midText={dash ? (dash.data ? dash.data.totalUsers : 0) : 0}
              btmText={"Total No Users"}
              increase={"none"}
              isFour={true}
            />
            <SummaryCard
              icon={monitor}
              midText={dash ? (dash.data ? dash.data.totalProducts : 0) : 0}
              btmText={"Total Products"}
              increase={"none"}
              isFour={true}
            />
            <SummaryCard
              icon={cart}
              midText={dash ? (dash.data ? dash.data.totalTransactions : 0) : 0}
              increase={"none"}
              btmText={"Total Transactions"}
              isFour={true}
            />

            <SummaryCard
              // midText={
              //   auction ? toCurrency(currency, auction.data.revenue) : 0
              // }
              currency={"N"}
              btmText={"Total Revenue"}
              isAmount={true}
              isFour={true}
            >
              {" "}
              <Currency
                country={user.country}
                price={dash ? (dash.data ? dash.data.totalRevenue : 0) : 0}
              />
            </SummaryCard>
          </div>
          <div className="mid-wrap">
            <div className="transaction-card-wrap">
              <div className="section-head">
                <p className="title">Transaction Activities</p>
                {/* <DateRange handle={handleSetDate} position={"-350px"} /> */}
              </div>
              <div className="double-graph">
                <div className="top-wrap">
                  <div className="money-wrap">
                    {/* <div className="transact">
                      <p className="money">₦ 940,000,000</p>
                      <p className="text">Total Transaction</p>
                    </div>
                    <div className="auction-money">
                      <p className="money">₦30,000</p>
                      <p className="circle ">
                        <span className="blue"></span> Buy Now{" "}
                      </p>
                    </div>
                    <div className="auction-money">
                      <p className="money">₦30,000</p>
                      <p className="circle">
                        <span></span> Auctions{" "}
                      </p>
                    </div> */}
                  </div>
                  {/* <select name="" id="" className="filter">
                    <option value="">Filter by category</option>
                  </select> */}
                </div>
                <div className="line-graph">
                  <Line
                    // options={options}
                    data={LineData}
                    options={{
                      title: {
                        display: false,
                        text: "",
                        fontSize: 10,
                      },
                      // cutout: 100,
                      maintainAspectRatio: false,
                      legend: {
                        display: true,
                        position: "right",
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="selling-wrap">
              <div className="section-head">
                <p className="title">Top Selling</p>
              </div>

              <div className="pieDisplay pie">
                <Pie
                  data={pieData}
                  options={{
                    title: {
                      display: false,

                      fontSize: 10,
                    },

                    legend: {
                      display: false,
                    },
                  }}
                />
                <div className="chatInfo">
                  <div className="eachInfo">
                    <p className="info-detail">
                      <span className="red"></span>Auctions{" "}
                      {dash ? dash.data.auction : 0}
                    </p>
                    <p className="percent">
                      {dash
                        ? getPercent(
                            dash.data.auction,
                            dash.data.auction + dash.data.buyNow
                          )
                        : 0}
                      %
                    </p>
                  </div>
                  <div className="eachInfo">
                    <p className="info-detail">
                      <span className="blue"></span>Buy Now{" "}
                      {dash ? dash.data.auction : 0}
                    </p>
                    <p className="percent">
                      {" "}
                      {dash
                        ? getPercent(
                            dash.data.buyNow,
                            dash.data.auction + dash.data.buyNow
                          )
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="sellers-wrap">
              <div className="section-head">
                <p className="title">Top Sellers</p>
                {/* <select name="" id="">
                <option value="">Individual</option>
              </select> */}
              </div>
              <div className="top-wrap">
                {dash ? (
                  !dash.data.topSellers.length ? (
                    <NoProduct msg="No Data Yet...">
                      <FontAwesomeIcon icon={faCommentSlash} />
                    </NoProduct>
                  ) : (
                    dash.data.topSellers.map((item, i) => {
                      if (i < 4) {
                        return (
                          <TopSeller
                            key={i}
                            name={item.user.firstName + "" + item.user.lastName}
                            email={item.user.email}
                            sales={item.totalCount}
                            image={item.user.avatar}
                          />
                        );
                      }
                    })
                  )
                ) : (
                  <NoProduct msg="No Data Yet...">
                    <FontAwesomeIcon icon={faCommentSlash} />
                  </NoProduct>
                )}
              </div>
            </div>
          </div>
          <div className="mid-wrap">
            <div className="transaction-card-wrap">
              <div className="section-head">
                <p className="title">Recent Activities</p>
              </div>
              <div className="recent-table">
                {dash ? (
                  dash.data.recentTransaction.length ? (
                    <table>
                      <thead>
                        <tr>
                          <th>Transaction ID</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dash.data.recentTransaction.map((item, el) => {
                          if (el < 5) {
                            return (
                              <tr key={item.id}>
                                <td> {item.id} </td>
                                <td>
                                  {/* {toCurrency(currency, item?.amount)} */}
                                  <Currency
                                    country={item.user.country}
                                    price={item.amount || 0}
                                  />
                                </td>
                                <td>
                                  <p className={`status ${item.status}`}>
                                    {item.status.toLowerCase()}
                                  </p>
                                </td>
                                <td className="date">
                                  {moment(item.createdAt).format("L")},{" "}
                                  {moment(item.createdAt).format("LT")}
                                </td>
                              </tr>
                            );
                          }
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <NoProduct msg="No Data Yet...">
                      <FontAwesomeIcon icon={faCommentSlash} />
                    </NoProduct>
                  )
                ) : (
                  <NoProduct msg="No Data Yet...">
                    <FontAwesomeIcon icon={faCommentSlash} />
                  </NoProduct>
                )}
              </div>
            </div>
            <div className="selling-wrap">
              <div className="section-head">
                <p className="title">Top Selling category</p>
              </div>
              <div className="pieDisplay doughnut">
                <Doughnut
                  data={donughtData}
                  options={{
                    cutout: 40,
                  }}
                />
                <div className="chatInfo">
                  {dash
                    ? dash.data.topSellingCategory.length
                      ? dash.data.topSellingCategory.map((item, el) => {
                          if (el < 3) {
                            return (
                              <div key={el} className="eachInfo">
                                <p className="info-detail">
                                  <span
                                    className={
                                      el === 1
                                        ? "red"
                                        : el === 2
                                        ? "blue"
                                        : "orange"
                                    }
                                  ></span>
                                  {item.categoryName}
                                </p>
                                {/* <p className="percent">{
                                getPercent(item.totalCount,  )
                              }</p> */}
                              </div>
                            );
                          }
                        })
                      : ""
                    : ""}
                  {/* 
                <div className="eachInfo">
                  <p className="info-detail">
                    <span className="blue"></span>Automobile Auctions
                  </p>
                  <p className="percent">37%</p>
                </div>
                <div className="eachInfo">
                  <p className="info-detail">
                    <span className="orange"></span>Property Auctions
                  </p>
                  <p className="percent">37%</p>
                </div> */}
                </div>
              </div>
            </div>
            <div className="sellers-wrap">
              <div className="section-head">
                <p className="title">Admin Activities</p>
                {/* <select name="" id="">
                <option value="">Individual</option>
              </select> */}
              </div>
              <div className="top-wrap">
                {dash && !dash.data.adminActivities.length ? (
                  <NoProduct msg="No Data Yet...">
                    <FontAwesomeIcon icon={faCommentSlash} />
                  </NoProduct>
                ) : (
                  dash.data.adminActivities.map((item, el) => {
                    if (el < 5) {
                      return (
                        <TopSeller
                          key={item._id}
                          name={item.user.firstName + "" + item.user.lastName}
                          email={item.auditLog}
                          image={item.user.avatar}
                        />
                      );
                    }
                  })
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AdminDashboardLayout>
  );
};

export default Dashboard;
