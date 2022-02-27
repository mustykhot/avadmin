/* eslint-disable react-hooks/exhaustive-deps */
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

import SuccessModal from "../../../../component/popModal";
import TableDrop from "../../../../component/TableDrop";

import Phone from "../../../../component/input/phone";
import CreateAdminModal from "../../../../component/ModalPlace/CreateAdminModal";

import {
  useAddAdminMutation,
  useApproveDealMutation,
  useGetAdminsQuery,
  useRejectDealMutation,
  useUpdateMutation,
} from "../../../../services/api";
import { toastr } from "react-redux-toastr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentSlash } from "@fortawesome/free-solid-svg-icons";
import LoadingTable from "../../../../component/loadingTable";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import EnhancedTableHead from "../../../../component/EnhancedTableHead";
import { getComparator, stableSort } from "../../../../utils/utils";
import DropDownWrapper from "../../../../component/DropDownWrapper";
import { IconButton, Pagination } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link } from "react-router-dom";
import NoProduct from "../../../../component/NoProduct";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { moveIn } from "../../../../utils/variants";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";
// dropdown
const SubscribeDropDown = ({ id, setId, setActive, submit }) => (
  <DropDownWrapper
    className="more-actions"
    action={
      <IconButton className="more-action-btn" aria-label="actions">
        <MoreVertIcon />
      </IconButton>
    }
  >
    <button
      onClick={() => {
        setId(id);
        setActive(true);
        // submit();
      }}
      className="btn-noBg"
    >
      Activate
    </button>
    <button
      onClick={() => {
        setId(id);
        setActive(false);
        // submit();
      }}
      className="btn-noBg"
    >
      Deactivate
    </button>
  </DropDownWrapper>
);

const headCells = [
  {
    id: "name",
    label: "Name",
  },
  {
    id: "phone",
    label: "Mobile No",
  },
  {
    id: "role",
    label: "Admin Role",
  },
  {
    id: "status",
    label: "Status",
  },
];

const Administrator = () => {
  const list = [1, 2, 3];
  const [modal, setModal] = useState(false);
  const [modalPop, setModalPop] = useState(false);
  const editAdmin = (id) => {
    closeModal();
  };
  const closeModal = () => {
    setModal(!modal);
  };

  const closeModalPop = () => {
    setModal(!modal);
  };

  // pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const handlePage = (e, value) => {
    setPage(value);
  };

  const {
    data: admins = null,
    isLoading: loading,
    isError,
    error,
  } = useGetAdminsQuery({ search, page });
  console.log(admins, error);

  // table magic
  const [order, setOrder] = useState("");
  const [orderBy, setOrderBy] = useState("");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const [update, { isLoading }] = useUpdateMutation();
  const [id, setId] = useState(null);
  console.log(id, "");
  const [active, setActive] = useState(null);
  useEffect(() => {
    if (id) {
      onSubmit();
    }
  }, [id]);

  const onSubmit = async () => {
    const payload = {
      active: active,
    };
    console.log(payload);

    try {
      // call login trigger from rtk query
      const response = await update({
        credentials: payload,
        id: id,
      }).unwrap();
      console.log(response);
      toastr.success("Success", "Successful");
      setId(null);
    } catch (err) {
      if (err.status === "FETCH_ERROR")
        toastr.error("Error", "Something went wrong, please try again...");
      else toastr.error("Error", err.data._meta.error.message);
    }
  };

  return (
    <AdminDashboardLayout active="admin">
      <div className="pd-admin">
        <AnimatePresence>
          {modal && (
            <CreateAdminModal
              setModalPop={setModalPop}
              closeModal={closeModal}
            />
          )}
        </AnimatePresence>
        {modalPop && (
          <SuccessModal
            closeModal={closeModalPop}
            text={"Administrator created successfully!"}
          />
        )}
        <div className="topicPart">
          <p className="pageTitle">Administrators</p>
          <div className="btnBox">
            {/* <button className="download">
              Download <Fill className="fill" />
            </button> */}
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button btn btn-success mb-3"
              table="table-to-xls"
              filename="Administrators"
              sheet="tablexls"
              buttonText="Download"
            />
            <button onClick={closeModal} className="create">
              Create New Admin
            </button>
          </div>
        </div>

        <div className="whiteContainer">
          <div className="tableHead">
            <p className="tableTitle">Admin Users</p>
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="search"
            />
          </div>

          <div className="downloadTable" style={{ display: "none" }}>
            <table id="table-to-xls">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Admin Role</th>

                  <th className="extraTh">Status</th>
                </tr>
              </thead>
              <tbody>
                {admins &&
                  admins.data.length &&
                  admins.data.map((item) => {
                    return (
                      <tr key={item._id}>
                        <td>
                          {" "}
                          <p className="name">{`${item.firstName} ${item.lastName}`}</p>
                        </td>
                        <td align="left">{item.mobile}</td>
                        <td align="left">{item.userType}</td>
                        <td> {item.active ? "Active" : "Inactive"}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="overflowTable">
            {isError === true ? (
              <NoProduct msg="Something is wrong...">
                <FontAwesomeIcon icon={faCommentSlash} />
              </NoProduct>
            ) : loading ? (
              <LoadingTable />
            ) : admins.data.length ? (
              <motion.div
                variants={moveIn}
                animate="visible"
                initial="hidden"
                className="pd-dashboard"
              >
                <TableContainer>
                  <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                    <EnhancedTableHead
                      headCells={headCells}
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      rowCount={admins.data.length}
                      align="left"
                    />
                    <TableBody>
                      {stableSort(
                        admins.data,
                        getComparator(order, orderBy)
                      ).map((row, index) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row._id}
                          >
                            <TableCell align="left">
                              {" "}
                              <div className="nameDiv">
                                <img
                                  className="userImg"
                                  src={userImg}
                                  alt="user"
                                />
                                <div className="nameBox">
                                  <p className="name">{`${row.firstName} ${row.lastName}`}</p>
                                  <p className="email">{row.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell align="left">{row.mobile}</TableCell>
                            <TableCell align="left">{row.userType}</TableCell>

                            {/* <TableCell align="left">
                            <p
                              className={`status ${
                                row.status === "Deactivated" ||
                                row.status === "Declined"
                                  ? "red"
                                  : row.status === "pending"
                                  ? "yellow"
                                  : "active"
                              }`}
                            >
                              {row.status}
                            </p>
                          </TableCell> */}

                            <TableCell align="left">
                              <p
                                className={`status ${
                                  !row.active ? "red" : "active"
                                }`}
                              >
                                {row.active ? "Active" : "Inactive"}
                              </p>
                            </TableCell>

                            <TableCell className="action" align="left">
                              <SubscribeDropDown
                                setActive={setActive}
                                setId={setId}
                                submit={onSubmit}
                                id={row._id}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </motion.div>
            ) : (
              <NoProduct msg="No Data Yet...">
                <FontAwesomeIcon icon={faCommentSlash} />
              </NoProduct>
            )}
          </div>
          <div className="pagination-wrap">
            <Pagination
              color="primary"
              onChange={handlePage}
              count={
                admins &&
                Math.ceil(parseInt(admins._meta.pagination.total_count) / 10)
              }
              shape="rounded"
            />
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default Administrator;
