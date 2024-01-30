import { Link, UNSAFE_RouteContext, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios, { Axios } from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import styles from "../../styles/styles";

export const initialState = {
  // user_id: "",   default value
  pay_from: "-",
  // account_no: "",
  // date: "",
  purpose: "",
  // expense_no: "", deafult handlechange
  // currency: "", default handlechange
  expense_account: "",
  description: "-",
  amount: "",
  comments: "-",
};

const Add_Expense = ({ ToggleAlert }) => {
  const [bank, setbank] = useState([]); //tax value
  const [showformdata, setshowformdata] = useState(initialState); //form data passed
  const [amount, setamount] = useState(0); //set amount
  const [order_final, setorder_final] = useState(0); //set amount
  const navigate = useNavigate();
  const [curr_date, setcurr_date] = useState(getdate()); //data for customer
  const [bank_account, setbank_account] = useState("-"); //ware_house_from

  const [dashboard_account, setdashboard_account] = useState([]); //ware_house_from

  const [with_payment, setwith_payment] = useState(true); //ware_house_from
  const [loader, setLoader] = useState(false);

  const [loader_val, setloader_val] = useState(true);

  const { user } = useContext(AuthContext);
  var user_id = user._id;

  useEffect(() => {
    setloader_val(true);

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/accounts/bank_account?id=${user_id}`,
        {
          user_id: user_id,
        }
      )
      .then((response) => {
        setbank(response.data);
        if (response.data.length === 0) {
          ToggleAlert("Warning", "Please add Bank Account first");
        }
      })
      .catch((e) => {
        console.log(e);
      });

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/accounts/add_Expense?id=${user_id}`
      )
      .then((response) => {
        GenerateOrdernumber(response.data);
      })
      .catch((e) => {
        console.log("error");
      });

    setloader_val(false);
  }, []);

  const GenerateOrdernumber = (e) => {
    e.length != 0
      ? e.map((userx, index) =>
          e.length - 1 == index ? setorder_final(userx.expense_no + 1) : ""
        )
      : setorder_final(1000);
  };

  const handleChange = (e) => {
    if (e.target.name === "pay_from") {
      bank.map((userx, index) => {
        if (userx._id === e.target.value)
          setbank_account(userx.bank_account_number);
      });
    }
    if (e.target.name == "date") {
      setcurr_date(e.target.value);
    }
    if (e.target.name == "amount") {
      setamount(e.target.value);
    }
  

    setdashboard_account({
      user_id: user._id,
      date: getdate(),
      amount: amount,
      type: "expense",
    });
    setshowformdata({
      ...showformdata,
      [e.target.name]: e.target.value,
      user_id: user._id,
      currency: "Pakistani Rupees",
      expense_no: order_final,
      account_no: bank_account,
      date: curr_date,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const url = `${process.env.REACT_APP_API_URL}/accounts/add_Expense/add`;
      const response = await axios.post(url, showformdata);

      const dashboard_revenue_api = `${process.env.REACT_APP_API_URL}/dashboard/dashboard_revenue/add`;
      const dashboard_revenue_movement = await axios.post(
        dashboard_revenue_api,
        dashboard_account
      );

      setshowformdata(initialState);
      navigate("/accounts/expense");
      setLoader(false);
      setTimeout(() => {
        ToggleAlert("Success", "Entry recorded successfully");
      }, 1000);
    } catch (error) {
      console.log(error);
      if (e.response && e.response.status >= 400 && e.response.status <= 500) {
        console.log(e.response.data.message);
      }
    }
  };

  function getdate() {
    const date = new Date();
    const year = date.getFullYear();
    const getdate = new Date(date);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const full_date = [year, month, day].join("-");
    return full_date;
  }

  return (
    <>
      {/* {console.log(order_final)} */}
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
            <form onSubmit={handleSubmit}>
              <div className="px-md-4 pt-md-4 px-2 pt-2">
                <div className="d-flex justify-content-between flex-row my-2 border-bottom py-3">
                  <h4 className="mb-md-0 text-center text-md-left">
                    Expenses Account
                  </h4>
                  {/* <h4 className="mb-md-0 text-center text-md-right">Drafts</h4> */}
                </div>
                <div className="form-row">
                  <div className="col-md-2 mb-3">
                    <label htmlFor="validationCustom01" className="h6">
                      Payment Mode
                    </label>
                    <div className="custom-control custom-switch pt-2">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="customSwitch1"
                        onChange={() => setwith_payment(!with_payment)}
                      />
                      <label
                        className="custom-control-label"
                        for="customSwitch1"
                      >
                        From Bank
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="validationCustom01" className="h6">
                      Pay From
                    </label>
                    <select
                      className="custom-select mb-3 mr-3"
                      id="pay_from"
                      name="pay_from"
                      onChange={handleChange}
                      style={styles.uiInputSelect}
                      disabled={with_payment ? true : false}
                      required={with_payment ? false : true}
                    >
                      {/* <option selected>DD/MM/YYYY</option> */}
                      {bank.map((userx, index) => (
                        <option
                          data-test-id={userx.value}
                          dataid="2342"
                          value={userx._id}
                          key={index}
                        >
                          {userx.account_name}
                          {/* <button onClick={()=>console.log(userx.value)}>{userx.value}%</button> */}
                        </option>
                      ))}
                      <option selected value="">
                        Please select a bank account
                      </option>
                    </select>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label htmlFor="validationCustom02" className="h6">
                      Account No
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="-"
                      value={bank_account}
                      onChange={handleChange}
                      style={styles.uiInput}
                      disabled
                    />
                  </div>
                  <div className="col-md-3 mb-2">
                    <label htmlFor="validationCustom027" className="h6">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      onChange={handleChange}
                      className="form-control"
                      value={curr_date}
                      style={styles.uiInput}
                      required
                    />
                  </div>
                </div>
                <div class="form-row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="validationCustom021" className="h6">
                      Purpose
                    </label>
                    <select
                      className="custom-select mb-3 mr-3"
                      id="purpose"
                      name="purpose"
                      onChange={handleChange}
                      style={styles.uiInputSelect}
                      required
                    >
                      <option value="Miscellaneous payments">
                        Miscellaneous Payments
                      </option>
                      <option value="Business">Business</option>
                      <option value="Credit Card Payments">
                        Credit Card Payments
                      </option>
                      <option value="Donation">Donation</option>
                      <option value="Education">Education</option>
                      <option value="Family Support">Family Support</option>
                      <option value="Medical Expense">Medical Expense</option>
                      <option value="Family Support">Family Support</option>
                      <option selected value="">
                        Please select purpose
                      </option>
                    </select>
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom026" className="h6">
                      Expense Account - ID
                    </label>
                    <div className="input-group">
                      <div className="input-group-append">
                        <span
                          className="input-group-text"
                          id="inputGroupAppend"
                        >
                          EA-
                        </span>
                      </div>
                      <input
                        type="Number"
                        onChange={handleChange}
                        className="form-control"
                        value={order_final}
                        disabled
                        style={styles.uiInputGroupRight}
                      />
                    </div>
                  </div>

                  <div className="col-md-3 mb-2">
                    <label htmlFor="validationCustom022" className="h6">
                      Currency
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="currency"
                      name="currency"
                      placeholder="Pakistani Rupees(Rs)"
                      style={styles.uiInput}
                      disabled
                    />
                  </div>
                </div>
                <div class="form-row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="validationCustom022" className="h6">
                      Account Head
                    </label>
                    <select
                      className="custom-select"
                      id="expense_account"
                      name="expense_account"
                      onChange={handleChange}
                      style={styles.uiInputSelect}
                      required
                    >
                      <option value="Salaries Expense">Salaries Expense</option>
                      <option value="Electricity Expense">
                        Electricity Expense
                      </option>
                      <option value="Water Expense">Water Expense</option>
                      <option value="Gas Expense">Gas Expense</option>
                      <option value="Office Rental Expense">
                        Office Rental Expense
                      </option>
                      <option value="Repairing and Maintenance">
                        Repairing and Maintenance
                      </option>
                      <option value="Delivery Expense">Delivery Expense</option>
                      <option value="Stationery Expense">
                        Stationery Expense
                      </option>
                      <option selected value="Internet Bill">
                        Internet Bill
                      </option>
                      <option selected value="Other Expense">
                        Other Expense
                      </option>
                      <option selected value="">
                        Please select a account head
                      </option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="validationCustom022" className="h6">
                      Description
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="description"
                      onChange={handleChange}
                      name="description"
                      placeholder="Enter expense description"
                      style={styles.uiInput}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="validationCustom022" className="h6">
                      Amount
                    </label>
                    <input
                      type="Number"
                      className="form-control"
                      id="amount"
                      name="amount"
                      onChange={handleChange}
                      style={styles.uiInput}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* <div className="table-responsive px-md-4 pt-md-5 px-2 pt-2">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th scope="col">Account Head</th>
                  <th scope="col">Description</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td scope="row">
                    <select
                      className="custom-select"
                      id="expense_account"
                      name="expense_account"
                      onChange={handleChange}
                      style={styles.uiInputSelect}
                      required
                    >
                      <option value="Salaries Expense">
                        Salaries Expense
                      </option>
                      <option value="Electricity Expense">
                        Electricity Expense
                      </option>
                      <option value="Water Expense">
                        Water Expense
                      </option>
                      <option value="Gas Expense">
                        Gas Expense
                      </option>
                      <option value="Office Rental Expense">
                        Office Rental Expense
                      </option>
                      <option value="Repairing and Maintenance">
                        Repairing and Maintenance
                      </option>
                      <option value="Delivery Expense">
                        Delivery Expense
                      </option>
                      <option value="Stationery Expense">
                        Stationery Expense
                      </option>
                      <option selected value="Internet Bill" >
                        Internet Bill
                      </option>
                      <option selected value="Internet Bill" >
                       Courage inward
                      </option>
                      <option selected value="Internet Bill" >
                       Courage outward
                      </option>
                      <option selected value="Other Expense" >
                        Other Expense
                      </option>
                      <option selected value="" >
                        Please select a account head
                      </option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      id="description"
                      onChange={handleChange}
                      name="description"
                      placeholder="Enter expense description"
                      style={styles.uiInput}
                    />
                  </td>
                  <td>
                    <input
                      type="Number"
                      className="form-control"
                      id="amount"
                      name="amount"
                      onChange={(e) => setamount(e.target.value)}
                      style={styles.uiInput}
                      placeholder="0"
                      required
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div> */}

              <div className="row mx-0 px-md-4 pt-md-4 px-2 pt-2">
                <div className="col-md-5 col-12 px-0">
                  <textarea
                    type="text"
                    className="form-control mt-2 w-100 rounded-3"
                    rows="5"
                    cols="40"
                    id="comments"
                    name="comments"
                    onChange={handleChange}
                    placeholder="Additional Notes"
                    style={styles.uiInput}
                  ></textarea>
                </div>
                <div className="col-md-7 col-12 px-0">
                  <div className="form-group row">
                    {/* <label
                    htmlFor="inputEmail3"
                    className="col-sm-2 col-form-label font-weight-bold text-muted"
                  >
                    Gross
                  </label>
                  <div className="col-sm-10">
                    <input type="text" 
                      className="form-control"
                      style={styles.uiInput} 
                      id="inputEmail3" 
                      value={amount}/>
                  </div> */}
                  </div>
                  <div className="form-group row text-center">
                    <label
                      htmlFor="inputPassword3"
                      className="col-sm-4 col-form-label font-weight-bold text-muted"
                    >
                      Total Amount
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        style={styles.uiInput}
                        className="form-control"
                        id="inputPassword3"
                        value={`PKR ${amount.toLocaleString()}`}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-md-right text-center mt-2 px-md-4 px-2">
                <button
                  type="submit"
                  className="btn btn-success mb-2 px-md-4 p-2 mr-2"
                  style={styles.btnRadius}
                  disabled={loader}
                >
                  {loader ? (
                    <span
                      class="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    "Save & Approved"
                  )}
                </button>
                <button
                  type="button"
                  className="btn px-md-5 p-2 btn-primary mb-2 ml-2"
                  onClick={() => navigate(-1)}
                  style={styles.btnRadius}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default Add_Expense;
