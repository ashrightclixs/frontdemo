import { Link, UNSAFE_RouteContext, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios, { Axios } from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import styles from "../../styles/styles";

export const initialState = {
  order: "",
  // date: "",
  subject: "",
};

const Add_SalesRefund = ({ ToggleAlert }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  var user_id = user._id;

  const [showformdata, setshowformdata] = useState(initialState); //form data passed

  const [refund_chalan, setrefund_chalan] = useState([]); //set amount

  const [value, setvalue] = useState([]); // for recive amount

  const [order1, setorder] = useState([]); //set amount

  const [customer_value, setcustomer_value] = useState([]);

  // const [order_final, setorder_final] = useState([]);

  const [curr_date, setcurr_date] = useState(getdate()); //data for customer
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
    // console.log(user_id);

    setloader_val(true);

    axios
      .get(`${process.env.REACT_APP_API_URL}/sales/order?id=${user_id}`, {
        user_id: user_id,
      })
      .then((response) => {
        setorder(response.data);
        if (response.data.length === 0) {
          ToggleAlert("Warning", "please add Order first");
        }
      })
      .catch((e) => {
        setorder(1000);
      });

    axios
      .get(`${process.env.REACT_APP_API_URL}/sales/refund?id=${user_id}`, {
        user_id: user_id,
      })
      .then((response) => {
        GenerateOrdernumber(response.data);
      })
      .catch((e) => {
        setrefund_chalan(1000);
      });

    setloader_val(false);
  }, []);

  const GenerateOrdernumber = (e) => {
    e.length !== 0
      ? e.map((userx, index) =>
          e.length - 1 == index ? setrefund_chalan(userx.refund + 1) : ""
        )
      : setrefund_chalan(1000);
  };

  const handleChange = (e) => {
    var ww = document.getElementById("order_select");
    var optionxx = ww.options[ww.selectedIndex];
    var order_value = optionxx.getAttribute("data-test");
    var entires_value = optionxx.getAttribute("data-entries");

    if (e.target.name == "order") {
      setcustomer_value(order_value);
      setvalue(entires_value);
    }

    if (e.target.name == "curr_date") {
      setcurr_date(e.target.value);
    }

    setshowformdata({
      ...showformdata,
      [e.target.name]: e.target.value,
      user_id: user._id,
      currency: "Pakistani Rupees",
      refund: refund_chalan,
      customer: customer_value,
      curr_date: curr_date,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(showformdata);

    try {
      const url = `${process.env.REACT_APP_API_URL}/sales/refund/add`;
      const response = await axios.post(url, showformdata);
      try {
        const url = `${process.env.REACT_APP_API_URL}/sales/entries/delete?id=${user_id}&value=${value}`;
        const response = await axios.delete(url);
      } catch (error) {
        // console.log(error)
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          console.log("error");
        }
      }
      setshowformdata(initialState);
      navigate("/sales/refund");
      setTimeout(() => {
        ToggleAlert("Success", "Refund Entry Added Successfully");
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
            {/* <div
          className={
            order1.length === 0
              ? "alert alert-warning alert-dismissible fade show"
              : "d-none"
          }
          id="submit"
          role="alert"
        >
          <strong> {order1.length === 0 ? "[Order Missing]" : ""}</strong>
          <button
            type="button"
            className="close"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div> */}
            <form onSubmit={handleSubmit}>
              <div className="px-md-4 pt-md-4 px-1 pt-1">
                <div className="d-flex justify-content-between flex-md-row flex-column my-2 border-bottom py-3">
                  <h4 className="mb-md-0 text-center text-md-left">
                    Customer Refunds [CR-{refund_chalan}]
                  </h4>
                  <h4 className="mb-md-0 text-center text-md-right">Drafts</h4>
                </div>

                <div className="form-row">
                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom026" className="h6">
                      Order ID
                    </label>
                    <div className="input-group">
                      <select
                        className="custom-select mb-3 mr-3"
                        id="order_select"
                        name="order"
                        onChange={handleChange}
                        style={styles.uiInputSelect}
                        required
                      >
                        {/* <option selected>DD/MM/YYYY</option> */}

                        {order1.map((userx, index) => (
                          <option
                            value={userx._id}
                            key={index}
                            data-test={userx.customer._id}
                            data-entries={userx.order}
                          >
                            SO-{userx.order}
                          </option>
                        ))}
                        <option selected></option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom026" className="h6">
                      Refund ID
                    </label>
                    <div className="input-group">
                      <div className="input-group-append">
                        <span
                          className="input-group-text"
                          id="inputGroupAppend"
                        >
                          CR
                        </span>
                      </div>
                      <input
                        type="Number"
                        name="refund_chalan"
                        // onChange={handleChange}
                        className="form-control"
                        value={refund_chalan}
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
                      name="curr_date"
                      onChange={handleChange}
                      className="form-control"
                      value={curr_date}
                      style={styles.uiInput}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
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
                  <div className="col-md-3 mb-6">
                    <label htmlFor="validationCustom023" className="h6">
                      Subject
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="validationCustomUsername"
                      name="subject"
                      onChange={handleChange}
                      placeholder="Enter your Subject"
                      aria-describedby="inputGroupAppend"
                      style={styles.uiInput}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row mx-0 px-md-4 pt-md-4 px-1 pt-1">
                {/* button */}
                <div className="text-md-right text-center mt-2 ">
                  <button
                    type="submit"
                    class="btn btn-success mb-2 px-md-4 p-1 mr-2"
                    style={styles.btnRadius}
                  >
                    Save & Approved
                  </button>
                  <button
                    type="button"
                    class="btn px-md-5 p-1 btn-primary mb-2 ml-2"
                    onClick={() => navigate(-1)}
                    style={styles.btnRadius}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default Add_SalesRefund;
