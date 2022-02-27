import AdminDashboardLayout from "../../../../component/adminDashboardLayout";
import "./style.scss";
import { ReactComponent as Fill } from "../../../../assets/icons/Fill.svg";
import shape from "../../../../assets/icons/shape.svg";
import { useState } from "react";
import Modal from "../../../../component/Modal";
import FormHead from "../../../../component/formHead";
import { FormProvider, useForm } from "react-hook-form";
import SubmitBtn from "../../../../component/submitBtn";
import SuccessModal from "../../../../component/popModal";
import TableDrop from "../../../../component/TableDrop";
import Textarea from "../../../../component/input/textarea";
import {
  useActivateCategoryMutation,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useDisableCategoryMutation,
  useEditCategoryMutation,
  useGetAllCategoryQuery,
} from "../../../../services/api";
import NoProduct from "../../../../component/NoProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentSlash } from "@fortawesome/free-solid-svg-icons";
import LoadingTable from "../../../../component/loadingTable";
import { toastr } from "react-redux-toastr";
import InputField from "../../../../component/input/indexField";

import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import EnhancedTableHead from "../../../../component/EnhancedTableHead";
import {
  getComparator,
  stableSort,
  truncateString,
} from "../../../../utils/utils";
import { IconButton, Pagination } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DropDownWrapper from "../../../../component/DropDownWrapper/index";
import RajiFile from "../../../../component/input/RajiFile";
import { moveIn } from "../../../../utils/variants";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";
import uploadImg from "../../../../hook/UploadImg";
// dropdown
export const SubscribeDropDown = ({
  id,
  activate,
  disable,
  setEditId,
  deleteCat,
  values,
  closeModal,
  onEdit,
}) => (
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
        activate(id);
      }}
      className="btn-noBg"
    >
      Activate
    </button>

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
        deleteCat(id);
      }}
      className="btn-noBg"
    >
      Delete
    </button>

    <button
      onClick={() => {
        setEditId(id);
        onEdit({
          percentageIncrease: values.percentageIncrease,
          description: values.description,
          charge: values.charge,
          categoryName: values.categoryName,
        });
        closeModal();
      }}
      className="btn-noBg"
    >
      Edit
    </button>
  </DropDownWrapper>
);

