import AdminDashboardLayout from "../../../../component/adminDashboardLayout";
import "./style.scss";

import { useState } from "react";
import arrow from "../../../../assets/icons/arrow2.svg";
import { ReactComponent as Download } from "../../../../assets/icons/download.svg";
import { ReactComponent as Printer } from "../../../../assets/icons/printer.svg";
import product from "../../../../assets/images/product.png";
import FormHead from "../../../../component/formHead";
import SubmitBtn from "../../../../component/submitBtn";
import Modal from "../../../../component/Modal";
import Textarea from "../../../../component/input/textarea";
import { useForm } from "react-hook-form";
import { useGetOneDealQuery } from "../../../../services/api";
import { useParams } from "react-router-dom";
import Loader from "../../../../component/Loader";
import ErrorMsg from "../../../../component/ErrorMsg";
import { formatCurrency } from "../../../../utils/utils";
import moment from "moment";
const AuctionDetail = () => {
  const [isLoadng, setIsLoading] = useState(false);
  const [toggleBtn, setToggleBtn] = useState("auction");
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState(false);
  const { register, formState, handleSubmit } = useForm();
  const { id } = useParams();
  const {
    data: deal = null,
    isLoading,
    isError,
    error,
  } = useGetOneDealQuery(id);

  console.log(deal);

  const handleToggle = (type) => {
    setToggleBtn(type);
  };
  const onSubmit = (vals) => {
    console.log(vals);
    setIsLoading(false);
  };
  const closeModal = () => {
    setModal(!modal);
  };
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <ErrorMsg error={error} />;
  }
  return (
    <AdminDashboardLayout active="auction">
      {modal && (
        <Modal>
          <form className="createAdmin" action="">
            <FormHead title={"Create Administrator"} subTitle={""} />

            <Textarea
              name="email"
              placeholder="Enter reason"
              label="Enter reason"
              id="email"
              register={register}
              errors={formState.errors}
              errMsg="invalid input"
            />

            <SubmitBtn isLoading={isLoadng} btnText="Submit" />
            <button onClick={closeModal} className="cancel">
              Cancel
            </button>
          </form>
        </Modal>
      )}
      <div className="pd-auctionDetail">
        <div className="downloadBox">
          <div className="aboutProduct">
            <img src={product} alt="product" />
            <div className="productText">
              <p className="order">Order ID: ${deal && deal.id} </p>
              <p className="productName">
                {deal
                  ? deal.product
                    ? deal.product.productName
                    : "N/A"
                  : "N/A"}
              </p>
              <p className="auctionName">{deal && deal.dealType}</p>
            </div>
          </div>
          <div className="line"></div>
          <div className="eachOrder">
            <p className="orderTopic">Auction Summary</p>
            <div className="flexOrder">
              <p className="left">Status</p>
              <div className="status-drop">
                <p
                  onClick={() => {
                    setShow(!show);
                  }}
                  className={`status ${deal && deal.status}`}
                >
                  {deal && deal.status}
                  <img src={arrow} alt="arrow" />
                </p>
                <div className={`actionPop moreLeft ${show ? "show" : ""}`}>
                  <button className="pop">Approve</button>
                  <button onClick={closeModal} className="pop">
                    Reject
                  </button>
                </div>
              </div>
            </div>
            <div className="flexOrder">
              <p className="left">Date Posted:</p>
              <p className="right">
                {deal && moment(deal.datePosted).format("L")}
              </p>
            </div>
            <div className="flexOrder">
              <p className="left">End Date:</p>
              <p className="right">
                {deal && moment(deal.endDate).format("L")}
              </p>
            </div>
          </div>
          <div className="line"></div>
          <div className="eachOrder">
            <p className="orderTopic">Trader Details</p>
            <div className="flexOrder">
              <p className="left">Customer name:</p>
              <p className="right">
                <b>
                  {deal
                    ? deal.user
                      ? `${deal.user.firstName} ${deal.user.lastName}`
                      : "N/A"
                    : "N/A"}
                  c
                </b>
              </p>
            </div>
            <div className="flexOrder">
              <p className="left">Contact Email:</p>
              <p className="right">
                {" "}
                <b>
                  {deal ? (deal.user ? deal.user.email : "N/A") : "N/A"}
                </b>{" "}
              </p>
            </div>
            <div className="flexOrder">
              <p className="left">Phone:</p>
              <p className="right">
                {" "}
                <b>
                  {deal ? (deal.user ? deal.user.phone : "N/A") : "N/A"}
                </b>{" "}
              </p>
            </div>
          </div>
          <div className="line"></div>
          <div className="eachOrder">
            <p className="orderTopic">Auction Activities</p>
            <div className="flexOrder">
              <p className="left">Based Price:</p>
              <p className="right">
                ₦{" "}
                {deal && deal.product
                  ? formatCurrency(deal.product.price)
                  : "0,00"}
              </p>
            </div>
            <div className="flexOrder">
              <p className="left">Max Increment:</p>
              <p className="right">
                ₦ {deal ? (deal.product ? deal.product.price : "N/A") : "N/A"}
              </p>
            </div>
            <div className="flexOrder">
              <p className="left">Highest Bid:</p>
              <p className="right green">
                ₦ {deal ? (deal.product ? deal.product.price : "N/A") : "N/A"}
              </p>
            </div>
          </div>
          <div className="line"></div>
          <div className="eachOrder">
            <p className="orderTopic">Recent Bidding</p>
            <div className="flexOrder">
              <div className="cover">
                <div className="eachBidding">
                  <img src={product} alt="bid" />
                  <div className="leftBid">
                    <div className="nameBid">
                      <p className="name">Raji Mustapha</p>
                      <p className="price"> ₦ 754,000,000</p>
                    </div>
                    <div className="nameBid">
                      <p className="date">09 Nov -02:32:12</p>
                      <p className="bid">Current Bid</p>
                    </div>
                  </div>
                </div>
                <div className="eachBidding">
                  <img src={product} alt="bid" />
                  <div className="leftBid">
                    <div className="nameBid">
                      <p className="name">Raji Mustapha</p>
                      <p className="price"> ₦ 754,000,000</p>
                    </div>
                    <div className="nameBid">
                      <p className="name">09 Nov -02:32:12</p>
                      <p className="price">Current Bid</p>
                    </div>
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

export default AuctionDetail;
