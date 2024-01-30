import { useContext, useEffect, useState } from "react";
import { Route, Routes, Link, Navigate } from "react-router-dom";
import Dashboard from "./components/dashboard";
import logo from "./assets/logo.jpg";
import "./styles/nav.css";
import Quotation from "./components/sales/quotation.sales";
import Tax from "./components/sales/tax.sales";
import Add_SalesQuotaion from "./components/sales/add_quotation.sales";
// import Sales_orders from "./components/sales/orders.sales";
// import Add_SalesOrders from "./components/sales/add_orders.sales";
import SalesInvoice from "./components/sales/invoice.sales";
import Add_SalesInvoice from "./components/sales/add_invoice.sales";
// import Add_RecMoneySales from "./components/sales/add_rec_money.sales";
// import RecMoney_Sales from "./components/sales/rec_money.sales";
import Add_SalesDelivery from "./components/sales/add_delivery.sales";
import Sales_Delivery from "./components/sales/delivery.sales";
// import Sales_Refund from "./components/sales/refund.sales";
// import Add_SalesRefund from "./components/sales/add_refund.sales";
// import Purchases_Orders from "./components/purchases/orders.purchases";
// import Add_PurchasesOrders from "./components/purchases/add_orders.purchases";
import Purchases_Invoice from "./components/purchases/invoice.purchases";
import Add_PurchasesInvoice from "./components/purchases/add_invoice.purchases";
// import Purchases_Return from "./components/purchases/return.purchases";
// import Purchases_Products from "./components/purchases/products.purchases";
// import Add_PurchasesProducts from "./components/purchases/add_products.purchase";
// import Add_PurchasesReturn from "./components/purchases/add_return.purchases";
import StockMov from "./components/inventory/stock_mov";
import Add_StockMov from "./components/inventory/add_stock_mov";
import StockReturn from "./components/inventory/stock_return";
import Add_StockReturn from "./components/inventory/add_stock_return";
import ScheduledVal from "./components/inventory/scheduled_val";
import Add_ScheduledVal from "./components/inventory/add_scheduled_val";
import Stock_WareHouse from "./components/inventory/stock_warehouse";
import Add_StockWarehouse from "./components/inventory/add_stock_warehouse";
import Stock_Inventory from "./components/inventory/stock_inventory";
import Add_Stock_Inventory from "./components/inventory/add_stock_inventory";
// import Bal_Sheet from "./components/statements/bal_sheet";
// import Add_BalSheet from "./components/statements/add_bal_sheet";
import Trail_Bal from "./components/statements/trail_bal";
import Add_Trail_Bal from "./components/statements/add_trail_bal";
import Income_Stat from "./components/statements/income_stat";
import Add_Income_Stat from "./components/statements/add_income_stat";
// import Bank_Rec from "./components/statements/bank_rec";
// import Add_Bank_Rec from "./components/statements/add_bank_rec";
import Expense from "./components/accounts/expense.acc";
import Add_Expense from "./components/accounts/add_expense";
import Bank_Account from "./components/accounts/bank_acc.acc";
import Add_BankAcc from "./components/accounts/add_bank_acc";
// import Bank_Deposit from "./components/accounts/bank_deposit.acc";
// import Add_BankDeposit from "./components/accounts/add_bank_deposit";
import Fund_Transfer from "./components/accounts/fund_transfer";
import Add_FundTransfer from "./components/accounts/add_fund_transfer";
// import OtherCollection from "./components/accounts/other_coll";
// import Add_OtherCollection from "./components/accounts/add_other_coll";
// import Add_OtherPayment from "./components/accounts/add_other_payment";
// import OtherPayment from "./components/accounts/other_payment";
import J_Entry from "./components/accounts/j_entry";
import Add_J_Entry from "./components/accounts/add_j_entry";
// import Credit_Note from "./components/accounts/credit_note";
// import Add_Credit_Note from "./components/accounts/add_credit_note";
// import Debit_Note from "./components/accounts/debit_note";
// import Add_Debit_Note from "./components/accounts/add_debit_note";
// import Employees from "./components/accounts/employees";
// import Add_Employees from "./components/accounts/add_employees";
import Customer from "./components/sales/customer.sales";
import Add_SalesCustomer from "./components/sales/add_customer.sales";
import Login from "./components/Auth/login";
import Register from "./components/Auth/register";
import Settings from "./components//profile/Settings";
import { AuthContext } from "./context/authContextAdmin";
import Avatar from "react-avatar";
import Add_Tax from "./components/sales/add_tax";
import Alert from "./components/Alert";
import Payment_Details from "./components/profile/payment_details";
import styles from "./styles/styles";
import axios from "axios";
import DeliveryChallan from "./components/pdfs/delivery_challan";
import InvoiceChallan from "./components/pdfs/invoice_challan";
import PurchaseChallan from "./components/pdfs/purchase_challan";
import WarehousePdf from "./components/pdfs/warehouse";
import CashDeposit from "./components/accounts/CashDeposit";
import Add_CashDeposit from "./components/accounts/add_cashdeposit";


import IncomeStatementPdf from "./components/pdfs/income_statement.pdf";
import TrailBalancePDF from "./components/pdfs/trail_balance.pdf";
import CustomerPDF from "./components/pdfs/customer.pdf";
import Add_StockSupplier from "./components/inventory/add_stocksupplier";
import StockSupplier from "./components/inventory/stocksupplier";

