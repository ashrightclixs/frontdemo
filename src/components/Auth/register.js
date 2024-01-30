import { Link, useNavigate } from 'react-router-dom'
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import logo from "../../assets/logo.jpg";
import styles from "../../styles/styles"

export const initialState = {
  username: "",
  email: "",
  password: "",
};

function Register({ ToggleAlert }) {
  const history = useNavigate();


  const [data, setData] = useState(initialState);
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);
  const [getplan, setgetplan] = useState(false);
  const [getplan_2, setgetplan_2] = useState(false);
  const [imageUpdated, setImageUpdated] = useState(false);
  const [attachment, setAttachemnt] = useState("no-attachment"); //data for customer
  const [showformdata, setshowformdata] = useState(initialState); //form data passed
  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
      region: "Pak",
      isadmin: false,
      status: false,
      image: "",
    });
  };

  const HandleFileUpload = (e) => {

    const maxAllowedSize = 5 * 1024 * 1024;
    if (e.target.files[0].size > maxAllowedSize) {
      // Here you can ask your users to load correct file
      ToggleAlert("Warning", `File is too big!`);
      e.target.value = "";
    } else {
      setData({ ...data, attachment: e.target.files[0] });
      ToggleAlert(
        "Success",
        `Your File : ${e.target.files[0].name} has been added. Click Sign Up Button`
      );
      setImageUpdated(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true)
    //  axios

    const formdata = new FormData();
    formdata.append("email", data.email);
    formdata.append("password", data.password);
    formdata.append("username", data.username);
    formdata.append("region", data.region);
    formdata.append("isadmin", data.isadmin);
    formdata.append("status", data.status);
    formdata.append("image", data.image);
    formdata.append("plan", data.plan);
    formdata.append("bank", data.bank);
    formdata.append("account_number", data.account_number);
    formdata.append("account_title", data.account_title);
    formdata.append("attachment", data.attachment, data.attachment.name);

    //    .then((res) => console.log(res.data));
 
    try {
      const url = `${process.env.REACT_APP_API_URL}/user/register`;
      const { data: res } = await axios.post(url, formdata);
      setLoader(false)
      history("/login");
      setTimeout(() => {
        ToggleAlert(
          "Success",
          "Profile Added. You are added in Queue"
        );
      }, 1000);
    } catch (error) {
      setLoader(false)
      console.log(error);
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };


  const changeState = () =>{
    setgetplan_2(!getplan_2);
    setgetplan(true);
  }

  const changeState_final = () =>{
    setgetplan_2(false);
    setgetplan(false);
  }
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  

  return (
    <div className="bg-image">
      <div className="wid-50 bg-white p-5 middle-y shadow rounded-3">
        <div className="text-center pb-3">
          <img src={logo} alt="logo" className="mb-3" />
        </div>
        <form onSubmit={handleSubmit}>
          {getplan ? (
            getplan_2 ? (
              <div>
                <div>
                  <div className="table-responsive">
                    <table class="table table-bordered">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Details</th>
                          <th scope="col">EASYPAISA</th>
                          <th scope="col">HABIB METRO</th>
                          <th scope="col">NAYAPAY</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* <tr>
                        <th scope="row">1</th>
                        <td>Bank</td>
                        <td>Easypaisa account</td>
                        <td>HABIBMETRO</td>
                        <td>NAYAPAY</td>
                      </tr> */}
                        <tr>
                          <th scope="row">1</th>
                          <th>Account Title</th>
                          <td className="h6">USMAN GHANI</td>
                          <td className="h6">USMAN GHANI</td>
                          <td className="h6">USMAN GHANI</td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <th>Account Number</th>
                          <td className="h6">0334-7626141</td>
                          <td className="h6">60120-20311714198588</td>
                          <td className="h6">0332-2027538</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span
                        className="input-group-text bg-white border-right-0"
                        id="basic-addon1"
                      >
                        <i className="fas fa-building-columns"></i>
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Your Bank Name"
                      aria-label="Username"
                      name="bank"
                      onChange={handleChange}
                      required
                      style={styles.uiInputGroupRight}
                      aria-describedby="basic-addon1"
                    />
                  </div>
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span
                        className="input-group-text bg-white border-right-0"
                        id="basic-addon1"
                      >
                        <i className="fas fa-hashtag"></i>
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Your Account Number"
                      aria-label="account_number"
                      name="account_number"
                      onChange={handleChange}
                      required
                      style={styles.uiInputGroupRight}
                      aria-describedby="basic-addon1"
                    />
                  </div>
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span
                        className="input-group-text bg-white border-right-0"
                        id="basic-addon1"
                      >
                        <i className="fas fa-t"></i>
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Your Account Title"
                      aria-label="account_title"
                      name="account_title"
                      onChange={handleChange}
                      required
                      style={styles.uiInputGroupRight}
                      aria-describedby="basic-addon1"
                    />
                  </div>
                  <div className="col-12 px-0">
                    <h6 className="my-3">Attach Payment Screenshot</h6>
                    <div className="w-100 dashed mb-3">
                      <div className="input-group p-md-4 p-2">
                        <div className="custom-file">
                          <input
                            type="file"
                            className="custom-file-input"
                            id="inputGroupFile01"
                            name="attachment"
                            accept="image/jpg, image/jpeg, image/png"
                            onChange={HandleFileUpload}
                            aria-describedby="inputGroupFileAddon01"
                          />
                          <label
                            className="custom-file-label border-0 w-50 mx-auto"
                            htmlFor="inputGroupFile01"
                          >
                            <span className="hide-me">
                              {imageUpdated ? "File Uploaded" : "Drop Files"}
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-success mr-3"
                  onClick={() => changeState()}
                  style={getplan ? styles.btnRadius : { display: "none" }}
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={getplan_2 ? styles.btnRadius : { display: "none" }}
                >
                  {loader ? (
                    <span
                      class="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </div>
            ) : (
              <div>
                <div className="table-responsive">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col"></th>
                        <th scope="col">Plans</th>
                        <th scope="col">Users</th>
                        <th scope="col">Pricing</th>
                        <th scope="col">Features</th>
                        {/* <th scope="col">Plan 4</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row" className="text-center">
                          <input
                            type="radio"
                            value="2"
                            name="plan"
                            required
                            onChange={handleChange}
                          />
                        </th>
                        <td className="h6">Plan 1</td>
                        <td className="h6">2 Users</td>
                        <td className="h6">PKR&nbsp;2,500/month</td>
                        <td className="h6">All Features Included</td>
                        {/* <td>8 Users</td> */}
                      </tr>
                      <tr>
                        <th scope="row" className="text-center">
                          <input
                            type="radio"
                            value="4"
                            name="plan"
                            required
                            onChange={handleChange}
                          />
                        </th>
                        <td className="h6">Plan 2</td>
                        <td className="h6">4 Users</td>
                        <td className="h6">PKR&nbsp;5,000/month</td>
                        {/* <td>PKR&nbsp;7,500/mo</td> */}
                        <td className="h6">All Features Included</td>
                      </tr>
                      <tr>
                        <th scope="row" className="text-center">
                          <input
                            type="radio"
                            value="6"
                            name="plan"
                            required
                            onChange={handleChange}
                          />
                        </th>
                        <td className="h6">Plan 3</td>
                        <td className="h6">6 Users</td>
                        <td className="h6">PKR&nbsp;7,500/month</td>
                        <td className="h6">All Features Included</td>
                        {/* <td>All Features Included</td> */}
                      </tr>
                      <tr>
                        <th scope="row" className="text-center">
                          <input
                            type="radio"
                            value="8"
                            name="plan"
                            required
                            onChange={handleChange}
                          />
                        </th>
                        <td className="h6">Plan 4</td>
                        <td className="h6">8 Users</td>
                        <td className="h6">PKR&nbsp;10,000/month</td>
                        <td className="h6">All Features Included</td>
                        {/* <td>All Features Included</td> */}
                        {/* <td>All Features Included</td> */}
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* <div>
                    <input type="radio" value="2" name="gender" style={{ marginBottom: "20px" }} /> Plan 1 [ 2 User ] <br />
                    <input type="radio" value="4" name="gender" style={{ marginBottom: "20px" }} /> Plan 2 [ 4 User ]<br />
                    <input type="radio" value="6" name="gender" style={{ marginBottom: "20px" }} /> Plan 3 [ 6 User ]<br />
                    <input type="radio" value="8" name="gender" style={{ marginBottom: "20px" }} /> Plan 4 [ 8 User ]<br />
                  </div> */}
                <button
                  type="button"
                  className="btn btn-success mr-3"
                  onClick={() => changeState_final()}
                  style={getplan ? styles.btnRadius : { display: "none" }}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setgetplan_2(!getplan_2)}
                  style={getplan_2 ? { display: "none" } : styles.btnRadius}
                >
                  Next
                </button>
              </div>
            )
          ) : (
            <div>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span
                    className="input-group-text bg-white border-right-0"
                    id="basic-addon1"
                  >
                    <i className="fas fa-building"></i>
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  aria-label="Username"
                  name="username"
                  onChange={handleChange}
                  required
                  style={styles.uiInputGroupRight}
                  aria-describedby="basic-addon1"
                />
              </div>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span
                    className="input-group-text bg-white border-right-0"
                    id="basic-addon1"
                  >
                    <i className="fas fa-envelope"></i>
                  </span>
                </div>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email Address"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  name="email"
                  onChange={handleChange}
                  style={styles.uiInputGroupRight}
                  required
                />
              </div>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span
                    className="input-group-text bg-white border-right-0"
                    id="basic-addon1"
                  >
                    <i className="fas fa-lock"></i>
                  </span>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Password"
                  aria-label="Password"
                  aria-describedby="basic-addon1"
                  name="password"
                  onChange={handleChange}
                  style={styles.uiInputMiddle}
                  required
                />
                <div class="input-group-append">
                  <span
                    class="input-group-text"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <i className="fas fa-eye-slash"></i>
                    ) : (
                      <i className="fas fa-eye"></i>
                    )}
                  </span>
                </div>
              </div>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span
                    className="input-group-text bg-white border-right-0"
                    id="basic-addon1"
                  >
                    <i className="fas fa-globe"></i>
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  value="Pakistan"
                  aria-label="Region"
                  name="region"
                  onChange={handleChange}
                  style={styles.uiInputGroupRight}
                  aria-describedby="basic-addon1"
                  readOnly
                />
              </div>
              {/* <div className="form-group form-check pl-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="exampleCheck1"
                  />
                  <label className="form-check-label" htmlFor="exampleCheck1">
                    Remember Me
                  </label>
                </div> */}
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setgetplan(!getplan)}
                style={getplan ? { display: "none" } : styles.btnRadius}
              >
                Next
              </button>
            </div>
          )}

          {error && (
            <div>
              <p className="text-danger fw-bold">{error}</p>
            </div>
          )}

          {/* <button
            type="submit"
            className="btn btn-primary"
            style={getplan_2 ? styles.btnRadius : { display: "none" }}
          >



            {loader ? (
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              "Sign Up"
            )}
          </button> */}
        </form>
        <p className="my-3">
          Already have a Quick Management Account?
          <Link to="/login" className="text-primary text-decoration-none">
            {" "}
            Login
          </Link>
        </p>
        <div className="border-top mt-3 pt-3">
          {/* <div id="signin-btn"></div> */}
        </div>
      </div>
    </div>
  );
}

export default Register;