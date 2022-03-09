import AdminDashboardLayout from "../../../../component/adminDashboardLayout";
import "./style.scss";
import { ReactComponent as Fill } from "../../../../assets/icons/Fill.svg";
import shape from "../../../../assets/icons/shape.svg";
import userImg from "../../../../assets/images/user-img.png";

import { useState } from "react";
import Modal from "../../../../component/Modal";
import FormHead from "../../../../component/formHead";
import { useForm } from "react-hook-form";
import Input from "../../../../component/input";
import SubmitBtn from "../../../../component/submitBtn";
import Select from "../../../../component/input/selectt";
import FormHeadFlex from "../../../../component/formHeadFlex";
import Phone from "../../../../component/input/phone";
import Textarea from "../../../../component/input/textarea";
import saveImg from "../../../../assets/icons/img.svg";
import { useRef } from "react";
import { useNavigate } from "react-router";
import {
  useActivatePrivateDealMutation,
  // useActivateDealMutation,
  useGetAllPrivateBuyDealQuery,
  useGetAllPrivateDealQuery,
} from "../../../../services/api";
import LoadingTable from "../../../../component/loadingTable";
import NoProduct from "../../../../component/NoProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentSlash } from "@fortawesome/free-solid-svg-icons";
import { formatCurrency } from "../../../../utils/utils";
import moment from "moment";
import TableDrop from "../../../../component/TableDrop";
import { toastr } from "react-redux-toastr";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import EnhancedTableHead from "../../../../component/EnhancedTableHead";
import { getComparator, stableSort } from "../../../../utils/utils";
import { IconButton, Pagination } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DropDownWrapper from "../../../../component/DropDownWrapper/index";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { moveIn } from "../../../../utils/variants";
import { motion } from "framer-motion/dist/framer-motion";
// dropdown
export const SubscribeDropDown = ({ id, activateDeal }) => (
  <DropDownWrapper
    className="more-actions"
    action={
      <IconButton className="more-action-btn" aria-label="actions">
        <MoreVertIcon />
      </IconButton>
    }
  >
    {/* <button
      onClick={() => {
        activate(id);
      }}
      className="btn-noBg"
    >
      Activate
    </button> */}

    <button
      onClick={() => {
        activateDeal({ type: false, id: id });
      }}
      className="btn-noBg"
    >
      Deactivate
    </button>

    <button
      onClick={() => {
        activateDeal({ type: true, id: id });
      }}
      className="btn-noBg"
    >
      Activate
    </button>
  </DropDownWrapper>
);

