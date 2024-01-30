import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios, { Axios } from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import styles from "../../styles/styles";

export const initialState = {
  reference: "-",
  payment_mode: "",
  amount: "",
  comments: "-",
};
// { ToggleAlert }
const Add_CashDeposit = ({ ToggleAlert }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  var user_id = user._id;
  const [showformdata, setshowformdata] = useState(initialState); //form data passed
  const [invoice_final, setinvoice_final] = useState([]);
  const [loader, setLoader] = useState(false);
  const [loader_val, setloader_val] = useState(true);
  function getdate() {
    const date = new Date();
    const year = date.getFullYear();
    const getdate = new Date(date);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const full_date = [year, month, day].join("-");
    return full_date;
  }

  useEffect(() => {
    setloader_val(true);
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/accounts/cash_deposit?id=${user_id}`
      )
      .then((response) => {
        GenerateOrdernumber(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    setloader_val(false);
  }, []);

  const GenerateOrdernumber = (e) => {
    e.length !== 0
      ? e.map((userx, index) =>
          e.length - 1 === index ? setinvoice_final(userx.deposit_no + 1) : ""
        )
      : setinvoice_final(1000);
  };

  const handleChange = (e) => {
    setshowformdata({
      ...showformdata,
      [e.target.name]: e.target.value,
      user_id: user._id,
      currency: "Pakistani Rupees",
      deposit_no: invoice_final,
      date: getdate(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    console.log(showformdata);
    try {
      const url = `${process.env.REACT_APP_API_URL}/accounts/cash_deposit/add`;
      const response = await axios.post(url, showformdata);
      setshowformdata(initialState);
      setLoader(false);
      navigate("/accounts/cashdeposit");
      setTimeout(() => {
        ToggleAlert("Success", "Entry recorded successfully");
      }, 1000);
    } catch (error) {
      console.log(error);
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        console.log(error.response.data.message);
      }
    }
  };
  return (
    <>
      <div className="main-card">
        <form onSubmit={handleSubmit}>
          <div className="px-md-4 pt-md-4 px-2 pt-2">
            <div className="d-flex justify-content-between flex-md-row flex-column my-2 border-bottom py-3">
              <h4 className="mb-md-0 text-center text-md-left">
                Add Cash Deposit [CD-{invoice_final}]
              </h4>
              <h4 className="mb-md-0 text-center text-md-right">Drafts</h4>
            </div>

            <div className="form-row">
              <div className="col-md-3 mb-3">
                <label htmlFor="validationCustom026" className="h6">
                  Cash Deposit ID
                </label>
                <div className="input-group">
                  <div className="input-group-append">
                    <span className="input-group-text" id="inputGroupAppend">
                      CD-
                    </span>
                  </div>
                  <input
                    type="text"
                    name="j_entry_no"
                    // onChange={handleChange}
                    className="form-control"
                    value={invoice_final}
                    style={styles.uiInputGroupRight}
                    disabled
                  />
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <label htmlFor="validationCustom027" className="h6">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  onChange={handleChange}
                  className="form-control"
                  value={getdate()}
                  style={styles.uiInput}
                  disabled
                  required
                />
              </div>
              <div className="col-md-3 mb-6">
                <label htmlFor="validationCustom022" className="h6">
                  Currency
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="validationCustom022"
                  name="currency"
                  placeholder="Pakistani Rupees(Rs)"
                  style={styles.uiInput}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <label htmlFor="validationCustom01" className="h6">
                  Reference
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="reference"
                  name="reference"
                  onChange={handleChange}
                  placeholder="Enter your reference"
                  aria-describedby="inputGroupAppend"
                  style={styles.uiInput}
                />
              </div>
            </div>
          </div>
          <div className="table-responsive px-md-4 pt-md-5 px-2 pt-2">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  {/* <th scope="col">Reference</th> */}
                  <th scope="col">Payment Mode</th>
                  {/* <th scope="col">Account Head</th> */}
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="col-md-12 mb-12">
                      <select
                        className="custom-select"
                        id="payment_mode"
                        name="payment_mode"
                        onChange={handleChange}
                        style={styles.uiInputSelect}
                        required
                      >
                        <option value="Cash">Cash</option>
                        <option value="Bank">Bank</option>
                        <option value="Credit Card Payments">
                          Credit Card Payments
                        </option>
                        <option selected value="">
                          Please select payment mode
                        </option>
                      </select>
                    </div>
                  </td>

                  <td>
                    <input
                      type="Number"
                      className="form-control"
                      id="amount"
                      name="amount"
                      onChange={handleChange}
                      placeholder="Enter amount paid/received"
                      aria-describedby="inputGroupAppend"
                      style={styles.uiInput}
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
                className="form-control"
                id="form-control mt-2 w-100 rounded-3"
                rows="5"
                cols="40"
                placeholder="Additional Notes"
                name="comments"
                onChange={handleChange}
                style={styles.uiInput}
              ></textarea>
            </div>
            <div className="col-md-7 col-12 px-0">
              <div className="text-md-right text-center mt-2 ">
                <button
                  type="submit"
                  class="btn btn-success mb-2 px-md-4 p-2 mr-2"
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
                  class="btn px-md-5 p-2 btn-primary mb-2 ml-2"
                  style={styles.btnRadius}
                  onClick={() => navigate(-1)}
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

export default Add_CashDeposit;
