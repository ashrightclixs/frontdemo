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
  const COLN_WIDTH =  COL1_WIDTH / 2
  
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
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
      marginTop: 20,
    },
    tableRow: {
      margin: "auto",
      flexDirection: "row",
    },
    tableCol1Header: {
      width: COL1_WIDTH + "%",
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderBottomColor: "#000",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      backgroundColor: "#3C3D3A",
      color: "#fff",
    },
    tableColHeader: {
      width: COLN_WIDTH + "%",
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderBottomColor: "#000",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      backgroundColor: "#3C3D3A",
      color: "#fff",
    },
    tableCol1: {
      width: COL1_WIDTH + "%",
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCol: {
      width: COLN_WIDTH + "%",
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableColT: {
        width: COLN_WIDTH + "%",
        borderStyle: BORDER_STYLE,
        borderColor: "black",
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
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
  
  
  
  function TrailBalancePDF({ user, ToggleAlert }) {
    const [data, setData] = useState([]);
    const [company, setCompany] = useState([]);
    const [Month, setMonth] = useState([]);
    const params = useParams();

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


      await axios
        .get(
          `${
            process.env.REACT_APP_API_URL
          }/accounts/cash_deposit/gettrialbalance?id=${user._id}&month=${params.month}&year=${new Date().getFullYear()}`
        )
        .then((response) => {
          setData(response.data);
        }).catch(e => console.log(e));
    }

    useEffect(() => {
      fetchData();
      getMonth()
    }, []);

    const getMonth = () => {
      const months = ["January" , "February", "March" , "April" , "May" , "June" , "July" , "August", "September" , "October" , "November" , "December" , "Jan - June" , "Jan - Dec"]
      setMonth(months[parseInt(params.month) - 1])
    } 
  
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
                Trail Balance
              </Text>
              <Text style={{ fontSize: 12 }}>{company[0].name}</Text>
              <Text style={{ fontSize: 12 }}>
                {`For ${Month} ${new Date().getFullYear()}`}
              </Text>
            </View>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableCol1Header}>
                  <Text style={styles.tableCellHeader}>Particulars</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Debit [DR]</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Credit [CR]</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol1}>
                  <Text style={styles.tableCell}>Cash</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {data.entires == "debit"
                      ? parseInt(data.cash.toFixed(2)).toLocaleString()
                      : ""}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {data.entires == "credit"
                      ? parseInt(data.cash.toFixed(2)).toLocaleString()
                      : ""}
                  </Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol1}>
                  <Text style={styles.tableCell}>Capital A/C</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {parseInt(data.capital_ac.toFixed(2)).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}></Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol1}>
                  <Text style={styles.tableCell}>Sales A/C</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {parseInt(data.sales_ac.toFixed(2)).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}></Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol1}>
                  <Text style={styles.tableCell}>Receivable A/C</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {parseInt(data.receivable_ac.toFixed(2)).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}></Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol1}>
                  <Text style={styles.tableCell}>Purchase A/C</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}></Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {parseInt(data.purchase_ac.toFixed(2)).toLocaleString()}
                  </Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol1}>
                  <Text style={styles.tableCell}>Payable A/C</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}></Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {parseInt(data.payable_ac.toFixed(2)).toLocaleString()}
                  </Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol1}>
                  <Text style={styles.tableCell}>Expense A/C</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}></Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {parseInt(data.expenses_ac.toFixed(2)).toLocaleString()}
                  </Text>
                </View>
              </View>

              <View style={styles.tableRow}>
                <View style={styles.tableCol1}>
                  <Text style={styles.tableCell}></Text>
                </View>
                <View style={styles.tableColT}>
                  <Text style={styles.tableCell}>
                    {parseInt(data.total.toFixed(2)).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.tableColT}>
                  <Text style={styles.tableCell}>
                    {parseInt(data.total.toFixed(2)).toLocaleString()}
                  </Text>
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
  }
  export default TrailBalancePDF;
  