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
import { IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DropDownWrapper from "../../../../component/DropDownWrapper/index";
import RajiFile from "../../../../component/input/RajiFile";
// dropdown
export const SubscribeDropDown = ({
  id,
  activate,
  disable,
  setEditId,
  deleteCat,
  closeModal,
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

  const [editModal, setEditModal] = useState(false);
  const [editId, setEditId] = useState("");
  const [imgupload, setImgUpload] = useState("");
  // get category
  const {
    data: category = [],
    isLoading: loading,
    isError,
    error,
  } = useGetAllCategoryQuery();

  // add category
  const [addResponse, { isLoading }] = useAddCategoryMutation();
  const onSubmit = async (vals) => {
    const payload = {
      ...vals,
      image: imgupload,
    };
    console.log(payload);
    try {
      const response = await addResponse(payload).unwrap();
      closeModal();
      toastr.success("Success", response.message);
    } catch (err) {
      if (err.data) toastr.error("Error", err.data.message);
      else toastr.error("Error", "Something went wrong, please try again...");
    }
  };

  // edit category
  const [editResponse, { isLoading: editLoading }] = useEditCategoryMutation();
  const editCategory = async (vals) => {
    console.log(vals);
    const payload = {
      ...vals,
      image: imgupload,
    };
    try {
      const response = await editResponse({
        credentials: payload,
        id: editId,
      }).unwrap();

      toastr.success("Success", response.message);
    } catch (err) {
      if (err.data) toastr.error("Error", err.data.message);
      else toastr.error("Error", "Something went wrong, please try again...");
    }
  };

  // activate category
  const [activateResponse, { isLoading: activateLoading }] =
    useActivateCategoryMutation();
  const activateCategory = async (id) => {
    try {
      const response = await activateResponse({ id: id }).unwrap();

      toastr.success("Success", response.message);
    } catch (err) {
      if (err.data) toastr.error("Error", err.data.message);
      else toastr.error("Error", "Something went wrong, please try again...");
    }
  };

  // disable category
  const [disableResponse, { isLoading: disableLoading }] =
    useDisableCategoryMutation();
  const disableCategory = async (id) => {
    try {
      const response = await disableResponse({ id: id }).unwrap();

      toastr.success("Success", response.message);
    } catch (err) {
      if (err.data) toastr.error("Error", err.data.message);
      else toastr.error("Error", "Something went wrong, please try again...");
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
      if (err.data) toastr.error("Error", err.data.message);
      else toastr.error("Error", "Something went wrong, please try again...");
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
                  setFiler={setImgUpload}
                />
                <InputField
                  type="text"
                  name="categoryName"
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
                  disable={imgupload ? false : true}
                  btnText="Add Category"
                />
                <button onClick={closeModal} className="cancel">
                  Cancel
                </button>
              </form>
            </FormProvider>
          </Modal>
        )}
        {editModal && (
          <Modal>
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(editCategory)}
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
                />
                <Textarea
                  type="text"
                  name="description"
                  placeholder="Description"
                  label="Description"
                  id="description"
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

                <SubmitBtn isLoading={editLoading} btnText="Edit Category" />
                <button onClick={closeEditModal} className="cancel">
                  Cancel
                </button>
              </form>
            </FormProvider>
          </Modal>
        )}
        {modalPop && (
          <SuccessModal
            closeModal={closeModalPop}
            text={"Category addedd successfully!!"}
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
            <input type="text" placeholder="Search" className="search" />
          </div>

          <div className="overflowTable">
            {loading ? (
              <LoadingTable />
            ) : category.length ? (
              <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                  <EnhancedTableHead
                    headCells={headCells}
                    // numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    // onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={category.length}
                    align="left"
                  />
                  <TableBody>
                    {stableSort(category, getComparator(order, orderBy)).map(
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
                              {truncateString(item._id, 10)}
                              {/* {item.id} */}
                            </TableCell>
                            <TableCell align="left">
                              {item.categoryName}
                            </TableCell>
                            <TableCell align="left">
                              {truncateString(item.description, 20)}
                            </TableCell>
                            <TableCell align="left">
                              {item.productsAssigned}
                            </TableCell>
                            <TableCell align="left">
                              <p
                                className={`status ${
                                  item.status === "active" ? "active" : "red"
                                }`}
                              >
                                {item.status}
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
              // <table className="unset">
              //   <thead>
              //     <tr>
              //       <th>ID</th>
              //       <th>Name</th>
              //       <th className="extraTh">Description</th>
              //       <th className="extraTh">
              //         Products Assigned <img src={shape} alt="shape" />{" "}
              //       </th>
              //       <th className="extraTh">
              //         Status <img src={shape} alt="shape" />{" "}
              //       </th>
              //       <th></th>
              //     </tr>
              //   </thead>
              //   <tbody>
              //     {category.map((item, i) => {
              //       return (
              //         <tr>
              //           <td className="">{i + 1}</td>
              //           <td className="phone">{item.categoryName}</td>
              //           <td className="collect">{item.description}</td>
              //           <td className="phone">{item.productsAssigned}</td>
              //           <td className="statusTd">
              //             <p
              //               className={`status ${
              //                 item.status === "active" ? "active" : "red"
              //               }`}
              //             >
              //               {item.status}
              //             </p>
              //           </td>
              //           <td className="action">
              //             <TableDrop
              //               fbutton={"Actvate"}
              //               sbutton={"Disable"}
              //               tbutton={"Edit"}
              //               fhandle={() => {
              //                 activateCategory(item._id);
              //               }}
              //               shandle={() => {
              //                 disableCategory(item._id);
              //               }}
              //               thandle={() => {
              //                 setEditId(item._id);
              //                 closeEditModal();
              //               }}
              //             />
              //           </td>
              //         </tr>
              //       );
              //     })}
              //   </tbody>
              // </table>
              <NoProduct msg="No Data Yet...">
                <FontAwesomeIcon icon={faCommentSlash} />
              </NoProduct>
            )}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default Category;
