import photo from "../assets/photo.jpg";
import { Chart } from "react-google-charts";
import React, { useContext, useEffect, useState } from "react";
// import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import axios from "axios";
import { AuthContext } from "../context/authContextProvicer";

export const data = [
  ['Month', 'Revenue', 'Expenses'],
  ['January', 5000, 2000],
  ['Febuary', 0, 0],
  ['March', 0, 0],
  ['April', 0, 0],
  ['May', 0, 0],
  ['June', 0, 0],
  ['July', 0, 0],
  ['August', 0, 0],
  ['September', 0, 0],
  ['October', 0, 0],
  ['November', 0, 0],
  ['December', 0, 0],
];

export const options = {
  title: 'Project Statistics',
  titleTextStyle: { fontSize: 24, bold: false },
  curveType: 'function',
  legend: { position: 'top', textStyle: { fontSize: 16 } },
  // 'width':"100%",
  // 'height':"400",
  colors: ['#3A6FF8', '#25D136'],
  vAxis: { gridlines: { color: '#F0F0F0', minSpacing: 20 }, baseline: { color: '#F0F0F0' }, format: 'PKR' },
  theme: { vAxis: { textStyle: { fontSize: 12, color: '#B0B0B0', opacity: '1' } }, hAxis: { textStyle: { fontSize: 12, color: '#B0B0B0', opacity: '1' } } },
};

// export const pie_data = [
//   ["Tasks", "Amount"],
//   ['Amount Recive', 28.57142857142857],
//   ['Amount Dues', 71.42857142857143],
// ];

export const pie_options = {
  title: 'Accounts',
  titleTextStyle: { fontSize: 20, bold: false },
  pieStartAngle: '-150',
  colors: ['#3A6FF8', '#13CC26', '#3A6FF8'],
  legend: { position: 'bottom', textStyle: { fontSize: 14 }, marginHorizontal: 'auto' },
  chartArea: { width: 300 }
};

