import AdminDashboardLayout from "../../../../component/adminDashboardLayout";
import "./style.scss";

import { useState } from "react";
import Modal from "../../../../component/Modal";
import FormHead from "../../../../component/formHead";
import { FormProvider, useForm } from "react-hook-form";
import SubmitBtn from "../../../../component/submitBtn";
import SuccessModal from "../../../../component/popModal";
import AddIcon from "@mui/icons-material/Add";

import {
  useAddPlanMutation,
  useDeletePlanMutation,
  useEditPlanMutation,
  useGetPlanQuery,
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
  formatCurrency,
  getComparator,
  stableSort,
  toCurrency,
} from "../../../../utils/utils";
import { Button, IconButton, Pagination } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DropDownWrapper from "../../../../component/DropDownWrapper/index";

import { moveIn } from "../../../../utils/variants";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";

import moment from "moment";
import { useGetUser } from "../../../../hook/getUserHook";
import Currency from "../../../../component/Currency";
import SelectField from "../../../../component/input/select";
// dropdown
export const SubscribeDropDown = ({
  id,
  setEditId,
  deletePlan,
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
        deletePlan(id);
      }}
      className="btn-noBg"
    >
      Delete
    </button>

    <button
      onClick={() => {
        setEditId(id);
        onEdit({
          name: values.name,
          amount: values.amount,
          priority: values.priority,
          features: values.features,
        });
        closeModal();
      }}
      className="btn-noBg"
    >
      Edit
    </button>
  </DropDownWrapper>
);

