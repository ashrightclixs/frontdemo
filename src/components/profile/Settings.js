import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/styles";

const Settings = ({ user, ToggleAlert, Img_Found }) => {
  const [Edit, setEdit] = useState(false);
  const [EditCompany, setEditCompany] = useState(false);
  const [imageUpdated, setImageUpdated] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [data, setData] = useState([]);
  const [Profile_Found, setProfile_Found] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loader_val, setloader_val] = useState(true);
  const [showformdata, setshowformdata] = useState({
    username: user.username,
    password: user.password,
    email: user.email,
    image: user.image,
    details: user.details,
    bank: user.bank,
    account_number: user.account_number,
    account_title: user.account_title,
  }); //form data passed

  useEffect(function () {
    setloader_val(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/user/get_company?id=${user._id}`)
      .then((res) => {
        setData(res.data.data);
        setloader_val(false);
      })
      .catch((e) => console.log(e));
  }, []);
const profile = JSON.parse(localStorage.getItem("profile"));

if (profile) {
  axios
    .get(`${process.env.REACT_APP_IMAGE_URL}${profile}`)
    .then((res) => {
      setProfile_Found(true);
    })
    .catch((e) => console.log(`eeee ${e}`));
}
  const [companydata, setcompanydata] = useState({
    name: "",
    owner: "",
    contact: "",
    email: "",
    profile: "",
    niche: "",
    address: "",
  });

  const HandleEdit = () => {
    setEdit(!Edit);
  };

  const HandleChange = (e) => {
    setshowformdata({ ...showformdata, [e.target.name]: e.target.value });
  };

  const HandleUpload = () => {
    const upload_input = document.getElementById("avatar_image");
    upload_input.click();
  };

  const HandleDeleteAvatar = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/user/delete_prof_img?id=${user._id}`;
      const response = await axios.post(url);
      console.log(response);
      ToggleAlert(
        "Success",
        `Your Profile Has Been removed. Click Save Changes Button`
      );
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

  const HandleFileUpload = (e) => {
    /*Maximum allowed size in bytes
        5MB Example
        Change first operand(multiplier) for your needs*/
    const maxAllowedSize = 5 * 1024 * 1024;
    if (e.target.files[0].size > maxAllowedSize) {
      // Here you can ask your users to load correct file
      ToggleAlert("Success", `File is too big!`);
      e.target.value = "";
    } else {
      setshowformdata({ ...showformdata, image: e.target.files[0] });
      ToggleAlert(
        "Success",
        `Your File : ${e.target.files[0].name} has been added. Click Save Changes Button`
      );
      setImageUpdated(true);
    }
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    const formdata = new FormData();
    imageUpdated
      ? formdata.append("image", showformdata.image, showformdata.image.name)
      : formdata.append("image", showformdata.image);
    formdata.append("username", showformdata.username);
    formdata.append("password", showformdata.password);
    formdata.append("email", showformdata.email);
    formdata.append("bank", showformdata.bank);
    formdata.append("account_number", showformdata.account_number);
    formdata.append("account_title", showformdata.account_title);
    // console.log("DATA", formdata);

    try {
      const url = `${process.env.REACT_APP_API_URL}/user/update?id=${user._id}`;
      const response = await axios.post(url, formdata);
      setLoader(false);
      localStorage.setItem("user", JSON.stringify(response.data.data));
      setEdit(false);
      setTimeout(() => {
        window.location.reload();
      }, 5500);
      ToggleAlert("Success", "Your Changes Will Update in 5 seconds");
    } catch (error) {
      setLoader(false);
      console.log(error);
      ToggleAlert("Error", `${error.response.data.message}`);
    }
  };

  const HandleCustomUpload = () => {
    const upload_input = document.getElementById("company_profile");
    upload_input.click();
  };

  const HandleCompanyChange = (e) => {
    setcompanydata({
      ...companydata,
      [e.target.name]: e.target.value,
      user: user._id,
    });
  };

  const HandleCompanyFileUpload = (e) => {
    /*Maximum allowed size in bytes
      5MB Example
      Change first operand(multiplier) for your needs*/
    const maxAllowedSize = 5 * 1024 * 1024;
    if (e.target.files[0].size > maxAllowedSize) {
      // Here you can ask your users to load correct file
      ToggleAlert("Success", `File is too big!`);
      e.target.value = "";
    } else {
      setcompanydata({ ...companydata, profile: e.target.files[0] });
      window.scrollTo(0, 0); // scroll the window to the top
      ToggleAlert(
        "Success",
        `Your File : ${e.target.files[0].name} has been added. Click Save Changes Button`
      );
      setProfileUpdated(true);
    }
  };

  const CompanyFormSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    const formdata = new FormData();
    profileUpdated
      ? formdata.append(
          "profile",
          companydata.profile,
          companydata.profile.name
        )
      : formdata.append("profile", companydata.profile);
    formdata.append(
      "name",
      companydata.name === "" ? data[0].name : companydata.name
    );
    formdata.append(
      "owner",
      companydata.owner === "" ? data[0].owner : companydata.owner
    );
    formdata.append(
      "contact",
      companydata.contact === "" ? data[0].contact : companydata.contact
    );
    formdata.append(
      "email",
      companydata.email === "" ? data[0].email : companydata.email
    );
    formdata.append(
      "niche",
      companydata.niche === "" ? data[0].niche : companydata.niche
    );
    formdata.append(
      "address",
      companydata.address === "" ? data[0].address : companydata.address
    );

    try {
      const url =
        data.length === 0
          ? `${process.env.REACT_APP_API_URL}/user/post_company?id=${user._id}`
          : `${process.env.REACT_APP_API_URL}/user/update_company?id=${user._id}&company_id=${data[0]._id}`;

      const response = await axios.post(url, formdata).then((res) => {
        localStorage.setItem("profile", JSON.stringify(res.data.comp_profile));
      });
      setLoader(false);
      setEditCompany(false);
      window.scrollTo(0, 0); // scroll the window to the top
      setTimeout(() => {
        window.location.reload();
      }, 5500);
      ToggleAlert("Success", "Your Changes Will Update in 5 seconds");
    } catch (error) {
      setLoader(false);
      console.log(error);
      ToggleAlert("Error", `${error.response.data.message}`);
    }
  };

  const HandleCompanyDelete = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/user/delete_img?id=${user._id}`;
      const response = await axios.post(url);

      ToggleAlert(
        "Success",
        `Your Profile Has Been removed. Click Save Changes Button`
      );
      window.scrollTo(0, 0); // scroll the window to the top
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
          <div className="main-card p-4">
            <ul
              className="nav nav-pills mb-3 flex-sm-row flex-column align-items-center"
              id="pills-tab"
              role="tablist"
            >
              <li className="nav-item mr-sm-2">
                <Link
                  to="/profile"
                  className="nav-link text-success active border rounded-pill"
                >
                  My Profile
                </Link>
              </li>
              <li className="nav-item mx-sm-2 my-sm-0 my-2">
                <Link
                  to="/billing"
                  className="nav-link text-success border rounded-pill"
                >
                  Billing / Subscription Plans
                </Link>
              </li>
            </ul>

            <div className="p-4">
              <div className="d-flex justify-content-between align-items-center border-bottom">
                <div>
                  <p className="h4">{Edit ? "Edit Profile" : "Overview"}</p>
                  <p className="text-muted">
                    {Edit
                      ? "Edit your profile information"
                      : "Complete profile overview"}
                  </p>
                </div>
                {!Edit && (
                  <button
                    className="btn btn-primary p-3"
                    onClick={HandleEdit}
                    style={styles.btnRadius}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
              {Edit ? (
                <form onSubmit={HandleSubmit} encType="multipart/form-data">
                  <div className="row py-lg-5 py-1">
                    <div className="py-4 pr-lg-5 border-right border-lg-right text-center col-12 col-lg-3">
                      <div style={styles.EditAvatar}>
                        <input
                          type="file"
                          hidden
                          id="avatar_image"
                          accept="image/jpg, image/jpeg, image/png"
                          onChange={HandleFileUpload}
                        />
                        {user.image === "false" || !Img_Found ? (
                          <Avatar
                            color="#13CC26"
                            name={user.username}
                            size="150"
                            round
                            textSizeRatio={3}
                            maxInitials={2}
                          />
                        ) : (
                          <Avatar
                            src={process.env.REACT_APP_IMAGE_URL + user.image}
                            size="150"
                            round
                          />
                        )}
                        <div className="dropdown">
                          <button
                            type="button"
                            id="dropdownMenuLink"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                            style={styles.uploadBtn}
                          >
                            <i className="fas fa-camera px-1"></i>
                            {/* 🙂 */}
                          </button>
                          <div
                            className="dropdown-menu dropdown-menu-center"
                            aria-labelledby="dropdownMenuLink"
                            style={styles.edit_prof_dropdown}
                          >
                            <Link
                              type="button"
                              className="dropdown-item py-2 mb-0"
                              id="avatar_upload_btn"
                              onClick={HandleUpload}
                            >
                              Upload a photo...
                            </Link>
                            <Link
                              type="button"
                              className="dropdown-item py-2 mb-0"
                              onClick={HandleDeleteAvatar}
                            >
                              Remove photo
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="py-3">
                        <p style={styles.mediumtext}>{user.username}</p>
                      </div>
                    </div>
                    <div className="pl-lg-5 col-12 col-lg-9">
                      <div className="form-row">
                        <div className="form-group col-md-3">
                          <label htmlFor="" className="h6">
                            Name
                          </label>
                          <input
                            type="text"
                            name="username"
                            className="form-control"
                            placeholder={user.username}
                            onChange={HandleChange}
                            style={styles.uiInput}
                          />
                        </div>

                        {/* <div className="form-group col-md-6">
                      <label htmlFor="" className="h6">
                        Region
                      </label>
                      <input
                        type="text"
                        className="form-control "
                        placeholder={user.region}
                        readOnly
                        style={styles.uiInput}
                      />
                    </div> */}

                        <div className="form-group col-md-5">
                          <label htmlFor="" className="h6">
                            Email
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder={user.email}
                            name="email"
                            onChange={HandleChange}
                            style={styles.uiInput}
                          />
                        </div>

                        <div className="form-group col-md-4">
                          <label htmlFor="" className="h6">
                            Password
                          </label>
                          <input
                            type={"password"}
                            className="form-control"
                            placeholder="Enter Password"
                            name="password"
                            onChange={HandleChange}
                            style={styles.uiInput}
                          />
                        </div>

                        <div className="form-group col-md-3 my-md-5">
                          <label htmlFor="" className="h6">
                            Bank Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={user.bank}
                            name="bank"
                            onChange={HandleChange}
                            style={styles.uiInput}
                          />
                        </div>

                        <div className="form-group col-md-4 my-md-5">
                          <label htmlFor="" className="h6">
                            Account Title
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={user.account_title}
                            name="account_title"
                            onChange={HandleChange}
                            style={styles.uiInput}
                          />
                        </div>
                        <div className="form-group col-md-5 my-md-5">
                          <label htmlFor="" className="h6">
                            Account Number
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={user.account_number}
                            name="account_number"
                            onChange={HandleChange}
                            style={styles.uiInput}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="py-3 text-right">
                    <button
                      type="submit"
                      className="btn btn-success px-4"
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
                        "Save Changes"
                      )}
                    </button>
                    <button
                      className="btn btn-primary px-5 ml-2"
                      onClick={HandleEdit}
                      style={styles.btnRadius}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div style={styles.grid} className="row">
                  <div className="py-4 pr-5 border-right text-center col-12 col-lg-3">
                    {user.image === "false" || !Img_Found ? (
                      <Avatar
                        color="#13CC26"
                        name={user.username}
                        size="150"
                        round
                        textSizeRatio={3}
                        maxInitials={2}
                      />
                    ) : (
                      <Avatar
                        src={process.env.REACT_APP_IMAGE_URL + user.image}
                        size="150"
                        round
                      />
                    )}
                    <div className="py-3">
                      <p style={styles.mediumtext}>{user.username}</p>
                    </div>
                  </div>
                  <div className="pl-lg-5 col-12 col-lg-9">
                    <div className="form-row">
                      <div className="form-group col-md-3">
                        <label htmlFor="" className="h6">
                          Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          style={styles.uiInput}
                          placeholder={user.username}
                          value=""
                          readOnly
                        />
                      </div>

                      {/* <div className="form-group col-md-6">
                    <label htmlFor="" className="h6">
                      Region
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      style={styles.uiInput}
                      placeholder={user.region}
                      value=""
                      readOnly
                    />
                  </div> */}

                      <div className="form-group col-md-5">
                        <label htmlFor="" className="h6">
                          Email
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          style={styles.uiInput}
                          placeholder={user.email}
                          value=""
                          readOnly
                        />
                      </div>

                      <div className="form-group col-md-4">
                        <label htmlFor="" className="h6">
                          Password
                        </label>
                        <input
                          type={"password"}
                          className="form-control"
                          value={12345678}
                          style={styles.uiInput}
                          readOnly
                        />
                      </div>
                      <div className="form-group col-md-3 my-md-5">
                        <label htmlFor="" className="h6">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={user.bank}
                          name="bank"
                          style={styles.uiInput}
                          readOnly
                        />
                      </div>
                      <div className="form-group col-md-4 my-md-5">
                        <label htmlFor="" className="h6">
                          Account Title
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={user.account_title}
                          name="account_title"
                          style={styles.uiInput}
                          readOnly
                        />
                      </div>
                      <div className="form-group col-md-5 my-md-5">
                        <label htmlFor="" className="h6">
                          Account Number
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={user.account_number}
                          name="account_number"
                          style={styles.uiInput}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center border-bottom my-5">
                <div>
                  <p className="h4">
                    {EditCompany
                      ? "Edit Company/Organisation"
                      : "Company Profile"}
                  </p>
                  <p className="text-muted">
                    {EditCompany
                      ? "Edit your company profile information"
                      : "Complete company profile overview"}
                  </p>
                </div>
                {!EditCompany && (
                  <button
                    className="btn btn-primary p-3"
                    onClick={() => setEditCompany(!EditCompany)}
                    style={styles.btnRadius}
                  >
                    Add/Edit Company Profile
                  </button>
                )}
              </div>

              {EditCompany ? (
                <form
                  onSubmit={CompanyFormSubmit}
                  encType="multipart/form-data"
                >
                  <div className="row py-lg-5 py-1">
                    <div className="py-4 pr-lg-5 border-right border-lg-right text-center col-12 col-lg-3">
                      <div style={styles.EditAvatar}>
                        <input
                          type="file"
                          hidden
                          id="company_profile"
                          accept="image/jpg, image/jpeg, image/png"
                          onChange={HandleCompanyFileUpload}
                        />
                        {data.length !== 0 ? (
                          data[0].profile === "-" || !Profile_Found ? (
                            <Avatar
                              color="#13CC26"
                              name={
                                data.length !== 0
                                  ? data[0].name
                                  : "Quick Accounts"
                              }
                              size="150"
                              round
                              textSizeRatio={3}
                              maxInitials={2}
                            />
                          ) : (
                            <Avatar
                              src={
                                process.env.REACT_APP_IMAGE_URL +
                                data[0].profile
                              }
                              size="150"
                              round
                            />
                          )
                        ) : (
                          <Avatar
                            color="#13CC26"
                            name={
                              data.length !== 0
                                ? data[0].name
                                : "Quick Accounts"
                            }
                            size="150"
                            round
                            textSizeRatio={3}
                            maxInitials={2}
                          />
                        )}
                        <div className="dropdown">
                          <button
                            type="button"
                            id="dropdownMenuLink"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                            style={styles.uploadBtn}
                          >
                            <i className="fas fa-camera px-1"></i>
                            {/* 🙂 */}
                          </button>
                          <div
                            className="dropdown-menu dropdown-menu-center"
                            aria-labelledby="dropdownMenuLink"
                            style={styles.edit_prof_dropdown}
                          >
                            <Link
                              type="button"
                              className="dropdown-item py-2 mb-0"
                              id="avatar_upload_btn"
                              onClick={HandleCustomUpload}
                            >
                              Upload a photo...
                            </Link>
                            <Link
                              type="button"
                              className="dropdown-item py-2 mb-0"
                              onClick={HandleCompanyDelete}
                            >
                              Remove photo
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="py-3">
                        <p style={styles.mediumtext}>
                          {data.length !== 0
                            ? data[0].name
                            : "Add Company Name"}
                        </p>
                      </div>
                    </div>
                    <div className="pl-lg-5 col-12 col-lg-9">
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label htmlFor="" className="h6">
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder={
                              data.length !== 0
                                ? data[0].name
                                : "Enter company's name"
                            }
                            onChange={HandleCompanyChange}
                            style={styles.uiInput}
                          />
                        </div>

                        <div className="form-group col-md-6">
                          <label htmlFor="" className="h6">
                            Owner
                          </label>
                          <input
                            type="text"
                            className="form-control "
                            placeholder={
                              data.length !== 0
                                ? data[0].owner
                                : "Enter company owner's name"
                            }
                            onChange={HandleCompanyChange}
                            name="owner"
                            style={styles.uiInput}
                          />
                        </div>

                        <div className="form-group col-md-6 my-md-5">
                          <label htmlFor="" className="h6">
                            Email
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder={
                              data.length !== 0
                                ? data[0].email
                                : "Enter company's registered email"
                            }
                            name="email"
                            onChange={HandleCompanyChange}
                            style={styles.uiInput}
                          />
                        </div>

                        <div className="form-group col-md-6 my-md-5">
                          <label htmlFor="" className="h6">
                            Contact
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder={
                              data.length !== 0
                                ? data[0].contact
                                : "Enter company's registered contact"
                            }
                            name="contact"
                            onChange={HandleCompanyChange}
                            style={styles.uiInput}
                          />
                        </div>

                        <div
                          className="form-group col-md-6 mb-md-5"
                          style={{ marginTop: "1rem" }}
                        >
                          <label htmlFor="" className="h6">
                            Niche
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={
                              data.length !== 0
                                ? data[0].niche
                                : "Enter company's niche"
                            }
                            name="niche"
                            onChange={HandleCompanyChange}
                            style={styles.uiInput}
                          />
                        </div>
                        <div
                          className="form-group col-md-6 mb-md-5"
                          style={{ marginTop: "1rem" }}
                        >
                          <label htmlFor="" className="h6">
                            Address
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={
                              data.length !== 0
                                ? data[0].address
                                : "Enter company's address"
                            }
                            name="address"
                            onChange={HandleCompanyChange}
                            style={styles.uiInput}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="py-3 text-right">
                    <button
                      type="submit"
                      className="btn btn-success px-4"
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
                        "Save Changes"
                      )}
                    </button>
                    <button
                      className="btn btn-primary px-5 ml-2"
                      onClick={() => setEditCompany(!EditCompany)}
                      style={styles.btnRadius}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div style={styles.grid} className="row">
                  <div className="py-4 pr-5 border-right text-center col-12 col-lg-3">
                    {data.length !== 0 ? (
                      data[0].profile === "-" || !Profile_Found ? (
                        <Avatar
                          color="#13CC26"
                          name={
                            data.length !== 0 ? data[0].name : "Quick Accounts"
                          }
                          size="150"
                          round
                          textSizeRatio={3}
                          maxInitials={2}
                        />
                      ) : (
                        <Avatar
                          src={
                            process.env.REACT_APP_IMAGE_URL + data[0].profile
                          }
                          size="150"
                          round
                        />
                      )
                    ) : (
                      <Avatar
                        color="#13CC26"
                        name={"Quick Accounts"}
                        size="150"
                        round
                        textSizeRatio={3}
                        maxInitials={2}
                      />
                    )}
                    <div className="py-3">
                      <p style={styles.mediumtext}>
                        {data.length !== 0
                          ? data[0].name
                          : "Add Company's Name"}
                      </p>
                    </div>
                  </div>
                  <div className="pl-lg-5 col-12 col-lg-9">
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="" className="h6">
                          Company Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          style={styles.uiInput}
                          placeholder={
                            data.length !== 0
                              ? data[0].name
                              : "Enter company's name"
                          }
                          value=""
                          readOnly
                        />
                      </div>

                      <div className="form-group col-md-6">
                        <label htmlFor="" className="h6">
                          Owner
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          style={styles.uiInput}
                          placeholder={
                            data.length !== 0
                              ? data[0].owner
                              : "Enter company owner's name"
                          }
                          value=""
                          readOnly
                        />
                      </div>

                      <div className="form-group col-md-6 my-md-5">
                        <label htmlFor="" className="h6">
                          Email
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          style={styles.uiInput}
                          placeholder={
                            data.length !== 0
                              ? data[0].email
                              : "Enter company's registered email"
                          }
                          value=""
                          readOnly
                        />
                      </div>

                      <div className="form-group col-md-6 my-md-5">
                        <label htmlFor="" className="h6">
                          Contact
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            data.length !== 0
                              ? data[0].contact
                              : "Enter company's registered contact"
                          }
                          style={styles.uiInput}
                          readOnly
                        />
                      </div>
                      <div
                        className="form-group col-md-6 mb-md-5"
                        style={{ marginTop: "1rem" }}
                      >
                        <label htmlFor="" className="h6">
                          Niche
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            data.length !== 0
                              ? data[0].niche
                              : "Enter company's niche"
                          }
                          style={styles.uiInput}
                          readOnly
                        />
                      </div>
                      <div
                        className="form-group col-md-6 mb-md-5"
                        style={{ marginTop: "1rem" }}
                      >
                        <label htmlFor="" className="h6">
                          Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            data.length !== 0
                              ? data[0].address
                              : "Enter company's address"
                          }
                          style={styles.uiInput}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Settings;
