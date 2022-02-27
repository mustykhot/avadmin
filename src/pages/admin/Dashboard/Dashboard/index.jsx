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
import { formatCurrency } from "../../../../utils/utils";
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
import ErrorMsg from "../../../../component/ErrorMsg";
import Loader from "../../../../component/Loader";
import NoProduct from "../../../../component/NoProduct";
import moment from "moment";
import { motion } from "framer-motion/dist/framer-motion";
import { moveIn } from "../../../../utils/variants";
const Dashboard = () => {
  const [newDate, setNewDate] = useState([{}]);
  const handleSetDate = (dateRange) => {
    setNewDate([
      {
        startDate: dateRange[0].startDate,
        endDate: dateRange[0].endDate,
      },
    ]);
  };
  const labels = ["January", "February", "March", "April", "May"];
  const options = {
    responsive: true,
    plugins: {
      legend: {},
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
  };

  // get category
  const { data: dash = null, isLoading, isError, error } = useGetDashQuery();
  console.log(dash, "dash");

  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",

        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Dataset 2",

        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
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
    labels,

    datasets: [
      {
        label: "set 1",
        data: [1, 2, 3, 4, 5],
        borderColor: "#f98b2d",
        backgroundColor: "#F98B2D",
      },
      {
        label: "Dataset 2",
        data: [1, 4, 6, 2, 5],
        borderColor: "#285ED3",
        backgroundColor: "#285ED3",
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
        data: dash ? [dash.data.stats.auction, dash.data.stats.buyNow] : [0, 0],
      },
    ],
  };

  const donughtData = {
    labels: dash
      ? dash.data.stats.topSellingCategory.length
        ? dash.data.stats.topSellingCategory.map((item, el) => {
            if (el < 3) {
              return item.categoryName;
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
          ? dash.data.stats.topSellingCategory.length
            ? dash.data.stats.topSellingCategory.map((item, el) => {
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
    let perc = (calc / total) * 100;

    return perc;
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
              midText={dash ? (dash.data ? dash.data.stats.totalUsers : 0) : 0}
              btmText={"Total No Users"}
              increase={"none"}
              isFour={true}
            />
            <SummaryCard
              icon={monitor}
              midText={
                dash ? (dash.data ? dash.data.stats.totalProducts : 0) : 0
              }
              btmText={"Total Products"}
              increase={"none"}
              isFour={true}
            />
            <SummaryCard
              icon={cart}
              midText={
                dash ? (dash.data ? dash.data.stats.totalTransactions : 0) : 0
              }
              increase={"none"}
              btmText={"Total Transactions"}
              isFour={true}
            />
            <SummaryCard
              midText={
                dash ? (dash.data ? dash.data.stats.totalRevenue : 0) : 0
              }
              currency={"₦"}
              btmText={"Total Revenue"}
              isAmount={true}
              isFour={true}
            />
          </div>
          <div className="mid-wrap">
            <div className="transaction-card-wrap">
              <div className="section-head">
                <p className="title">Transaction Activities</p>
                <DateRange handle={handleSetDate} position={"-350px"} />
              </div>
              <div className="double-graph">
                <div className="top-wrap">
                  <div className="money-wrap">
                    <div className="transact">
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
                    </div>
                  </div>
                  <select name="" id="" className="filter">
                    <option value="">Filter by category</option>
                  </select>
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
                      {dash ? dash.data.stats.auction : 0}
                    </p>
                    <p className="percent">
                      {dash
                        ? getPercent(
                            dash.data.stats.auction,
                            dash.data.stats.auction + dash.data.stats.buyNow
                          )
                        : 0}
                      %
                    </p>
                  </div>
                  <div className="eachInfo">
                    <p className="info-detail">
                      <span className="blue"></span>Buy Now{" "}
                      {dash ? dash.data.stats.auction : 0}
                    </p>
                    <p className="percent">
                      {" "}
                      {dash
                        ? getPercent(
                            dash.data.stats.buyNow,
                            dash.data.stats.auction + dash.data.stats.buyNow
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
                {dash &&
                  dash.data.stats.topSellers.map((item) => {
                    return (
                      <TopSeller
                        key={item}
                        name={"Carrie Thompson Balogun"}
                        email={"emeka.phillips@gmail.com"}
                        sales={1343}
                        image={top}
                      />
                    );
                  })}
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
                  dash.data.stats.recentTransaction.length ? (
                    <table>
                      <thead>
                        <tr>
                          <th>Transaction ID</th>
                          <th>
                            Amount <img src="" alt="" />{" "}
                          </th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dash.data.stats.recentTransaction.map((item, el) => {
                          if (el < 5) {
                            return (
                              <tr key={item.id}>
                                <td> {item.id} </td>
                                <td>₦ {formatCurrency(item.amount)}</td>
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
                    ? dash.data.stats.topSellingCategory.length
                      ? dash.data.stats.topSellingCategory.map((item, el) => {
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
                {dash && !dash.data.stats.adminActivities.length ? (
                  <NoProduct msg="No Data Yet...">
                    <FontAwesomeIcon icon={faCommentSlash} />
                  </NoProduct>
                ) : (
                  dash.data.stats.adminActivities.map((item, el) => {
                    if (el < 5) {
                      return (
                        <TopSeller
                          key={item._id}
                          name={"Carrie Thompson Balogun"}
                          email={"Has joined the team"}
                          image={top}
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
