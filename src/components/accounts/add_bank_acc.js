import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios, { Axios } from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import styles from "../../styles/styles";

export const initialState = {
  amount: "",
  bank_name: "",
  account_name: "",
  branch_name: "",
  bank_account_title: "",
  bank_account_number: "",
  description: "-",
};

const Add_BankAcc = ({ ToggleAlert }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); //for get user
  var user_id = user._id; //for get user id
  const [loader, setLoader] = useState(false);
  const [showformdata, setshowformdata] = useState(initialState); //form data passed
  const [loader_val, setloader_val] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(showformdata);
    setLoader(true);
    try {
      const url_qoutation = `${process.env.REACT_APP_API_URL}/accounts/bank_account/add`;
      const response = await axios.post(url_qoutation, showformdata);
      setshowformdata(initialState);
      setLoader(false);
      navigate("/accounts/bank_account");
      setTimeout(() => {
        ToggleAlert("Success", "Entry recorded Successfully");
      }, 1000);
    } catch (error) {
      console.log(error);
      setLoader(false);
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        console.log(error.response.data.message);
      }
    }
  };

  const handleChange = (e) => {
    setshowformdata({
      ...showformdata,
      [e.target.name]: e.target.value,
      user_id: user._id,
    });
  };

  return (
    <>
      <div className="main-card">
        <form onSubmit={handleSubmit}>
          <div className="px-md-4 pt-md-4 px-2 pt-2">
            <div className="d-flex justify-content-between flex-md-row flex-column my-2 border-bottom py-3">
              <h4 className="mb-md-0 text-center text-md-left">Bank Account</h4>
              <h4 className="mb-md-0 text-center text-md-right">Drafts</h4>
            </div>

            {/* <div className="form-row">
                <div className="col-md-4 mb-3">
                  <label htmlFor="validationCustom01" className="h6">Parent Account</label>
                  <input
                    type="text"
                    className="form-control"
                    id="validationCustom01"
                    value=""
                    placeholder="Type to search contact"
                    required
                  />
                </div>
                <div className="col-md-4 mb-3 mx-md-5">
                  <label htmlFor="validationCustom02" className="mb-3 h6">
                  Account Group
                  </label>
                  <br />
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="inlineCheckbox1"
                      value="option1"
                    />
                    <label className="form-check-label" htmlFor="inlineCheckbox1">
                      Transactional
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="inlineCheckbox2"
                      value="option2"
                    />
                    <label className="form-check-label" htmlFor="inlineCheckbox2">
                      Control
                    </label>
                  </div>
                </div>
              </div> */}
            <div className="form-row my-3">
              {/* <div className="col-md-3 mb-3">
                  <label htmlFor="validationCustom021" className="h6">Account Code</label>
                  <input
                    type="number"
                    className="form-control"
                    id="validationCustom021"
                    value=""
                    placeholder="Account Code"
                    required
                  />
                </div> */}
              {/* <div className="col-md-3 mb-3">
                  <label htmlFor="validationCustom021" className="h6">Account Name</label>
                  <input
                    type="number"
                    className="form-control"
                    id="validationCustom021"
                    value=""
                    placeholder="Account Name"
                    required
                  />
                </div> */}
              {/* <div className="col-md-3 mb-3">
                  <label htmlFor="validationCustom021" className="h6">Subject</label>
                  <input
                    type="number"
                    className="form-control"
                    id="validationCustom021"
                    value=""
                    placeholder="Subject"
                    required
                  />
                </div> */}
            </div>

            <div className="form-row mb-3">
              <div className="col-md-3 mb-3">
                <label htmlFor="validationCustom021" className="h6">
                  Bank Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="bank_name"
                  name="bank_name"
                  onChange={handleChange}
                  style={styles.uiInput}
                  placeholder="Enter bank name"
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <label htmlFor="validationCustom021" className="h6">
                  Account Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  onChange={handleChange}
                  style={styles.uiInput}
                  name="account_name"
                  id="account_name"
                  placeholder="Enter account name"
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <label htmlFor="validationCustom021" className="h6">
                  Branch Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  onChange={handleChange}
                  style={styles.uiInput}
                  id="branch_name"
                  name="branch_name"
                  placeholder="Enter branch name"
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <label htmlFor="validationCustom021" className="h6">
                  Amount Deposit
                </label>
                <input
                  type="Number"
                  className="form-control"
                  onChange={handleChange}
                  style={styles.uiInput}
                  id="amount"
                  name="amount"
                  placeholder="Enter amount to deposit"
                  required
                />
              </div>
              {/* <div className="col-md-3 d-flex align-items-center pl-md-5 pl-2 my-md-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="autoSizingCheck2"
                    />
                    <label
                      className="form-check-label text-secondary"
                      htmlFor="autoSizingCheck2"
                    >
                      Use credit card accounts
                    </label>
                  </div>
                </div> */}
            </div>
            <div className="form-row mb-3">
              <div className="col-md-5 mb-3">
                <label htmlFor="validationCustom021" className="h6">
                  Bank Account Tittle
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="bank_account_title"
                  onChange={handleChange}
                  style={styles.uiInput}
                  name="bank_account_title"
                  placeholder="Enter bank account title"
                  required
                />
              </div>
              <div className="col-md-5 mb-3">
                <label htmlFor="validationCustom021" className="h6">
                  Bank Account Number
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="bank_account_number"
                  onChange={handleChange}
                  style={styles.uiInput}
                  name="bank_account_number"
                  placeholder="Enter bank account number"
                  required
                />
              </div>
            </div>
          </div>

          <div className="row mx-0 px-1 px-md-4 pt-2">
            <div className="col-md-5 col-12 px-0">
              <label htmlFor="description1" className="h6">
                Description
              </label>
              <textarea
                type="text"
                className="form-control mt-2 w-100 rounded-3"
                rows="5"
                cols="40"
                onChange={handleChange}
                id="description"
                name="description"
                style={styles.uiInput}
                placeholder="Additional Notes"
              ></textarea>
            </div>
            <div className="col-md-7 col-12 d-flex align-items-end justify-content-md-end justify-content-center">
              <div className="text-md-right text-center mt-2">
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
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Add_BankAcc;
