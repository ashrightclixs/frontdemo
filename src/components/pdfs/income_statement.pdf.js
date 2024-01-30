import {
    Document,
    Page,
    Text,
    View,
    Font,
    StyleSheet,
    PDFViewer,
    Image,
  } from "@react-pdf/renderer";
  import axios from "axios";
  import { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";
  
  import logo from '../../assets/logo.jpg'
  
  const BORDER_COLOR = '#bfbfbf'
  const BORDER_STYLE = 'solid'
  const COL1_WIDTH = 100 / 2
  const COLN_WIDTH =  COL1_WIDTH
  
  // Create styles
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#fff",
      color: "#212529",
      margin: 10,
      padding: 25,
    },
    image: {
      width: "75px",
      height: "auto",
      borderRadius: "50%",
    },
    section: {
      textAlign: "left",
    },
    FlexSection: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      paddingBottom: 20,
    },
    viewer: {
      width: "82vw", //the pdf viewer will take up all of the width and height
      height: window.innerHeight,
    },
    headingFont: {
      fontSize: "28px",
      fontWeight: "medium",
    },
    ParagraphFont: {
      fontSize: "10px",
      fontWeight: "light",
    },
    textRight: {
      textAlign: "right",
    },
    table: {
      display: "table",
      width: "auto",
      // borderStyle: BORDER_STYLE,
      // borderColor: BORDER_COLOR,
      // borderWidth: 1,
      // borderRightWidth: 0,
      // borderBottomWidth: 0,
      marginTop: 20,
    },
    tableRow: {
      margin: "auto",
      flexDirection: "row",
    },
    tableCol1Header: {
      width: COL1_WIDTH + "%",
      // borderStyle: BORDER_STYLE,
      // borderColor: BORDER_COLOR,
      // borderBottomColor: "#000",
      // borderWidth: 1,
      // borderLeftWidth: 0,
      // borderTopWidth: 0,
      backgroundColor: "#3C3D3A",
      color: "#fff",
    },
    tableColHeader: {
      width: COLN_WIDTH + "%",
      // borderStyle: BORDER_STYLE,
      // borderColor: BORDER_COLOR,
      // borderBottomColor: "#000",
      // borderWidth: 1,
      // borderLeftWidth: 0,
      // borderTopWidth: 0,
      backgroundColor: "#3C3D3A",
      color: "#fff",
    },
    tableCol1: {
      width: COL1_WIDTH + "%",
      // borderStyle: BORDER_STYLE,
      // borderColor: BORDER_COLOR,
      // borderWidth: 1,
      // borderLeftWidth: 0,
      // borderTopWidth: 0,
    },
    tableCol: {
      width: COLN_WIDTH + "%",
      // borderStyle: BORDER_STYLE,
      // borderColor: BORDER_COLOR,
      // borderBottomWidth: 1,
      // borderLeftWidth: 0,
      // borderTopWidth: 0,
    },
    tableCellHeader: {
      marginVertical: 10,
      marginHorizontal: 5,
      fontSize: 10,
    },
    tableColLeft: {
      width: COLN_WIDTH + "%",
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      borderBottomWidth: 0,
      borderRightWidth: 0,
    },
    tableColRight: {
      width: COLN_WIDTH + "%",
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      borderBottomWidth: 0,
      borderRightWidth: 1,
    },
    tableRowBottom: {
      margin: "auto",
      flexDirection: "row",
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      borderBottomWidth: 1,
      borderRightWidth: 0,
    },
    tableCell: {
      margin: 5,
      fontSize: 10,
      padding: 3,
      width: 100 + "%"
    },
  });
  
  Font.register({
    family: 'Lato',
    src: `https://fonts.gstatic.com/s/lato/v16/S6uyw4BMUTPHjx4wWw.ttf`,
  });
  
  Font.register({
    family: 'Lato Italic',
    src: `https://fonts.gstatic.com/s/lato/v16/S6u8w4BMUTPHjxsAXC-v.ttf`,
  });
  
  Font.register({
    family: 'Lato Bold',
    src: `https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh6UVSwiPHA.ttf`,
  });



