import AdminDashboardLayout from "../../../../component/adminDashboardLayout";
import "./style.scss";

import { useRef, useState } from "react";

import { ReactComponent as Download } from "../../../../assets/icons/download.svg";
import { ReactComponent as Printer } from "../../../../assets/icons/printer.svg";
import product from "../../../../assets/images/product.png";
import { useParams } from "react-router-dom";
import { useGetEachTransactionQuery } from "../../../../services/api";
import moment from "moment";
import {
  formatCurrency,
  moneyFormatter,
  toCurrency,
} from "../../../../utils/utils";
import Pdf from "react-to-pdf";
import Loader from "../../../../component/Loader";
import { motion } from "framer-motion/dist/framer-motion";
import { moveIn } from "../../../../utils/variants";
import { useGetUser } from "../../../../hook/getUserHook";
import Currency from "../../../../component/Currency";
const TransactionDownload = () => {
  const list = [1, 2, 3];
  let { id } = useParams();
  const ref = useRef();
  const { currency } = useGetUser();

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
      {loading ? (
        <Loader />
      ) : (
        <motion.div
          variants={moveIn}
          animate="visible"
          initial="hidden"
          className="pd-transaction-download"
        >
          <div className="topSide">
            <button className="print">
              {" "}
              <Printer className="fill2" /> Print
            </button>

            <Pdf targetRef={ref} filename="code-example.pdf">
              {({ toPdf }) => (
                <button onClick={toPdf} className="download">
                  {" "}
                  <Download className="fill2" /> Download
                </button>
              )}
            </Pdf>
          </div>
          <div ref={ref} className="downloadBox">
            <div className="aboutProduct">
              {/* <img src={product} alt="product" /> */}
              <div className="productText">
                <p className="order">
                  Transaction ID: {transaction && transaction.data._id}
                </p>
                <br />
                <p className="order">
                  Transaction Type:{" "}
                  {transaction && transaction.data.Transactiontype}
                </p>
                {/* <p className="productName">
                  {transaction && transaction.data.item}
                </p> */}
                {/* <p className="auctionName">Automobile Auctions</p> */}
              </div>
            </div>
            <div className="eachOrder">
              <p className="orderTopic">Order Summary</p>
              <div className="flexOrder">
                <p className="left">Date</p>
                <p className="right">
                  {transaction &&
                    moment(transaction.data.createdAt).format("MM/DD/YYYY")}
                </p>
              </div>
              <div className="flexOrder">
                <p className="left">Product price:</p>
                <p className="right">
                  {/* ₦{transaction && formatCurrency(transaction.data.amount)} */}
                  {/* {transaction &&
                    toCurrency(currency, transaction.data?.amount)} */}
                  <Currency
                    country={transaction.data.user.country}
                    price={transaction.data.amount || 0}
                  />
                </p>
              </div>
              {/* <div className="flexOrder">
                <p className="left">Surge:</p>
                <p className="right">₦ 0.00</p>
              </div>
              <div className="flexOrder">
                <p className="left">Sub-Total</p>
                <p className="right green">10 Nov, 2021</p>
              </div> */}
            </div>
            <div className="line"></div>
            <div className="eachOrder">
              <p className="orderTopic">Customer Details</p>
              <div className="flexOrder">
                <p className="left">Customer name:</p>
                <p className="right">
                  {`${transaction && transaction.data.user.firstName} ${
                    transaction && transaction.data.user.lastName
                  }`}
                </p>
              </div>
              <div className="flexOrder">
                <p className="left">Email:</p>
                <p className="right">
                  {transaction && transaction.data.user.email}
                </p>
              </div>
              <div className="flexOrder">
                <p className="left">Phone:</p>
                <p className="right">
                  {transaction && transaction.data.user.mobile}
                </p>
              </div>
            </div>
            {/* <div className="line"></div>
            <div className="eachOrder">
              <p className="orderTopic">Shipping Address</p>
              <div className="flexOrder">
                <p className="left">
                  Address: 235 Ikorodu road, Anthony-iyanaoworo, Lagos state,
                  Nigeria
                </p>
              </div>
            </div> */}
          </div>
        </motion.div>
      )}
    </AdminDashboardLayout>
  );
};

export default TransactionDownload;
