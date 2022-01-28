import AdminDashboardLayout from "../../../../component/adminDashboardLayout";
import "./style.scss";
import { ReactComponent as Fill } from "../../../../assets/icons/Fill.svg";

import { useState } from "react";

import cardImg from "../../../../assets/images/cardimg.png";
import map from "../../../../assets/icons/map.svg";
import prod from "../../../../assets/images/prod.png";
import naira from "../../../../assets/icons/naira.svg";
const TransactionDetail = () => {
  const list = [1, 2, 3];

  const [isLoadng, setIsLoading] = useState(false);
  const [toggleBtn, setToggleBtn] = useState("auction");
  const handleToggle = (type) => {
    setToggleBtn(type);
  };
  const onSubmit = (vals) => {
    console.log(vals);
    setIsLoading(false);
  };

  return (
    <AdminDashboardLayout active="transaction">
      <div className="pd-transaction_detail">
        <div className="topicPart">
          <p className="pageTitle">Transactions Details</p>
          <div className="btnBox">
            <button className="download">
              Download <Fill className="fill" />
            </button>
          </div>
        </div>

        <div className="whiteContainer">
          <p className="title">10 Nov, 2021, 10:45pm</p>
          <p className="subTitle">Order ID: #3834425</p>
          <div className="cards">
            <div className="eachCard">
              <img src={cardImg} alt="card" className="leftBox" />
              <div className="rightBox">
                <p className="cardTitle">Customer</p>
                <div className="cardText">
                  <p className="name">Martha Beasley</p>
                  <p className="name">emeka.phillips@gmail.com</p>
                  <p className="name">+2348098765432</p>
                </div>
              </div>
            </div>
            <div className="eachCard">
              <div className="leftBox map">
                <img src={map} alt="map" />
              </div>
              <div className="rightBox">
                <p className="cardTitle">Billing Address</p>
                <div className="cardText">
                  <p className="name">
                    235 Ikorodu road, Anthony-iyanaoworo, Lagos state, Nigeria
                  </p>
                </div>
              </div>
            </div>
            <div className="eachCard blue">
              <div className="leftBox naira">
                <img src={naira} alt="naira" />
              </div>
              <div className="rightBox">
                <p className="cardTitle">Billing Address</p>
                <div className="cardText">
                  <div className="productFlex">
                    <p className="left">Product price:</p>
                    <p className="right">₦ 54,000,000</p>
                  </div>
                  <div className="productFlex">
                    <p className="left">Surge:</p>
                    <p className="right">₦ 0.00</p>
                  </div>
                  <div className="productFlex">
                    <p className="left">Status:</p>
                    <p className="right">Paid</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="product_detail">
            <div className="left">
              <p className="head">Product name</p>
              <div className="product_about">
                <img src={prod} alt="prod" />
                <div className="aboutBox">
                  <p className="name">
                    2008 Gcc Mitsubishi Pajero Gls157515kms
                  </p>
                  <p className="subName">Automobile Auctions</p>
                </div>
              </div>
              <div className="desc">
                <p className="head">Product description</p>
                <p className="story">
                  The Pajero's history traces to 1934 with the Mitsubishi PX33
                  prototype commissioned for the Japanese Government. Mitsubishi
                  presented the first Pajero prototype at the Tokyo Motor Show
                  in November 1973 [10] then Pajero II prototype followed in
                  1978, five years later
                </p>
              </div>
            </div>
            <div className="bidding">
              <p className="biddingHead">Top Bidding History</p>
              <div className="eachBidding">
                <div className="bidImg">
                  <p>EP</p>
                </div>
                <div className="aboutBid">
                  <div className="det">
                    <p className="name">Emeka Phillips</p>
                    <p className="money green">₦ 54,000,000</p>
                  </div>
                  <div className="det">
                    <p className="date">10 Nov, 2021</p>
                    <p className="win">Winning Bid</p>
                  </div>
                </div>
              </div>
              <div className="eachBidding">
                <div className="bidImg">
                  <p>EP</p>
                </div>
                <div className="aboutBid">
                  <div className="det">
                    <p className="name">Emeka Phillips</p>
                    <p className="money">₦ 54,000,000</p>
                  </div>
                  <div className="det">
                    <p className="date">10 Nov, 2021</p>
                    <p className="win">Winning Bid</p>
                  </div>
                </div>
              </div>
              <div className="eachBidding">
                <div className="bidImg">
                  <p>EP</p>
                </div>
                <div className="aboutBid">
                  <div className="det">
                    <p className="name">Emeka Phillips</p>
                    <p className="money">₦ 54,000,000</p>
                  </div>
                  <div className="det">
                    <p className="date">10 Nov, 2021</p>
                    <p className="win">Winning Bid</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default TransactionDetail;
