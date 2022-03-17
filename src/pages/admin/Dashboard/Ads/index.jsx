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
  useAddAdvertMutation,
  useApproveDealMutation,
  useGetAllCategoryQuery,
  useGetSponsoredDealQuery,
} from "../../../../services/api";
import { toastr } from "react-redux-toastr";
import LoadingTable from "../../../../component/loadingTable";
import NoProduct from "../../../../component/NoProduct";
import InputField from "../../../../component/input/indexField";

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
import moment from "moment";
import Modal from "../../../../component/Modal";
import FormHead from "../../../../component/formHead";
import { FormProvider, useForm } from "react-hook-form";
import Textarea from "../../../../component/input/textarea";
import uploadImg from "../../../../hook/UploadImg";
import SubmitBtn from "../../../../component/submitBtn";
import RajiFile from "../../../../component/input/RajiFile";
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
      Approve
    </button>

    <button
      onClick={() => {
        approve("DECLINED", id);
      }}
      className="btn-noBg"
    >
      Decline
    </button>
  </DropDownWrapper>
);

const headCells = [
  {
    id: "title",
    label: "Campaign Title",
  },
  {
    id: "base_price",
    label: "Base Price",
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
    data: deal = null,
    isLoading: loading,
    isError,
  } = useGetSponsoredDealQuery({ page, search });

  //
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
  const methods = useForm();
  const [modal, setModal] = useState(false);
  const closeModal = () => {
    setModal(!modal);
  };
  const [addResponse, { isLoading }] = useAddAdvertMutation();
  const onSubmit = async (vals) => {
    let url = await uploadImg(vals.images[0], "n3mtymsx");
    console.log(url);
    const payload = {
      ...vals,
      images: [
        {
          url: url.secure_url,
          name: vals.images[0].name,
          mimeType: url.format,
        },
      ],
    };
    console.log(payload);
    try {
      const response = await addResponse(payload).unwrap();
      closeModal();
      toastr.success("Success", response.message);
      methods.reset();
    } catch (err) {
      if (err.status === "FETCH_ERROR")
        toastr.error("Error", "Something went wrong, please try again...");
      else toastr.error("Error", err.data._meta.error.message);
    }
  };

  return (
    <AdminDashboardLayout active="ads">
      <div className="pd-ads">
        <AnimatePresence>
          {modal && (
            <Modal>
              <FormProvider {...methods}>
                <form
                  onSubmit={methods.handleSubmit(onSubmit)}
                  className="createAdmin"
                  action=""
                >
                  <FormHead title={"Create Announcement"} subTitle={""} />

                  <InputField
                    type="text"
                    name="title"
                    placeholder="Title"
                    label="Title"
                    id="title"
                  />
                  <RajiFile
                    name="images"
                    placeholder="Image"
                    label="Image"
                    id="image"
                    // setFiler={setImgUpload}
                  />
                  <InputField
                    type="date"
                    name="publishDate"
                    placeholder="Date"
                    label="Publish Date"
                    id="date"
                  />
                  <Textarea
                    type="text"
                    name="description"
                    placeholder="Description"
                    label="Description"
                    id="description"
                  />
                  <SubmitBtn
                    isLoading={isLoading}
                    // disable={imgupload ? false : true}
                    // disable={imgupload ? false : true}
                    btnText="Add Announcement"
                  />
                  <button type="button" onClick={closeModal} className="cancel">
                    Cancel
                  </button>
                </form>
              </FormProvider>
            </Modal>
          )}
        </AnimatePresence>
        <div className="topicPart">
          <p className="pageTitle">Ads Manager</p>
          <div className="btnBox">
            <button onClick={closeModal} className="create">
              Create Advert
            </button>
          </div>
        </div>

        <div style={{ marginTop: "20px" }} className="whiteContainer">
          <div className="tableHead">
            <p className="tableTitle">Posted Campaign</p>
            <input
              type="text"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Search"
              className="search"
            />
          </div>

          <div className="overflowTable">
            {loading ? (
              <LoadingTable />
            ) : isError ? (
              <NoProduct msg="Something went wrong...">
                <FontAwesomeIcon icon={faCommentSlash} />
              </NoProduct>
            ) : deal.data.length ? (
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
                      rowCount={deal.data.length}
                      align="left"
                    />
                    <TableBody>
                      {stableSort(deal.data, getComparator(order, orderBy)).map(
                        (item) => {
                          return (
                            <TableRow tabIndex={-1} key={item._id}>
                              <TableCell align="left">
                                <div className="nameDiv">
                                  <Avatar
                                    alt={"user"}
                                    src={item.user ? item.user.avatar : ""}
                                    sx={{ width: 35, height: 35 }}
                                  />
                                  <div className="nameBox">
                                    <p className="name">
                                      {item.user &&
                                        `${item.user.firstName} ${item.user.lastName}`}
                                    </p>
                                    <p className="email">
                                      {item.user && item.user.email}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell align="left">
                                {item.basePrice}
                              </TableCell>
                              <TableCell align="left">{item.clicks}</TableCell>
                              <TableCell align="left">
                                {moment(item.startDate).format("L")}
                              </TableCell>
                              <TableCell align="left">
                                {moment(item.endDate).format("L")}
                              </TableCell>
                              <TableCell align="left">
                                <p
                                  className={`status ${item.status.toLowerCase()}`}
                                >
                                  {item.status.toLowerCase()}
                                </p>
                              </TableCell>
                              <TableCell className="action" align="left">
                                <SubscribeDropDown
                                  id={item._id}
                                  approve={approveDeal}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}
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
              count={deal && deal.total_pages}
              shape="rounded"
            />
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default Ads;
