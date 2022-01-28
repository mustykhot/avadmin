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
  // useActivateDealMutation,
  useDeactivatePrivateDealMutation,
  useGetAllPrivateBuyDealQuery,
  useGetAllPrivateDealQuery,
  useRejectDealMutation,
} from "../../../../services/api";
import LoadingTable from "../../../../component/loadingTable";
import NoProduct from "../../../../component/NoProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentSlash } from "@fortawesome/free-solid-svg-icons";
import { moneyFormatter } from "../../../../utils/utils";
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
import { IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DropDownWrapper from "../../../../component/DropDownWrapper/index";
// dropdown
export const SubscribeDropDown = ({ id, disable, rejectDeal }) => (
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
        disable(id);
      }}
      className="btn-noBg"
    >
      Deactivate
    </button>

    <button
      onClick={() => {
        rejectDeal(id);
      }}
      className="btn-noBg"
    >
      Reject
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
  // get deal
  const {
    data: deal = [],
    isLoading: loading,
    isError,
    error,
  } = useGetAllPrivateDealQuery();
  console.log(deal.rows);
  // get buynow
  const {
    data: buydeal = [],
    isLoading: buyloading,
    isError: isBuyError,
    error: buyError,
  } = useGetAllPrivateBuyDealQuery();
  console.log(buydeal.rows);

  // activate Deal
  // const [activateResponse, { isLoading: activateLoading }] =
  //   useActivateDealMutation();
  // const activateDeal = async (id) => {
  //   try {
  //     const response = await activateResponse({ id: id }).unwrap();

  //     toastr.success("Success", response.message);
  //   } catch (err) {
  //     if (err.data) toastr.error("Error", err.data.message);
  //     else toastr.error("Error", "Something went wrong, please try again...");
  //   }
  // };

  // disable category
  const [disableResponse, { isLoading: disableLoading }] =
    useDeactivatePrivateDealMutation();
  const deactivateDeal = async (id) => {
    try {
      const response = await disableResponse({ id: id }).unwrap();

      toastr.success("Success", response.message);
    } catch (err) {
      if (err.data) toastr.error("Error", err.data.message);
      else toastr.error("Error", "Something went wrong, please try again...");
    }
  };

  // reject deal
  const [rejectResponse, { isLoading: rejectoading }] = useRejectDealMutation();
  const rejectDeal = async (id) => {
    try {
      const response = await rejectResponse({ id: id }).unwrap();

      toastr.success("Success", response.message);
    } catch (err) {
      if (err.data) toastr.error("Error", err.data.message);
      else toastr.error("Error", "Something went wrong, please try again...");
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

  return (
    <AdminDashboardLayout active="deal">
      <div className="pd-private">
        <div className="topicPart">
          <p className="pageTitle">Private Deals</p>
          <div className="btnBox">
            <button className="download">
              Download <Fill className="fill" />
            </button>
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
                onKeyPress={(e) => {
                  handleSearch(e.target.value);
                }}
                placeholder="Search"
                className="search"
              />
            </div>

            <div className="overflowTable">
              {loading ? (
                <LoadingTable />
              ) : deal.rows.length ? (
                <TableContainer>
                  <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                    <EnhancedTableHead
                      headCells={headCells}
                      // numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      // onSelectAllClick={handleSelectAllClick}
                      onRequestSort={handleRequestSort}
                      rowCount={deal.rows.length}
                      align="left"
                    />
                    <TableBody>
                      {stableSort(deal.rows, getComparator(order, orderBy)).map(
                        (item) => {
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
                                    <p className="name">Emeka Phillips</p>

                                    <p className="email">
                                      emeka.phillips@gmail.com
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell align="left">
                                {item.product.productName}
                              </TableCell>
                              <TableCell align="left">
                                {moneyFormatter(item.price)}
                              </TableCell>
                              <TableCell align="left">
                                {moment(item.product.createdAt).format(
                                  "MMM Do YYYY"
                                )}{" "}
                                <br />{" "}
                                <p className="time green">
                                  {moment(item.product.createdAt).format("LT")}
                                </p>{" "}
                              </TableCell>

                              <TableCell align="left">
                                <p
                                  className={`status ${
                                    item.status === "Active" ? "active" : "red"
                                  }`}
                                >
                                  {item.status}
                                </p>
                              </TableCell>
                              <TableCell className="action" align="left">
                                <SubscribeDropDown
                                  id={item._id}
                                  // activate={activateDeal}
                                  disable={deactivateDeal}
                                  rejectDeal={rejectDeal}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <NoProduct msg="No Data Yet...">
                  <FontAwesomeIcon icon={faCommentSlash} />
                </NoProduct>
              )}
            </div>
          </div>
        )}
        {toggleBtn === "buy" && (
          <div className="whiteContainer">
            <div className="tableHead">
              <p className="tableTitle">Buy Now</p>
              <input type="text" placeholder="Search" className="search" />
            </div>

            {buyloading ? (
              <LoadingTable />
            ) : buydeal.rows.length ? (
              <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                  <EnhancedTableHead
                    headCells={headCells}
                    // numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    // onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={deal.rows.length}
                    align="left"
                  />
                  <TableBody>
                    {stableSort(
                      buydeal.rows,
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
                                <p className="name">Emeka Phillips</p>

                                <p className="email">
                                  emeka.phillips@gmail.com
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            {item.product.productName}
                          </TableCell>
                          <TableCell align="left">
                            {moneyFormatter(item.price)}
                          </TableCell>
                          <TableCell align="left">
                            {moment(item.product.createdAt).format(
                              "MMM Do YYYY"
                            )}{" "}
                            <br />{" "}
                            <p className="time green">
                              {moment(item.product.createdAt).format("LT")}
                            </p>{" "}
                          </TableCell>

                          <TableCell align="left">
                            <p
                              className={`status ${
                                item.status === "Active" ? "active" : "red"
                              }`}
                            >
                              {item.status}
                            </p>
                          </TableCell>
                          <TableCell className="action" align="left">
                            <SubscribeDropDown
                              id={item._id}
                              // activate={activateDeal}
                              disable={deactivateDeal}
                              rejectDeal={rejectDeal}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <NoProduct msg="No Data Yet...">
                <FontAwesomeIcon icon={faCommentSlash} />
              </NoProduct>
            )}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default PrivateDeal;
