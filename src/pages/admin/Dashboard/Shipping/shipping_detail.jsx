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
const ShippingDetail = () => {
  const list = [1, 2, 3];

  const [isLoadng, setIsLoading] = useState(false);
  const [toggleBtn, setToggleBtn] = useState("auction");
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState(false);
  const { register, formState, handleSubmit } = useForm();

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
  return (
    <AdminDashboardLayout active="shipping">
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
      <div className="pd-shippingDetail">
        <div className="downloadBox">
          <div className="aboutProduct">
            <img src={product} alt="product" />
            <div className="productText">
              <p className="order">Order ID: #3834425</p>
              <p className="productName">
                2008 Gcc Mitsubishi Pajero Gls157515kms
              </p>
              <p className="auctionName">Automobile Auctions</p>
            </div>
          </div>
          <div className="line"></div>
          <div className="eachOrder">
            <p className="orderTopic">Shipping Summary</p>
            <div className="flexOrder">
              <p className="left">Status</p>
              <p className="right red">Pending</p>
            </div>
            <div className="flexOrder">
              <p className="left">Date Posted:</p>
              <p className="right">10 Nov, 2021</p>
            </div>
            <div className="flexOrder">
              <p className="left">End Date:</p>
              <p className="right">10 Nov, 2021</p>
            </div>
          </div>
          <div className="line"></div>
          <div className="eachOrder">
            <p className="orderTopic">Customer Details</p>
            <div className="flexOrder">
              <p className="left">Customer name:</p>
              <p className="right">
                <b>Guaranty Trust Bank Plc</b>
              </p>
            </div>
            <div className="flexOrder">
              <p className="left">Contact Email:</p>
              <p className="right">
                {" "}
                <b>emeka.phillips@gmail.com</b>{" "}
              </p>
            </div>
            <div className="flexOrder">
              <p className="left">Phone:</p>
              <p className="right">
                {" "}
                <b>+2348098765432</b>{" "}
              </p>
            </div>
          </div>
          <div className="line"></div>
          <div className="eachOrder">
            <p className="orderTopic">Vendor Details</p>
            <div className="flexOrder">
              <p className="left">Vendor name:</p>
              <p className="right">
                <b>Guaranty Trust Bank Plc</b>
              </p>
            </div>
            <div className="flexOrder">
              <p className="left">Contact Email:</p>
              <p className="right">
                {" "}
                <b>emeka.phillips@gmail.com</b>{" "}
              </p>
            </div>
            <div className="flexOrder">
              <p className="left">Phone:</p>
              <p className="right">
                {" "}
                <b>+2348098765432</b>{" "}
              </p>
            </div>
          </div>
          <div className="about_vendor">
            <div className="location">
              <p className="title">Vendor Location</p>
              <p className="desc">
                Abeokuta North <br /> Ogun state, Nigeria
              </p>
            </div>
            <div className="location">
              <p className="title">Shipping Address</p>
              <p className="desc">
                Address: 235 Ikorodu road, Anthony- <br /> iyanaoworo. <br />{" "}
                Lagos state
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default ShippingDetail;
