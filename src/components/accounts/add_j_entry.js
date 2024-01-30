import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios, { Axios } from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import styles from "../../styles/styles";

export const initialState = {
  // customer: "",
  // due_date: "",
  // subject: "",
  // ware_house: "",
  // product_id: "",
  // quantity: "",
  // price: "",
  // discount: "",
  // discription: "",
  // tax: "",
  // reference: "",
  // received: "",

  //   user_id ObjectId   default
  // j_entry_no  Number  default

  // date   : "",
  currency: "",
  reference: "-",
  payment_mode: "",
  account_head: "",
  amount: "",
  comments: "-",
};
// { ToggleAlert }
const Add_J_Entry = ({ ToggleAlert }) => {
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
        `${process.env.REACT_APP_API_URL}/accounts/journal_entry?id=${user_id}`
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
          e.length - 1 === index ? setinvoice_final(userx.j_entry_no + 1) : ""
        )
      : setinvoice_final(1000);
  };

  const handleChange = (e) => {
    setshowformdata({
      ...showformdata,
      [e.target.name]: e.target.value,
      user_id: user._id,
      currency: "Pakistani Rupees",
      j_entry_no: invoice_final,
      date: getdate(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    console.log(showformdata);
    try {
      const url = `${process.env.REACT_APP_API_URL}/accounts/journal_entry/add`;
      const response = await axios.post(url, showformdata);
      setshowformdata(initialState);
      setLoader(false);
      navigate("/accounts/journal_entry");
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
                    Add Journal Entry [JE-{invoice_final}]
                  </h4>
                  <h4 className="mb-md-0 text-center text-md-right">Drafts</h4>
                </div>

                <div className="form-row">
                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom026" className="h6">
                      Journal Entry ID
                    </label>
                    <div className="input-group">
                      <div className="input-group-append">
                        <span
                          className="input-group-text"
                          id="inputGroupAppend"
                        >
                          JE-
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
                <div className="form-row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="validationCustom01" className="h6">
                      Payment Mode
                    </label>
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
                  <div className="col-md-4 mb-3">
                    <label htmlFor="validationCustom01" className="h6">
                      Account Head
                    </label>
                    <select
                      className="custom-select"
                      id="account_head"
                      name="account_head"
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
                        Please select account head
                      </option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="validationCustom01" className="h6">
                      Amount
                    </label>
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
                  </div>
                </div>
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
      )}
    </>
  );
};

export default Add_J_Entry;
