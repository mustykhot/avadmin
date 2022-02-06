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
        data: [40, 60],
      },
    ],
  };

  const donughtData = {
    labels: ["Luxury Auctions", "Automobile Auctions", "Property Auctions"],

    datasets: [
      {
        label: "",
        borderWidth: 1,
        backgroundColor: ["#F98B2D", "#285ED3", "#FBCC40"],
        data: [30, 50, 20],
      },
    ],
  };

  return (
    <AdminDashboardLayout active="dashboard">
      <div className="pd-dashboard">
        <div className="topicPart">
          <p className="pageTitle">Dashboard</p>
          <div className="btnBox">
            <button className="download">
              Download <Fill className="fill" />
            </button>
          </div>
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
            midText={"4,510"}
            btmText={"Total No Users"}
            increase={"none"}
            isFour={true}
          />
          <SummaryCard
            icon={monitor}
            midText={"3521"}
            btmText={"Total Products"}
            increase={"none"}
            isFour={true}
          />
          <SummaryCard
            icon={cart}
            midText={"3,003,999"}
            increase={"none"}
            btmText={"Total Transactions"}
            isFour={true}
          />
          <SummaryCard
            midText={"530,504,000"}
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
                    <span className="red"></span>Auctions (214,345)
                  </p>
                  <p className="percent">37%</p>
                </div>
                <div className="eachInfo">
                  <p className="info-detail">
                    <span className="blue"></span>Buy Now (23,890)
                  </p>
                  <p className="percent">37%</p>
                </div>
              </div>
            </div>
          </div>
          <div className="sellers-wrap">
            <div className="section-head">
              <p className="title">Top Sellers</p>
              <select name="" id="">
                <option value="">Individual</option>
              </select>
            </div>
            <div className="top-wrap">
              {[1, 2, 3, 4].map((item) => {
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
                  <tr>
                    <td>8974-8743</td>
                    <td>₦ 2,400,000</td>
                    <td className="status">
                      <p className="fail">Fail</p>
                    </td>
                    <td className="date">10/11/2021, 5:34 pm</td>
                  </tr>
                  <tr>
                    <td>8974-8743</td>
                    <td>₦ 2,400,000</td>
                    <td className="status">
                      <p className="succes">SuccessFul</p>
                    </td>
                    <td className="date">10/11/2021, 5:34 pm</td>
                  </tr>
                  <tr>
                    <td>8974-8743</td>
                    <td>₦ 2,400,000</td>
                    <td className="status">
                      <p className="succes">SuccessFul</p>
                    </td>
                    <td className="date">10/11/2021, 5:34 pm</td>
                  </tr>
                  <tr>
                    <td>8974-8743</td>
                    <td>₦ 2,400,000</td>
                    <td className="status">
                      <p className="fail">Fail</p>
                    </td>
                    <td className="date">10/11/2021, 5:34 pm</td>
                  </tr>
                  <tr>
                    <td>8974-8743</td>
                    <td>₦ 2,400,000</td>
                    <td className="status">
                      <p className="fail">Fail</p>
                    </td>
                    <td className="date">10/11/2021, 5:34 pm</td>
                  </tr>
                </tbody>
              </table>
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
                <div className="eachInfo">
                  <p className="info-detail">
                    <span className="red"></span>Luxury Auctions
                  </p>
                  <p className="percent">37%</p>
                </div>
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
                </div>
              </div>
            </div>
          </div>
          <div className="sellers-wrap">
            <div className="section-head">
              <p className="title">Admin Activities</p>
              <select name="" id="">
                <option value="">Individual</option>
              </select>
            </div>
            <div className="top-wrap">
              {[1, 2, 3, 4, 5].map((item) => {
                return (
                  <TopSeller
                    key={item}
                    name={"Carrie Thompson Balogun"}
                    email={"Has joined the team"}
                    image={top}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default Dashboard;
