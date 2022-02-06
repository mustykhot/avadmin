import AdminDashboardLayout from "../../../../component/adminDashboardLayout";
import "./style.scss";
import { ReactComponent as Fill } from "../../../../assets/icons/Fill.svg";
import shape from "../../../../assets/icons/shape.svg";
import userImg from "../../../../assets/images/user-img.png";

import { useState } from "react";
import TableDrop from "../../../../component/TableDrop";
import { Link, useNavigate } from "react-router-dom";
import DropDownWrapper from "../../../../component/DropDownWrapper";
import { Avatar, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  useApproveDealMutation,
  useGetAllDealPrivateQuery,
  useGetAllDealQuery,
  useRejectDealMutation,
} from "../../../../services/api";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import {
  formatCurrency,
  getComparator,
  stableSort,
} from "../../../../utils/utils";
import Checkbox from "@mui/material/Checkbox";
import moment from "moment";
import EnhancedTableHead from "../../../../component/EnhancedTableHead";
import LoadingTable from "../../../../component/loadingTable";
import NoProduct from "../../../../component/NoProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentSlash } from "@fortawesome/free-solid-svg-icons";
import { toastr } from "react-redux-toastr";
import { useDispatch } from "react-redux";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { logout } from "../../../../store/slice/AuthSlice";
// dropdown
const SubscribeDropDown = ({ id, reject, approve }) => (
  <DropDownWrapper
    className="more-actions"
    action={
      <IconButton className="more-action-btn" aria-label="actions">
        <MoreVertIcon />
      </IconButton>
    }
  >
    <Link to={`/auction/auction_detail/${id}`} className="btn-noBg">
      View Details
    </Link>

    <button
      onClick={() => {
        approve(id);
      }}
      className="btn-noBg"
    >
      Approve
    </button>

    <button
      onClick={() => {
        reject(id);
      }}
      className="btn-noBg"
    >
      Reject
    </button>
  </DropDownWrapper>
);
// tableData

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
    id: "based_price",
    label: "Based Price",
  },
  {
    id: "current_bid",
    label: "Current Bid",
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

const Auction = () => {
  const dispatch = useDispatch();
  const [isLoadng, setIsLoading] = useState(false);
  const [toggleBtn, setToggleBtn] = useState("regular");
  const [show, setShow] = useState(false);
  let navigate = useNavigate();

  const handleToggle = (type) => {
    setToggleBtn(type);
  };
  const onSubmit = (vals) => {
    console.log(vals);
    setIsLoading(false);
  };

  const viewAuction = (id) => {
    navigate(`auction_detail/${id}`);
  };
  const {
    data: deal = null,
    isLoading: loadingBuyNow,
    isError,
    error,
  } = useGetAllDealQuery();
  const {
    data: dealPrivate = null,
    isLoading: loadingPrivate,
    isError: isPrivateError,
    error: privateError,
  } = useGetAllDealPrivateQuery();
  console.log(deal && deal.data.rows);

  // click table
  const [selected, setSelected] = useState([]);
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = deal.data.rows.map((n) => n.id);
      setSelected(newSelecteds);
      console.log(newSelecteds, "newselecteds");
      return;
    }
    setSelected([]);
    console.log(selected);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // table magic
  const [order, setOrder] = useState("");
  const [orderBy, setOrderBy] = useState("");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // approve and reject

  // disable category
  const [approveResponse, { isLoading: approveLoading }] =
    useApproveDealMutation();
  const approveDeal = async (id) => {
    try {
      const response = await approveResponse({ id: id }).unwrap();

      toastr.success("Success", response.message);
    } catch (err) {
      if (err.data) toastr.error("Error", err.data.message);
      else toastr.error("Error", "Something went wrong, please try again...");
    }
  };

  // reject deal
  const [rejectResponse, { isLoading: rejectLoading }] =
    useRejectDealMutation();
  const rejectDeal = async (id) => {
    try {
      const response = await rejectResponse({ id: id }).unwrap();

      toastr.success("Success", response.message);
    } catch (err) {
      if (err.data) toastr.error("Error", err.data.message);
      else toastr.error("Error", "Something went wrong, please try again...");
    }
  };

  return (
    <AdminDashboardLayout active="auction">
      <div className="pd-auction">
        <div className="topicPart">
          <p className="pageTitle">Auctions</p>
          <div className="btnBox">
            {toggleBtn === "regular" && (
              <ReactHTMLTableToExcel
                id="test-table-xls-button"
                className="download-table-xls-button btn btn-success mb-3"
                table="table-to-xls"
                filename="Auction"
                sheet="tablexls"
                buttonText="Download"
              />
            )}
            {toggleBtn !== "regular" && (
              <ReactHTMLTableToExcel
                id="test-table-xls-button"
                className="download-table-xls-button btn btn-success mb-3"
                table="table-to-xls2"
                filename="Buy Now"
                sheet="tablexls"
                buttonText="Download"
              />
            )}
            <button
              onClick={() => {
                setShow(!show);
              }}
              className="create"
            >
              Action <Fill className="fill" />
            </button>
            <div className={`actionPop  ${show ? "show" : ""}`}>
              <button className="pop">Activate</button>
              <button className="pop">Deactivate</button>
            </div>
          </div>
        </div>

        <div className="transactionNav">
          <button
            onClick={() => {
              handleToggle("regular");
            }}
            className={`auction ${toggleBtn === "regular" ? "active" : ""}`}
          >
            All Auctions
          </button>
          <button
            onClick={() => {
              handleToggle("private");
            }}
            className={`payment ${toggleBtn === "private" ? "active" : ""}`}
          >
            Buy Now
          </button>
        </div>
        {toggleBtn === "regular" && (
          <div className="whiteContainer">
            <div className="tableHead">
              <p className="tableTitle">Admin Users</p>
              <input type="text" placeholder="Search" className="search" />
            </div>

            <div className="downloadTable" style={{ display: "none" }}>
              <table id="table-to-xls">
                <thead>
                  <tr>
                    <th>Trader</th>

                    <th>Product Name</th>
                    <th>Base Price</th>
                    <th>Current Bid</th>
                    <th>Date Posted</th>

                    <th className="extraTh">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {deal &&
                    deal.data.rows &&
                    deal.data.rows.map((item) => {
                      return (
                        <tr key={item.id}>
                          <td>
                            {" "}
                            {
                              <p className="name">
                                {item.user
                                  ? `${item.user.firstName} ${item.user.lastName}`
                                  : "N/A"}
                              </p>
                            }
                          </td>
                          <td align="left">
                            {item.product ? item.product.productName : "N/A"}
                          </td>
                          <td align="left">
                            {item.product
                              ? formatCurrency(item.product.price)
                              : "N/A"}
                          </td>
                          <td align="left">
                            {item.product
                              ? formatCurrency(item.product.finalPrice)
                              : "N/A"}
                          </td>
                          <td align="left">
                            {moment(item.created_at).format("L")}
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
                loadingBuyNow ? (
                  <LoadingTable />
                ) : deal.data.rows ? (
                  <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                      <EnhancedTableHead
                        headCells={headCells}
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={deal.data.rows.length}
                        align="left"
                        isCheck={true}
                      />
                      <TableBody>
                        {stableSort(
                          deal.data.rows,
                          getComparator(order, orderBy)
                        ).map((row, index) => {
                          const isItemSelected = isSelected(row.id);
                          const labelId = `enhanced-table-checkbox-${index}`;

                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={row.id}
                              selected={isItemSelected}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  color="primary"
                                  checked={isItemSelected}
                                  inputProps={{
                                    "aria-labelledby": labelId,
                                  }}
                                  onChange={(event) =>
                                    handleClick(event, row.id)
                                  }
                                />
                              </TableCell>

                              <TableCell align="left">
                                {" "}
                                <div className="nameDiv">
                                  <Avatar
                                    alt={"user"}
                                    src={row.user ? row.user.image : ""}
                                    sx={{ width: 35, height: 35 }}
                                  />
                                  <div className="nameBox">
                                    <p className="name">
                                      {row.user
                                        ? `${row.user.firstName} ${row.user.lastName}`
                                        : "N/A"}
                                    </p>
                                    <p className="email">
                                      {row.user ? row.user.email : "N/A"}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell align="left">
                                {row.product ? row.product.productName : "N/A"}
                              </TableCell>
                              <TableCell align="left">
                                {row.product
                                  ? formatCurrency(row.product.price)
                                  : "N/A"}
                              </TableCell>
                              <TableCell align="left">
                                {row.product
                                  ? formatCurrency(row.product.finalPrice)
                                  : "N/A"}
                              </TableCell>
                              <TableCell align="left">
                                {moment(row.created_at).format("L")}
                              </TableCell>
                              <TableCell align="left">
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
                              </TableCell>

                              <TableCell className="action" align="left">
                                <SubscribeDropDown
                                  approve={approveDeal}
                                  reject={rejectDeal}
                                  id={row.id}
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
                )
              ) : (
                <NoProduct msg="There is a problem...">
                  <FontAwesomeIcon icon={faCommentSlash} />
                </NoProduct>
              )}
            </div>
          </div>
        )}

        {toggleBtn === "private" && (
          <div className="whiteContainer">
            <div className="tableHead">
              <p className="tableTitle">Buy Now</p>
              <input type="text" placeholder="Search" className="search" />
            </div>
            <div className="downloadTable" style={{ display: "none" }}>
              <table id="table-to-xls2">
                <thead>
                  <tr>
                    <th>Trader</th>

                    <th>Product Name</th>
                    <th>Base Price</th>
                    <th>Current Bid</th>
                    <th>Date Posted</th>

                    <th className="extraTh">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dealPrivate &&
                    dealPrivate.data.rows &&
                    dealPrivate.data.rows.map((item) => {
                      return (
                        <tr key={item.id}>
                          <td>
                            {" "}
                            {
                              <p className="name">
                                {item.user
                                  ? `${item.user.firstName} ${item.user.lastName}`
                                  : "N/A"}
                              </p>
                            }
                          </td>
                          <td align="left">
                            {item.product ? item.product.productName : "N/A"}
                          </td>
                          <td align="left">
                            {item.product
                              ? formatCurrency(item.product.price)
                              : "N/A"}
                          </td>
                          <td align="left">
                            {item.product
                              ? formatCurrency(item.product.finalPrice)
                              : "N/A"}
                          </td>
                          <td align="left">
                            {moment(item.created_at).format("L")}
                          </td>

                          <td>{item.status}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div className="overflowTable">
              {!isPrivateError ? (
                loadingPrivate ? (
                  <LoadingTable />
                ) : dealPrivate.message !== "no buy now deals available!" ? (
                  <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                      <EnhancedTableHead
                        headCells={headCells}
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={dealPrivate.data.rows.length}
                        align="left"
                        isCheck={true}
                      />
                      <TableBody>
                        {stableSort(
                          dealPrivate.data.rows,
                          getComparator(order, orderBy)
                        ).map((row, index) => {
                          const isItemSelected = isSelected(row.id);
                          const labelId = `enhanced-table-checkbox-${index}`;

                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={row.id}
                              selected={isItemSelected}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  color="primary"
                                  checked={isItemSelected}
                                  inputProps={{
                                    "aria-labelledby": labelId,
                                  }}
                                  onChange={(event) =>
                                    handleClick(event, row.id)
                                  }
                                />
                              </TableCell>

                              <TableCell align="left">
                                <div className="nameDiv">
                                  <Avatar
                                    alt={"user"}
                                    src={row.user ? row.user.image : ""}
                                    sx={{ width: 35, height: 35 }}
                                  />
                                  <div className="nameBox">
                                    <p className="name">
                                      {row.user
                                        ? `${row.user.firstName} ${row.user.lastName}`
                                        : "N/A"}
                                    </p>
                                    <p className="email">
                                      {row.user ? row.user.email : "N/A"}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell align="left">
                                {row.product ? row.product.productName : "N/A"}
                              </TableCell>
                              <TableCell align="left">
                                {formatCurrency(
                                  row.product ? row.product.price : "N/A"
                                )}
                              </TableCell>
                              <TableCell align="left">
                                {formatCurrency(
                                  row.product ? row.product.finalPrice : "N/A"
                                )}
                              </TableCell>
                              <TableCell align="left">
                                {moment(row.created_at).format("L")}
                              </TableCell>
                              <TableCell align="left">
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
                              </TableCell>

                              <TableCell className="action" align="left">
                                <SubscribeDropDown
                                  approve={approveDeal}
                                  reject={rejectDeal}
                                  id={row.id}
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
                )
              ) : (
                <NoProduct msg="There is a problem...">
                  <FontAwesomeIcon icon={faCommentSlash} />
                </NoProduct>
              )}
            </div>
          </div>
        )}

        {/* <div className="whiteContainer">
          <div className="tableHead">
            <p className="tableTitle">Admin Users</p>
            <input type="text" placeholder="Search" className="search" />
          </div>

          <div className="overflowTable">
            {toggleBtn === "regular" && (
              <table className="unset">
                <thead>
                  <tr>
                    <th>
                      <input
                        onChange={(e) => {
                          addAll(e.target.checked);
                        }}
                        type="checkbox"
                        name=""
                        id=""
                      />
                    </th>
                    <th>Trader</th>
                    <th>Product Name</th>
                    <th className="extraTh">
                      Based Price <img src={shape} alt="shape" />{" "}
                    </th>
                    <th className="extraTh">
                      Current Bid <img src={shape} alt="shape" />{" "}
                    </th>
                    <th className="extraTh">
                      Date Posted <img src={shape} alt="shape" />{" "}
                    </th>
                    <th className="extraTh">Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((item) => {
                    return (
                      <tr className={`${selected.includes(item) && "bgDark"}`}>
                        <td>
                          <input
                            onChange={(e) => {
                              handleCheckList(e.target.checked, item);
                            }}
                            checked={selected.includes(item)}
                            type="checkbox"
                            name=""
                            id=""
                          />
                        </td>
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
                        <td className="role bidTd">
                          ₦ 54,000 <br /> <p className="bid">24 Bids</p>{" "}
                        </td>
                        <td className="role timeTd">
                          10 Nov, 2021 <br />
                          <p className="time green">2:45</p>
                        </td>
                        <td className="statusTd">
                          <p className="status active">Active</p>
                        </td>
                        <td>
                          <TableDrop
                            extra={true}
                            handleView={() => {
                              viewAuction(1);
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                  <tr></tr>
                </tbody>
              </table>
            )}
            {toggleBtn === "private" && (
              <table className="unset">
                <thead>
                  <tr>
                    <th>
                      <input
                        onChange={(e) => {
                          addAll(e.target.checked);
                        }}
                        type="checkbox"
                        name=""
                        id=""
                      />
                    </th>
                    <th>Trader</th>
                    <th>Product Name</th>
                    <th className="extraTh">
                      Based Price <img src={shape} alt="shape" />{" "}
                    </th>
                    <th className="extraTh">
                      Current Bid <img src={shape} alt="shape" />{" "}
                    </th>
                    <th className="extraTh">
                      Date Posted <img src={shape} alt="shape" />{" "}
                    </th>
                    <th className="extraTh">Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((item) => {
                    return (
                      <tr className={`${selected.includes(item) && "bgDark"}`}>
                        <td>
                          <input
                            onChange={(e) => {
                              handleCheckList(e.target.checked, item);
                            }}
                            checked={selected.includes(item)}
                            type="checkbox"
                            name=""
                            id=""
                          />
                        </td>
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
                        <td className="role bidTd">
                          ₦ 54,000 <br /> <p className="bid">24 Bids</p>{" "}
                        </td>
                        <td className="role timeTd">
                          10 Nov, 2021 <br />
                          <p className="time green">2:45</p>
                        </td>
                        <td className="statusTd">
                          <p className="status active">Active</p>
                        </td>
                        <td>
                          <TableDrop extra={true} />
                        </td>
                      </tr>
                    );
                  })}
                  <tr></tr>
                </tbody>
              </table>
            )}
          </div>
        </div> */}
      </div>
    </AdminDashboardLayout>
  );
};

export default Auction;
