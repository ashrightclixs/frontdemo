import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios, { Axios } from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import styles from "../../styles/styles";

export const initialState = {
  // curr_date: "",
  due_date: "",
  product_name: "",
  // quantity: "",
  // price: "",
  // discount: "",
  subject: "-",
  // discription: "-",
  reference: "reference",
  discription: "discription",
  tax: "",
  received: "",
};

const Add_PurchasesInvoice = ({ ToggleAlert }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  var user_id = user._id;
  const [tax, setTax] = useState([]); //tax value
  const [showformdata, setshowformdata] = useState(initialState); //form data passed
  const [price, setprice] = useState(0); //set price
  const [quantity, setquantity] = useState(0); //set price
  const [discount, setdiscount] = useState([]); //set discount
  const [discountfinal, setdiscountfinal] = useState([]); //set final discount
  const [net, setnet] = useState([]); //set net
  const [amount, setamount] = useState(0); //set amount
  const [invoice, setinvoice] = useState([]); //set amount
  const [invoice_final, setinvoice_final] = useState([]);
  const [receive, setreceive] = useState([]); // for recive amount
  const [curr_date, setcurr_date] = useState(getdate()); //data for customer
  const [loader, setLoader] = useState(false);
  const [loader_val, setloader_val] = useState(true);

  function percentage(num, per) {
    var q = (num / 100) * per;
    var e = num - q;
    setdiscount(e);
    return e;
  }

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
    console.log(user_id);
    axios
      .get(`${process.env.REACT_APP_API_URL}/tax?id=${user_id}`, {
        user_id: user_id,
      })
      .then((response) => {
        setTax(response.data.filter((p) => p.user_id == user._id));
        if (response.data.length === 0) {
          ToggleAlert("Warning", "please add Tax first");
        }
      })
      .catch((e) => {
        console.log(0);
      });

    axios
      .get(`${process.env.REACT_APP_API_URL}/purchase/invoice?id=${user_id}`, {
        user_id: user_id,
      })
      .then((response) => {
        // setinvoice(response.data.filter((p) => p.user_id == user_id));
        GenerateOrdernumber(response.data);
      })
      .catch((e) => {
        setinvoice(1000);
      });
    setloader_val(false);
  }, []);

  const GenerateOrdernumber = (e) => {
    e.length !== 0
      ? e.map((userx, index) =>
          e.length - 1 === index ? setinvoice_final(userx.invoice + 1) : ""
        )
      : setinvoice_final(1000);
  };

  function taxcalculation(num, per) {
    var q = (num / 100) * per;
    var e = num + q;
    // setdiscount(e);
    return e;
  }

  const handleChange = (e) => {
    var ee = document.getElementById("tax_select");
    var optionx = ee.options[ee.selectedIndex];
    var tax_value = optionx.getAttribute("data-test-id");

    var price_value = document.getElementById("price").value;
    var quantity_value = document.getElementById("quantity").value;
    var submit_btn = document.getElementById("submit_btn");
    var received_value = document.getElementById("received").value;

    if (e.target.name == "tax") {
      if (!price && !quantity) {
        console.log("null");
      } else {
        setdiscountfinal(((price_value * quantity_value) / 100) * tax_value);
        setnet(taxcalculation(amount, tax_value));
      }
    }
    if (e.target.name == "curr_date") {
      setcurr_date(e.target.value);
    }

    if (e.target.name == "received") {
      if (net < received_value) {
        submit_btn.disabled = true;
        ToggleAlert(
          "Warning",
          "Paid amount entered is greater than Total amount"
        );
      } else {
        submit_btn.disabled = false;
      }
    }

    setshowformdata({
      ...showformdata,
      [e.target.name]: e.target.value,
      user_id: user._id,
      currency: "Pakistani Rupees",
      net: net,
      amount: amount,
      invoice: invoice_final,
      quantity: quantity,
      price: price,
      curr_date: curr_date,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    console.log(showformdata);

    try {
      const url = `${process.env.REACT_APP_API_URL}/purchase/invoice/add`;
      const response = await axios.post(url, showformdata);
      setshowformdata(initialState);
      setLoader(false);
      navigate("/purchases/invoice");
      setTimeout(() => {
        ToggleAlert("Success", "Purchase Invoice added successfully");
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
      {loader_val === false && (
        <>
          <div className="main-card">
            <form onSubmit={handleSubmit}>
              <div className="px-md-4 pt-md-4 px-2 pt-2">
                <div className="d-flex justify-content-between flex-md-row flex-column my-2 border-bottom py-3">
                  <h4 className="mb-md-0 text-center text-md-left">
                    Purchase Invoice [PI-{invoice_final}]
                  </h4>
                  <h4 className="mb-md-0 text-center text-md-right">Drafts</h4>
                </div>

                <div className="form-row">
                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom026" className="h6">
                      Purchase Invoice ID
                    </label>
                    <div className="input-group">
                      <div className="input-group-append">
                        <span
                          className="input-group-text"
                          id="inputGroupAppend"
                        >
                          PI-
                        </span>
                      </div>
                      <input
                        type="text"
                        name="due_date"
                        // onChange={handleChange}
                        className="form-control"
                        value={invoice_final}
                        disabled
                        style={styles.uiInputGroupRight}
                      />
                    </div>
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom027" className="h6">
                      Date
                    </label>
                    <input
                      type="date"
                      name="curr_date"
                      onChange={handleChange}
                      className="form-control"
                      value={curr_date}
                      style={styles.uiInput}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom026" className="h6">
                      Due Date
                    </label>
                    <input
                      type="date"
                      name="due_date"
                      onChange={handleChange}
                      className="form-control"
                      style={styles.uiInput}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom022" className="h6">
                      Currency
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="validationCustom022"
                      name="currency"
                      placeholder="Pakistani Rupees(Rs)"
                      disabled
                      style={styles.uiInput}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom023" className="h6">
                      Subject
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="validationCustomUsername"
                      name="subject"
                      onChange={handleChange}
                      placeholder="Enter subject"
                      aria-describedby="inputGroupAppend"
                      style={styles.uiInput}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom023" className="h6">
                      Item
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="validationCustomUsername"
                      name="product_name"
                      onChange={handleChange}
                      placeholder="Enter item purchased"
                      aria-describedby="inputGroupAppend"
                      required
                      style={styles.uiInput}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom023" className="h6">
                      Quantity
                    </label>
                    <input
                      type="Number"
                      className="form-control"
                      id="quantity"
                      name="quantity"
                      onChange={(e) => {
                        setquantity(e.target.value);
                        setamount(price * e.target.value);
                      }}
                      placeholder="Enter your quantity"
                      aria-describedby="inputGroupAppend"
                      required
                      style={styles.uiInput}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom023" className="h6">
                      Rate
                    </label>
                    <input
                      type="Number"
                      className="form-control"
                      id="price"
                      name="price"
                      onChange={(e) => {
                        setprice(e.target.value);
                        setamount(e.target.value * quantity);
                      }}
                      placeholder="Enter item rate"
                      aria-describedby="inputGroupAppend"
                      required
                      style={styles.uiInput}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom023" className="h6">
                      Amount
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="validationCustomUsername"
                      name="amount"
                      value={`PKR ${amount.toLocaleString()}`}
                      placeholder="Enter your Amount"
                      aria-describedby="inputGroupAppend"
                      readOnly
                      style={styles.uiInput}
                      required
                    />
                  </div>
                </div>
              </div>
              {/* <div className="table-responsive px-md-4 pt-md-5 px-2 pt-2">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Rate</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      id="validationCustomUsername"
                      name="product_name"
                      onChange={handleChange}
                      placeholder="Enter item purchased"
                      aria-describedby="inputGroupAppend"
                      required
                      style={styles.uiInput}
                    />
                  </td>
                  <td>
                    <input
                      type="Number"
                      className="form-control"
                      id="quantity"
                      name="quantity"
                      onChange={(e) => {
                        setquantity(e.target.value);
                        setamount(price * e.target.value);
                      }}
                      placeholder="Enter your quantity"
                      aria-describedby="inputGroupAppend"
                      required
                      style={styles.uiInput}
                    />
                  </td>
                  <td>
                    <input
                      type="Number"
                      className="form-control"
                      id="price"
                      name="price"
                      onChange={(e) => {
                        setprice(e.target.value);
                        setamount(e.target.value * quantity);
                      }}
                      placeholder="Enter item rate"
                      aria-describedby="inputGroupAppend"
                      required
                      style={styles.uiInput}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      id="validationCustomUsername"
                      name="amount"
                      value={`PKR ${amount.toLocaleString()}`}
                      placeholder="Enter your Amount"
                      aria-describedby="inputGroupAppend"
                      readOnly
                      style={styles.uiInput}
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
                    className="form-control"
                    id="form-control mt-2 w-100 rounded-3"
                    rows="5"
                    cols="40"
                    placeholder="Additional Notes"
                    name="discription"
                    onChange={handleChange}
                    style={styles.uiInput}
                  ></textarea>
                </div>
                <div className="col-md-7 col-12 px-0">
                  {/* <div className="form-group row">
                <label
                  htmlFor="inputPassword3"
                  className="col-sm-2 col-form-label font-weight-bold text-muted"
                >
                  Tax Add Amount
                </label>
                <div className="col-sm-10 d-flex flex-row justify-content-around">
                  <div className="input-group">
                    <input
                      type="Number"
                      className="form-control"
                      id="validationCustomUsername"
                      name="discountfinal"
                      value={discountfinal}
                      placeholder="0"
                      aria-describedby="inputGroupAppend"
                      readOnly
                      style={styles.uiInput}
                      required
                    />
                  </div>
                </div>
              </div> */}
                  <div className="form-group row">
                    <label
                      htmlFor="inputPassword3"
                      className="col-sm-2 col-form-label font-weight-bold text-muted"
                    >
                      Tax
                    </label>
                    <div className="col-sm-10">
                      <select
                        className="custom-select mb-3 mr-3"
                        id="tax_select"
                        name="tax"
                        onChange={handleChange}
                        // onChange={(event) => event.target.value == "add" ? setmodal(true) : setmodal(false)}
                        required
                        style={styles.uiInputSelect}
                      >
                        {/* <option selected>DD/MM/YYYY</option> */}
                        {tax.map((userx, index) => (
                          <option
                            data-test-id={userx.value}
                            dataid="2342"
                            value={userx._id}
                            mydata={userx.value}
                          >
                            {`${userx.description} - ${userx.value}%`}
                            {/* <button onClick={()=>console.log(userx.value)}>{userx.value}%</button> */}
                          </option>
                        ))}

                        <option selected value="">
                          Please select a tax
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      htmlFor="inputPassword3"
                      className="col-sm-2 col-form-label font-weight-bold text-muted"
                    >
                      Tax Amount
                    </label>
                    <div className="col-sm-10 d-flex flex-row justify-content-around">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          id="validationCustomUsername"
                          name="discountfinal"
                          value={`PKR ${discountfinal.toLocaleString()}`}
                          placeholder="Enter your Discount"
                          aria-describedby="inputGroupAppend"
                          style={styles.uiInput}
                          readOnly
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      htmlFor="inputPassword3"
                      className="col-sm-2 col-form-label font-weight-bold text-muted"
                    >
                      Total Amount
                    </label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control"
                        id="validationCustomUsername"
                        name="net"
                        value={`PKR ${net.toLocaleString()}`}
                        style={styles.uiInput}
                        placeholder="-"
                        aria-describedby="inputGroupAppend"
                        readOnly
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="col-md-2 mb-3"></div>
                    <div className="col-md-5 mb-3">
                      <label htmlFor="validationCustom01" className="h6">
                        Reference
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="validationCustomUsername"
                        name="reference"
                        onChange={handleChange}
                        style={styles.uiInput}
                        placeholder="Reference of this invoice"
                        aria-describedby="inputGroupAppend"
                      />
                    </div>
                    <div className="col-md-5 mb-3">
                      <label htmlFor="validationCustom02" className="h6">
                        Amount Paid
                      </label>
                      <input
                        type="Number"
                        className="form-control"
                        id="received"
                        name="received"
                        onChange={handleChange}
                        style={styles.uiInput}
                        placeholder="Enter amount paid"
                        aria-describedby="inputGroupAppend"
                        required
                      />
                    </div>
                  </div>

                  <div className="text-md-right text-center mt-2 ">
                    <button
                      type="submit"
                      id="submit_btn"
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
      )}
    </>
  );
};

export default Add_PurchasesInvoice;
