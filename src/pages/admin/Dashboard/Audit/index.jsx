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
import { useForm } from "react-hook-form";
import { useGetAuditQuery } from "../../../../services/api";
import NoProduct from "../../../../component/NoProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentSlash } from "@fortawesome/free-solid-svg-icons";
import LoadingTable from "../../../../component/loadingTable";
import moment from "moment";
const Audit = () => {
  const list = [1, 2, 3];
  const [isLoadng, setIsLoading] = useState(false);
  const [toggleBtn, setToggleBtn] = useState("auction");
  const { register, formState, handleSubmit } = useForm();
  const [modal, setModal] = useState(false);
  const [modalPop, setModalPop] = useState(false);
  const handleToggle = (type) => {
    setToggleBtn(type);
  };
  const onSubmit = (vals) => {
    console.log(vals);
    setIsLoading(false);
  };
  const {
    data: audit = [],
    isLoading: loading,
    isError,
    error,
  } = useGetAuditQuery();
  console.log(audit, "audit");

  return (
    <AdminDashboardLayout active="audit">
      <div className="pd-audit">
        <div className="topicPart">
          <p className="pageTitle">Audit Activities</p>
        </div>

        <div className="whiteContainer">
          <div className="tableHead">
            <p className="tableTitle">Audit logs</p>
            <div className="otherBox">
              <input type="text" placeholder="Search" className="search" />
              <input type="date" />
              <input type="date" />
            </div>
          </div>

          <div className="overflowTable">
            {isError ? (
              <NoProduct msg="There is a problem...">
                <FontAwesomeIcon icon={faCommentSlash} />
              </NoProduct>
            ) : loading ? (
              <LoadingTable />
            ) : !audit.rows ? (
              <NoProduct msg="No Audit Yet">
                <FontAwesomeIcon icon={faCommentSlash} />
              </NoProduct>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th className="left">Campaign Title</th>
                    <th className="extraTh right">
                      Time <img src={shape} alt="shape" />{" "}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {audit.rows.map((item) => {
                    return (
                      <tr>
                        <td className="left">
                          {/* <b>Give admin access to “Ads manager</b> <br />{" "}
                            <br />
                            Carrie Thompson Balogun | Non-financial admin */}
                          <b>{item.auditLog}</b>
                        </td>

                        <td className="right">
                          {moment(item.createdAt).fromNow()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default Audit;
