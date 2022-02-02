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
const Transaction = () => {
  const [toggleBtn, setToggleBtn] = useState("auction");
  const [page, setPage] = useState(1);
  const handleToggle = (type) => {
    setToggleBtn(type);
  };
  const navigate = useNavigate();
  const {
    data: transaction = [],
    isLoading: loading,
    isError,
    error,
  } = useGetTransactionQuery(page);
  console.log(transaction);
  const view = (id) => {
    navigate(`/transaction/details/${id}`);
  };

  const handlePage = (e, newPage) => {
    setPage(newPage);
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
      id: "product",
      label: "Products Name",
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
            <button className="download">
              Download <Fill className="fill" />
            </button>
          </div>
        </div>

        {/* <div className="transactionNav">
          <button
            onClick={() => {
              handleToggle("auction");
            }}
            className={`auction ${toggleBtn === "auction" ? "active" : ""}`}
          >
            Auction
          </button>
          <button
            onClick={() => {
              handleToggle("payment");
            }}
            className={`payment ${toggleBtn === "payment" ? "active" : ""}`}
          >
            Instant Payments
          </button>
        </div> */}

        <div style={{ marginTop: "30px" }} className="whiteContainer">
          {/* <div className="tableHead">
            <p className="tableTitle">Admin Users</p>
            <input type="text" placeholder="Search" className="search" />
          </div> */}

          <div className="overflowTable">
            {!isError ? (
              loading ? (
                <LoadingTable />
              ) : transaction.rows.length ? (
                <TableContainer>
                  <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                    <EnhancedTableHead
                      headCells={headCells}
                      // numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      // onSelectAllClick={handleSelectAllClick}
                      onRequestSort={handleRequestSort}
                      rowCount={transaction.rows.length}
                      align="left"
                    />
                    <TableBody>
                      {stableSort(
                        transaction.rows,
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
                                <img
                                  className="userImg"
                                  src={userImg}
                                  alt="user"
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
                            <TableCell align="left">{item.item}</TableCell>
                            <TableCell align="left">
                              ₦ {moneyFormatter(item.amount)}
                            </TableCell>
                            <TableCell align="left">
                              {moment(item.createdAt).format("MM/DD/YYYY")}
                            </TableCell>

                            <TableCell align="left">
                              <p
                                className={`status ${
                                  item.status === "paid" ? "active" : "red"
                                }`}
                              >
                                {item.status}
                              </p>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  <div className="pagination-wrap">
                    <Pagination
                      color="primary"
                      onChangePage={handlePage}
                      count={transaction.total}
                      defaultPage={1}
                      shape="rounded"
                    />
                  </div>
                </TableContainer>
              ) : (
                // <table>
                //   <thead>
                //     <tr>
                //       <th>ID</th>
                //       <th>Customer</th>
                //       <th>Product Name</th>
                //       <th className="extraTh">
                //         Amount <img src={shape} alt="shape" />{" "}
                //       </th>
                //       <th className="extraTh">
                //         Date <img src={shape} alt="shape" />{" "}
                //       </th>
                //       <th className="extraTh">
                //         Status <img src={shape} alt="shape" />{" "}
                //       </th>
                //       <th></th>
                //     </tr>
                //   </thead>
                //   <tbody>
                //     {transaction.rows.map((item) => {
                //       return (
                //         <tr
                //           onClick={() => {
                //             view(item.id);
                //           }}
                //           style={{ cursor: "pointer" }}
                //         >
                //           <td>{truncateString(item._id, 7)}</td>
                //           <td className="nameTd">
                //             <div className="nameDiv">
                //               <img className="userImg" src={userImg} alt="user" />
                //               <div className="nameBox">
                //                 <p className="name">Emeka Phillips</p>
                //                 <p className="email">emeka.phillips@gmail.com</p>
                //               </div>
                //             </div>
                //           </td>
                //           <td className="phone">Toyota Camry 2012</td>
                //           <td className="role">
                //             ₦ {moneyFormatter(item.amount)}
                //           </td>
                //           <td className="role">
                //             {moment(item.createdAt).format("MM/DD/YYYY")}
                //           </td>
                //           <td className="statusTd">
                //             <p
                //               className={`status ${
                //                 item.status === "paid" ? "active" : "red"
                //               }`}
                //             >
                //               {item.status}
                //             </p>
                //           </td>
                //           {/* <td className="action">
                //             <TableDrop extra={true} />
                //           </td> */}
                //         </tr>
                //       );
                //     })}
                //     <tr></tr>
                //   </tbody>
                // </table>
                <NoProduct msg="No Data Yet...">
                  <FontAwesomeIcon icon={faCommentSlash} />
                </NoProduct>
              )
            ) : (
              <NoProduct msg="There is a problem...">
                <FontAwesomeIcon icon={faCommentSlash} />
              </NoProduct>
            )}
            {/* {toggleBtn === "auction" && (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Product Name</th>
                    <th className="extraTh">
                      Amount <img src={shape} alt="shape" />{" "}
                    </th>
                    <th className="extraTh">
                      Date <img src={shape} alt="shape" />{" "}
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
                        <td>#84253</td>
                        <td className="nameTd">
                          <div className="nameDiv">
                            <img className="userImg" src={userImg} alt="user" />
                            <div className="nameBox">
                              <p className="name">Emeka Phillips</p>
                              <p className="email">emeka.phillips@gmail.com</p>
                            </div>
                          </div>
                        </td>
                        <td className="phone">Toyota Camry 2012</td>
                        <td className="role">₦ 54,000</td>
                        <td className="role">10 Nov, 2021</td>
                        <td className="statusTd">
                          <p className="status active">Paid</p>
                        </td>
                  
                      </tr>
                    );
                  })}
                  <tr></tr>
                </tbody>
              </table>
            )} */}
            {/* {toggleBtn === "payment" && (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Product Name</th>
                    <th className="extraTh">
                      Amount <img src={shape} alt="shape" />{" "}
                    </th>
                    <th className="extraTh">
                      Date <img src={shape} alt="shape" />{" "}
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
                        <td>#84253</td>
                        <td className="nameTd">
                          <div className="nameDiv">
                            <img className="userImg" src={userImg} alt="user" />
                            <div className="nameBox">
                              <p className="name">Emeka Phillips</p>
                              <p className="email">emeka.phillips@gmail.com</p>
                            </div>
                          </div>
                        </td>
                        <td className="phone">Toyota Camry 2012</td>
                        <td className="role">₦ 54,000</td>
                        <td className="role">10 Nov, 2021</td>
                        <td className="statusTd">
                          <p className="status active">Paid</p>
                        </td>
                      </tr>
                    );
                  })}
                  <tr></tr>
                </tbody>
              </table>
            )} */}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default Transaction;
