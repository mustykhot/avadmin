import AdminDashboardLayout from "../../../../component/adminDashboardLayout";
import "./style.scss";

import { useState } from "react";

import { ReactComponent as Download } from "../../../../assets/icons/download.svg";
import { ReactComponent as Printer } from "../../../../assets/icons/printer.svg";
import product from "../../../../assets/images/product.png";
import { useParams } from "react-router-dom";
import { useGetEachTransactionQuery } from "../../../../services/api";
import moment from "moment";
import { moneyFormatter } from "../../../../utils/utils";
const TransactionDownload = () => {
  const list = [1, 2, 3];
  let { id } = useParams();

  const [isLoadng, setIsLoading] = useState(false);
  const [toggleBtn, setToggleBtn] = useState("auction");
  const handleToggle = (type) => {
    setToggleBtn(type);
  };
  const onSubmit = (vals) => {
    console.log(vals);
    setIsLoading(false);
  };
  const {
    data: transaction = null,
    isLoading: loading,
    isError,
    error,
  } = useGetEachTransactionQuery(id);
  console.log(transaction);
  return (
    <AdminDashboardLayout active="transaction">
      <div className="pd-transaction-download">
        <div className="topSide">
          <button className="print">
            {" "}
            <Printer className="fill2" /> Print
          </button>
          <button className="download">
            {" "}
            <Download className="fill2" /> Download
          </button>
        </div>
        <div className="downloadBox">
          <div className="aboutProduct">
            <img src={product} alt="product" />
            <div className="productText">
              <p className="order">
                Order ID: {transaction && transaction._id}
              </p>
              <p className="productName">{transaction && transaction.item}</p>
              <p className="auctionName">Automobile Auctions</p>
            </div>
          </div>
          <div className="eachOrder">
            <p className="orderTopic">Order Summary</p>
            <div className="flexOrder">
              <p className="left">Date</p>
              <p className="right">
                {transaction &&
                  moment(transaction.createdAt).format("MM/DD/YYYY")}
              </p>
            </div>
            <div className="flexOrder">
              <p className="left">Product price:</p>
              <p className="right">
                ₦{transaction && moneyFormatter(transaction.amount)}
              </p>
            </div>
            <div className="flexOrder">
              <p className="left">Surge:</p>
              <p className="right">₦ 0.00</p>
            </div>
            <div className="flexOrder">
              <p className="left">Sub-Total</p>
              <p className="right green">10 Nov, 2021</p>
            </div>
          </div>
          <div className="line"></div>
          <div className="eachOrder">
            <p className="orderTopic">Customer Details</p>
            <div className="flexOrder">
              <p className="left">Customer name:</p>
              <p className="right">
                {`${transaction && transaction.user.firstName} ${
                  transaction && transaction.user.lastName
                }`}
              </p>
            </div>
            <div className="flexOrder">
              <p className="left">Email:</p>
              <p className="right">{transaction && transaction.user.email}</p>
            </div>
            <div className="flexOrder">
              <p className="left">Phone:</p>
              <p className="right">{transaction && transaction.user.phone}</p>
            </div>
          </div>
          <div className="line"></div>
          <div className="eachOrder">
            <p className="orderTopic">Shipping Address</p>
            <div className="flexOrder">
              <p className="left">
                Address: 235 Ikorodu road, Anthony-iyanaoworo, Lagos state,
                Nigeria
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default TransactionDownload;
