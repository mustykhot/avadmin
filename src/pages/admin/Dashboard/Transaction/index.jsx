import AdminDashboardLayout from "../../../../component/adminDashboardLayout";
import "./style.scss";
import { ReactComponent as Fill } from "../../../../assets/icons/Fill.svg";
import shape from "../../../../assets/icons/shape.svg";
import userImg from "../../../../assets/images/user-img.png";

import { useState } from "react";
import { useGetTransactionQuery } from "../../../../services/api";
import LoadingTable from "../../../../component/loadingTable";
import NoProduct from "../../../../component/NoProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentSlash } from "@fortawesome/free-solid-svg-icons";
import {
  moneyFormatter,
  truncateString,
  stableSort,
  getComparator,
  formatCurrency,
  toCurrency,
} from "../../../../utils/utils";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import EnhancedTableHead from "../../../../component/EnhancedTableHead";
import Pagination from "@mui/material/Pagination";
import { Avatar } from "@mui/material";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { moveIn } from "../../../../utils/variants";
import { motion } from "framer-motion/dist/framer-motion";
import { useGetUser } from "../../../../hook/getUserHook";
const Transaction = () => {
  const [toggleBtn, setToggleBtn] = useState("auction");
  const { currency } = useGetUser();
  const [page, setPage] = useState(1);
  const handleToggle = (type) => {
    setToggleBtn(type);
  };
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const {
    data: transaction = null,
    isLoading: loading,
    isError,
    error,
  } = useGetTransactionQuery({ page, search });
  console.log(transaction);
  const view = (id) => {
    navigate(`/transaction/details/${id}`);
  };

  const handlePage = (e, value) => {
    setPage(value);
  };

  // table head
  const headCells = [
    {
      id: "id",
      label: "ID",
    },
    {
      id: "customer",
      label: "Customer",
    },
    {
      id: "amount",
      label: "Amount",
    },
    {
      id: "date",
      label: "Date",
    },

    {
      id: "status",
      label: "Status",
    },
  ];
  // table magic
  const [order, setOrder] = useState("");
  const [orderBy, setOrderBy] = useState("");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleView = (id) => {
    navigate(`/transaction/details/${id}`);
  };

  return (
    <AdminDashboardLayout active="transaction">
      <div className="pd-transaction">
        <div className="topicPart">
          <p className="pageTitle">Transactions List</p>
          <div className="btnBox">
            {/* <button className="download">
              Download <Fill className="fill" />
            </button> */}

            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button btn btn-success mb-3"
              table="table-to-xls"
              filename="transactions"
              sheet="tablexls"
              buttonText="Download"
            />
          </div>
        </div>

        <div style={{ marginTop: "30px" }} className="whiteContainer">
          <div className="tableHead">
            <p className="tableTitle">All Transactions</p>
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
                  <th>ID</th>
                  <th>Customer</th>

                  <th className="extraTh">Amount</th>

                  <th className="extraTh">Date</th>

                  <th className="extraTh">Status</th>
                </tr>
              </thead>
              <tbody>
                {transaction &&
                  transaction.data.length &&
                  transaction.data.map((item) => {
                    return (
                      <tr>
                        <td>{truncateString(item._id, 7)}</td>
                        <td>
                          {item.user.firstName}
                          {item.user.lastName}
                        </td>

                        <td>₦ {formatCurrency(item.amount)}</td>
                        <td>{moment(item.createdAt).format("MM/DD/YYYY")}</td>

                        <td>{item.status}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="overflowTable">
            {!isError ? (
              loading ? (
                <LoadingTable />
              ) : transaction.data.length ? (
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
                        // numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        // onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={transaction.data.length}
                        align="left"
                      />
                      <TableBody>
                        {stableSort(
                          transaction.data,
                          getComparator(order, orderBy)
                        ).map((item) => {
                          return (
                            <TableRow
                              hover
                              tabIndex={-1}
                              key={item._id}
                              onClick={() => {
                                handleView(item._id);
                              }}
                            >
                              <TableCell align="left">
                                {truncateString(item.id, 10)}
                              </TableCell>
                              <TableCell align="left">
                                <div className="nameDiv">
                                  <Avatar
                                    alt={"user"}
                                    src={item.user.image}
                                    sx={{ width: 35, height: 35 }}
                                  />

                                  <div className="nameBox">
                                    <p className="name">
                                      {item.user.firstName}
                                      {item.user.lastName}
                                    </p>

                                    <p className="email">{item.user.email}</p>
                                  </div>
                                </div>
                              </TableCell>

                              <TableCell align="left">
                                {/* ₦ {moneyFormatter(item.amount)} */}

                                {toCurrency(currency, item?.amount)}
                              </TableCell>
                              <TableCell align="left">
                                {moment(item.createdAt).format("MM/DD/YYYY")}
                              </TableCell>

                              <TableCell align="left">
                                <p className={`status ${item.status}`}>
                                  {item.status.toLowerCase()}
                                </p>
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
              )
            ) : (
              <NoProduct msg="There is a problem...">
                <FontAwesomeIcon icon={faCommentSlash} />
              </NoProduct>
            )}
          </div>
          <div className="pagination-wrap">
            <Pagination
              color="primary"
              onChange={handlePage}
              count={
                transaction &&
                Math.ceil(
                  parseInt(transaction._meta.pagination.total_count) / 10
                )
              }
              defaultPage={1}
              shape="rounded"
            />
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default Transaction;
