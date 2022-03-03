import AdminDashboardLayout from "../../../../component/adminDashboardLayout";
import "./style.scss";

import shape from "../../../../assets/icons/shape.svg";
import userImg from "../../../../assets/images/user-img.png";

import { useState } from "react";
import TableDrop from "../../../../component/TableDrop";

import DropDownWrapper from "../../../../component/DropDownWrapper";
import { Avatar, IconButton, Pagination } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  useActivateCategoryMutation,
  useGetAllCategoryQuery,
} from "../../../../services/api";
import { toastr } from "react-redux-toastr";
import LoadingTable from "../../../../component/loadingTable";
import NoProduct from "../../../../component/NoProduct";
import {
  getComparator,
  stableSort,
  truncateString,
} from "../../../../utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentSlash } from "@fortawesome/free-solid-svg-icons";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import EnhancedTableHead from "../../../../component/EnhancedTableHead";
import { moveIn } from "../../../../utils/variants";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";

const SubscribeDropDown = ({ id, approve }) => (
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
        approve("APPROVED", id);
      }}
      className="btn-noBg"
    >
      Activate
    </button>

    <button
      onClick={() => {
        approve("DECLINED", id);
      }}
      className="btn-noBg"
    >
      Deactivate
    </button>
  </DropDownWrapper>
);

const headCells = [
  {
    id: "title",
    label: "Campaign Title",
  },
  {
    id: "reach",
    label: "Reach",
  },
  {
    id: "clicks",
    label: "Clicks",
  },
  {
    id: "start_date",
    label: " Start Date",
  },
  {
    id: "end_date",
    label: "End Date",
  },
  {
    id: "status",
    label: "Status",
  },
];

const Ads = () => {
  const list = [1, 2, 3];
  // pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const handlePage = (e, value) => {
    setPage(value);
  };

  // get category
  const {
    data: category = null,
    isLoading: loading,
    isError,
  } = useGetAllCategoryQuery(page);

  const [activateResponse, { isLoading: activateLoading }] =
    useActivateCategoryMutation();
  const activate = async (type, id) => {
    const payload = {
      active: type,
    };
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

  // table magic
  const [order, setOrder] = useState("");
  const [orderBy, setOrderBy] = useState("");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <AdminDashboardLayout active="ads">
      <div className="pd-ads">
        <div className="topicPart">
          <p className="pageTitle">Ads Manager</p>
        </div>

        <div className="whiteContainer">
          <div className="tableHead">
            <p className="tableTitle">Posted Campaign</p>
            <input type="text" placeholder="Search" className="search" />
          </div>

          <div className="overflowTable">
            {loading ? (
              <LoadingTable />
            ) : isError ? (
              <NoProduct msg="Something went wrong...">
                <FontAwesomeIcon icon={faCommentSlash} />
              </NoProduct>
            ) : category.data.length ? (
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
                      rowCount={category.data.length}
                      align="left"
                    />
                    <TableBody>
                      {stableSort(
                        category.data,
                        getComparator(order, orderBy)
                      ).map((item) => {
                        return (
                          <TableRow tabIndex={-1} key={item._id}>
                            <TableCell align="left">
                              {truncateString(item._id, 10)}
                            </TableCell>
                            <TableCell align="left">{item.name}</TableCell>
                            <TableCell align="left">
                              {truncateString(item.description, 20)}
                            </TableCell>
                            <TableCell align="left">
                              {item.productsAssigned}
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
                                activate={activate}
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
                    <tr key={item.id}>
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
