import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import axios from "axios";


const Payment_Details = ({ user, ToggleAlert }) => {
  const [LinkHover, setLinkHover] = useState(false);
  const [plan , setPlan] = useState(false)
  // const [Edit, setEdit] = useState(false);
  // const [Data, setData] = useState({
  //   username: user.username,
  //   password: user.password,
  //   email: user.email,
  //   image: user.image,
  //   details: user.details,
  // });

  const plans = [
    {
      plan: "1",
      users: "2",
      desc: "All Features Included",
      price: 2500,
    },
    {
      plan: "2",
      users: "4",
      desc: "All Features Included",
      price: 5000,
    },
    {
      plan: "3",
      users: "6",
      desc: "All Features Included",
      price: 7500,
    },
    {
      plan: "4",
      users: "8",
      desc: "All Features Included",
      price: 10000,
    },
  ];

  useEffect(()=>{
    if(user.plan == 2){
      setPlan(plans[0])
    }
    if (user.plan == 4) {
      setPlan(plans[1]);
    }
    if (user.plan == 6) {
      setPlan(plans[2]);
    }
    if (user.plan == 8) {
      setPlan(plans[3]);
    }
  })



  const HandleMouseIn = () => {
    setLinkHover(true);
  };

  const HandleMouseOut = () => {
    setLinkHover(false);
  };


  // const HandleChange = (e) => {
  //   setData({ ...Data, [e.target.name]: e.target.value });
  // };
  // const HandleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log(Data);

  //   try {
  //     const url = `${process.env.REACT_APP_API_URL}/user/update?id=${user._id}`;
  //     const response = await axios.post(url, Data);
  //     localStorage.setItem("user", JSON.stringify(response.data.data));
  //     setEdit(false);
  //     setTimeout(() => {
  //       window.location.reload();
  //     }, 5500);
  //     ToggleAlert("Success", "Your Changes Will Update in 5 seconds");
  //   } catch (error) {
  //     console.log(error);
  //     if (
  //       error.response &&
  //       error.response.status >= 400 &&
  //       error.response.status <= 500
  //     ) {
  //       console.log(error.response.data.message);
  //     }
  //   }
  // };

  return plan ? (
    <>
      <div className="main-card p-4">
        <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li className="nav-item mr-2">
            <Link
              to="/profile"
              className="nav-link text-success border rounded-pill"
            >
              My Profile
            </Link>
          </li>
          <li className="nav-item mx-2">
            <Link
              to="/billing"
              className="nav-link text-success active border rounded-pill"
            >
              Billing / Subscription Plans
            </Link>
          </li>
        </ul>
        <div className="p-4">
          <div className="mb-3 border-bottom">
            <p className="h4">Current Subscription</p>
            <p className="text-muted">Fees Exclusive of Tax</p>
          </div>
          <div className="row py-3 px-4">
            <div className="col-4 py-2">
              <p className="h5 m-0">Plan {plan.plan}</p>
              <p className="text-muted" style={{ fontSize: "12px" }}>
                Effective From {user.current_date}
              </p>
            </div>
            <div className="col-4 py-2 text-center">
              <div>
                <p className="m-0" style={styles.TextWrap}>
                  {plan.desc} with <strong>{plan.users}</strong> Users
                </p>
              </div>
            </div>
            <div className="col-4 py-2 d-flex justify-content-end">
              <p className="h6">PKR {plan.price.toLocaleString()}</p>
            </div>
          </div>
          <div className="px-4">
            <a
              href="https://quickmanagement.io/pricing/"
              style={LinkHover ? styles.uiLinkHover : styles.uiLink}
              onMouseEnter={HandleMouseIn}
              onMouseLeave={HandleMouseOut}
              target="_blank"
            >
              Learn more about plans on the pricing page
              <i className="fas fa-external-link-alt ml-2"></i>
            </a>
            <div className="pt-4">
              <p className="h6 m-0">To Change/Upgrade your subscription plan please contact : +92 332 2027538</p>
              {/* <button className="btn btn-primary" style={styles.btnRadius}>
                Change Subscription Plan
              </button> */}
            </div>
          </div>
        </div>

        {/* INVOICE */}
        <div className="px-4 py-5">
          <div className="mb-3 border-bottom">
            <p className="h4">Invoices</p>
            <p className="text-muted">Itemized statements of service charges</p>
          </div>
          {/* <div className="row py-3 px-4">
            <div className="col-12 pb-4">
              <p className="h5 m-0">Overdue invoices</p>
            </div>
            <div className="col-4 py-2">
              <p className="h6 m-0">Starter Plan</p>
              <p className="text-muted" style={{ fontSize: "12px" }}>
                Effective From Nov 1, 2022
              </p>
            </div>
            <div className="col-4 py-2 text-center">
              <div>
                <p className="h6 m-0 text-left">Due From</p>
                <p
                  className="text-muted text-left"
                  style={{ fontSize: "12px" }}
                >
                  Nov 1, 2022
                </p>
              </div>
            </div>
            <div className="col-4 py-2 d-flex justify-content-end">
              <p className="h6">PKR 5000</p>
            </div>
          </div> */}

          <div className="row py-3 px-4">
            <div className="col-12 pb-4">
              <p className="h5 m-0">Paid invoice receipts</p>
            </div>
            <div className="col-12 py-2">
              <div
                className="text-dark p-3 rounded"
                style={{ background: "#f0f0f0" }}
              >
                <a
                  href={`${process.env.REACT_APP_IMAGE_URL}${user.attachment}`}
                  download={
                    user.username + "-" + user.current_date + "-Receipt"
                  }
                  target="_blank"
                >
                  Receipt for the date : {user.current_date}
                </a>
              </div>
              {/* <img
                  src={`${process.env.REACT_APP_IMAGE_URL}/${user.attachment}`}
                  style={{ width : "50%" }}
                /> */}
              {/* <p className="text-muted">No receipts found</p> */}
            </div>
            {/* <div className="col-4 py-2">
              <p className="h6 m-0">Starter Plan</p>
              <p className="text-muted" style={{ fontSize: "12px" }}>
                Effective From Nov 1, 2022
              </p>
            </div>
            <div className="col-4 py-2 text-center">
              <div>
                <p className="h6 m-0 text-left">Due From</p>
                <p
                  className="text-muted text-left"
                  style={{ fontSize: "12px" }}
                >
                  Nov 1, 2022
                </p>
              </div>
            </div>
            <div className="col-4 py-2 d-flex justify-content-end">
              <p className="h5">PKR 5000</p>
            </div> */}
          </div>
        </div>

        {/* BILLING DETAILS */}

        <div className="px-4">
          <div className="mb-3 border-bottom">
            <p className="h4">Billing details</p>
            <p className="text-muted">
              Payment and billing information for your account
            </p>
          </div>
          <div className="row py-3 px-4">
            <div className="col-12 pb-4">
              <p className="h5 m-0">Payment information</p>
            </div>
            <div className="col-4 py-2">
              <p className="h6 m-0">Payment method:</p>
            </div>
            <div className="col-4 py-2">
              <p className="h6 m-0 text-left text-muted">Bank Transfer</p>
            </div>
          </div>
          {/* <div className="pt-2 pb-3 px-4">
            <button className="btn btn-primary" style={styles.btnRadius}>
              Add payment method
            </button>
          </div> */}
          {/* {Edit ? (
            <form onSubmit={HandleSubmit}>
              <div className="row pt-5 px-4">
                <div className="col-12 pb-4">
                  <p className="h5 m-0">Billing information</p>
                </div>
                <div className="col-4 py-2">
                  <p className="h6 m-0">Name:</p>
                </div>
                <div className="col-8 py-2">
                  <p className="h6 m-0 text-left text-muted">{user.username}</p>
                </div>

                <div className="col-4 py-2">
                  <p className="h6 m-0">Email:</p>
                </div>
                <div className="col-8 py-2">
                  <p className="h6 m-0 text-left text-muted">{user.email}</p>
                </div>

                <div className="col-4 py-2">
                  <p className="h6 m-0">Details:</p>
                </div>
                <div className="col-5 py-2">
                  <textarea
                    placeholder="Enter Billing Details"
                    onChange={HandleChange}
                    name="details"
                    className="form-control"
                    rows={4}
                    style={{ borderRadius: "10px" }}
                  ></textarea>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="btn btn-success"
                      style={styles.btnRadius}
                    >
                      Save & Approved
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary  ml-2"
                      onClick={() => setEdit(false)}
                      style={styles.btnRadius}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : ( */}
          <>
            <div className="row pt-5 px-4">
              <div className="col-12 pb-4">
                <p className="h5 m-0">Billing information</p>
              </div>
              <div className="col-4 py-2">
                <p className="h6 m-0">Name:</p>
              </div>
              <div className="col-8 py-2">
                <p className="h6 m-0 text-left text-muted">{user.username}</p>
              </div>

              <div className="col-4 py-2">
                <p className="h6 m-0">Email:</p>
              </div>
              <div className="col-8 py-2">
                <p className="h6 m-0 text-left text-muted">{user.email}</p>
              </div>

              <div className="col-4 py-2">
                <p className="h6 m-0">Bank :</p>
              </div>
              <div className="col-8 py-2">
                <p className="h6 m-0 text-left text-muted">{user.bank}</p>
              </div>

              <div className="col-4 py-2">
                <p className="h6 m-0">Account Title :</p>
              </div>
              <div className="col-8 py-2">
                <p className="h6 m-0 text-left text-muted">
                  {user.account_title}
                </p>
              </div>

              <div className="col-4 py-2">
                <p className="h6 m-0">Account No. :</p>
              </div>
              <div className="col-8 py-2">
                <p className="h6 m-0 text-left text-muted">
                  {user.account_number}
                </p>
              </div>
            </div>
            {/* <div className="px-4 pt-4">
              <button
                className="btn btn-primary"
                style={styles.btnRadius}
                onClick={() => setEdit(true)}
              >
                Edit Billing Details
              </button>
            </div> */}
          </>
          {/* )} */}
        </div>
      </div>
    </>
  ) : (
    <>
      <div style={{ textAlign: "center", marginTop: "10rem" }}>
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </>
  );
};

export default Payment_Details;
