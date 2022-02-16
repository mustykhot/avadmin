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
  useAddVendorMutation,
  useGetAllCategoryQuery,
  useGetAllPrivateVendorQuery,
} from "../../../../services/api";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import EnhancedTableHead from "../../../../component/EnhancedTableHead";
import {
  getComparator,
  moneyFormatter,
  stableSort,
} from "../../../../utils/utils";
import moment from "moment";
import NoProduct from "../../../../component/NoProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentSlash } from "@fortawesome/free-solid-svg-icons";
import LoadingTable from "../../../../component/loadingTable";
import { toastr } from "react-redux-toastr";
import uploadImg from "../../../../hook/UploadImg";
import { Avatar, Pagination } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";
import { moveIn } from "../../../../utils/variants";
const PrivateVendor = () => {
  const list = [1, 2, 3];

  const [toggleBtn, setToggleBtn] = useState("individual");
  const [modal, setModal] = useState(false);
  const { register, formState, handleSubmit } = useForm();
  const [phone, setPhone] = useState("");
  const ref = useRef();
  const [companyImg, setCompanyImg] = useState("");

  // get category
  const { data: category = [] } = useGetAllCategoryQuery();

  const FileChangeHandler = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCompanyImg(URL.createObjectURL(e.target.files[0]));
    } else {
      console.log("nothing");
    }
  };
  const handleToggle = (type) => {
    setToggleBtn(type);
  };

  const closeModal = () => {
    setModal(!modal);
  };

  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const handlePage = (e, value) => {
    setPage(value);
  };

  // get vendor
  const {
    data: vendor = [],
    isLoading: loading,
    isError,
    error,
  } = useGetAllPrivateVendorQuery({ page: page });
  console.log(vendor);
  // table head
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
      id: "deal_value",
      label: "Deal Value",
    },
    {
      id: "deal_posted",
      label: "Deals Posted",
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
  const [addVendor, { isLoading: loader }] = useAddVendorMutation();

  const [img, setImg] = useState("");
  const uploader = async (file) => {
    let url = await uploadImg(file, "n3mtymsx");
    setImg(url.secure_url);
  };
  const onSubmit = async (vals) => {
    const payload = {
      ...vals,
      phonenumber: phone,
      photo: img,
    };
    console.log(payload);

    try {
      const response = await addVendor(payload).unwrap();
      //  closeModal();

      toastr.success("Success", response.message);
    } catch (err) {
      if (err.data) toastr.error("Error", err.data.message);
      else toastr.error("Error", "Something went wrong, please try again...");
    }
  };

  return (
    <AdminDashboardLayout active="vendor">
      <AnimatePresence>
        {modal && (
          <Modal>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="createAdmin"
              action=""
            >
              <Input
                type="text"
                name="name"
                placeholder="Vendor's Name"
                label="Vendor's Name"
                id="vendor_name"
                register={register}
                errors={formState.errors}
                errMsg="invalid input"
              />
              <Input
                type="email"
                name="email"
                placeholder="Vendor's Email"
                label="Vendor's Email"
                id="vendor_email"
                register={register}
                errors={formState.errors}
                errMsg="invalid email input"
              />

              <Phone label={"Mobile no"} telVal={phone} setTelVal={setPhone} />
              <div className="companyLogoDiv2">
                <p className="label">Company Logo (Optional)</p>

                <div className="logoCover">
                  <label htmlFor="company">
                    <img src={companyImg ? companyImg : saveImg} alt="save" />
                    <p>
                      Each picture must not exceed 5 Mb Supported formats are
                      *.jpg, *.gif and *.png
                    </p>
                  </label>
                  <input
                    type="file"
                    ref={ref}
                    onChange={(e) => {
                      FileChangeHandler(e);
                      uploader(e.target.files[0]);
                    }}
                    hidden
                    name="company"
                    id="company"
                  />
                </div>
              </div>

              <SubmitBtn
                isLoading={loader}
                disable={img ? false : true}
                btnText="Submit"
              />
              <button onClick={closeModal} className="cancel">
                Cancel
              </button>
            </form>
          </Modal>
        )}
      </AnimatePresence>
      <div className="pd-privateVend">
        <div className="topicPart">
          <p className="pageTitle">Private Vendors</p>
          <div className="btnBox">
            <button className="download">
              Download <Fill className="fill" />
            </button>
            <button onClick={closeModal} className="create">
              New Vendor
            </button>
          </div>
        </div>

        {/* <div className="transactionNav">
          <button
            onClick={() => {
              handleToggle("individual");
            }}
            className={`auction ${toggleBtn === "individual" ? "active" : ""}`}
          >
            Individual
          </button>
          <button
            onClick={() => {
              handleToggle("corporate");
            }}
            className={`payment ${toggleBtn === "corporate" ? "active" : ""}`}
          >
            Corporate
          </button>
        </div> */}
        {toggleBtn === "individual" && (
          <div className="whiteContainer" style={{ marginTop: "20px" }}>
            <div className="tableHead">
              <p className="tableTitle">Vendors</p>
              <input type="text" placeholder="Search" className="search" />
            </div>

            <div className="overflowTable">
              {!isError ? (
                loading ? (
                  <LoadingTable />
                ) : vendor.rows.length ? (
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
                          // numSelected={selected.length}
                          order={order}
                          orderBy={orderBy}
                          // onSelectAllClick={handleSelectAllClick}
                          onRequestSort={handleRequestSort}
                          rowCount={vendor.rows.length}
                          align="left"
                        />
                        <TableBody>
                          {stableSort(
                            vendor.rows,
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
                                    <Avatar
                                      alt={"user"}
                                      src={item.photo}
                                      sx={{ width: 35, height: 35 }}
                                    />
                                    <div className="nameBox">
                                      <p className="name">{item.name}</p>
                                      <p className="email">{item.email}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell align="left">
                                  {item.phonenumber}
                                </TableCell>
                                <TableCell align="left">₦ 54,000</TableCell>

                                <TableCell align="left">5</TableCell>
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
              <div className="pagination-wrap">
                <Pagination
                  color="primary"
                  onChange={handlePage}
                  count={vendor && vendor.total_pages}
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

export default PrivateVendor;
