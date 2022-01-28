import AdminDashboardLayout from "../../../../component/adminDashboardLayout";
import "./style.scss";
import { ReactComponent as Fill } from "../../../../assets/icons/Fill.svg";
import shape from "../../../../assets/icons/shape.svg";
import userImg from "../../../../assets/images/user-img.png";

import { useState } from "react";
import Modal from "../../../../component/Modal";
import FormHead from "../../../../component/formHead";
import Input from "../../../../component/input";
import { useForm } from "react-hook-form";
import SubmitBtn from "../../../../component/submitBtn";
import Select from "../../../../component/input/selectt";
import SuccessModal from "../../../../component/popModal";
import TableDrop from "../../../../component/TableDrop";
import Phone from "../../../../component/input/phone";
const Account = () => {
  const list = [1, 2, 3];
  const [modal, setModal] = useState(false);
  const [modalPop, setModalPop] = useState(false);
  const { register, formState, handleSubmit } = useForm();
  const [isLoadng, setIsLoading] = useState(false);
  const closeModal = () => {
    setModal(!modal);
  };
  const closeModalPop = () => {
    setModalPop(!modal);
  };

  const onSubmit = (vals) => {
    console.log(vals);
    setIsLoading(false);
  };
  const [phone, setPhone] = useState("");
  const roleOption = [
    {
      label: "None Financial",
      value: "none",
    },
    {
      label: "None Financial2",
      value: "none2",
    },
  ];
  return (
    <AdminDashboardLayout active="account">
      <div className="pd-account">
        {modalPop && (
          <SuccessModal
            closeModal={closeModalPop}
            text={"Administrator created successfully!"}
          />
        )}
        <div className="topicPart">
          <p className="pageTitle">Account Setting</p>
        </div>

        <div className="whiteContainer">
          <div className="coverSetting">
            <div className="left">
              <p className="leftHead">Change Password</p>
              <form action="">
                {/* <Input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  label="Email"
                  id="email"
                  register={register}
                  errors={formState.errors}
                  errMsg="invalid email input"
                /> */}

                <Input
                  type="password"
                  name="password"
                  label="Current Password"
                  placeholder="Current Password"
                  id="password"
                  register={register}
                  errors={formState.errors}
                  errMsg="invalid password"
                />
                <Input
                  type="password"
                  name="password"
                  label="New Password"
                  placeholder="New Password"
                  id="password"
                  register={register}
                  errors={formState.errors}
                  errMsg="invalid password"
                />

                <Input
                  type="password"
                  name="password"
                  label="Confirm Password"
                  placeholder="Confirm Password"
                  id="password"
                  register={register}
                  errors={formState.errors}
                  errMsg="invalid password"
                />
                <SubmitBtn isLoading={isLoadng} btnText="Save" />
              </form>
            </div>
            <div className="left">
              <p className="leftHead">Profile Details</p>
              <form action="">
                <div className="group">
                  <div className="halfInput">
                    <Input
                      type="text"
                      name="firstname"
                      placeholder="Firstname"
                      label="Firstname"
                      id="firstname"
                      register={register}
                      errors={formState.errors}
                      errMsg="invalid input"
                    />
                  </div>
                  <div className="halfInput">
                    <Input
                      type="text"
                      name="lastname"
                      placeholder="Lastname"
                      label="Lastname"
                      id="lastname"
                      register={register}
                      errors={formState.errors}
                      errMsg="invalid input"
                    />
                  </div>
                </div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  label="Email"
                  id="email"
                  register={register}
                  errors={formState.errors}
                  errMsg="invalid email input"
                />

                <Phone
                  label={"Mobile no"}
                  telVal={phone}
                  setTelVal={setPhone}
                />

                <SubmitBtn isLoading={isLoadng} btnText="Update" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default Account;
