import AdminDashboardLayout from "../../../../component/adminDashboardLayout";
import "./style.scss";
import { ReactComponent as Fill } from "../../../../assets/icons/Fill.svg";
import shape from "../../../../assets/icons/shape.svg";
import userImg from "../../../../assets/images/user-img.png";

import { useState } from "react";
import Modal from "../../../../component/Modal";
import FormHead from "../../../../component/formHead";
import Input from "../../../../component/input";
import { FormProvider, useForm } from "react-hook-form";
import SubmitBtn from "../../../../component/submitBtn";
import Select from "../../../../component/input/selectt";
import SuccessModal from "../../../../component/popModal";
import TableDrop from "../../../../component/TableDrop";
import Phone from "../../../../component/input/phone";
import { ReactComponent as Loka } from "../../../../assets/icons/loka.svg";
import { ReactComponent as Circ } from "../../../../assets/icons/circ.svg";
import InputField from "../../../../component/input/indexField";
import RajiFile from "../../../../component/input/RajiFile";
import {
  useUpdateMutation,
  useUpdatePasswordMutation,
} from "../../../../services/api";
import { toastr } from "react-redux-toastr";
import { useSelector } from "react-redux";
import uploadImg from "../../../../hook/UploadImg";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
const Plan = () => {
  const list = [1, 2, 3];
  const [modal, setModal] = useState(false);
  const [modalPop, setModalPop] = useState(false);
  const methods = useForm();

  const [isLoadng, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [imgupload, setImgUpload] = useState("");
  const [update, { isLoading }] = useUpdateMutation();

  const closeModal = () => {
    setModal(!modal);
  };
  const closeModalPop = () => {
    setModalPop(!modal);
  };
  const { user } = useSelector((state) => state.auth);
  const [updatePassword, { isLoading: passLoading }] =
    useUpdatePasswordMutation();
  const onSubmit = async (vals) => {
    let url = await uploadImg(vals.image[0], "n3mtymsx");

    const payload = {
      ...vals,
      mobile: phone,
      image: url.secure_url,
    };
    console.log(payload);
    setIsLoading(false);

    try {
      // call login trigger from rtk query
      const response = await update({
        credentials: payload,
        id: user.id,
      }).unwrap();
      console.log(response);
      toastr.success("Success", "Successful");
    } catch (err) {
      if (err.status === "FETCH_ERROR")
        toastr.error("Error", "Something went wrong, please try again...");
      else toastr.error("Error", err.data._meta.error.message);
    }
  };

  const onSubmit2 = async (vals) => {
    console.log(vals);
    setIsLoading(false);
    const payload = {
      currentPassword: vals.password,
      password: vals.newPassword,
    };

    try {
      // call login trigger from rtk query
      const response = await updatePassword(payload).unwrap();
      console.log(response);
      toastr.success("Success", "Successful");
    } catch (err) {
      if (err.status === "FETCH_ERROR")
        toastr.error("Error", "Something went wrong, please try again...");
      else toastr.error("Error", err.data._meta.error.message);
    }
  };
  const [recent, setRecent] = useState("");
  const [selector, setSelector] = useState([]);
  const addSelector = (type) => {
    setSelector([...selector, type]);
    setRecent("");
  };
  const removeSelector = (type) => {
    let newSelect = selector.filter((item) => {
      return item !== type;
    });
    setSelector(newSelect);
  };
  return (
    <AdminDashboardLayout active="account">
      <div className="pd-plan">
        {modalPop && (
          <SuccessModal
            closeModal={closeModalPop}
            text={"Created successfully!"}
          />
        )}
        <div className="topicPart">
          <p className="pageTitle">Create Plan</p>
        </div>

        <div className="flexPart">
          <div className="whiteGuy">
            <div className="coverForm">
              <FormProvider {...methods}>
                <form
                  onSubmit={methods.handleSubmit(onSubmit)}
                  // className="loginBox2"
                  action=""
                >
                  <FormHead title={"Profile Details"} />
                  <InputField
                    type="text"
                    name="name"
                    placeholder="Plan name"
                    label="Plan name"
                    id="name"
                    errMsg="invalid input"
                  />
                  <InputField
                    type="number"
                    name="amount"
                    placeholder=""
                    label="Amount"
                    id="amount"
                    errMsg="invalid input"
                  />
                  <div className="form-group">
                    <label htmlFor=""> Add Features</label>
                    <div className="input-icon-wrap">
                      <input
                        value={recent}
                        onChange={(e) => {
                          setRecent(e.target.value);
                        }}
                        type="text"
                      />
                    </div>
                    <Button
                      onClick={() => {
                        addSelector(recent);
                      }}
                      startIcon={<AddIcon />}
                    >
                      Add more
                    </Button>
                  </div>

                  <div className="listSelected">
                    {selector.map((item) => {
                      return (
                        <div className="box">
                          <p>{item}</p>{" "}
                          <p
                            onClick={() => {
                              removeSelector(item);
                            }}
                            className="can"
                          >
                            x
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <SubmitBtn isLoading={isLoading} btnText="Create" />
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default Plan;
