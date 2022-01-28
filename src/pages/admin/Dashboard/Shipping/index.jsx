import AdminDashboardLayout from "../../../../component/adminDashboardLayout";
import "./style.scss";
import { ReactComponent as Fill } from "../../../../assets/icons/Fill.svg";
import shape from "../../../../assets/icons/shape.svg";
import userImg from "../../../../assets/images/user-img.png";

import { useState } from "react";
import TableDrop from "../../../../component/TableDrop";
import { useNavigate } from "react-router-dom";

const Shipping = () => {
  const list = [1, 2, 3];

  const [isLoadng, setIsLoading] = useState(false);
  const [toggleBtn, setToggleBtn] = useState("regular");
  const [show, setShow] = useState(false);

  const onSubmit = (vals) => {
    console.log(vals);
    setIsLoading(false);
  };
  const navigate = useNavigate();

  const view = (id) => {
    navigate(`/shipping/${id}`);
  };

  return (
    <AdminDashboardLayout active="shipping">
      <div className="pd-shipping">
        <div className="topicPart">
          <p className="pageTitle">Shipping</p>
          <div className="btnBox">
            <button className="download">
              Download <Fill className="fill" />
            </button>
          </div>
        </div>

        <div className="whiteContainer">
          <div className="tableHead">
            <p className="tableTitle">Shipping</p>
            <input type="text" placeholder="Search" className="search" />
          </div>

          <div className="overflowTable">
            <table className="four">
              <thead>
                <tr>
                  <th>Product Details</th>

                  <th className="extraTh">
                    Amount <img src={shape} alt="shape" />{" "}
                  </th>

                  <th className="extraTh">
                    Date <img src={shape} alt="shape" />{" "}
                  </th>
                  <th className="extraTh">Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {list.map((item) => {
                  return (
                    <tr
                      onClick={() => {
                        view(item);
                      }}
                    >
                      <td className="nameTd">
                        <div className="nameDiv">
                          <img className="userImg" src={userImg} alt="user" />
                          <div className="nameBox">
                            <p className="name">Emeka Phillips</p>
                            <p className="email">emeka.phillips@gmail.com</p>
                          </div>
                        </div>
                      </td>

                      <td className="role">₦ 54,000</td>

                      <td className="role timeTd">
                        10 Nov, 2021 <br />
                        <p className="time green">2:45</p>
                      </td>
                      <td className="statusTd">
                        <p className="status active">Active</p>
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

export default Shipping;