const IncomeStatementPdf = ({ user, ToggleAlert }) => {
  const [data, setData] = useState([]);
  const [company, setCompany] = useState([]);
  // Expense
  const [salaries_Expense, setSalaries_Expense] = useState(0);
  const [electricity_Expense, setelectricity_Expense] = useState(0);
  const [water_Expense, setwater_Expense] = useState(0);
  const [gas_Expense, setgas_Expense] = useState(0);
  const [office_Rental_Expense, setoffice_Rental_Expense] = useState(0);
  const [repairing_Maintenance, setrepairing_Maintenance] = useState(0);
  const [delivery_Expense, setdelivery_Expense] = useState(0);
  const [stationery_Expense, setstationery_Expense] = useState(0);
  const [internet_Bill, setinternet_Bill] = useState(0);
  const [other_Expense, setother_Expense] = useState(0);

  const [total_invoice, settotal_invoice] = useState(0);
  const [Gross_profit, setGross_profit] = useState(0);

  const [ net_profit , setnet_profit ] = useState(0);
  const params = useParams();
  let total_all_Expenses = 0;

  const total = (value) => {
    let totalinvoice = 0;
    let grossprofit = 0;
    let expense;
    const total = [];
    value.invoice.map((val, index) => {
      totalinvoice += val.net;
    });
    value.dashboardrevenue.map((val, index) => {
      if (val.type == "revenue") {
        grossprofit += val.amount;
      }
    });

    for (let i = 0; i < 10; i++) {
      expense = 0;
      value.Array_expense[i].map((val, index) => {
        expense += val.amount;
      });
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

    return total;
  };

  const fetchData = async() => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/user/get_company?id=${user._id}`)
      .then((res) => {
        setCompany(res.data.data);
        if (res.data.data.length === 0) {
          ToggleAlert(
            "Warning",
            "Please add company profile first in profile section"
          );
        }
      })
      .catch((e) => console.log(e));

    const url = `${process.env.REACT_APP_API_URL}/statement/incomestatement?id=${user._id}&previous=${params.previous}&current=${params.current}`;
    // console.log(url);
    await axios
      .get(url)
      .then((response) => {
        total(response.data);
        setData(response.data);
      })
      .catch((e) => {
        console.log("error");
      });
  }

  useEffect(() => {
    fetchData()
  }, []);

  return data.length !== 0 && company.length !== 0 ? (
    <PDFViewer style={styles.viewer}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontFamily: "Lato Bold", fontSize: 15 }}>
              Income Statement
            </Text>
            <Text style={{ fontSize: 15 }}>{company[0].name}</Text>
            <Text style={{ fontSize: 15 }}>
              {params.previous} to {params.current}
            </Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={[styles.tableCellHeader, { textAlign: "left" }]}>
                  Title
                </Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={[styles.tableCellHeader, { textAlign: "right" }]}>
                  Amount (PKR) 
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <View
                  style={{
                    borderStyle: BORDER_STYLE,
                    borderColor: BORDER_COLOR,
                    borderBottomWidth: 1,
                    borderLeftWidth: 0,
                    borderTopWidth: 0,
                  }}
                >
                  <Text style={[styles.tableCell, { fontFamily: "Lato Bold" }]}>
                    Income
                  </Text>
                  <Text style={styles.tableCell}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sales
                  </Text>
                  <Text style={styles.tableCell}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Total Income
                  </Text>
                </View>
                <View
                  style={{
                    borderStyle: BORDER_STYLE,
                    borderColor: BORDER_COLOR,
                    borderBottomWidth: 1,
                    borderLeftWidth: 0,
                    borderTopWidth: 0,
                  }}
                >
                  <Text style={[styles.tableCell, { fontFamily: "Lato Bold" }]}>
                    Less Cost of Sales
                  </Text>
                  <Text style={styles.tableCell}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Purchases
                  </Text>
                  <Text style={styles.tableCell}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Total Cost of Sales
                  </Text>
                </View>
                <View
                  style={{
                    borderStyle: BORDER_STYLE,
                    borderColor: BORDER_COLOR,
                    borderBottomWidth: 1,
                    borderLeftWidth: 0,
                    borderTopWidth: 0,
                  }}
                >
                  <Text style={[styles.tableCell, { fontFamily: "Lato Bold" }]}>
                    Gross Profit
                  </Text>
                </View>
                <View
                  style={{
                    // borderStyle: BORDER_STYLE,
                    // borderColor: BORDER_COLOR,
                    // borderBottomWidth: 1,
                    borderLeftWidth: 0,
                    borderTopWidth: 0,
                  }}
                >
                  <Text style={[styles.tableCell, { fontFamily: "Lato Bold" }]}>
                    Less Operating Expenses
                  </Text>
                  <Text style={styles.tableCell}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Salaries Expense
                  </Text>
                  <Text style={styles.tableCell}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Electricity Expense
                  </Text>
                  <Text style={styles.tableCell}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Water Expense
                  </Text>
                  <Text style={styles.tableCell}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Gas Expense
                  </Text>
                  <Text style={styles.tableCell}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Office Rental Expense
                  </Text>
                  <Text style={styles.tableCell}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Repairing and
                    Maintenance
                  </Text>
                  <Text style={styles.tableCell}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Delivery Expense
                  </Text>
                  <Text style={styles.tableCell}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Stationery Expense
                  </Text>
                  <Text style={styles.tableCell}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Internet Bill
                  </Text>
                  <Text style={styles.tableCell}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Other Expense
                  </Text>
                </View>
                <View
                  style={{
                    borderStyle: BORDER_STYLE,
                    borderColor: BORDER_COLOR,
                    borderBottomWidth: 1,
                    borderLeftWidth: 0,
                    borderTopWidth: 0,
                  }}
                >
                  <Text style={[styles.tableCell, { fontFamily: "Lato Bold" }]}>
                    Net Profit
                  </Text>
                </View>
                {/* <View
                  style={{
                    borderStyle: BORDER_STYLE,
                    borderColor: BORDER_COLOR,
                    borderBottomWidth: 1,
                    borderLeftWidth: 0,
                    borderTopWidth: 0,
                  }}
                >
                  <Text style={[styles.tableCell, { fontFamily: "Lato Bold" }]}>
                    Total
                  </Text>
                </View> */}
              </View>
              <View style={styles.tableCol}>
                <View
                  style={{
                    borderStyle: BORDER_STYLE,
                    borderColor: BORDER_COLOR,
                    borderBottomWidth: 1,
                    borderLeftWidth: 0,
                    borderTopWidth: 0,
                    textAlign: "right",
                  }}
                >
                  <Text style={[styles.tableCell]}>&nbsp;</Text>
                  <Text style={styles.tableCell}>
                    {parseInt(total_invoice.toFixed(2)).toLocaleString()}
                  </Text>
                  <Text style={[styles.tableCell, { fontFamily: "Lato Bold" }]}>
                    {parseInt(total_invoice.toFixed(2)).toLocaleString()}
                  </Text>
                </View>
                <View
                  style={{
                    borderStyle: BORDER_STYLE,
                    borderColor: BORDER_COLOR,
                    borderBottomWidth: 1,
                    borderLeftWidth: 0,
                    borderTopWidth: 0,
                    textAlign: "right",
                  }}
                >
                  <Text style={[styles.tableCell, { fontFamily: "Lato Bold" }]}>
                    &nbsp;
                  </Text>
                  <Text style={styles.tableCell}>
                    {parseInt(Gross_profit.toFixed(2)).toLocaleString()}
                  </Text>
                  <Text style={styles.tableCell}>
                    {parseInt(Gross_profit.toFixed(2)).toLocaleString()}
                  </Text>
                </View>
                <View
                  style={{
                    borderStyle: BORDER_STYLE,
                    borderColor: BORDER_COLOR,
                    borderBottomWidth: 1,
                    borderLeftWidth: 0,
                    borderTopWidth: 0,
                    textAlign: "right",
                  }}
                >
                  <Text style={[styles.tableCell, { fontFamily: "Lato Bold" }]}>
                    {parseInt(Gross_profit.toFixed(2)).toLocaleString()}
                  </Text>
                </View>
                <View
                  style={{
                    // borderStyle: BORDER_STYLE,
                    // borderColor: BORDER_COLOR,
                    // borderBottomWidth: 1,
                    borderLeftWidth: 0,
                    borderTopWidth: 0,
                    textAlign: "right",
                  }}
                >
                  <Text style={[styles.tableCell, { fontFamily: "Lato Bold" }]}>
                    &nbsp;
                  </Text>
                  <Text style={styles.tableCell}>
                    {parseInt(salaries_Expense.toFixed(2)).toLocaleString()}
                  </Text>
                  <Text style={styles.tableCell}>
                    {parseInt(electricity_Expense.toFixed(2)).toLocaleString()}
                  </Text>
                  <Text style={styles.tableCell}>
                    {parseInt(water_Expense.toFixed(2)).toLocaleString()}
                  </Text>
                  <Text style={styles.tableCell}>
                    {parseInt(gas_Expense.toFixed(2)).toLocaleString()}
                  </Text>
                  <Text style={styles.tableCell}>
                    {parseInt(
                      office_Rental_Expense.toFixed(2)
                    ).toLocaleString()}
                  </Text>
                  <Text style={styles.tableCell}>
                    {parseInt(
                      repairing_Maintenance.toFixed(2)
                    ).toLocaleString()}
                  </Text>
                  <Text style={styles.tableCell}>
                    {parseInt(delivery_Expense.toFixed(2)).toLocaleString()}
                  </Text>
                  <Text style={styles.tableCell}>
                    {parseInt(stationery_Expense.toFixed(2)).toLocaleString()}
                  </Text>
                  <Text style={styles.tableCell}>
                    {parseInt(internet_Bill.toFixed(2)).toLocaleString()}
                  </Text>
                  <Text style={styles.tableCell}>
                    {parseInt(other_Expense.toFixed(2)).toLocaleString()}
                  </Text>
                </View>
                <View
                  style={{
                    borderStyle: BORDER_STYLE,
                    borderColor: BORDER_COLOR,
                    borderBottomWidth: 1,
                    borderLeftWidth: 0,
                    borderTopWidth: 0,
                    textAlign: "right",
                  }}
                >
                  <Text style={[styles.tableCell, { fontFamily: "Lato Bold" }]}>
                  { Gross_profit - net_profit }
                  </Text>
                </View>
                {/* <View
                  style={{
                    borderStyle: BORDER_STYLE,
                    borderColor: BORDER_COLOR,
                    borderBottomWidth: 1,
                    borderLeftWidth: 0,
                    borderTopWidth: 0,
                    textAlign: "right",
                  }}
                >
                  <Text style={[styles.tableCell, { fontFamily: "Lato Bold" }]}>
                    0
                  </Text>
                </View> */}
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  ) : (
    <div style={{ textAlign: "center", marginTop: "10rem" }}>
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  );
};
 
export default IncomeStatementPdf;