const Category = () => {
  const list = [1, 2, 3];
  const [modal, setModal] = useState(false);
  const [modalPop, setModalPop] = useState(false);
  const methods = useForm();
  const methods2 = useForm();

  const [editModal, setEditModal] = useState(false);
  const [editId, setEditId] = useState("");
  const [imgupload, setImgUpload] = useState("");

  // pagination

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

  // add category
  const [addResponse, { isLoading }] = useAddCategoryMutation();
  const onSubmit = async (vals) => {
    let url = await uploadImg(vals.image[0], "n3mtymsx");

    const payload = {
      ...vals,
      image: url.secure_url,
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

  // edit category
  const [editResponse, { isLoading: editLoading }] = useEditCategoryMutation();
  const onEdit = ({
    categoryName,
    percentageIncrease,
    charge,
    description,
  }) => {
    methods2.setValue("categoryName", categoryName);
    methods2.setValue("percentageIncrease", percentageIncrease);
    methods2.setValue("charge", charge);
    methods2.setValue("description", description);
  };
  const editCategory = async (vals) => {
    console.log(vals);
    let url = await uploadImg(vals.image[0], "n3mtymsx");

    const payload = {
      ...vals,
      image: url.secure_url,
    };
    try {
      const response = await editResponse({
        credentials: payload,
        id: editId,
      }).unwrap();

      toastr.success("Success", response.message);
      // methods2.reset();
    } catch (err) {
      if (err.status === "FETCH_ERROR")
        toastr.error("Error", "Something went wrong, please try again...");
      else toastr.error("Error", err.data._meta.error.message);
    }
  };

  // activate category
  const [activateResponse, { isLoading: activateLoading }] =
    useActivateCategoryMutation();
  const activateCategory = async (id) => {
    const payload = {
      active: true,
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

  // disable category
  const [disableResponse, { isLoading: disableLoading }] =
    useDisableCategoryMutation();
  const disableCategory = async (id) => {
    const payload = {
      active: false,
    };
    try {
      const response = await disableResponse({
        credentials: payload,
        id: id,
      }).unwrap();

      toastr.success("Success", response.message);
    } catch (err) {
      if (err.status === "FETCH_ERROR")
        toastr.error("Error", "Something went wrong, please try again...");
      else toastr.error("Error", err.data._meta.error.message);
    } finally {
    }
  };

  // delete category
  const [delResponse, { isLoading: delLoading }] = useDeleteCategoryMutation();
  const deleteCat = async (id) => {
    try {
      const response = await delResponse({ id: id }).unwrap();

      toastr.success("Success", response.message);
    } catch (err) {
      if (err.status === "FETCH_ERROR")
        toastr.error("Error", "Something went wrong, please try again...");
      else toastr.error("Error", err.data._meta.error.message);
    } finally {
    }
  };

  const closeModal = () => {
    setModal(!modal);
  };
  const closeEditModal = () => {
    setEditModal(!editModal);
  };
  const closeModalPop = () => {
    setModal(!modal);
  };

  // table head
  const headCells = [
    {
      id: "id",
      label: "ID",
    },
    {
      id: "name",
      label: "Name",
    },
    {
      id: "description",
      label: "Description",
    },
    {
      id: "product",
      label: "Products Assigned",
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

  console.log(imgupload);
  return (
    <AdminDashboardLayout active="category">
      <div className="pd-category">
        <AnimatePresence>
          {modal && (
            <Modal>
              <FormProvider {...methods}>
                <form
                  onSubmit={methods.handleSubmit(onSubmit)}
                  className="createAdmin"
                  action=""
                >
                  <FormHead title={"Create Category"} subTitle={""} />
                  <RajiFile
                    name="image"
                    placeholder="Categoy Image"
                    label="Category Image"
                    id="image"
                    // setFiler={setImgUpload}
                  />
                  <InputField
                    type="text"
                    name="name"
                    placeholder="Category Name"
                    label="Name"
                    id="category_name"
                  />
                  <InputField
                    type="number"
                    name="percentageIncrease"
                    placeholder=""
                    label="Percentage Increase"
                    id="percentageIncrease"
                  />
                  <InputField
                    type="number"
                    name="charge"
                    placeholder=""
                    label="Charge (%)"
                    id="platformFee"
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
                    btnText="Add Category"
                  />
                  <button onClick={closeModal} className="cancel">
                    Cancel
                  </button>
                </form>
              </FormProvider>
            </Modal>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {editModal && (
            <Modal>
              <FormProvider {...methods2}>
                <form
                  onSubmit={methods2.handleSubmit(editCategory)}
                  className="createAdmin"
                  action=""
                >
                  <FormHead title={"Edit Category"} subTitle={""} />
                  <RajiFile
                    name="image"
                    placeholder="Categoy Image"
                    label="Category Image"
                    id="image"
                    setFiler={setImgUpload}
                    required={false}
                  />
                  <Textarea
                    type="text"
                    name="description"
                    placeholder="Description"
                    label="Description"
                    id="description"
                    required={false}
                  />
                  <InputField
                    type="number"
                    name="percentageIncrease"
                    placeholder=""
                    label="Percentage Increase"
                    required={false}
                    id="percentageIncrease"
                  />
                  <InputField
                    type="number"
                    name="charge"
                    placeholder=""
                    label="Charge (%)"
                    id="platformFee"
                    required={false}
                  />

                  <SubmitBtn isLoading={editLoading} btnText="Edit Category" />
                  <button onClick={closeEditModal} className="cancel">
                    Cancel
                  </button>
                </form>
              </FormProvider>
            </Modal>
          )}
        </AnimatePresence>
        {modalPop && (
          <SuccessModal
            closeModal={closeModalPop}
            text={"Category addedd successfully!!"}
            d
          />
        )}
        <div className="topicPart">
          <p className="pageTitle">Categories</p>
          <div className="btnBox">
            <button onClick={closeModal} className="create">
              Add Category
            </button>
          </div>
        </div>

        <div className="whiteContainer">
          <div className="tableHead">
            <p className="tableTitle">Categories Lists</p>
            {/* <input type="text" placeholder="Search" className="search" /> */}
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
                                activate={activateCategory}
                                disable={disableCategory}
                                closeModal={closeEditModal}
                                setEditId={setEditId}
                                deleteCat={deleteCat}
                                onEdit={onEdit}
                                values={{
                                  categoryName: item.categoryName,
                                  description: item.description,
                                  percentageIncrease: item.percentageIncrease,
                                  charge: item.charge,
                                }}
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
          </div>
          <div className="pagination-wrap">
            <Pagination
              color="primary"
              onChange={handlePage}
              count={
                category &&
                Math.ceil(parseInt(category._meta.pagination.total_count) / 10)
              }
              shape="rounded"
            />
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default Category;
