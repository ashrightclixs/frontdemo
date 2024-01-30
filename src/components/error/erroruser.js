import { Link, Navigate, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import { useSearchParams } from "react-router-dom";
import styles from "../../styles/styles";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import alert from '../../assets/alert.png'

// import Customer from "./customer.sales";

const Error_User = ({ ToggleAlert }) => {

  const [data, setData] = useState([]);
  const [data1, setData1] = useState();
  const [filter, setfilter] = useState(false);
  const nav = useNavigate();
  const [DeleteID, setDeleteID] = useState([]);
  const [ID, setID] = useState("");
  const [customer, setcustomer] = useState(false);
  const [search, setsearch] = useState("");
  const [loader, setLoader] = useState(false);
  const { user } = useContext(AuthContext);
  // for checkbox
  const [isCheck, setIsCheck] = useState([]);
  const [all_data_check, setall_data_check] = useState(false);
  const [pagination, setpagination] = useState(1);
  const array1 = ["123", "123", "123322"];
  const [all_data, setall_data] = useState([]);
  const [loader_val, setloader_val] = useState();


  const [curr_date, setcurr_date] = useState();
  const [due_date, setdue_date] = useState();
  const [plan, setplan] = useState();
  const [status, setstatus] = useState();

  let currentDate = new Date().toJSON().slice(0, 10);

  var user_id = user._id;

  useEffect(() => {
    setloader_val(true);
    show(pagination);
  }, []);

  function getdate() {
    const date = new Date();
    const year = date.getFullYear();
    const getdate = new Date(date);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const full_date = [year, month, day].join('-');
    return full_date;
  }
  const compare_dates = (date1, date2) => {
    const date2_value = getdate();
    if (date1 > date2_value) { return "none"; }
    else if (date1 < date2_value) { return "red"; }
    else { return "none"; }
  }



  const paginate = (value) => {
    setpagination(value);
    show(value);
  }

  const show = (value) => {
    axios.get(`${process.env.REACT_APP_API_URL}/user/getuser`)
      .then((response) => {
        const data = response.data.filter((val, index) => {
          return val.isadmin === false;
        })
        console.log(data);
        setData(data);
        setData1(data);
      })

    setloader_val(false);
  }

  const handleClick = e => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter(item => item !== id));
    }
  };


  const delete_data = async (id) => {
    const cancel = document.getElementById("modal_cancel");
    setLoader(true);
    try {
      const url = `${process.env.REACT_APP_API_URL}/customer/delete?id=${id}`;
      const response = await axios.delete(url);
      // console.log(response);
      cancel.click()
      setLoader(false);
      ToggleAlert("Success", "Entry Deleted Successfully");
      show();
    }
    catch (error) {
      // console.log(error)
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        console.log(error.response.data.message)
      }
    }
  }

  const check_Availability = (val) => {
    console.log(val._id);
    setID(val._id);
    axios.get(`${process.env.REACT_APP_API_URL}/user/get?id=${val._id}`).then((response) => {
      setall_data_check(response.data);
    })
  }

  const handleSubmitRecived = async (e) => {
    e.preventDefault();
    console.log(
      curr_date,
      due_date,
      plan,
      status
    );
    try{
      // /userupdate
      const user_Data = `${process.env.REACT_APP_API_URL}/user/userupdate?id=${ID}&current_date=${curr_date}&due_date=${due_date}&status=${status}`;
      const dashboard_revenue_movement = await axios.post(user_Data, user_id);
      show();

    }catch(error) {
      console.log(error);
    }

    const modal_cancel = document.getElementById("modal_cancel");
    modal_cancel.click();
  }

  return (
    <>
      {loader_val === true && (
        <>
          <div style={{ textAlign: "center", marginTop: "10rem" }}>
            <div class="spinner-border" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        </>
      )}

      {loader_val === false && (
        <>
          <div className="main-card">
            <div
              class="modal fade"
              id="CustomerModal"
              tabindex="-1"
              role="dialog"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <form onSubmit={handleSubmitRecived}>
                <div class="modal-dialog modal-xl" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">
                        User Dues
                      </h5>
                      <button
                        type="button"
                        class="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                      <div className="table-responsive">
                        <table class="table table-bordered">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Current Date</th>
                              <th scope="col">Due Date</th>
                              <th scope="col">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {all_data_check &&
                              all_data_check.data.map((value, index) => (
                                <tr key={index}>
                                  <th scope="row">{index + 1}</th>
                                  <td>{value.current_date}</td>
                                  <td>{value.due_date}</td>
                                  <td>
                                    {value.status === true ? (
                                      <div
                                        className="btn btn-light"
                                        style={{ color: "green" }}
                                      >
                                        <i
                                          class="fa fa-check"
                                          aria-hidden="true"
                                        ></i>
                                      </div>
                                    ) : (
                                      <div
                                        className="btn btn-light"
                                        style={{ color: "green" }}
                                      >
                                        <i
                                          class="fa fa-clock"
                                          aria-hidden="true"
                                        ></i>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                        <div className="form-row">
                          <div className="col-md-12 mb-12">
                            <label htmlFor="validationCustsom01" className="h6">
                              Start Date
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              name="current_date"
                              id="validationCustom01"
                              onChange={(e) => setcurr_date(e.target.value)}
                              placeholder="Type to search contact"
                              style={styles.uiInput}
                            />
                          </div>
                          <div className="col-md-12 mb-12">
                            <label htmlFor="validationCustsom01" className="h6">
                              Due Date
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              name="due_date"
                              id="validationCustom01"
                              onChange={(e) => setdue_date(e.target.value)}
                              placeholder="Type to search contact"
                              style={styles.uiInput}
                            />
                          </div>

                          <div className="col-md-12 mb-12">
                            <label htmlFor="validationCustom01" className="h6">
                              Select a Plan
                            </label>
                            <select
                              className="custom-select mb-3 mr-3"
                              id="customer"
                              name="customer"
                              onChange={(e) => setplan(e.target.value)}
                              style={styles.uiInputSelect}
                              required
                            >
                              <option selected value="">
                                Please Select a Customer
                              </option>
                              <option value="2">2 User Plan</option>
                              <option value="4">4 User Plan</option>
                              <option value="6">6 User Plan</option>
                              <option value="8">8 User Plan</option>
                            </select>
                          </div>
                          <div className="col-md-12 mb-12">
                            <label htmlFor="validationCustom01" className="h6">
                              Select a Status
                            </label>
                            <select
                              className="custom-select mb-3 mr-3"
                              id="status"
                              name="status"
                              onChange={(e) => setstatus(e.target.value)}
                              style={styles.uiInputSelect}
                              required
                            >
                              <option selected value="">
                                Please Select a Status
                              </option>
                              <option value="true">Allow</option>
                              <option value="false">Not Allow</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        className="btn px-md-4 p-1 btn-primary mb-2 ml-2"
                        style={styles.btnRadius}
                        data-dismiss="modal"
                        id="modal_cancel"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        class="btn btn-success mb-2 px-md-4 p-1 mr-2"
                        style={styles.btnRadius}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="px-md-4 pt-md-4 px-1 pt-1">
              <div className="d-flex justify-content-between flex-md-row flex-column my-2 border-bottom py-3">
                <h4 className="mb-md-0 text-center text-md-left">Error 404</h4>
              </div>
              <div className="d-flex justify-content-between flex-md-row flex-column my-2 py-3">
                <div className="d-flex justify-content-end flex-md-row flex-column">
                  {/* approved select */}

                  {/* <div className="text-center mx-md-2 my-2 my-md-0">
                <button className="btn btn-md btn-primary p-1 p-md-3"
                  onClick={approved}>
                  Approve selected Quotation
                </button>
              </div> */}
                  {/* <div className="text-center mx-md-2 my-2 my-md-0"> */}

                  {/* <button className="btn btn-md btn-primary p-1 p-md-3">
                    Export to excel
                  </button> */}
                  {/* </div> */}
                </div>
              </div>

              {/* data-toggle="modal"
                data-target="#filter_quotation" */}
              <div
                className={
                  filter == true
                    ? "d-flex justify-content-between flex-md-row flex-column my-2 py-3"
                    : "d-none"
                }
              >
                <div className="text-center my-2 my-md-0 order-last order-md-first">
                  <button
                    type="button"
                    class={
                      customer === true ? "btn btn-success" : "btn btn-light"
                    }
                    onClick={() => setcustomer(!customer)}
                    style={styles.btnRadius}
                  >
                    User
                  </button>
                </div>
              </div>

              <div className={customer === true ? "form-group row" : "d-none"}>
                <div className="col-sm-4">
                  <label htmlFor="validationCustom01" className="h6">
                    User Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="search customer"
                    name="search"
                    onChange={(e) => setsearch(e.target.value)}
                    placeholder="Search by User Name"
                    required
                    style={styles.uiInput}
                  />
                </div>
              </div>
            </div>
            <div className="table-responsive px-md-4 pb-md-4 px-1 pb-1">
              <h1>Please recharge/upgrade your plan. Contact on Call or Whatsapp +92 332 2027538</h1>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Error_User;
