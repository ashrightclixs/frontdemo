
import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import { useSearchParams } from "react-router-dom";
import styles from "../../styles/styles"
// import Customer from "./customer.sales";

const Income_Stat = ({ ToggleAlert }) => {

  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  var user_id = user._id;
  const nav = useNavigate()
  const [searched , setSearched] = useState(false)
  const [loader, setLoader] = useState(false);

  //data
  const [data, setData] = useState([]); //data for customer


  // date 
  const [ current , setcurrent] = useState(""); //data for customer
  const [ previous , setprevious] = useState(""); //data for customer

  // Expense
  const [ salaries_Expense , setSalaries_Expense  ] = useState(0);
  const [ electricity_Expense , setelectricity_Expense ] = useState(0);
  const [ water_Expense , setwater_Expense ] = useState(0);
  const [ gas_Expense , setgas_Expense ] = useState(0);
  const [ office_Rental_Expense , setoffice_Rental_Expense ] = useState(0);
  const [ repairing_Maintenance , setrepairing_Maintenance ] = useState(0);
  const [ delivery_Expense , setdelivery_Expense ] = useState(0);
  const [ stationery_Expense , setstationery_Expense ] = useState(0);
  const [ internet_Bill , setinternet_Bill ] = useState(0);
  const [ other_Expense , setother_Expense ] = useState(0);

  const [ total_invoice , settotal_invoice ] = useState(0);
  const [ Gross_profit , setGross_profit ] = useState(0);


  const [ net_profit , setnet_profit ] = useState(0);



  


  // handlesubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    // console.log(current);
    // console.log(previous);
    const url = `${process.env.REACT_APP_API_URL}/statement/incomestatement?id=${user_id}&previous=${previous}&current=${current}`;
    // console.log(url);
    axios.get (url)
    .then((response) => {
      total(response.data);
      // console.log(response.data.Array_expense[9]);
      setData(response.data);
      setSearched(true)
      setLoader(false);
    }).catch((e) => {
        console.log("error");
    });
  };

  let total_all_Expenses = 0;
  const total = (value) => {
    let totalinvoice = 0;
    let grossprofit = 0;
    let expense ; 
    const total = [];
    
    value.invoice.map((val,index) =>{
      totalinvoice += val.net;
    })
    value.dashboardrevenue.map((val,index)=>{
      if(val.type == "revenue"){
        grossprofit +=val.amount;
      }
    })

    for(let i = 0 ; i < 10 ; i++ ){
      expense = 0;
      value.Array_expense[i].map((val,index)=>{
        expense +=val.amount;
      })
      total.push(expense);
    }
  
    settotal_invoice(totalinvoice);
    setGross_profit(grossprofit);

    setSalaries_Expense(total[0]);
    setelectricity_Expense(total[1]);
    setwater_Expense(total[2]);
    setgas_Expense(total[3]);
    setoffice_Rental_Expense(total[4]);
    setrepairing_Maintenance(total[5]);
    setdelivery_Expense(total[6]);
    setstationery_Expense(total[7]);
    setinternet_Bill(total[8]);
    setother_Expense(total[9]);

    for(let i = 0 ;i < total.length ; i++){
      total_all_Expenses += total[i];
    }

    setnet_profit(total_all_Expenses);
    console.log(total.length)
    
    return total;
  }

  const Navigate = () => {
    previous && current
      ? nav(`/statements/income_statement/pdf/${previous}/${current}`)
      : ToggleAlert("Warning", "Please generate statement first");
  }


  return (
    <>
      <div className="main-card">
        <div className="px-md-4 pt-md-4 px-2 pt-2">
          <div className="d-flex justify-content-between flex-md-row flex-column my-2 border-bottom py-3">
            <h4 className="mb-md-0 text-center text-md-left">
              Income Statement
            </h4>
          </div>
        </div>
        {/* date filter  */}
        <form onSubmit={handleSubmit} className="px-md-4 pb-md-4 px-2 py-3">
          <div className="row align-items-center">
            <div className="col-md-4 mb-3">
              <label htmlFor="validationCustom0271" className="h6">
                From
              </label>
              <input
                type="date"
                name="current"
                onChange={(e) => setprevious(e.target.value)}
                className="form-control"
                style={styles.uiInput}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="validationCustom0271" className="h6">
                To
              </label>
              <input
                type="date"
                name="previous"
                onChange={(e) => setcurrent(e.target.value)}
                className="form-control"
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
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  "Generate"
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

        {searched ? (
          <div className="px-md-4 pb-md-4 px-2 pb-2">
            <table
              className="table table-stipe"
              style={{ fontSize: "12px", marginTop: "10px" }}
            >
              <thead>
                <tr style={{ fontSize: "14px" }}>
                  <th>Title</th>
                  <th></th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {/* income  */}
                <tr>
                  <th style={{ fontWeight: "bolder" }}>Income</th>
                  <td></td>
                </tr>
                {/* total_invoice
  Gross_profit */}
                <tr>
                  <td colSpan={2}>Sales</td>
                  <td>{parseInt(total_invoice.toFixed(2)).toLocaleString()}</td>
                </tr>
                <tr>
                  <td colSpan={2}>Total Income</td>
                  <th>{parseInt(total_invoice.toFixed(2)).toLocaleString()}</th>
                </tr>
                {/* cost of sales  */}
                <tr>
                  <th style={{ fontWeight: "bolder" }}>Less Cost of Sales</th>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan={2}>Purchases</td>
                  <td>{parseInt(Gross_profit.toFixed(2)).toLocaleString()}</td>
                </tr>
                <tr>
                  <td colSpan={2}>Total Cost of Sales</td>
                  <td>{parseInt(Gross_profit.toFixed(2)).toLocaleString()}</td>
                </tr>
                {/* Gross Profit  */}
                <tr>
                  <th style={{ fontWeight: "bolder" }} colSpan={2}>
                    Gross Profit
                  </th>
                  <th>{parseInt(Gross_profit.toFixed(2)).toLocaleString()}</th>
                </tr>
                {/* Expenses  */}
                <tr>
                  <th style={{ fontWeight: "bolder" }}>
                    Less Operating Expenses
                  </th>
                  <td></td>
                  <th></th>
                </tr>
                <tr>
                  <td colSpan={2}>Salaries Expense</td>
                  <td>
                    {parseInt(salaries_Expense.toFixed(2)).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td>Electricity Expense</td>
                  <td></td>
                  <td>
                    {parseInt(electricity_Expense.toFixed(2)).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td>Water Expense</td>
                  <td></td>
                  <td>{parseInt(water_Expense.toFixed(2)).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Gas Expense</td>
                  <td></td>
                  <td>{parseInt(gas_Expense.toFixed(2)).toLocaleString()}</td>
                </tr>
                {/* office_Rental_Expense
  repairing_Maintenance */}
                <tr>
                  <td>Office Rental Expense</td>
                  <td></td>
                  <td>
                    {parseInt(
                      office_Rental_Expense.toFixed(2)
                    ).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td>Repairing and Maintenance</td>
                  <td></td>
                  <td>
                    {parseInt(
                      repairing_Maintenance.toFixed(2)
                    ).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td>Delivery Expense</td>
                  <td></td>
                  <td>
                    {parseInt(delivery_Expense.toFixed(2)).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td>Stationery Expense</td>
                  <td></td>
                  <td>
                    {parseInt(stationery_Expense.toFixed(2)).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td>Internet Bill</td>
                  <td></td>
                  <td>{parseInt(internet_Bill.toFixed(2)).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Other Expense</td>
                  <td></td>
                  <td>{parseInt(other_Expense.toFixed(2)).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bolder" }}>Net Profit</td>
                  <td></td>
                  <td style={{ fontWeight: "bolder" }}>{ (Gross_profit - net_profit).toLocaleString() }</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default Income_Stat;



























