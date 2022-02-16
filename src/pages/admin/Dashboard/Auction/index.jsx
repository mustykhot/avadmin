import AdminDashboardLayout from "../../../../component/adminDashboardLayout";
import "./style.scss";
import { ReactComponent as Fill } from "../../../../assets/icons/Fill.svg";
import shape from "../../../../assets/icons/shape.svg";
import userImg from "../../../../assets/images/user-img.png";

import { useState } from "react";
import TableDrop from "../../../../component/TableDrop";
import { Link, useNavigate } from "react-router-dom";
import DropDownWrapper from "../../../../component/DropDownWrapper";
import { Avatar, IconButton, Pagination } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  useApproveDealMutation,
  useGetAllDealPrivateQuery,
  useGetAllDealQuery,
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
import { moveIn } from "../../../../utils/variants";
import { motion } from "framer-motion/dist/framer-motion";
// dropdown
const SubscribeDropDown = ({ id, approve }) => (
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
        approve("Active", id);
      }}
      className="btn-noBg"
    >
      Approve
    </button>

    <button
      onClick={() => {
        approve("Declined", id);
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

const headCells2 = [
  {
    id: "trader",
    label: "Trader",
  },
  {
    id: "product",
    label: "Product Name",
  },
  {
    id: "price",
    label: "Price",
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
  const [show2, setShow2] = useState(false);
  let navigate = useNavigate();
  const [searching, setSearchIng] = useState("");
  const [search2, setSearch2] = useState("");
  console.log(searching, "search");
  console.log(search2, "search2");
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

  const [page, setPage] = useState(1);
  const handlePage = (e, value) => {
    setPage(value);
  };
  const [page2, setPage2] = useState(1);
  const handlePage2 = (e, value) => {
    setPage2(value);
  };

  const [status, setStatus] = useState("");
  const [status2, setStatus2] = useState("");

  const {
    data: deal = null,
    isLoading: loadingBuyNow,
    isError,
    error,
  } = useGetAllDealQuery({ page, status, search: searching });
  const {
    data: dealPrivate = null,
    isLoading: loadingPrivate,
    isError: isPrivateError,
    error: privateError,
  } = useGetAllDealPrivateQuery({
    page: page2,
    status: status2,
    search: search2,
  });
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
  const approveDeal = async (status, id) => {
    const payload = {
      status,
    };
    try {
      const response = await approveResponse({
        credentials: payload,
        id: id,
      }).unwrap();

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
            <div className="coverFilter">
              <button
                onClick={() => {
                  setShow2(!show2);
                }}
                className="create"
              >
                Filter <Fill className="fill" />
              </button>
              <div className={`actionPop  ${show2 ? "show" : ""}`}>
                <button
                  onClick={() => {
                    if (toggleBtn === "regular") {
                      setStatus("Active");
                    } else {
                      setStatus2("Active");
                    }
                  }}
                  className="pop"
                >
                  Activated
                </button>
                <button
                  onClick={() => {
                    if (toggleBtn === "regular") {
                      setStatus("Declined");
                    } else {
                      setStatus2("Declined");
                    }
                  }}
                  className="pop"
                >
                  Deactivated
                </button>
                <button
                  onClick={() => {
                    if (toggleBtn === "regular") {
                      setStatus("pending");
                    } else {
                      setStatus2("pending");
                    }
                  }}
                  className="pop"
                >
                  Pending
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                setShow(!show);
              }}
              className="create"
            >
              Action <Fill className="fill" />
            </button>
            <div className={`actionPop  ${show ? "show" : ""}`}>
              <button
                onClick={() => {
                  approveDeal("Active", selected);
                }}
                className="pop"
              >
                Activate
              </button>
              <button
                onClick={() => {
                  approveDeal("Declined", selected);
                }}
                className="pop"
              >
                Deactivate
              </button>
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
              <p className="tableTitle">All Auctions</p>
              <input
                type="text"
                value={searching}
                onChange={(e) => {
                  console.log(e);
                  setSearchIng(e.target.value);
                }}
                placeholder="Search"
                className="search"
              />
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
                  !deal.data.rows.length ? (
                    <NoProduct msg="No Data ...">
                      <FontAwesomeIcon icon={faCommentSlash} />
                    </NoProduct>
                  ) : (
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
                                    {row.product
                                      ? row.product.productName
                                      : "N/A"}
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
                                      id={row.id}
                                    />
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </motion.div>
                  )
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
              <div className="pagination-wrap">
                <Pagination
                  color="primary"
                  onChange={handlePage}
                  count={deal && deal.total_pages}
                  shape="rounded"
                />
              </div>
            </div>
          </div>
        )}

        {toggleBtn === "private" && (
          <div className="whiteContainer">
            <div className="tableHead">
              <p className="tableTitle">Buy Now</p>
              <input
                type="text"
                value={search2}
                onChange={(e) => {
                  setSearch2(e.target.value);
                }}
                placeholder="Search"
                className="search"
              />
            </div>
            <div className="downloadTable" style={{ display: "none" }}>
              <table id="table-to-xls2">
                <thead>
                  <tr>
                    <th>Trader</th>

                    <th>Product Name</th>
                    <th>Price</th>

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
                  !dealPrivate.data.rows.length ? (
                    <NoProduct msg="No Data...">
                      <FontAwesomeIcon icon={faCommentSlash} />
                    </NoProduct>
                  ) : (
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
                            headCells={headCells2}
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
                                    {row.product
                                      ? row.product.productName
                                      : "N/A"}
                                  </TableCell>
                                  <TableCell align="left">
                                    {formatCurrency(
                                      row.product ? row.product.price : "N/A"
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
                                      id={row.id}
                                    />
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </motion.div>
                  )
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

              <div className="pagination-wrap">
                <Pagination
                  color="primary"
                  onChange={handlePage2}
                  count={dealPrivate && dealPrivate.total_pages}
                  shape="rounded"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default Auction;
