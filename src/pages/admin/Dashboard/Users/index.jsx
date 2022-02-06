import AdminDashboardLayout from "../../../../component/adminDashboardLayout";
import "./style.scss";
import { ReactComponent as Fill } from "../../../../assets/icons/Fill.svg";
import { ReactComponent as Download } from "../../../../assets/icons/download.svg";
import shape from "../../../../assets/icons/shape.svg";
import userImg from "../../../../assets/images/user-img.png";

import { useState } from "react";
// import Modal from "../../../../component/Modal";
// // import FormHead from "../../../../component/formHead";
// // import Input from "../../../../component/input";
// import { useForm } from "react-hook-form";
// import SubmitBtn from "../../../../component/submitBtn";
// import Select from "../../../../component/input/selectt";
// import SuccessModal from "../../../../component/popModal";
import { useNavigate } from "react-router";
import {
  useGetUsersQuery,
  useUpdateBatchMutation,
} from "../../../../services/api";
import LoadingTable from "../../../../component/loadingTable";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import EnhancedTableHead from "../../../../component/EnhancedTableHead";
import {
  formatCurrency,
  getComparator,
  stableSort,
} from "../../../../utils/utils";
import { Avatar, Checkbox } from "@mui/material";
import moment from "moment";
import NoProduct from "../../../../component/NoProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentSlash } from "@fortawesome/free-solid-svg-icons";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { toastr } from "react-redux-toastr";

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
    id: "balance",
    label: "Wallet Ballance",
  },
  {
    id: "date",
    label: "Joining Date",
  },
  {
    id: "status",
    label: "Status",
  },
];

const Users = () => {
  const list = [1, 2, 3, 4];

  // const { register, formState, handleSubmit } = useForm();
  // const [isLoadng, setIsLoading] = useState(false);
  let navigate = useNavigate();

  // const onSubmit = (vals) => {
  //   console.log(vals);
  //   setIsLoading(false);
  // };
  // const roleOption = [
  //   {
  //     label: "None Financial",
  //     value: "none",
  //   },
  //   {
  //     label: "None Financial2",
  //     value: "none2",
  //   },
  // ];
  const {
    data: users = null,
    isLoading: loading,
    isError,
    error,
  } = useGetUsersQuery();
  console.log(users, "users");
  const viewUser = (id) => {
    navigate(`user_detail/${id}`);
  };
  // click table
  const [selected, setSelected] = useState([]);
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.data.rows.map((n) => n.id);
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
  const [show, setShow] = useState(false);
  console.log(selected, "selected");
  // update
  const [update, { isLoading: activateLoading }] = useUpdateBatchMutation();
  const onSubmit = async (bool) => {
    const payload = {
      active: bool,
    };
    try {
      // call login trigger from rtk query
      const response = await update({
        credentials: payload,
        id: selected,
      }).unwrap();
      console.log(response);
      toastr.success("Success", "Successful");
    } catch (err) {
      if (err.data) toastr.error("Error", err.data.message);
      else toastr.error("Error", "Something went wrong, please try again...");
    }
  };
  return (
    <AdminDashboardLayout active="user">
      <div className="pd-user">
        <div className="topicPart">
          <p className="pageTitle">Users</p>
          <div className="btnBox">
            {/* <button className="download">
              <Download className="fill2" /> Export <Fill className="fill" />
            </button> */}
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button btn btn-success mb-3"
              table="table-to-xls"
              filename="Users"
              sheet="tablexls"
              buttonText="Export"
            />
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
                  onSubmit(true);
                }}
                className="pop"
              >
                Activate
              </button>
              <button
                onClick={() => {
                  onSubmit(false);
                }}
                className="pop"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>

        <div className="whiteContainer">
          <div className="tableHead">
            <p className="tableTitle">Admin Users</p>
            <input type="text" placeholder="Search" className="search" />
          </div>

          <div className="downloadTable" style={{ display: "none" }}>
            <table id="table-to-xls">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Wallet</th>
                  <th>Joining Date</th>

                  <th className="extraTh">Status</th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  users.message !== "no user available!" &&
                  users.users &&
                  users.users.map((item) => {
                    return (
                      <tr>
                        <td>
                          {" "}
                          <p className="name">{`${item.firstName} ${item.lastName}`}</p>
                        </td>
                        <td align="left">{item.phone}</td>
                        <td>{500}</td>
                        <td align="left">
                          {moment(item.updatedAt).format("L")}
                        </td>
                        <td> {item.active ? "Active" : "Inactive"}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="overflowTable">
            {isError ? (
              <NoProduct msg="There is a problem...">
                <FontAwesomeIcon icon={faCommentSlash} />
              </NoProduct>
            ) : loading ? (
              <LoadingTable />
            ) : users.users ? (
              <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                  <EnhancedTableHead
                    headCells={headCells}
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={users.users.length}
                    align="left"
                    isCheck={true}
                  />
                  <TableBody>
                    {stableSort(users.users, getComparator(order, orderBy)).map(
                      (row, index) => {
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
                                onChange={(event) => handleClick(event, row.id)}
                              />
                            </TableCell>

                            <TableCell align="left">
                              {" "}
                              <div className="nameDiv">
                                {/* <img
                                  className="userImg"
                                  src={row.image}
                                  alt="user"
                                /> */}

                                <Avatar
                                  alt={row.firstName}
                                  src={row.image}
                                  sx={{ width: 35, height: 35 }}
                                />
                                <div className="nameBox">
                                  <p className="name">
                                    {row.firstName} {row.lastName}
                                  </p>
                                  <p className="email">{row.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell align="left">{row.phone}</TableCell>
                            <TableCell align="left">
                              {formatCurrency(540000)}
                            </TableCell>

                            <TableCell align="left">
                              {moment(row.updatedAt).format("L")}
                            </TableCell>
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
                              {" "}
                              <button
                                onClick={() => {
                                  viewUser(row.id);
                                }}
                                className="view"
                              >
                                View
                              </button>
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
            {/* <table className="unset">
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
                  <th>Name</th>
                  <th>Mobile No</th>
                  <th className="extraTh">
                    Wallet Balance <img src={shape} alt="shape" />{" "}
                  </th>
                  <th className="extraTh">
                    Joining Date <img src={shape} alt="shape" />{" "}
                  </th>
                  <th className="extraTh">
                    Status <img src={shape} alt="shape" />{" "}
                  </th>
                  <th>View</th>
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
                      <td className="phone">08087427344</td>
                      <td className="role">₦ 54,000</td>
                      <td className="role">10 Nov, 2021</td>
                      <td className="statusTd">
                        <p className="status active">Active</p>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            viewUser(1);
                          }}
                          className="view"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
                <tr></tr>
              </tbody>
            </table> */}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default Users;
