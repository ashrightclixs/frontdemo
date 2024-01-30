import { Link, UNSAFE_RouteContext, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios, { Axios } from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import styles from "../../styles/styles";

export const initialState = {
  //   user_id  default in handlechange
  // funds_no  default in handlechange
  from_account: "",
  to_account: "",
  purpose: "",
  amount: "",
  comments: "-",
};

const Add_FundTransfer = ({ ToggleAlert }) => {
  const [bank, setbank] = useState([]); //tax value
  const [showformdata, setshowformdata] = useState(initialState); //form data passed
  const [amount, setamount] = useState(0); //set amount
  const [order_final, setorder_final] = useState(0); //set amount
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [bank_account, setbank_account] = useState([]); //ware_house_from
  const [loader_val, setloader_val] = useState(true);
  const { user } = useContext(AuthContext);
  var user_id = user._id;

  useEffect(() => {
    setloader_val(true);
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/accounts/funds_account?id=${user_id}`
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
          e.length - 1 == index ? setorder_final(userx.funds_no + 1) : ""
        )
      : setorder_final(1000);
  };

  const handleChange = (e) => {
    setshowformdata({
      ...showformdata,
      [e.target.name]: e.target.value,
      user_id: user._id,
      funds_no: order_final,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    console.log(showformdata);
    try {
      const url = `${process.env.REACT_APP_API_URL}/accounts/funds_account/add`;
      const response = await axios.post(url, showformdata);
      setshowformdata(initialState);
      setLoader(false);
      navigate("/accounts/funds_transfer");
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
                <div className="d-flex justify-content-between flex-md-row flex-column my-2 border-bottom py-3">
                  <h4 className="mb-md-0 text-center text-md-left">
                    Add Funds Transferred
                  </h4>
                  <h4 className="mb-md-0 text-center text-md-right">Drafts</h4>
                </div>
                <div className="form-row">
                  {/* fund_no  */}
                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom026" className="h6">
                      Fund Transfer ID
                    </label>
                    <div className="input-group">
                      <div className="input-group-append">
                        <span
                          className="input-group-text"
                          id="inputGroupAppend"
                        >
                          FT-
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
                  {/* //from account  */}
                  <div className="col-md-4 mb-4">
                    <label htmlFor="validationCustom02" className="h6">
                      From Account
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter account name"
                      name="from_account"
                      onChange={handleChange}
                      style={styles.uiInput}
                    />
                  </div>
                  {/* to acccount */}
                  <div className="col-md-4 mb-4">
                    <label htmlFor="validationCustom027" className="h6">
                      To Account
                    </label>
                    <input
                      type="text"
                      name="to_account"
                      id="to_account"
                      placeholder="Enter account name"
                      style={styles.uiInput}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="table-responsive px-md-4 pt-md-5 px-2 pt-2">
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">Purpose</th>
                      <th scope="col">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td scope="row">
                        <select
                          className="custom-select"
                          id="purpose"
                          name="purpose"
                          onChange={handleChange}
                          style={styles.uiInputSelect}
                          required
                        >
                          <option value="miscellaneous payments">
                            Miscellaneous Payments
                          </option>
                          <option value="miscellaneous payments">
                            Business
                          </option>
                          <option value="Credit Card Payments">
                            Credit Card Payments
                          </option>
                          <option value="Donation">Donation</option>
                          <option value="Education">Education</option>
                          <option value="Family Support">Family Support</option>
                          <option value="Medical Expense">
                            Medical Expense
                          </option>
                          <option value="Family Support">Family Support</option>
                          <option selected value="">
                            Please Select a Bank Account
                          </option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="Number"
                          className="form-control"
                          id="amount"
                          name="amount"
                          onChange={handleChange}
                          style={styles.uiInput}
                          placeholder="Enter amount transferred"
                          required
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

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
              </div>
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
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default Add_FundTransfer;
