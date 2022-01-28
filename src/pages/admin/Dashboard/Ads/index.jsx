import AdminDashboardLayout from "../../../../component/adminDashboardLayout";
import "./style.scss";
import { ReactComponent as Fill } from "../../../../assets/icons/Fill.svg";
import shape from "../../../../assets/icons/shape.svg";
import userImg from "../../../../assets/images/user-img.png";

import { useState } from "react";
import TableDrop from "../../../../component/TableDrop";
import FormHead from "../../../../component/formHead";
import Input from "../../../../component/input";
import Modal from "../../../../component/Modal";
import SubmitBtn from "../../../../component/submitBtn";
import SuccessModal from "../../../../component/popModal";
import { FormProvider, useForm } from "react-hook-form";
import InputField from "../../../../component/input/indexField";

const Ads = () => {
  const list = [1, 2, 3];
  const [isLoadng, setIsLoading] = useState(false);
  const [toggleBtn, setToggleBtn] = useState("auction");
  const methods = useForm();
  const [modal, setModal] = useState(false);
  const [modalPop, setModalPop] = useState(false);
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
  const closeModalPop = () => {
    setModal(!modal);
  };
  return (
    <AdminDashboardLayout active="ads">
      <div className="pd-ads">
        {modal && (
          <Modal>
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="createAdmin"
                action=""
              >
                <FormHead title={"New Campaign"} subTitle={""} />

                <InputField
                  type="text"
                  name="campaign_title"
                  placeholder="Campaign Title"
                  label="Campaign Title"
                  id="campaign_title"
                />

                <InputField
                  type="text"
                  name="url"
                  placeholder="Url"
                  label="Url"
                  id="url"
                />

                <InputField
                  type="date"
                  name="start_date"
                  placeholder="Campaign start date"
                  label="Campaign start date"
                  id="start_date"
                />
                <InputField
                  type="date"
                  name="end_date"
                  placeholder="Campaign end date"
                  label="Campaign end date"
                  id="end_date"
                />

                <SubmitBtn isLoading={isLoadng} btnText="Add Campaign" />
                <button onClick={closeModal} className="cancel">
                  Cancel
                </button>
              </form>
            </FormProvider>
          </Modal>
        )}
        {modalPop && (
          <SuccessModal
            closeModal={closeModalPop}
            text={"Campaign created successfully!"}
          />
        )}
        <div className="topicPart">
          <p className="pageTitle">Ads Manager</p>
          <div className="btnBox">
            <button onClick={closeModal} className="create">
              Add Campaign
            </button>
          </div>
        </div>

        <div className="whiteContainer">
          <div className="tableHead">
            <p className="tableTitle">Posted Campaign</p>
            <input type="text" placeholder="Search" className="search" />
          </div>

          <div className="overflowTable">
            <table>
              <thead>
                <tr>
                  <th>Campaign Title</th>
                  <th className="extraTh">
                    Reach <img src={shape} alt="shape" />{" "}
                  </th>
                  <th className="extraTh">
                    Clicks <img src={shape} alt="shape" />{" "}
                  </th>
                  <th className="extraTh">
                    Date Posted <img src={shape} alt="shape" />{" "}
                  </th>
                  <th className="extraTh">
                    End Date <img src={shape} alt="shape" />{" "}
                  </th>

                  <th className="extraTh">
                    Status <img src={shape} alt="shape" />{" "}
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {list.map((item) => {
                  return (
                    <tr>
                      <td className="nameTd">
                        <div className="nameDiv">
                          <img className="userImg" src={userImg} alt="user" />
                          <div className="nameBox">
                            <p className="name">Emeka Phillips</p>
                            <p className="email">emeka.phillips@gmail.com</p>
                          </div>
                        </div>
                      </td>
                      <td>345</td>
                      <td className="phone">23</td>
                      <td className="role">10 Nov, 2021</td>
                      <td className="role">10 Nov, 2021</td>
                      <td className="statusTd">
                        <p className="status active">Active</p>
                      </td>
                      <td className="action">
                        <TableDrop extra={true} />
                      </td>
                    </tr>
                  );
                })}
                <tr></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default Ads;