function MainAdmin() {
  const { user } = useContext(AuthContext);
  const [Toast, setToast] = useState(false);
  const [Progress, setProgress] = useState(false);
  const [alert, setAlert] = useState(null);
  const [timer1, settimer1] = useState(null);
  const [timer2, settimer2] = useState(null);
  const [Img_Found, setImg_Found] = useState(false)
  
  const HandleToggleBtn = (type, message) => {
    setAlert({
      message: message,
      type: type,
    });
    setToast(true);
    setProgress(true);
    settimer1(
      setTimeout(() => {
        setToast(false);
      }, 5000)
    ); 

    settimer2(
      setTimeout(() => {
        setProgress(false);
        setAlert(null);
      }, 5300)
    );
  };

 
  user &&
  axios
    .get(
      process.env.REACT_APP_IMAGE_URL +
        user.image
    )
    .then((res) => setImg_Found(true))
    .catch((e) => console.log(e.message));

  const [click, setClick] = useState(false);
  const [isOpen, setisOpen] = useState(false);
  const handleClick = () => {
    click ? setClick(false) : setClick(true);
  };
  const toggleNav = () => {
    isOpen ? setisOpen(false) : setisOpen(true);
  };

  const closeMenu = () => {
    setClick(false);
  };


  const handleLogout = async() => {
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location("/");
  
  };

  
  return user ? (
    <div className="wrapper d-flex align-items-stretch">
      <nav id="sidebar" className={isOpen ? "active" : ""}>
        <div className="p-4 text-center">
          <Link to="/" className="logo text-center">
            <img src={logo} alt="Logo" />
          </Link>
          <ul
            className="list-unstyled components my-5 text-left accordion"
            id="accordionExample"
          >
            <li>
              <Link to="/dashboard">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.5 10.9V4.1C21.5 2.6 20.86 2 19.27 2H15.23C13.64 2 13 2.6 13 4.1V10.9C13 12.4 13.64 13 15.23 13H19.27C20.86 13 21.5 12.4 21.5 10.9Z"
                    fill="#AEAEAE"
                  />
                  <path
                    d="M11 13.1V19.9C11 21.4 10.36 22 8.77 22H4.73C3.14 22 2.5 21.4 2.5 19.9V13.1C2.5 11.6 3.14 11 4.73 11H8.77C10.36 11 11 11.6 11 13.1Z"
                    fill="#AEAEAE"
                  />
                  <path
                    d="M21.5 19.9V17.1C21.5 15.6 20.86 15 19.27 15H15.23C13.64 15 13 15.6 13 17.1V19.9C13 21.4 13.64 22 15.23 22H19.27C20.86 22 21.5 21.4 21.5 19.9Z"
                    fill="#AEAEAE"
                  />
                  <path
                    d="M11 6.9V4.1C11 2.6 10.36 2 8.77 2H4.73C3.14 2 2.5 2.6 2.5 4.1V6.9C2.5 8.4 3.14 9 4.73 9H8.77C10.36 9 11 8.4 11 6.9Z"
                    fill="#AEAEAE"
                  />
                </svg>
                <span className="px-2">Dashboard</span>
              </Link>
            </li>

            <li>
              <a
                data-target="#SalesSubmenu"
                data-toggle="collapse"
                aria-expanded="false"
                className="dropdown-toggle"
                role="button"
                type="button"
                aria-controls="SalesSubmenu"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.5 16V18.5C20.5 20.43 18.93 22 17 22H7C5.07 22 3.5 20.43 3.5 18.5V17.85C3.5 16.28 4.78 15 6.35 15H19.5C20.05 15 20.5 15.45 20.5 16Z"
                    fill="#AEAEAE"
                  />
                  <path
                    d="M15.5 2H8.5C4.5 2 3.5 3 3.5 7V14.58C4.26 13.91 5.26 13.5 6.35 13.5H19.5C20.05 13.5 20.5 13.05 20.5 12.5V7C20.5 3 19.5 2 15.5 2ZM13 10.75H8C7.59 10.75 7.25 10.41 7.25 10C7.25 9.59 7.59 9.25 8 9.25H13C13.41 9.25 13.75 9.59 13.75 10C13.75 10.41 13.41 10.75 13 10.75ZM16 7.25H8C7.59 7.25 7.25 6.91 7.25 6.5C7.25 6.09 7.59 5.75 8 5.75H16C16.41 5.75 16.75 6.09 16.75 6.5C16.75 6.91 16.41 7.25 16 7.25Z"
                    fill="#AEAEAE"
                  />
                </svg>
                <span className="px-2">Sales</span>
              </a>

              <ul
                className="collapse list-unstyled childrens"
                id="SalesSubmenu"
                data-parent="#accordionExample"
              >
                <li>
                  <Link to="/sales/customer">Customer</Link>
                </li>
                <li>
                  <Link to="/sales/tax">Tax</Link>
                </li>
                <li>
                  <Link to="/sales/quotation">Quotation</Link>
                </li>
                {/* <li>
                  <Link to="/sales/orders">Order</Link>
                </li> */}
                <li>
                  <Link to="/sales/invoice">Sales Invoice</Link>
                </li>
                {/* <li>
                  <Link to="/sales/received_money">Received Money</Link>
                </li> */}
                <li>
                  <Link to="/sales/delivery">Delivery</Link>
                </li>
                {/* <li>
                  <Link to="/sales/refund">Refund</Link>
                </li> */}
              </ul>
            </li>

            <li>
              <a
                data-target="#PurchaseSubmenu"
                aria-controls="PurchaseSubmenu"
                data-toggle="collapse"
                aria-expanded="false"
                className="dropdown-toggle"
                role="button"
                type="button"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.81 2H16.19C19.83 2 22 4.17 21.99 7.81V16.19C21.99 19.83 19.82 22 16.18 22H7.81C4.17 22 2 19.83 2 16.18V7.81C2 4.17 4.17 2 7.81 2Z"
                    fill="#AEAEAE"
                  />
                  <path
                    d="M9.67094 7.91779V8.73355H17.4207V10.3484L16.5157 13.2203H9.41428L8.39458 5.87738H6V6.69315H7.68425L8.70395 14.036H17.114L18.2365 10.4739V7.91779H9.67094Z"
                    id="path1"
                  />
                  <path
                    d="M10.1036 14.8596C9.67108 14.8601 9.25638 15.0321 8.95051 15.338C8.64465 15.6438 8.4726 16.0585 8.47211 16.4911C8.47211 16.9238 8.644 17.3388 8.94997 17.6448C9.25594 17.9507 9.67093 18.1226 10.1036 18.1226C10.5363 18.1226 10.9513 17.9507 11.2573 17.6448C11.5633 17.3388 11.7352 16.9238 11.7352 16.4911C11.7347 16.0585 11.5626 15.6438 11.2568 15.338C10.9509 15.0321 10.5362 14.86 10.1036 14.8596ZM10.1036 17.3069C9.94229 17.3069 9.78457 17.259 9.65042 17.1694C9.51627 17.0797 9.41171 16.9523 9.34997 16.8033C9.28822 16.6542 9.27207 16.4902 9.30355 16.3319C9.33502 16.1737 9.41272 16.0283 9.5268 15.9143C9.64089 15.8002 9.78625 15.7225 9.94449 15.691C10.1027 15.6595 10.2668 15.6757 10.4158 15.7374C10.5649 15.7992 10.6923 15.9037 10.7819 16.0379C10.8716 16.172 10.9194 16.3297 10.9194 16.4911C10.9191 16.7074 10.8331 16.9147 10.6802 17.0676C10.5273 17.2206 10.3199 17.3066 10.1036 17.3069Z"
                    id="path2"
                  />
                  <path
                    d="M15.8142 14.8596C15.3817 14.8601 14.967 15.0321 14.6611 15.338C14.3552 15.6438 14.1832 16.0585 14.1827 16.4911C14.1827 16.9238 14.3546 17.3388 14.6605 17.6448C14.9665 17.9507 15.3815 18.1226 15.8142 18.1226C16.2469 18.1226 16.6619 17.9507 16.9679 17.6448C17.2738 17.3388 17.4457 16.9238 17.4457 16.4911C17.4453 16.0585 17.2732 15.6438 16.9673 15.338C16.6615 15.0321 16.2468 14.86 15.8142 14.8596ZM15.8142 17.3069C15.6529 17.3069 15.4951 17.259 15.361 17.1694C15.2268 17.0797 15.1223 16.9523 15.0605 16.8033C14.9988 16.6542 14.9826 16.4902 15.0141 16.3319C15.0456 16.1737 15.1233 16.0283 15.2374 15.9143C15.3515 15.8002 15.4968 15.7225 15.6551 15.691C15.8133 15.6595 15.9773 15.6757 16.1264 15.7374C16.2754 15.7992 16.4029 15.9037 16.4925 16.0379C16.5821 16.172 16.63 16.3297 16.63 16.4911C16.6297 16.7074 16.5437 16.9147 16.3908 17.0676C16.2378 17.2206 16.0305 17.3066 15.8142 17.3069Z"
                    id="path3"
                  />
                </svg>
                <span className="px-2">Purchase</span>
              </a>
              <ul
                className="collapse list-unstyled childrens"
                id="PurchaseSubmenu"
                data-parent="#accordionExample"
              >
                {/* <li>
                  <Link to="/purchases/orders">Order</Link>
                </li> */}
                <li>
                  <Link to="/purchases/invoice">Purchases</Link>
                </li>
                {/* <li>
                  <Link to="/purchases/products">Products</Link>
                </li> */}
                {/* <li>
                  <Link to="/purchases/return">Return</Link>
                </li> */}
              </ul>
            </li>

            <li>
              <a
                data-target="#AccountsSubmenu"
                data-toggle="collapse"
                aria-expanded="false"
                className="dropdown-toggle"
                role="button"
                type="button"
                aria-controls="AccountsSubmenu"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="20" height="20" rx="4" fill="#AEAEAE" />
                  <path d="M0 8H20" stroke="white" strokeWidth="3" />
                  <circle cx="4" cy="3" r="1" fill="white" />
                  <circle cx="7" cy="3" r="1" fill="white" />
                  <circle cx="10" cy="3" r="1" fill="white" />
                </svg>
                <span className="px-2">Accounts</span>
              </a>
              <ul
                className="collapse list-unstyled childrens"
                id="AccountsSubmenu"
                data-parent="#accordionExample"
              >
                <li>
                  <Link to="/accounts/bank_account">Bank Account</Link>
                </li>
                <li>
                  <Link to="/accounts/expense">Expense</Link>
                </li>
                {/* <li>
                  <Link to="/accounts/bank_deposit">Bank Deposit</Link>
                </li> */}
                <li>
                  <Link to="/accounts/funds_transfer">Funds Transfer</Link>
                </li>
                {/* <li>
                  <Link to="/accounts/other_collections">
                    Other Collections
                  </Link>
                </li> */}
                {/* <li>
                  <Link to="/accounts/other_payments">Other Payments</Link>
                </li> */}
                <li>
                  <Link to="/accounts/journal_entry">Journal Entry</Link>
                </li>

                <li>
                  <Link to="/accounts/cashdeposit">CashDeposit</Link>
                </li>

                {/* <li>
                  <Link to="/accounts/credit_note">Credit note</Link>
                </li>
                <li>
                  <Link to="/accounts/debit_note">Debit note</Link>
                </li>
                <li>
                  <Link to="/accounts/employees">Employees</Link>
                </li> */}
              </ul>
            </li>

            <li>
              <a
                data-target="#InventorySubmenu"
                aria-controls="InventorySubmenu"
                data-toggle="collapse"
                aria-expanded="false"
                className="dropdown-toggle"
                role="button"
                type="button"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z"
                    fill="#AEAEAE"
                  />
                  <path
                    d="M19.8 9.42C19.78 9.42 19.76 9.43 19.74 9.43C19.64 9.45 19.54 9.46 19.43 9.48C19.01 9.52 18.56 9.5 18.1 9.41C17.98 9.38 17.88 9.36 17.77 9.32C17.44 9.24 17.13 9.11 16.84 8.94C16.72 8.88 16.6 8.8 16.49 8.73C16.01 8.4 15.6 7.99 15.27 7.51C15.2 7.4 15.12 7.28 15.06 7.16C14.89 6.87 14.76 6.56 14.68 6.23C14.64 6.12 14.62 6.02 14.59 5.9C14.5 5.44 14.48 4.99 14.52 4.57C14.54 4.46 14.55 4.36 14.57 4.26C14.57 4.24 14.58 4.22 14.58 4.2C14.7 3.58 14.24 3 13.6 3H7.52C7.38 3 7.24 3.01 7.11 3.02C6.99 3.03 6.88 3.04 6.76 3.06C6.64 3.07 6.52 3.09 6.41 3.11C4 3.46 2.46 4.99 2.11 7.41C2.09 7.52 2.07 7.64 2.06 7.76C2.04 7.88 2.03 7.99 2.02 8.11C2.01 8.24 2 8.38 2 8.52V16.48C2 16.62 2.01 16.76 2.02 16.89C2.03 17.01 2.04 17.12 2.06 17.24C2.07 17.36 2.09 17.48 2.11 17.59C2.46 20.01 4 21.54 6.41 21.89C6.52 21.91 6.64 21.93 6.76 21.94C6.88 21.96 6.99 21.97 7.11 21.98C7.24 21.99 7.38 22 7.52 22H15.48C15.62 22 15.76 21.99 15.89 21.98C16.01 21.97 16.12 21.96 16.24 21.94C16.36 21.93 16.48 21.91 16.59 21.89C19 21.54 20.54 20.01 20.89 17.59C20.91 17.48 20.93 17.36 20.94 17.24C20.96 17.12 20.97 17.01 20.98 16.89C20.99 16.76 21 16.62 21 16.48V10.4C21 9.76 20.42 9.3 19.8 9.42ZM6.75 12.5H11.75C12.16 12.5 12.5 12.84 12.5 13.25C12.5 13.66 12.16 14 11.75 14H6.75C6.34 14 6 13.66 6 13.25C6 12.84 6.34 12.5 6.75 12.5ZM15.75 18H6.75C6.34 18 6 17.66 6 17.25C6 16.84 6.34 16.5 6.75 16.5H15.75C16.16 16.5 16.5 16.84 16.5 17.25C16.5 17.66 16.16 18 15.75 18Z"
                    fill="#AEAEAE"
                  />
                </svg>
                <span className="px-2">Inventory</span>
              </a>
              <ul
                className="collapse list-unstyled childrens"
                id="InventorySubmenu"
                data-parent="#accordionExample"
              >
                <li>
                  <Link to="/inventory/stock_warehouse">Stock Warehouse</Link>
                </li>
                <li>
                  <Link to="/inventory/stock_supplier">Stock Supplier</Link>
                </li>
                <li>
                  <Link to="/inventory/stock_inventory">Stock Inventory</Link>
                </li>
                <li>
                  <Link to="/inventory/stock_movement">Stock Movement</Link>
                </li>
                <li>
                  <Link to="/inventory/stock_return">Stock Return</Link>
                </li>
                {/* <li>
                  <Link to="/inventory/scheduled_valuation">
                    Scheduled Valuation
                  </Link>
                </li> */}
              </ul>
            </li>

            <li>
              <a
                data-target="#StatmentsSubmenu"
                aria-controls="StatmentsSubmenu"
                data-toggle="collapse"
                aria-expanded="false"
                className="dropdown-toggle"
                role="button"
                type="button"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.8 9.42C19.78 9.42 19.76 9.43 19.74 9.43C19.64 9.45 19.54 9.46 19.43 9.48C19.01 9.52 18.56 9.5 18.1 9.41C17.98 9.38 17.88 9.36 17.77 9.32C17.44 9.24 17.13 9.11 16.84 8.94C16.72 8.88 16.6 8.8 16.49 8.73C16.01 8.4 15.6 7.99 15.27 7.51C15.2 7.4 15.12 7.28 15.06 7.16C14.89 6.87 14.76 6.56 14.68 6.23C14.64 6.12 14.62 6.02 14.59 5.9C14.5 5.44 14.48 4.99 14.52 4.57C14.54 4.46 14.55 4.36 14.57 4.26C14.57 4.24 14.58 4.22 14.58 4.2C14.7 3.58 14.24 3 13.6 3H7.52C7.38 3 7.24 3.01 7.11 3.02C6.99 3.03 6.88 3.04 6.76 3.06C6.64 3.07 6.52 3.09 6.41 3.11C4 3.46 2.46 4.99 2.11 7.41C2.09 7.52 2.07 7.64 2.06 7.76C2.04 7.88 2.03 7.99 2.02 8.11C2.01 8.24 2 8.38 2 8.52V16.48C2 16.62 2.01 16.76 2.02 16.89C2.03 17.01 2.04 17.12 2.06 17.24C2.07 17.36 2.09 17.48 2.11 17.59C2.46 20.01 4 21.54 6.41 21.89C6.52 21.91 6.64 21.93 6.76 21.94C6.88 21.96 6.99 21.97 7.11 21.98C7.24 21.99 7.38 22 7.52 22H15.48C15.62 22 15.76 21.99 15.89 21.98C16.01 21.97 16.12 21.96 16.24 21.94C16.36 21.93 16.48 21.91 16.59 21.89C19 21.54 20.54 20.01 20.89 17.59C20.91 17.48 20.93 17.36 20.94 17.24C20.96 17.12 20.97 17.01 20.98 16.89C20.99 16.76 21 16.62 21 16.48V10.4C21 9.76 20.42 9.3 19.8 9.42ZM6.75 12.5H11.75C12.16 12.5 12.5 12.84 12.5 13.25C12.5 13.66 12.16 14 11.75 14H6.75C6.34 14 6 13.66 6 13.25C6 12.84 6.34 12.5 6.75 12.5ZM15.75 18H6.75C6.34 18 6 17.66 6 17.25C6 16.84 6.34 16.5 6.75 16.5H15.75C16.16 16.5 16.5 16.84 16.5 17.25C16.5 17.66 16.16 18 15.75 18Z"
                    fill="#AEAEAE"
                  />
                  <path
                    d="M19.6397 4.32226H18.2497C18.0367 4.32226 17.8324 4.23765 17.6818 4.08704C17.5312 3.93643 17.4466 3.73216 17.4466 3.51917C17.4466 3.30617 17.5312 3.1019 17.6818 2.95129C17.8324 2.80068 18.0367 2.71607 18.2497 2.71607H20.4737V2.16008H19.2922V1.12531H18.7362V2.16008H18.2497C17.8893 2.16008 17.5436 2.30327 17.2887 2.55814C17.0338 2.81302 16.8906 3.15871 16.8906 3.51917C16.8906 3.87962 17.0338 4.22531 17.2887 4.48019C17.5436 4.73506 17.8893 4.87825 18.2497 4.87825H19.6397C19.8526 4.87849 20.0567 4.96318 20.2073 5.11374C20.3579 5.2643 20.4426 5.46843 20.4428 5.68135V5.74314C20.4426 5.95606 20.3579 6.16019 20.2073 6.31075C20.0567 6.4613 19.8526 6.54599 19.6397 6.54623H17.287V7.10222H18.7362V8.07521H19.2922V7.10222H19.6397C20 7.10182 20.3455 6.9585 20.6003 6.70371C20.8551 6.44892 20.9984 6.10346 20.9988 5.74314V5.68135C20.9984 5.32102 20.8551 4.97557 20.6003 4.72078C20.3455 4.46599 20 4.32267 19.6397 4.32226Z"
                    fill="#AEAEAE"
                  />
                </svg>
                <span className="px-2">Statments</span>
              </a>
              <ul
                className="collapse list-unstyled childrens"
                id="StatmentsSubmenu"
                data-parent="#accordionExample"
              >
                <li>
                  <Link to="/statements/trail_balance">Trail Balance</Link>
                </li>
                <li>
                  <Link to="/statements/income_statement">
                    Income statement
                  </Link>
                </li>
                {/* <li>
                  <Link to="/statements/balance_sheet">Balance sheet</Link>
                </li>
                <li>
                  <Link to="/statements/bank_reconciliation">
                    Bank reconciliation
                  </Link>
                </li> */}
              </ul>
            </li>
            {/* <li>
              <Link to="/settings">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.1 9.22C18.29 9.22 17.55 7.94 18.45 6.37C18.97 5.46 18.66 4.3 17.75 3.78L16.02 2.79C15.23 2.32 14.21 2.6 13.74 3.39L13.63 3.58C12.73 5.15 11.25 5.15 10.34 3.58L10.23 3.39C9.78 2.6 8.76 2.32 7.97 2.79L6.24 3.78C5.33 4.3 5.02 5.47 5.54 6.38C6.45 7.94 5.71 9.22 3.9 9.22C2.86 9.22 2 10.07 2 11.12V12.88C2 13.92 2.85 14.78 3.9 14.78C5.71 14.78 6.45 16.06 5.54 17.63C5.02 18.54 5.33 19.7 6.24 20.22L7.97 21.21C8.76 21.68 9.78 21.4 10.25 20.61L10.36 20.42C11.26 18.85 12.74 18.85 13.65 20.42L13.76 20.61C14.23 21.4 15.25 21.68 16.04 21.21L17.77 20.22C18.68 19.7 18.99 18.53 18.47 17.63C17.56 16.06 18.3 14.78 20.11 14.78C21.15 14.78 22.01 13.93 22.01 12.88V11.12C22 10.08 21.15 9.22 20.1 9.22ZM12 15.25C10.21 15.25 8.75 13.79 8.75 12C8.75 10.21 10.21 8.75 12 8.75C13.79 8.75 15.25 10.21 15.25 12C15.25 13.79 13.79 15.25 12 15.25Z"
                    fill="#AEAEAE"
                  />
                </svg>
                <span className="px-2">Settings</span>
              </Link>
            </li> */}
            {/* <li>
              <Link to="/" onClick={handleLogout}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.8 2H14.2C11 2 9 4 9 7.2V11.25H15.25C15.66 11.25 16 11.59 16 12C16 12.41 15.66 12.75 15.25 12.75H9V16.8C9 20 11 22 14.2 22H16.79C19.99 22 21.99 20 21.99 16.8V7.2C22 4 20 2 16.8 2Z"
                    fill="#AEAEAE"
                  />
                  <path
                    d="M4.56 11.25L6.63 9.18C6.78 9.03 6.85 8.84 6.85 8.65C6.85 8.46 6.78 8.26 6.63 8.12C6.34 7.83 5.86 7.83 5.57 8.12L2.22 11.47C1.93 11.76 1.93 12.24 2.22 12.53L5.57 15.88C5.86 16.17 6.34 16.17 6.63 15.88C6.92 15.59 6.92 15.11 6.63 14.82L4.56 12.75H9V11.25H4.56Z"
                    fill="#AEAEAE"
                  />
                </svg>
                <span className="px-2">Log Out</span>
              </Link>
            </li> */}
          </ul>
        </div>
      </nav>
      {/* ********************************************** SIDENAV END ********************************** */}
      <div id="content">
        <nav className="navbar navbar-expand-lg navbar-light py-4 bg-white">
          <div className="container-fluid flex-nowrap">
            <button
              type="button"
              id="sidebarCollapse"
              className="btn btn-color"
              onClick={toggleNav}
            >
              <i className="fa fa-bars"></i>
            </button>

            <div
              className={
                click ? "dropdown ml-3 show mr-auto" : "dropdown ml-3 mr-auto"
              }
            >
              <button
                className="btn rounded-circle btn-light"
                onClick={handleClick}
                type="button"
              >
                <i
                  className={
                    click
                      ? "fas fa-xmark text-success"
                      : "fas fa-plus text-success"
                  }
                ></i>
              </button>
              <div
                className={
                  click ? "dropdown-menu d-flex show" : "dropdown-menu"
                }
              >
                <div>
                  <Link
                    className="dropdown-item disabled text-uppercase"
                    to="/"
                  >
                    <em>
                      <u>Sales</u>
                    </em>
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/sales/add_quotation"
                    onClick={closeMenu}
                  >
                    + Add Quotation
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/sales/add_customer"
                    onClick={closeMenu}
                  >
                    + Add Customer
                  </Link>
                  {/* <Link
                    className="dropdown-item"
                    to="/sales/add_orders"
                    onClick={closeMenu}
                  >
                    + Add Order
                  </Link> */}
                  <Link
                    className="dropdown-item"
                    to="/sales/add_invoice"
                    onClick={closeMenu}
                  >
                    + Add Sales Invoice
                  </Link>
                  {/* <Link
                    className="dropdown-item"
                    to="/sales/received_money"
                    onClick={closeMenu}
                  >
                    + Add Received Money
                  </Link> */}
                  <Link
                    className="dropdown-item"
                    to="/sales/add_delivery"
                    onClick={closeMenu}
                  >
                    + Add Delivery
                  </Link>
                  {/* <Link
                    className="dropdown-item"
                    to="/sales/add_refund"
                    onClick={closeMenu}
                  >
                    + Add Refund
                  </Link> */}
                  <Link
                    className="dropdown-item"
                    to="/sales/add_tax"
                    onClick={closeMenu}
                  >
                    + Add Tax
                  </Link>

                  {/* <Link
                    className="dropdown-item"
                    to="/purchases/add_products"
                    onClick={closeMenu}
                  >
                    + Add Purchase
                  </Link> */}
                  {/* <Link
                    className="dropdown-item"
                    to="/purchases/add_return"
                    onClick={closeMenu}
                  >
                    + Add Return
                  </Link> */}
                </div>
                <div>
                  <Link
                    className="dropdown-item disabled text-uppercase"
                    to="/"
                  >
                    <em>
                      <u>Purchase</u>
                    </em>
                  </Link>
                  {/* <Link
                    className="dropdown-item"
                    to="/purchases/add_orders"
                    onClick={closeMenu}
                  >
                    + Add Order
                  </Link> */}
                  <Link
                    className="dropdown-item"
                    to="/purchases/add_invoice"
                    onClick={closeMenu}
                  >
                    + Add Purchases
                  </Link>
                </div>

                <div>
                  <Link
                    className="dropdown-item disabled text-uppercase"
                    to="/"
                  >
                    <em>
                      <u>Accounts</u>
                    </em>
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/accounts/add_bank_account"
                    onClick={closeMenu}
                  >
                    + Add Bank Account
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/accounts/add_expense"
                    onClick={closeMenu}
                  >
                    + Add Expense
                  </Link>

                  {/* <Link
                    className="dropdown-item"
                    to="/accounts/add_bank_deposit"
                    onClick={closeMenu}
                  >
                    + Add Bank Deposit
                  </Link> */}
                  <Link
                    className="dropdown-item"
                    to="/accounts/add_funds_transfer"
                    onClick={closeMenu}
                  >
                    + Add Funds Transfer
                  </Link>
                  {/* <Link
                    className="dropdown-item"
                    to="/accounts/add_other_collections"
                    onClick={closeMenu}
                  >
                    + Add Other Collection
                  </Link> */}
                  {/* <Link
                    className="dropdown-item"
                    to="/accounts/add_other_payment"
                    onClick={closeMenu}
                  >
                    + Add Other Payments
                  </Link> */}
                  <Link
                    className="dropdown-item"
                    to="/accounts/add_journal_entry"
                    onClick={closeMenu}
                  >
                    + Add Journal Entry
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/accounts/add_cashdeposit"
                    onClick={closeMenu}
                  >
                    + Add Cash Deposit
                  </Link>
                  {/* <Link
                    className="dropdown-item"
                    to="/accounts/add_credit_note"
                    onClick={closeMenu}
                  >
                    + Add Credit Note
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/accounts/add_debit_note"
                    onClick={closeMenu}
                  >
                    + Add Debit Note
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/accounts/add_employees"
                    onClick={closeMenu}
                  >
                    + Add Employees
                  </Link> */}
                </div>
                <div>
                  <Link
                    className="dropdown-item disabled text-uppercase"
                    to="/"
                  >
                    <em>
                      <u>Inventory</u>
                    </em>
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/inventory/add_stock_movement"
                    onClick={closeMenu}
                  >
                    + Add Stock Movement
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/inventory/add_stock_return"
                    onClick={closeMenu}
                  >
                    + Add Stock Return
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/inventory/add_stock_supplier"
                    onClick={closeMenu}
                  >
                    + Add Stock Supplier
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/inventory/add_stock_inventory"
                    onClick={closeMenu}
                  >
                    + Add Stock Inventory
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/inventory/add_stock_warehouse"
                    onClick={closeMenu}
                  >
                    + Add Stock Warehouse
                  </Link>
                  {/* <Link
                    className="dropdown-item disabled text-uppercase"
                    to="/"
                  >
                    <em>
                      <u>Statement</u>
                    </em>
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/statements/add_trail_balance"
                    onClick={closeMenu}
                  >
                    + Add Trial Balance
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/statements/add_income_statement"
                    onClick={closeMenu}
                  >
                    + Add Income statement
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/statements/add_balance_sheet"
                    onClick={closeMenu}
                  >
                    + Add Balance Sheet
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/statements/add_bank_reconciliation"
                    onClick={closeMenu}
                  >
                    + Add Bank Reconciliation
                  </Link> */}
                </div>
              </div>
            </div>
            {/* <form className="search-container mx-3 px-2">
              <input
                type="text"
                id="search-bar"
                className="py-2"
                placeholder="What can I help you with today?"
              />
              <a to="/">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.625 16.3125C4.3875 16.3125 0.9375 12.8625 0.9375 8.625C0.9375 4.3875 4.3875 0.9375 8.625 0.9375C12.8625 0.9375 16.3125 4.3875 16.3125 8.625C16.3125 12.8625 12.8625 16.3125 8.625 16.3125ZM8.625 2.0625C5.0025 2.0625 2.0625 5.01 2.0625 8.625C2.0625 12.24 5.0025 15.1875 8.625 15.1875C12.2475 15.1875 15.1875 12.24 15.1875 8.625C15.1875 5.01 12.2475 2.0625 8.625 2.0625Z"
                    fill="#B0B0B0"
                  />
                  <path
                    d="M16.5 17.0625C16.3575 17.0625 16.215 17.01 16.1025 16.8975L14.6025 15.3975C14.385 15.18 14.385 14.82 14.6025 14.6025C14.82 14.385 15.18 14.385 15.3975 14.6025L16.8975 16.1025C17.115 16.32 17.115 16.68 16.8975 16.8975C16.785 17.01 16.6425 17.0625 16.5 17.0625Z"
                    fill="#B0B0B0"
                  />
                </svg>
              </a>
            </form> */}
            {/* <button className="btn btn-dark d-inline-block d-lg-none ml-auto" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                          <i className="fas fa-align-justify"></i>
                      </button> */}

            <div
              className="collapse navbar-collapse justify-content-end mobile-display"
              id="navbarSupportedContent"
            >
              <ul className="nav navbar-nav ml-auto align-items-center">
                {/* <li className="nav-item">
                  <a className="nav-link" to="/" type="button">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 22.75H3C2.04 22.75 1.25 21.96 1.25 21V8C1.25 3.58 3.58 1.25 8 1.25H16C20.42 1.25 22.75 3.58 22.75 8V16C22.75 20.42 20.42 22.75 16 22.75ZM8 2.75C4.42 2.75 2.75 4.42 2.75 8V21C2.75 21.14 2.86 21.25 3 21.25H16C19.58 21.25 21.25 19.58 21.25 16V8C21.25 4.42 19.58 2.75 16 2.75H8Z"
                        fill="#B0B0B0"
                      />
                      <path
                        d="M17 10.25H7C6.59 10.25 6.25 9.91 6.25 9.5C6.25 9.09 6.59 8.75 7 8.75H17C17.41 8.75 17.75 9.09 17.75 9.5C17.75 9.91 17.41 10.25 17 10.25Z"
                        fill="#B0B0B0"
                      />
                      <path
                        d="M14 15.25H7C6.59 15.25 6.25 14.91 6.25 14.5C6.25 14.09 6.59 13.75 7 13.75H14C14.41 13.75 14.75 14.09 14.75 14.5C14.75 14.91 14.41 15.25 14 15.25Z"
                        fill="#B0B0B0"
                      />
                    </svg>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" to="/" type="button">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.02 20.53C9.68999 20.53 7.35999 20.16 5.14999 19.42C4.30999 19.13 3.66999 18.54 3.38999 17.77C3.09999 17 3.19999 16.15 3.65999 15.39L4.80999 13.48C5.04999 13.08 5.26999 12.28 5.26999 11.81V8.92C5.26999 5.2 8.29999 2.17 12.02 2.17C15.74 2.17 18.77 5.2 18.77 8.92V11.81C18.77 12.27 18.99 13.08 19.23 13.49L20.37 15.39C20.8 16.11 20.88 16.98 20.59 17.77C20.3 18.56 19.67 19.16 18.88 19.42C16.68 20.16 14.35 20.53 12.02 20.53ZM12.02 3.67C9.12999 3.67 6.76999 6.02 6.76999 8.92V11.81C6.76999 12.54 6.46999 13.62 6.09999 14.25L4.94999 16.16C4.72999 16.53 4.66999 16.92 4.79999 17.25C4.91999 17.59 5.21999 17.85 5.62999 17.99C9.80999 19.39 14.24 19.39 18.42 17.99C18.78 17.87 19.06 17.6 19.19 17.24C19.32 16.88 19.29 16.49 19.09 16.16L17.94 14.25C17.56 13.6 17.27 12.53 17.27 11.8V8.92C17.27 6.02 14.92 3.67 12.02 3.67Z"
                        fill="#B0B0B0"
                      />
                      <path
                        d="M13.88 3.93999C13.81 3.93999 13.74 3.92999 13.67 3.90999C13.38 3.82999 13.1 3.76999 12.83 3.72999C11.98 3.61999 11.16 3.67999 10.39 3.90999C10.11 3.99999 9.80999 3.90999 9.61999 3.69999C9.42999 3.48999 9.36999 3.18999 9.47999 2.91999C9.88999 1.86999 10.89 1.17999 12.03 1.17999C13.17 1.17999 14.17 1.85999 14.58 2.91999C14.68 3.18999 14.63 3.48999 14.44 3.69999C14.29 3.85999 14.08 3.93999 13.88 3.93999Z"
                        fill="#B0B0B0"
                      />
                      <path
                        d="M12.02 22.81C11.03 22.81 10.07 22.41 9.36999 21.71C8.66999 21.01 8.26999 20.05 8.26999 19.06H9.76999C9.76999 19.65 10.01 20.23 10.43 20.65C10.85 21.07 11.43 21.31 12.02 21.31C13.26 21.31 14.27 20.3 14.27 19.06H15.77C15.77 21.13 14.09 22.81 12.02 22.81Z"
                        fill="#B0B0B0"
                      />
                    </svg>
                  </a>
                </li> */}
                <li className="nav-item dropdown ">
                  <a
                    className="nav-link"
                    to="#"
                    id="dropdownMenuLink"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    type="button"
                  >
                    {/* <i className="fas fa-user px-1"></i> */}
                    {user.image === "false" || !Img_Found ? (
                      <>
                        <Avatar
                          color="#13CC26"
                          name={user.username}
                          size="35"
                          round
                          textSizeRatio={3}
                          maxInitials={2}
                        />{" "}
                        <span
                          style={styles.nav_user}
                          className="hide-me-on-mobile"
                        >
                          {user.username}
                        </span>
                      </>
                    ) : (
                      <>
                        <Avatar
                          src={process.env.REACT_APP_IMAGE_URL + user.image}
                          size="35"
                          round
                        />
                        <span
                          style={styles.nav_user}
                          className="hide-me-on-mobile"
                        >
                          {user.username}
                        </span>
                      </>
                    )}
                  </a>
                  <div
                    className="dropdown-menu dropdown-menu-right non-static-on-mobile"
                    aria-labelledby="dropdownMenuLink"
                    style={styles.nav_dropdown}
                  >
                    <div className="d-flex align-items-center p-4 border-bottom border-success">
                      <div>
                        {user.image === "false" || !Img_Found ? (
                          <Avatar
                            color="#13CC26"
                            name={user.username}
                            size="50"
                            round
                            textSizeRatio={3}
                            maxInitials={2}
                          />
                        ) : (
                          <Avatar
                            src={process.env.REACT_APP_IMAGE_URL + user.image}
                            size="50"
                            round
                          />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="my-1" style={styles.drop_nav_header}>
                          {user.username}
                        </p>
                        <p className="my-1">{user.email}</p>
                      </div>
                    </div>
                    <div className="py-3">
                      <Link
                        className="dropdown-item py-2 mb-0"
                        to="/profile"
                        style={styles.drop_nav_link}
                      >
                        <i className="fas fa-address-card pr-2"></i> My Profile
                      </Link>
                      <Link
                        className="dropdown-item py-2 mb-0"
                        to="/billing"
                        style={styles.drop_nav_link}
                      >
                        <i className="fas fa-money-bill pr-2"></i> Billing /
                        Subscription
                      </Link>
                      <Link
                        className="dropdown-item py-2 mb-0"
                        to="/"
                        style={styles.drop_nav_link}
                        onClick={handleLogout}
                      >
                        <i className="fas fa-arrow-right-from-bracket pr-2"></i>{" "}
                        Logout
                      </Link>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {/* ALL PAGES AND ROUTES HERE */}
        {/* <Route path="/sign-in" exact element={<SignIn />}></Route>
            <Route path="/" exact element={<SignUp />}></Route> */}
        <Routes>
          <Route path="/dashboard" exact element={<Dashboard />}></Route>
          <Route
            path="/sales/quotation"
            element={<Quotation ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/sales/customer"
            element={<Customer ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/sales/tax"
            element={<Tax ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/sales/add_customer"
            element={<Add_SalesCustomer ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/sales/add_quotation"
            element={<Add_SalesQuotaion ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/sales/add_tax"
            element={<Add_Tax ToggleAlert={HandleToggleBtn} />}
          ></Route>
          {/* <Route
            path="/sales/orders"
            element={<Sales_orders ToggleAlert={HandleToggleBtn} />}
          ></Route> */}
          {/* <Route
            path="/sales/add_orders"
            element={<Add_SalesOrders ToggleAlert={HandleToggleBtn} />}
          ></Route> */}
          <Route
            path="/sales/invoice"
            element={<SalesInvoice ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/sales/add_invoice"
            element={<Add_SalesInvoice ToggleAlert={HandleToggleBtn} />}
          ></Route>
          {/* <Route
            path="/sales/received_money"
            element={<RecMoney_Sales ToggleAlert={HandleToggleBtn} />}
          ></Route> */}
          {/* <Route
            path="/sales/add_received_money"
            element={<Add_RecMoneySales ToggleAlert={HandleToggleBtn} />}
          ></Route> */}
          <Route
            path="/sales/delivery"
            element={<Sales_Delivery ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/sales/add_delivery"
            element={<Add_SalesDelivery ToggleAlert={HandleToggleBtn} />}
          ></Route>
          {/* <Route
            path="/sales/refund"
            element={<Sales_Refund ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/sales/add_refund"
            element={<Add_SalesRefund ToggleAlert={HandleToggleBtn} />}
          ></Route> */}
          {/* <Route
            path="/purchases/orders"
            element={<Purchases_Orders ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/purchases/add_orders"
            element={<Add_PurchasesOrders ToggleAlert={HandleToggleBtn} />}
          ></Route> */}
          <Route
            path="/purchases/invoice"
            element={<Purchases_Invoice ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/purchases/add_invoice"
            element={<Add_PurchasesInvoice ToggleAlert={HandleToggleBtn} />}
          ></Route>
          {/* <Route
            path="/purchases/return"
            element={<Purchases_Return ToggleAlert={HandleToggleBtn} />}
          ></Route> */}
          {/* <Route
            path="/purchases/products"
            element={<Purchases_Products ToggleAlert={HandleToggleBtn} />}
          ></Route>

          <Route
            path="/purchases/add_products"
            element={<Add_PurchasesProducts ToggleAlert={HandleToggleBtn} />}
          ></Route> */}
          {/* <Route
            path="/purchases/add_return"
            element={<Add_PurchasesReturn ToggleAlert={HandleToggleBtn} />}
          ></Route> */}
          <Route
            path="/inventory/stock_movement"
            element={<StockMov ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/inventory/add_stock_movement"
            element={<Add_StockMov ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/inventory/add_stock_warehouse"
            element={<Add_StockWarehouse ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/inventory/stock_inventory"
            element={<Stock_Inventory ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/inventory/add_stock_inventory"
            element={<Add_Stock_Inventory ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/inventory/stock_warehouse"
            element={<Stock_WareHouse ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/inventory/stock_return"
            element={<StockReturn ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/inventory/add_stock_return"
            element={<Add_StockReturn ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/inventory/scheduled_valuation"
            element={<ScheduledVal ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/inventory/add_scheduled_valuation"
            element={<Add_ScheduledVal ToggleAlert={HandleToggleBtn} />}
          ></Route>
          {/* <Route
            path="/statements/balance_sheet"
            element={<Bal_Sheet ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/statements/add_balance_sheet"
            element={<Add_BalSheet ToggleAlert={HandleToggleBtn} />}
          ></Route> */}
          <Route
            path="/sales/customer/pdf/:id"
            element={<CustomerPDF ToggleAlert={HandleToggleBtn} user={user} />}
          ></Route>
          <Route
            path="/statements/trail_balance"
            element={<Trail_Bal ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/statements/add_trail_balance"
            element={<Add_Trail_Bal ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/statements/income_statement"
            element={<Income_Stat ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/statements/add_income_statement"
            element={<Add_Income_Stat ToggleAlert={HandleToggleBtn} />}
          ></Route>
          {/* <Route
            path="/statements/bank_reconciliation"
            element={<Bank_Rec ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/statements/add_bank_reconciliation"
            element={<Add_Bank_Rec ToggleAlert={HandleToggleBtn} />}
          ></Route> */}
          <Route
            path="/accounts/expense"
            element={<Expense ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/accounts/add_expense"
            element={<Add_Expense ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/accounts/bank_account"
            element={<Bank_Account ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/accounts/add_bank_account"
            element={<Add_BankAcc ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/accounts/cashdeposit"
            element={<CashDeposit ToggleAlert={HandleToggleBtn} />}
          ></Route>
          {/* <Route
            path="/accounts/bank_deposit"
            element={<Bank_Deposit ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/accounts/add_bank_deposit"
            element={<Add_BankDeposit ToggleAlert={HandleToggleBtn} />}
          ></Route> */}
          <Route
            path="/accounts/funds_transfer"
            element={<Fund_Transfer ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/accounts/add_funds_transfer"
            element={<Add_FundTransfer ToggleAlert={HandleToggleBtn} />}
          ></Route>
          {/* <Route
            path="/accounts/other_collections"
            element={<OtherCollection ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/accounts/add_other_collections"
            element={<Add_OtherCollection ToggleAlert={HandleToggleBtn} />}
          ></Route> */}
          {/* <Route
            path="/accounts/other_payments"
            element={<OtherPayment ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/accounts/add_other_payment"
            element={<Add_OtherPayment ToggleAlert={HandleToggleBtn} />}
          ></Route> */}
          <Route
            path="/accounts/journal_entry"
            element={<J_Entry ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/accounts/add_journal_entry"
            element={<Add_J_Entry ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/accounts/add_cashdeposit"
            element={<Add_CashDeposit ToggleAlert={HandleToggleBtn} />}
          ></Route>
          {/* <Route
            path="/accounts/credit_note"
            element={<Credit_Note ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/accounts/add_credit_note"
            element={<Add_Credit_Note ToggleAlert={HandleToggleBtn} />}
          ></Route>

          <Route
            path="/accounts/debit_note"
            element={<Debit_Note ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/accounts/add_debit_note"
            element={<Add_Debit_Note ToggleAlert={HandleToggleBtn} />}
          ></Route>

          <Route
            path="/accounts/employees"
            element={<Employees ToggleAlert={HandleToggleBtn} />}
          ></Route>
          <Route
            path="/accounts/add_employees"
            element={<Add_Employees ToggleAlert={HandleToggleBtn} />}
          ></Route> */}
          <Route
            path="/profile"
            element={
              <Settings
                user={user}
                ToggleAlert={HandleToggleBtn}
                Img_Found={Img_Found}
              />
            }
          ></Route>
          <Route
            path="/sales/delivery/delivery_challan/:id"
            element={
              <DeliveryChallan user={user} ToggleAlert={HandleToggleBtn} />
            }
          ></Route>
          <Route
            path="/sales/invoice/:id"
            element={
              <InvoiceChallan user={user} ToggleAlert={HandleToggleBtn} />
            }
          ></Route>
          <Route
            path="/purchases/invoice/:id"
            element={
              <PurchaseChallan user={user} ToggleAlert={HandleToggleBtn} />
            }
          ></Route>
          {/* TrailBalancePDF */}
          <Route
            path="/inventory/add_stock_supplier"
            element={
              <Add_StockSupplier user={user} ToggleAlert={HandleToggleBtn} />
            }
          ></Route>
          <Route
            path="/inventory/stock_supplier"
            element={
              <StockSupplier user={user} ToggleAlert={HandleToggleBtn} />
            }
          ></Route>
          <Route
            path="/statements/income_statement/pdf/:previous/:current"
            element={
              <IncomeStatementPdf user={user} ToggleAlert={HandleToggleBtn} />
            }
          ></Route>
          <Route
            path="/statements/trail_balance/pdf/:month"
            element={
              <TrailBalancePDF user={user} ToggleAlert={HandleToggleBtn} />
            }
          ></Route>
          <Route
            path="/inventory/stock_warehouse/:id"
            element={<WarehousePdf user={user} ToggleAlert={HandleToggleBtn} />}
          ></Route>
          {/* PurchaseChallanWarehousePdf */}
          <Route
            path="/billing"
            element={
              <Payment_Details user={user} ToggleAlert={HandleToggleBtn} />
            }
          ></Route>
          <Route path="/" element={<Navigate replace to="/dashboard" />} />
        </Routes>
        <Alert
          alert={alert}
          Progress={Progress}
          Toast={Toast}
          setToast={setToast}
          setProgress={setProgress}
          timer1={timer1}
          timer2={timer2}
          setAlert={setAlert}
        />
      </div>
    </div>
  ) : (
    <div>
      <Routes>
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/login/admin" element={<Login />}></Route>
        <Route
          path="/register"
          element={<Register ToggleAlert={HandleToggleBtn} />}
        ></Route>
        <Route path="/" element={<Navigate replace to="/login" />} />
      </Routes>
      <Alert
        alert={alert}
        Progress={Progress}
        Toast={Toast}
        setToast={setToast}
        setProgress={setProgress}
        timer1={timer1}
        timer2={timer2}
        setAlert={setAlert}
      />
    </div>
  );

}
export default MainAdmin;