const PrivateDeal = () => {
  const list = [1, 2, 3];

  const [isLoadng, setIsLoading] = useState(false);
  const [toggleBtn, setToggleBtn] = useState("auction");
  const [modal, setModal] = useState(false);
  const { register, formState, handleSubmit } = useForm();
  const [phone, setPhone] = useState("");
  const [imageList, setImageList] = useState([]);
  console.log(imageList);
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

  const [formLevel, setFormLevel] = useState(1);
  const handleFormLevel = (type) => {
    if (type === "add") {
      setFormLevel(formLevel + 1);
    } else {
      setFormLevel(formLevel - 1);
    }
  };

  const navigate = useNavigate();
  const createDeal = () => {
    navigate("/private/form1");
  };
  const [page, setPage] = useState(1);
  const handlePage = (e, value) => {
    setPage(value);
  };
  const [page2, setPage2] = useState(1);
  const handlePage2 = (e, value) => {
    setPage2(value);
  };
  const [search, setSearch] = useState("");
  const [search2, setSearch2] = useState("");

  // get deal
  const {
    data: deal = null,
    isLoading: loading,
    isError,
    error,
  } = useGetAllPrivateDealQuery({ page: page, search });
  console.log(deal);
  // get buynow
  const {
    data: buydeal = null,
    isLoading: buyloading,
    isError: isBuyError,
    error: buyError,
  } = useGetAllPrivateBuyDealQuery({ page: page2, search2 });
  console.log(buydeal);

  // update deal
  const [activateResponse, { isLoading: rejectoading }] =
    useActivatePrivateDealMutation();
  const activateDeal = async ({ type, id }) => {
    let payload = {
      actve: type,
    };
    console.log(payload);
    try {
      const response = await activateResponse({
        credentials: payload,
        id: id,
      }).unwrap();

      toastr.success("Success", response.message);
    } catch (err) {
      if (err.status === "FETCH_ERROR")
        toastr.error("Error", "Something went wrong, please try again...");
      else toastr.error("Error", err.data._meta.error.message);
    }
  };

  const handleSearch = (item) => {
    console.log(item);
  };

  // table head
  const headCells = [
    {
      id: "trader",
      label: "Trader",
    },
    {
      id: "product",
      label: "Product Name",
    },
    {
      id: "base",
      label: "Base Price",
    },
    {
      id: "date",
      label: "Date Posted",
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
  console.log(deal, buydeal);

  return (
    <AdminDashboardLayout active="deal">
      <div className="pd-private">
        <div className="topicPart">
          <p className="pageTitle">Private Deals</p>
          <div className="btnBox">
            {toggleBtn === "auction" && (
              <ReactHTMLTableToExcel
                id="test-table-xls-button"
                className="download-table-xls-button btn btn-success mb-3"
                table="table-to-xls"
                filename="Auction"
                sheet="tablexls"
                buttonText="Download"
              />
            )}
            {toggleBtn !== "auction" && (
              <ReactHTMLTableToExcel
                id="test-table-xls-button"
                className="download-table-xls-button btn btn-success mb-3"
                table="table-to-xls2"
                filename="Buy Now"
                sheet="tablexls"
                buttonText="Download"
              />
            )}

            <button onClick={createDeal} className="create">
              Create New Deal
            </button>
          </div>
        </div>

        <div className="transactionNav">
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
              handleToggle("buy");
            }}
            className={`payment ${toggleBtn === "buy" ? "active" : ""}`}
          >
            Buy Now
          </button>
        </div>
        {toggleBtn === "auction" && (
          <div className="whiteContainer">
            <div className="tableHead">
              <p className="tableTitle">Auction</p>
              <input
                type="text"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder="Search"
                className="search"
              />
            </div>

            <div className="downloadTable" style={{ display: "none" }}>
              <table id="table-to-xls">
                <thead>
                  <tr>
                    <th>Name</th>

                    <th>Product Name</th>
                    <th>Base Price</th>
                    <th>Date Posted</th>

                    <th className="extraTh">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {deal &&
                    deal.data.length &&
                    deal.data.map((item) => {
                      return (
                        <tr>
                          <td> {item.vendor && `${item.vendor.name}`}</td>
                          <td>{item.product && item.product.productName}</td>
                          <td> {formatCurrency(item.basePrice)}</td>
                          <td align="left">
                            {item.product &&
                              moment(item.product.createdAt).format(
                                "MMM Do YYYY"
                              )}{" "}
                          </td>

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
                ) : deal.data.length ? (
                  <motion.div
                    variants={moveIn}
                    animate="visible"
                    initial="hidden"
                    className="pd-dashboard"
                  >
                    <TableContainer>
                      <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                      >
                        <EnhancedTableHead
                          headCells={headCells}
                          order={order}
                          orderBy={orderBy}
                          onRequestSort={handleRequestSort}
                          rowCount={deal.data.length}
                          align="left"
                        />
                        <TableBody>
                          {stableSort(
                            deal.data,
                            getComparator(order, orderBy)
                          ).map((item) => {
                            // const isItemSelected = isSelected(row.id);
                            // const labelId = `enhanced-table-checkbox-${index}`
                            return (
                              <TableRow
                                // hover
                                // role="checkbox"
                                // aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={item._id}
                                // selected={isItemSelected}
                              >
                                <TableCell align="left">
                                  <div className="nameDiv">
                                    <div className="nameBox">
                                      <p className="name">
                                        {item.user &&
                                          `${item.user.firstName} ${item.user.lastName}`}
                                      </p>

                                      {/* <p className="email">
                                        {item.user && `${item.user.email}`}
                                      </p> */}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell align="left">
                                  {item.product ? item.product.name : "N/A"}
                                </TableCell>
                                <TableCell align="left">
                                  {formatCurrency(item.basePrice)}
                                </TableCell>
                                <TableCell align="left">
                                  {item.product &&
                                    moment(item.product.createdAt).format(
                                      "MMM Do YYYY"
                                    )}{" "}
                                  <br />{" "}
                                  <p className="time green">
                                    {item.product &&
                                      moment(item.product.createdAt).format(
                                        "LT"
                                      )}
                                  </p>{" "}
                                </TableCell>

                                <TableCell align="left">
                                  <p
                                    className={`status ${
                                      item.active ? "active" : "red"
                                    }`}
                                  >
                                    {item.active ? "Active" : "Inactive"}
                                  </p>
                                </TableCell>
                                <TableCell className="action" align="left">
                                  <SubscribeDropDown
                                    id={item._id}
                                    activateDeal={activateDeal}
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
                  deal &&
                  Math.ceil(parseInt(deal._meta.pagination.total_count) / 10)
                }
                shape="rounded"
              />
            </div>
          </div>
        )}
        {toggleBtn === "buy" && (
          <div className="whiteContainer">
            <div className="tableHead">
              <p className="tableTitle">Buy Now</p>
              <input
                onChange={(e) => {
                  setSearch2(e.target.value);
                }}
                type="text"
                placeholder="Search"
                className="search"
              />
            </div>
            <div className="downloadTable" style={{ display: "none" }}>
              <table id="table-to-xls2">
                <thead>
                  <tr>
                    <th>Name</th>

                    <th>Product Name</th>
                    <th>Base Price</th>
                    <th>Date Posted</th>

                    <th className="extraTh">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {buydeal &&
                    buydeal.data.length &&
                    buydeal.data.map((item) => {
                      return (
                        <tr>
                          <td> {item.vendor && `${item.vendor.name}`}</td>
                          <td>{item.product && item.product.name}</td>
                          <td> {formatCurrency(item.basePrice)}</td>
                          <td align="left">
                            {item.product &&
                              moment(item.product.createdAt).format(
                                "MMM Do YYYY"
                              )}
                          </td>

                          <td>{item.status}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div className="overflowTable">
              {!isBuyError ? (
                buyloading ? (
                  <LoadingTable />
                ) : buydeal.data.length ? (
                  <motion.div
                    variants={moveIn}
                    animate="visible"
                    initial="hidden"
                    className="pd-dashboard"
                  >
                    <TableContainer>
                      <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                      >
                        <EnhancedTableHead
                          headCells={headCells}
                          order={order}
                          orderBy={orderBy}
                          onRequestSort={handleRequestSort}
                          rowCount={buydeal.data.length}
                          align="left"
                        />
                        <TableBody>
                          {stableSort(
                            buydeal.data,
                            getComparator(order, orderBy)
                          ).map((item) => {
                            // const isItemSelected = isSelected(row.id);
                            // const labelId = `enhanced-table-checkbox-${index}`
                            return (
                              <TableRow
                                // hover
                                // role="checkbox"
                                // aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={item._id}
                                // selected={isItemSelected}
                              >
                                <TableCell align="left">
                                  <div className="nameDiv">
                                    <div className="nameBox">
                                      <p className="name">
                                        {item.vendor && `${item.vendor.name}`}
                                      </p>

                                      <p className="email">
                                        {item.vendor && `${item.vendor.email}`}
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell align="left">
                                  {item.product ? item.product.name : "N/A"}
                                </TableCell>
                                <TableCell align="left">
                                  {formatCurrency(item.basePrice)}
                                </TableCell>
                                <TableCell align="left">
                                  {item.product &&
                                    moment(item.product.createdAt).format(
                                      "MMM Do YYYY"
                                    )}{" "}
                                  <br />{" "}
                                  <p className="time green">
                                    {item.product &&
                                      moment(item.product.createdAt).format(
                                        "LT"
                                      )}
                                  </p>{" "}
                                </TableCell>

                                <TableCell align="left">
                                  <p
                                    className={`status ${
                                      item.status === "Active"
                                        ? "active"
                                        : "red"
                                    }`}
                                  >
                                    {item.status}
                                  </p>
                                </TableCell>
                                <TableCell className="action" align="left">
                                  <SubscribeDropDown
                                    id={item._id}
                                    activateDeal={activateDeal}
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
                  buydeal &&
                  Math.ceil(parseInt(buydeal._meta.pagination.total_count) / 10)
                }
                shape="rounded"
              />
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default PrivateDeal;