const PlanSide = () => {
  const [modal, setModal] = useState(false);
  const [modalPop, setModalPop] = useState(false);
  const methods = useForm();
  const methods2 = useForm();

  const [editModal, setEditModal] = useState(false);
  const [editId, setEditId] = useState("");

  const [recent, setRecent] = useState("");
  const [selector, setSelector] = useState([]);
  const addSelector = (type) => {
    setSelector([...selector, type]);
    setRecent("");
  };
  const removeSelector = (type) => {
    let newSelect = selector.filter((item) => {
      return item !== type;
    });
    setSelector(newSelect);
  };

  // pagination

  const [page, setPage] = useState(1);
  const handlePage = (e, value) => {
    setPage(value);
  };

  // get category
  const {
    data: plan = null,
    isLoading: loading,
    isError,
  } = useGetPlanQuery(page);
  console.log(plan);

  // add plan
  const [addResponse, { isLoading }] = useAddPlanMutation();
  const onSubmit = async (vals) => {
    const payload = {
      ...vals,
      features: selector,
    };
    if (selector.length) {
      try {
        const response = await addResponse(payload).unwrap();
        closeModal();
        toastr.success("Success", response.message);
        setSelector([]);
        methods.reset();
      } catch (err) {
        if (err.status === "FETCH_ERROR")
          toastr.error("Error", "Something went wrong, please try again...");
        else toastr.error("Error", err.data._meta.error.message);
      }
    } else {
      toastr.error("Error", "Add Feature");
    }
  };

  // edit category
  const [editResponse, { isLoading: editLoading }] = useEditPlanMutation();
  const onEdit = ({ name, amount, priority, features }) => {
    methods2.setValue("name", name);
    methods2.setValue("amount", amount);
    methods2.setValue("priority", priority);
    setSelector(features);
  };
  const editPlan = async (vals) => {
    console.log(vals);

    const payload = {
      ...vals,
      features: selector,
    };
    if (selector.length) {
      try {
        const response = await editResponse({
          credentials: payload,
          id: editId,
        }).unwrap();

        toastr.success("Success", response.message);
        methods2.reset();
        setSelector([]);

        // methods2.reset();
      } catch (err) {
        if (err.status === "FETCH_ERROR")
          toastr.error("Error", "Something went wrong, please try again...");
        else toastr.error("Error", err.data._meta.error.message);
      }
    } else {
      toastr.error("Error", "Add Feature");
    }
  };

  // delete category
  const [delResponse, { isLoading: delLoading }] = useDeletePlanMutation();
  const deletePlan = async (id) => {
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
      id: "name",
      label: "name",
    },
    {
      id: "amount",
      label: "Amount",
    },
    {
      id: "priority",
      label: "Priority",
    },
    {
      id: "date",
      label: "Date",
    },
  ];
  // table magic
  const [order, setOrder] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const { currency } = useGetUser();
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <AdminDashboardLayout active="plan">
      <div className="pd-plan">
        <AnimatePresence>
          {modal && (
            <Modal>
              <div className="whiteForm over">
                <FormProvider {...methods}>
                  <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    // className="loginBox2"
                    action=""
                  >
                    <FormHead title={"Create Plan"} />
                    <InputField
                      type="text"
                      name="name"
                      placeholder="Plan name"
                      label="Plan name"
                      id="name"
                      errMsg="invalid input"
                    />
                    <InputField
                      type="number"
                      name="amount"
                      placeholder=""
                      label="Amount"
                      id="amount"
                      errMsg="invalid input"
                    />
                    <InputField
                      type="number"
                      name="priority"
                      placeholder=""
                      label="Priority"
                      id="priority"
                      errMsg="invalid input"
                    />
                    <div className="form-group">
                      <label htmlFor=""> Add Features</label>
                      <div className="input-icon-wrap">
                        <input
                          value={recent}
                          onChange={(e) => {
                            setRecent(e.target.value);
                          }}
                          type="text"
                        />
                      </div>
                      <Button
                        onClick={() => {
                          addSelector(recent);
                        }}
                        startIcon={<AddIcon />}
                      >
                        Add
                      </Button>
                    </div>

                    <div className="listSelected">
                      {selector.map((item) => {
                        return (
                          <div className="box">
                            <p>{item}</p>{" "}
                            <p
                              onClick={() => {
                                removeSelector(item);
                              }}
                              className="can"
                            >
                              x
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <SubmitBtn isLoading={isLoading} btnText="Create" />
                    <button
                      type="button"
                      onClick={() => {
                        setModal(false);
                      }}
                      className="back"
                    >
                      Back
                    </button>
                  </form>
                </FormProvider>
              </div>
            </Modal>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {editModal && (
            <Modal>
              <div className="whiteForm">
                <FormProvider {...methods2}>
                  <form
                    onSubmit={methods2.handleSubmit(editPlan)}
                    // className="loginBox2"
                    action=""
                  >
                    <FormHead title={"Edit Plan"} />
                    <InputField
                      type="text"
                      name="name"
                      placeholder="Plan name"
                      label="Plan name"
                      id="name"
                      errMsg="invalid input"
                    />
                    <InputField
                      type="number"
                      name="amount"
                      placeholder=""
                      label="Amount"
                      id="amount"
                      errMsg="invalid input"
                    />
                    <SelectField
                      name="country"
                      label="Country"
                      errMsg="invalid field"
                      // required={false}
                      selectOption={[
                        {
                          label: "Select Country",
                          value: "",
                        },
                        {
                          label: "NIGERIA",
                          value: "NIGERIA",
                        },
                        {
                          label: "UNITED",
                          value: "UNITED KINGDOM",
                        },
                      ]}
                    />
                    <InputField
                      type="number"
                      name="priority"
                      placeholder=""
                      label="Priority"
                      id="priority"
                      errMsg="invalid input"
                    />
                    <div className="form-group">
                      <label htmlFor=""> Add Features</label>
                      <div className="input-icon-wrap">
                        <input
                          value={recent}
                          onChange={(e) => {
                            setRecent(e.target.value);
                          }}
                          type="text"
                        />
                      </div>
                      <Button
                        onClick={() => {
                          addSelector(recent);
                        }}
                        startIcon={<AddIcon />}
                      >
                        Add
                      </Button>
                    </div>

                    <div className="listSelected">
                      {selector.map((item) => {
                        return (
                          <div className="box">
                            <p>{item}</p>{" "}
                            <p
                              onClick={() => {
                                removeSelector(item);
                              }}
                              className="can"
                            >
                              x
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <SubmitBtn isLoading={editLoading} btnText="Update" />
                    <button
                      type="button"
                      onClick={() => {
                        setEditModal(false);
                      }}
                      className="back"
                    >
                      Back
                    </button>
                  </form>
                </FormProvider>
              </div>
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
          <p className="pageTitle">Plan</p>
          <div className="btnBox">
            <button onClick={closeModal} className="create">
              Add Plan
            </button>
          </div>
        </div>

        <div className="whiteContainer">
          <div className="tableHead">
            <p className="tableTitle">Plan Lists</p>
            {/* <input type="text" placeholder="Search" className="search" /> */}
          </div>

          <div className="overflowTable">
            {loading ? (
              <LoadingTable />
            ) : isError ? (
              <NoProduct msg="Something went wrong...">
                <FontAwesomeIcon icon={faCommentSlash} />
              </NoProduct>
            ) : plan.data.length ? (
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
                      rowCount={plan.data.length}
                      align="left"
                    />
                    <TableBody>
                      {stableSort(plan.data, getComparator(order, orderBy)).map(
                        (item) => {
                          return (
                            <TableRow tabIndex={-1} key={item._id}>
                              <TableCell align="left">{item.name}</TableCell>
                              <TableCell align="left">
                                {toCurrency(currency, item.amount)}
                                <Currency
                                  country={item.country}
                                  price={item.amount || 0}
                                />
                              </TableCell>
                              <TableCell align="left">
                                {item.priority}
                              </TableCell>
                              <TableCell align="left">
                                {moment(item.createdAt).format("L")}
                              </TableCell>

                              <TableCell className="action" align="left">
                                <SubscribeDropDown
                                  id={item._id}
                                  closeModal={closeEditModal}
                                  setEditId={setEditId}
                                  deletePlan={deletePlan}
                                  onEdit={onEdit}
                                  values={{
                                    name: item.name,
                                    amount: item.amount,
                                    priority: item.priority,
                                    features: item.features,
                                  }}
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
              count={
                plan &&
                Math.ceil(parseInt(plan._meta.pagination.total_count) / 10)
              }
              shape="rounded"
            />
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default PlanSide;
