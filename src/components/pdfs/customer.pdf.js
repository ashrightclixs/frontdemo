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

const BORDER_COLOR = "#bfbfbf";
const BORDER_STYLE = "solid";
const COL1_WIDTH = 100 / 6;
const COLN_WIDTH = COL1_WIDTH;

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    color: "#212529",
    margin: 10,
    padding: 25,
  },
  image: {
    width: "100px",
    height: "100px",
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
  family: "Lato",
  src: `https://fonts.gstatic.com/s/lato/v16/S6uyw4BMUTPHjx4wWw.ttf`,
});

Font.register({
  family: "Lato Italic",
  src: `https://fonts.gstatic.com/s/lato/v16/S6u8w4BMUTPHjxsAXC-v.ttf`,
});

Font.register({
  family: "Lato Bold",
  src: `https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh6UVSwiPHA.ttf`,
});

// Create Document Component
function CustomerPDF({ user, ToggleAlert }) {
  // delivery_challan;
    const [data, setData] = useState([]);
    const [company, setCompany] = useState([]);
    const [net, setNet] = useState(0)
    const [received, setReceived] = useState(0)
    const params = useParams();

    const fetchData = async () => {
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
            `${process.env.REACT_APP_API_URL}/customer/getcustomerinvoice?id=${params.id}`
          )
          .then((response) => {  
            setData(response.data)
            console.log(response.data.invoice_val)
            if(response.data.invoice.length > 0){
              let total_net = 0
              let total_received = 0;
              response.data.invoice.map((val) => {
                total_net+=val.net
                total_received += val.received
                setNet(total_net)
                setReceived(total_received);
              })
            }
          })
          .catch((e) => console.log(e));
    };

    useEffect(() => {
        fetchData();
    }, []);

  return data.length !== 0 && company.length !== 0 ? (
    <PDFViewer style={styles.viewer}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.FlexSection}>
            <Image
              src={process.env.REACT_APP_IMAGE_URL + company[0].profile}
              style={styles.image}
            />
            <View>
              <Text style={[styles.headingFont, { fontFamily: "Lato Bold" }]}>
                Customer Invoice
              </Text>
            </View>
          </View>
          <View style={[{ flexDirection: "column", marginTop: 15 }]}>
            <Text style={{ fontSize: "12px", fontFamily: "Lato Bold" }}>
              {company[0].name}
            </Text>
            <Text style={{ fontSize: "12px", fontFamily: "Lato" }}>
              {company[0].address}
            </Text>
            <Text style={{ fontSize: "12px", fontFamily: "Lato" }}>
              Phone: {company[0].contact}
            </Text>
          </View>
          <View style={[styles.FlexSection, { marginTop: 15 }]}>
            <View>
              <Text style={{ fontSize: "12px", fontFamily: "Lato Bold" }}>
                Bill to
              </Text>
              <Text style={{ fontSize: "12px", fontFamily: "Lato" }}>
                {data.invoice[0].customer.company}
              </Text>
              <Text style={{ fontSize: "12px", fontFamily: "Lato" }}>
                {data.invoice[0].customer.address}
              </Text>
              <Text
                style={{ fontSize: "12px", fontFamily: "Lato", marginTop: 20 }}
              >
                Phone: {data.invoice[0].customer.contact}
              </Text>
            </View>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol1Header}>
                <Text style={styles.tableCellHeader}>#</Text>
              </View>
              <View style={styles.tableCol1Header}>
                <Text style={styles.tableCellHeader}>Item</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Total Amount</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Amount Paid</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Amount Due</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Due Date</Text>
              </View>
            </View>
            {data.invoice_val.map((value, index) => (
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{index + 1}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {value.map(
                      (ele) => ele.product_inventory_id.stock_inventory_name
                    )}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {`PKR ${parseInt(
                      value[0].invoice_value.net.toFixed(2)
                    ).toLocaleString()}`}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {`PKR ${parseInt(
                      value[0].invoice_value.received.toFixed(2)
                    ).toLocaleString()}`}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {`PKR ${parseInt(
                      (
                        value[0].invoice_value.net -
                        value[0].invoice_value.received
                      ).toFixed(2)
                    ).toLocaleString()}`}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {value[0].invoice_value.due_date}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View
            style={[
              {
                flexDirection: "column",
                alignItems: "flex-end",
              },
            ]}
          >
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColLeft}>
                  <Text style={styles.tableCell}>Total Amount:</Text>
                </View>
                <View style={styles.tableColRight}>
                  <Text style={styles.tableCell}>{`PKR ${parseInt(
                    net.toFixed(2)
                  ).toLocaleString()}`}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableColLeft}>
                  <Text style={styles.tableCell}>Amount Paid:</Text>
                </View>
                <View style={styles.tableColRight}>
                  <Text style={styles.tableCell}>{`PKR ${parseInt(
                    received.toFixed(2)
                  ).toLocaleString()}`}</Text>
                </View>
              </View>
              <View style={styles.tableRowBottom}>
                <View style={styles.tableColLeft}>
                  <Text style={styles.tableCell}>Due Amount:</Text>
                </View>
                <View style={styles.tableColRight}>
                  <Text style={styles.tableCell}>
                    {`PKR ${parseInt(
                      (net - received).toFixed(2)
                    ).toLocaleString()}`}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {/* <Text
              style={{ fontSize: "12px", fontFamily: "Lato", marginBottom: 10 }}
            >
              Delivery Charges: &nbsp;&nbsp;&nbsp;&nbsp;{" "}
              {`PKR ${data.charges.toLocaleString()}`}
            </Text>
            <Text
              style={{
                fontSize: "12px",
                fontFamily: "Lato Bold",
                marginBottom: 10,
                backgroundColor: "#F5F4F3",
              }}
            >
              Total:
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {`PKR ${data.charges.toLocaleString()}`}
            </Text> */}

          <View
            style={[
              {
                display: "flex",
                position: "absolute",
                width: "100%",
                bottom: 25,
                paddingTop: 10,
                borderTopWidth: 1,
                borderColor: "#f6f6f6",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              },
            ]}
          >
            <View>
              <Text style={{ fontSize: "10px", fontFamily: "Lato Bold" }}>
                Bank/Franchise Name
              </Text>
              <Text style={{ fontSize: "10px", fontFamily: "Lato" }}>
                {user.bank}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: "10px", fontFamily: "Lato Bold" }}>
                Account Title
              </Text>
              <Text style={{ fontSize: "10px", fontFamily: "Lato" }}>
                {user.account_title}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: "10px", fontFamily: "Lato Bold" }}>
                Account No.
              </Text>
              <Text style={{ fontSize: "10px", fontFamily: "Lato" }}>
                {user.account_number}
              </Text>
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
export default CustomerPDF;
