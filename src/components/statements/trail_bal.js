import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios, { Axios } from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import styles from '../../styles/styles'


const Trail_Bal = ({ToggleAlert}) => {

  const [data, setData] = useState([]);
  const [year, setyear] = useState("");
  const [month, setmonth] = useState("");
  const nav = useNavigate();
  const { user } = useContext(AuthContext);
  const [searched, setSearched] = useState(false);
  const [loader, setLoader] = useState(false);
  const { modal, setModal } = useState(false);
  var user_id = user._id;


 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
      axios.get(`${process.env.REACT_APP_API_URL}/accounts/cash_deposit/gettrialbalance?id=${user_id}&month=${month}&year=${new Date().getFullYear()}`).then((response) => {
        setSearched(true)
        setLoader(false);
        setData(response.data)
      })
  }

  
  const Navigate = () => {
    month
      ? nav(`/statements/trail_balance/pdf/${month}`)
      : ToggleAlert("Warning", "Please generate statement first");
  };

  return (
    <>
      <div className="main-card">
        <div className="px-md-4 pt-md-4 px-2 pt-2">
          <div className="d-flex justify-content-between flex-md-row flex-column my-2 border-bottom py-3">
            <h4 className="mb-md-0 text-center text-md-left">Trail Balance</h4>
          </div>
          <form onSubmit={handleSubmit} className="pb-md-4 py-3">
            <div className="row align-items-center">
              <div className="col-md-4">
                <label htmlFor="validationCustom01" className="h6">
                  Select Month/Quartile
                </label>
                <select
                  className="custom-select mb-3 mr-3"
                  id="month"
                  name="month"
                  onChange={(e) => setmonth(e.target.value)}
                  required
                  style={styles.uiInputSelect}
                >
                  <option value="1">January</option>
                  <option value="2">Febuary</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                  <option value="13">Half Yearly</option>
                  <option value="14">One Year</option>
                  <option selected value="">
                    Please Select a Month/Quartile
                  </option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="validationCustom01" className="h6">
                  Year
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="year"
                  name="year"
                  value={new Date().getFullYear()}
                  aria-describedby="inputGroupAppend"
                  disabled
                  style={styles.uiInput}
                  required
                />
              </div>
              <div className="col-md-4 mt-2 text-center">
                <button
                  type="submit"
                  className="btn btn-success p-3 mr-2"
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
                    <span>Generate</span>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-primary p-3 mr-2"
                  style={styles.btnRadius}
                  onClick={Navigate}
                >
                  <i className="fa fa-print pr-2"></i>Print
                </button>
              </div>
            </div>
          </form>
        </div>
        {searched ? (
          <div className="table-responsive px-md-4 pb-md-4 px-2 pb-2">
            <table
              className="table"
              style={{ fontSize: "12px", marginTop: "10px" }}
            >
              <thead>
                <tr>
                  <th scope="col">Particulars</th>
                  <th scope="col">Debit [DR]</th>
                  <th scope="col">Credit [CR]</th>
                </tr>
              </thead>
              <tbody>
                {data.length == 0 ? (
                  " "
                ) : (
                  <>
                    <tr>
                      <td>Cash</td>
                      <td>
                        {data.entires == "debit"
                          ? parseInt(data.cash.toFixed(2)).toLocaleString()
                          : ""}
                      </td>
                      <td>
                        {data.entires == "credit"
                          ? parseInt(data.cash.toFixed(2)).toLocaleString()
                          : ""}
                      </td>
                    </tr>
                    <tr>
                      <td>Capital A/C</td>
                      <td>
                        {parseInt(data.capital_ac.toFixed(2)).toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Sales A/C</td>
                      <td>
                        {parseInt(data.sales_ac.toFixed(2)).toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Receivable A/C</td>
                      <td>
                        {parseInt(
                          data.receivable_ac.toFixed(2)
                        ).toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Purchase A/C</td>
                      <td></td>
                      <td>
                        {parseInt(data.purchase_ac.toFixed(2)).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td>Payable A/C</td>
                      <td></td>
                      <td>
                        {parseInt(data.payable_ac.toFixed(2)).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td>Expense A/C</td>
                      <td></td>
                      <td>
                        {parseInt(data.expenses_ac.toFixed(2)).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <th>Total</th>
                      <th>
                        {parseInt(data.total.toFixed(2)).toLocaleString()}
                      </th>
                      <th>
                        {parseInt(data.total.toFixed(2)).toLocaleString()}
                      </th>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Trail_Bal;