const Dashboard = () => {

  const [data1, setData] = useState([]);
  const [debitquotation, setdebitquotation] = useState(0);
  const [creditquotation, setcreditquotation] = useState(0);

  const [today, settoday] = useState(0);
  const [yesterday, setyesterday] = useState(0);
  const [curr_week, setcurr_week] = useState(0);
  const [prev_week, setprev_week] = useState(0);
  const [curr_month, setcurr_month] = useState(0);
  const [prev_month, setprev_month] = useState(0);
  const [curr_year, setcurr_year] = useState(0);
  const [prev_year, setprev_year] = useState(0);

  const [today_percentage, settoday_percentage] = useState(0);
  const [week_percentage, setweek_percentage] = useState(0);
  const [month_percentage, setmonth_percentage] = useState(0);
  const [year_percentage, setyear_percentage] = useState(0);

  const [ac_payable, setac_payable] = useState(0);
  const [ac_recive, setac_recive] = useState(0);
  const [products, setproducts] = useState([]);
  const [inventory, setinventory] = useState([]);

  const [total_value, settotal_value] = useState([]);
  const [total_recive, settotal_reciv] = useState(0);
  const [total_dues, settotal_dues] = useState(0);
  const [no_sales, setno_sales] = useState(0);


  const [loader, setloader] = useState(true);
  const [loadChart,setloadChart] = useState(true)



  const { user } = useContext(AuthContext);

  // const pie_data = [];

  var user_id = user._id;
  const date1 = new Date();
  const Arr_1 = [];
  let i = 0;

  // const calculation_total = () =>{
  //   let total = (20000/70000) * 
  // }


  useEffect(() => {
    show();
  }, []);

  const show = () => {

    axios.get(`${process.env.REACT_APP_API_URL}/dashboard/dashbaord_entries/getdashboardinvoice?id=${user_id}`, {
      'user_id': user_id
    }).then((response) => {
      settoday(calculation(response.data.Today));
      setyesterday(calculation(response.data.Yesterday));
      setcurr_week(calculation(response.data.curr_week));
      setprev_week(calculation(response.data.prev_week));
      setcurr_month(calculation(response.data.curr_month));
      setprev_month(calculation(response.data.prev_month));
      setcurr_year(calculation(response.data.curr_year));
      setprev_year(calculation(response.data.prev_year));
      settoday_percentage(((calculation(response.data.Today) - calculation(response.data.Yesterday)) / calculation(response.data.Yesterday)) * 100);
      setweek_percentage(((calculation(response.data.curr_week) - calculation(response.data.prev_week)) / calculation(response.data.prev_week)) * 100);
      setmonth_percentage(((calculation(response.data.curr_month) - calculation(response.data.prev_month)) / calculation(response.data.prev_month)) * 100);
      setyear_percentage(((calculation(response.data.curr_year) - calculation(response.data.prev_year)) / calculation(response.data.prev_year)) * 100);
      // console.log(response.data.Today);
      setData(response.data);
    })


    //get top products
    axios.get(`${process.env.REACT_APP_API_URL}/dashboard/dashbaord_entries/dashbaordcheck?id=${user_id}`, {
      'user_id': user_id
    }).then((response) =>
      // console.log(response.data.stock_inventory_1.stock_inventory_value)
      setproducts(response.data.stock_inventory_1.stock_inventory_value)
    )


    axios.get(`${process.env.REACT_APP_API_URL}/sales/invoice?id=${user_id}`, {
      'user_id': user_id
    }).then((response) => {
      setac_payable(ac_receive(response.data));
      if (i == 0) {
        let wq = total_value_chart(response.data);
        if (wq[0] > 0) {
          settotal_reciv(wq[0]);
          settotal_dues(wq[1]);
        } else {
          setno_sales(100);
        }
        setloadChart(false)
      }
      i++;
    })

    axios.get(`${process.env.REACT_APP_API_URL}/purchase/invoice?id=${user_id}`, {
      'user_id': user_id
    }).then((response) => {
      setac_recive(ac_pay(response.data));
      setloader(false);
    })

  }


  const total_value_chart = (val) => {
    let total_recived = 0;
    let total_net = 0;
    let total_Dues = 0;
    val.map((value, index) => {
      total_recived += value.received;
      total_net += value.net;
      total_Dues += value.net - value.received;
    })

    total_recived = (total_recived / total_net) * 100;
    total_Dues = (total_Dues / total_net) * 100;
    return [total_recived, total_Dues, total_net];
  }

  function calculation(e) {
    let value = calculationforvalue(e);
    return value;
  }

  function calculationforvalue(e) {
    let total = 0;
    e.map((val) => {
      total += val.amount;
    });
    return total;
  }

  const ac_receive = (val) => {
    let total = 0;
    val.map((value, index) => {
      total += value.net - value.received;
    })
    return total;
  }

  const ac_pay = (val) => {
    let total = 0;
    val.map((value, index) => {
      //  console.log("value"+value.net);
      total = value.net - value.received;
    })
    // console.log("TOTAL"+total);
    return total;
  }


  return (
    <>
      {loader ? (
        <>
          <div style={{ textAlign: "center", marginTop: "10rem" }}>
            <div class="spinner-border" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="main-card-dash">
            <div className="row justify-content-between">
              <div className="col-md-3 p-2">
                <div className="bg-white rounded">
                  <div className="d-flex justify-content-between align-items-center p-3">
                    <div>
                      {today_percentage > 0 &&
                      today_percentage != null &&
                      today_percentage != Infinity ? (
                        <>
                          <span className="mx-lg-2 mx-0">
                            <i className="fa-solid fa-caret-up text-success"></i>
                          </span>
                          <span className="mr-lg-2 mr-1 text-success">
                            +{Math.round(today_percentage)}%
                          </span>
                        </>
                      ) : today_percentage < 0 ? (
                        today_percentage < 0 ? (
                          <>
                            <span className="mx-lg-2 mx-0">
                              <i className="fa-solid fa-caret-down text-danger"></i>
                            </span>
                            <span className="mr-lg-2 mr-1 text-danger">
                              {Math.round(today_percentage)}%
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="mx-lg-2 mx-0">
                              <i className="fa-solid fa-caret-down text-danger"></i>
                            </span>
                            <span className="mr-lg-2 mr-1 text-danger">
                              +100%
                            </span>
                          </>
                        )
                      ) : (
                        <>
                          <span className="mx-lg-2 mx-0">
                            <i className="fa-solid fa-caret-up text-success"></i>
                          </span>
                          <span className="mr-lg-2 mr-1 text-success">+0%</span>
                        </>
                      )}
                      <span className="text-muted ml-lg-2">Today</span>
                    </div>
                  </div>
                  <div>
                    <p className="px-3 h3 mb-0 pb-3">
                      {/* PKR {today}{" "} */}PKR{" "}
                      {parseInt(today.toFixed(2)).toLocaleString()}
                    </p>
                    <p className="px-3 text-muted mb-0 pb-3">Yesterday</p>
                    <p className="px-3 text-muted mb-0 pb-3">
                      {/* PKR {yesterday}{" "} */}PKR{" "}
                      {parseInt(yesterday.toFixed(2)).toLocaleString()}
                    </p>
                    {/* <p className="px-3 text-muted mb-0 pb-3">CREDIT PKR 0</p> */}
                  </div>
                </div>
              </div>
              <div className="col-md-3 p-2">
                <div className="bg-white rounded">
                  <div className="d-flex justify-content-between align-items-center p-3">
                    <div>
                      {week_percentage > 0 &&
                      week_percentage != null &&
                      week_percentage != Infinity ? (
                        <>
                          <span className="mx-lg-2 mx-0">
                            <i className="fa-solid fa-caret-up text-success"></i>
                          </span>
                          <span className="mr-lg-2 mr-1 text-success">
                            +{Math.round(week_percentage)}%
                          </span>
                        </>
                      ) : week_percentage < 0 ? (
                        week_percentage < 0 ? (
                          <>
                            <span className="mx-lg-2 mx-0">
                              <i className="fa-solid fa-caret-down text-danger"></i>
                            </span>
                            <span className="mr-lg-2 mr-1 text-danger">
                              {Math.round(week_percentage)}%
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="mx-lg-2 mx-0">
                              <i className="fa-solid fa-caret-down text-danger"></i>
                            </span>
                            <span className="mr-lg-2 mr-1 text-danger">
                              +100%
                            </span>
                          </>
                        )
                      ) : (
                        <>
                          <span className="mx-lg-2 mx-0">
                            <i className="fa-solid fa-caret-up text-success"></i>
                          </span>
                          <span className="mr-lg-2 mr-1 text-success">+0%</span>
                        </>
                      )}
                      <span className="text-muted ml-lg-2">This Week</span>
                    </div>
                    {/* <div>
                  <span>
                    <i className="fa-solid fa-circle-info"></i>
                  </span>
                </div> */}
                  </div>
                  <div>
                    {/* PKR {curr_week} */}
                    <p className="px-3 h3 mb-0 pb-3">
                      {" "}
                      PKR {parseInt(curr_week.toFixed(2)).toLocaleString()}
                    </p>
                    <p className="px-3 text-muted mb-0 pb-3">Last Week</p>
                    {/* PKR {prev_week} */}
                    <p className="px-3 text-muted mb-0 pb-3">
                      {" "}
                      PKR {parseInt(prev_week.toFixed(2)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 p-2">
                <div className="bg-white rounded">
                  <div className="d-flex justify-content-between align-items-center p-3">
                    <div>
                      {month_percentage > 0 &&
                      month_percentage != null &&
                      month_percentage != Infinity ? (
                        <>
                          <span className="mx-lg-2 mx-0">
                            <i className="fa-solid fa-caret-up text-success"></i>
                          </span>
                          <span className="mr-lg-2 mr-1 text-success">
                            +{Math.round(month_percentage)}%
                          </span>
                        </>
                      ) : month_percentage < 0 ? (
                        month_percentage < 0 ? (
                          <>
                            <span className="mx-lg-2 mx-0">
                              <i className="fa-solid fa-caret-down text-danger"></i>
                            </span>
                            <span className="mr-lg-2 mr-1 text-danger">
                              {Math.round(month_percentage)}%
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="mx-lg-2 mx-0">
                              <i className="fa-solid fa-caret-down text-danger"></i>
                            </span>
                            <span className="mr-lg-2 mr-1 text-danger">
                              +100%
                            </span>
                          </>
                        )
                      ) : (
                        <>
                          <span className="mx-lg-2 mx-0">
                            <i className="fa-solid fa-caret-up text-success"></i>
                          </span>
                          <span className="mr-lg-2 mr-1 text-success">+0%</span>
                        </>
                      )}
                      <span className="text-muted ml-lg-2">This Month</span>
                    </div>
                    {/* <div>
                  <span>
                    <i className="fa-solid fa-circle-info"></i>
                  </span>
                </div> */}
                  </div>
                  <div>
                    {/* PKR {curr_month} */}
                    {/* PKR {prev_month} */}
                    <p className="px-3 h3 mb-0 pb-3">
                      PKR {parseInt(curr_month.toFixed(2)).toLocaleString()}
                    </p>
                    <p className="px-3 text-muted mb-0 pb-3">Last Month</p>
                    <p className="px-3 text-muted mb-0 pb-3">
                      PKR {parseInt(prev_month.toFixed(2)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 p-2">
                <div className="bg-white rounded">
                  <div className="d-flex justify-content-between align-items-center p-3">
                    <div>
                      {year_percentage > 0 &&
                      year_percentage != null &&
                      year_percentage != Infinity ? (
                        <>
                          <span className="mx-lg-2 mx-0">
                            <i className="fa-solid fa-caret-up text-success"></i>
                          </span>
                          <span className="mr-lg-2 mr-1 text-success">
                            +{Math.round(year_percentage)}%
                          </span>
                        </>
                      ) : year_percentage < 0 ? (
                        year_percentage < 0 ? (
                          <>
                            <span className="mx-lg-2 mx-0">
                              <i className="fa-solid fa-caret-down text-danger"></i>
                            </span>
                            <span className="mr-lg-2 mr-1 text-danger">
                              {Math.round(year_percentage)}%
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="mx-lg-2 mx-0">
                              <i className="fa-solid fa-caret-down text-danger"></i>
                            </span>
                            <span className="mr-lg-2 mr-1 text-danger">
                              +100%
                            </span>
                          </>
                        )
                      ) : (
                        <>
                          <span className="mx-lg-2 mx-0">
                            <i className="fa-solid fa-caret-up text-success"></i>
                          </span>
                          <span className="mr-lg-2 mr-1 text-success">+0%</span>
                        </>
                      )}
                      <span className="text-muted ml-lg-2">This Year</span>
                    </div>
                    {/* <div>
                  <span>
                    <i className="fa-solid fa-circle-info"></i>
                  </span>
                </div> */}
                  </div>
                  <div>
                    {/* PKR {curr_year} */}
                    {/* PKR {prev_year} */}
                    <p className="px-3 h3 mb-0 pb-3">
                      PKR {parseInt(curr_year.toFixed(2)).toLocaleString()}
                    </p>
                    <p className="px-3 text-muted mb-0 pb-3">Last Year</p>
                    <p className="px-3 text-muted mb-0 pb-3">
                      PKR {parseInt(prev_year.toFixed(2)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 p-2">
                <div className="bg-white rounded">
                  <div className="d-flex justify-content-between align-items-center p-3">
                    <div>
                      <span className="mx-lg-2 mx-0">
                        <i className="fa-solid fa-caret-up text-success"></i>
                      </span>
                      {/* <span className="mr-lg-2 mr-1 text-success">+1.02%</span> */}
                      <span className="text-muted ml-lg-2">
                        A/C Receiveable
                      </span>
                    </div>
                    {/* <div>
                  <span>
                    <i className="fa-solid fa-circle-info"></i>
                  </span>
                </div> */}
                  </div>
                  <div>
                    {/* PKR {curr_month} */}
                    {/* PKR {prev_month} */}
                    <p className="px-3 h3 mb-0 pb-3">
                      PKR {ac_payable.toLocaleString()}
                    </p>
                    <p className="px-3 text-muted mb-0 pb-3">Current</p>
                    {/* <p className="px-3 text-muted mb-0 pb-3">PKR {prev_month.toLocaleString()}</p> */}
                  </div>
                </div>
              </div>
              <div className="col-md-6 p-2">
                <div className="bg-white rounded">
                  <div className="d-flex justify-content-between align-items-center p-3">
                    <div>
                      <span className="mx-lg-2 mx-0">
                        <i className="fa-solid fa-caret-up text-success"></i>
                      </span>
                      {/* <span className="mr-lg-2 mr-1 text-success">+1.02%</span> */}
                      <span className="text-muted ml-lg-2">A/C Payable</span>
                    </div>
                    {/* <div>
                  <span>
                    <i className="fa-solid fa-circle-info"></i>
                  </span>
                </div> */}
                  </div>
                  <div>
                    {/* PKR {curr_year} */}
                    {/* PKR {prev_year} */}
                    <p className="px-3 h3 mb-0 pb-3">
                      PKR {ac_recive.toLocaleString()}
                    </p>
                    <p className="px-3 text-muted mb-0 pb-3">Current</p>
                    {/* <p className="px-3 text-muted mb-0 pb-3">PKR {prev_year.toLocaleString()}</p> */}
                  </div>
                </div>
              </div>

              {/* this work pending */}
              {/* <div className="col-md-12 p-2">
            <div className="bg-white rounded">
              <div id="graph">
                <Chart
                  chartType="LineChart"
                  width="100%"
                  height="400px"
                  data={data}
                  options={options}
                />
              </div>
            </div>
          </div> */}
              <div className="col-md-4 p-2">
                <div className="bg-white rounded">
                  <div id="piechart">
                    {loadChart ? (
                      <>
                        <div
                          style={{ textAlign: "center" }}
                        >
                          <div class="spinner-border" role="status">
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <Chart
                        chartType="PieChart"
                        data={[
                          ["Tasks", "Amount"],
                          ["Amount Receive", total_recive],
                          ["Amount Dues", total_dues],
                          ["No Accounts", no_sales],
                        ]}
                        options={pie_options}
                        width={"100%"}
                        height={"400px"}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-8 p-2">
                <div className="bg-white rounded p-3">
                  <p className="h5 mb-3">Top Products</p>
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead>
                        <tr className="text-center">
                          <th scope="col" className="p-3 text-muted ">
                            Product
                          </th>
                          <th scope="col" className="p-3 text-muted ">
                            Warehouse
                          </th>
                          <th scope="col" className="p-3 text-muted ">
                            Rate
                          </th>
                          <th scope="col" className="p-3 text-muted ">
                            Date
                          </th>
                          <th scope="col" className="p-3 text-muted "></th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.length > 0 ? (
                          products.map((val, index) =>
                            index < 3 ? (
                              <tr
                                className="border-bottom text-center"
                                key={index}
                              >
                                <th scope="row" className="h6 py-3 px-0">
                                  {`${val[0].stock_inventory_name}-${val[0].sku}`}
                                </th>
                                <td className="h6 py-3 px-0 text-muted">
                                  {val[0].WareHouse.stock_warehouse_name}
                                </td>
                                <td className="h6 py-3 px-0 text-muted">
                                  {val[0].amount.toLocaleString()}
                                </td>
                                <td className="h6 py-3 px-0">{val[0].date}</td>
                                {/* <td className="h6 py-3 px-0">
                          <i className="fa-solid fa-circle-info text-muted"></i>
                        </td> */}
                              </tr>
                            ) : (
                              " "
                            )
                          )
                        ) : (
                          <tr className="border-bottom">
                            <th scope="row" className="h6 py-3 px-0">
                              ----
                            </th>
                            <td className="h6 py-3 px-0 text-muted">----</td>
                            <td className="h6 py-3 px-0 text-muted">----</td>
                            <td className="h6 py-3 px-0">----</td>
                            {/* <td className="h6 py-3 px-0">
                          <i className="fa-solid fa-circle-info text-muted"></i>
                        </td> */}
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* <div className="col-md-4 p-2">
            <div className="bg-white rounded p-3">
              <p className="h5 mb-3">Resent Message</p>
              <div className="d-flex justify-content-between align-items-center my-3">
                <div className="d-flex justify-content-between">
                  <img src={photo} className="img-fluid mr-2" alt="Logo" />
                  <div className="d-flex flex-column">
                    <span>Jane Cooper</span>
                    <span className="text-muted">
                      Aliqua id fugiat nostrud...
                    </span>
                  </div>
                </div>
                <span className="text-muted">53s ago</span>
              </div>
              <div className="d-flex justify-content-between align-items-center my-3">
                <div className="d-flex justify-content-between">
                  <img src={photo} className="img-fluid mr-2" alt="Logo" />
                  <div className="d-flex flex-column">
                    <span>Jane Cooper</span>
                    <span className="text-muted">
                      Aliqua id fugiat nostrud...
                    </span>
                  </div>
                </div>
                <span className="text-muted">53s ago</span>
              </div>
              <div className="d-flex justify-content-between align-items-center my-3">
                <div className="d-flex justify-content-between">
                  <img src={photo} className="img-fluid mr-2" alt="Logo" />
                  <div className="d-flex flex-column">
                    <span>Jane Cooper</span>
                    <span className="text-muted">
                      Aliqua id fugiat nostrud...
                    </span>
                  </div>
                </div>
                <span className="text-muted">53s ago</span>
              </div>
            </div>
          </div> */}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
