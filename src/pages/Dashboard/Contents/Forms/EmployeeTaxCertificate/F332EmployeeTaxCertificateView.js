
import React ,{Fragment, useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import { Button } from "@material-ui/core";
import PrintIcon from "@material-ui/icons/Print";
import { useParams } from "react-router-dom/cjs/react-router-dom";
const F332EmployeeTaxCertificateView = () => {
  const [challanData, setChallanData] = useState({});
  const componentRef = useRef(null);
  const { id } = useParams();
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    const sessionId = id.split("T")[0];
    // const monthId = id.split("T")[1];
    const employeeObject = id.split("T")[1];

    if (sessionId && employeeObject) {
      getData(sessionId,  employeeObject);
    }
  }, []);
  const getData = async (sessionId,  employeeObject) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("sessionId", sessionId);
    // formData.append("monthId", monthId);
    formData.append("employeeId", employeeObject);

    let url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C332CommonEmployeesMonthlyPayrollVoucherTaxCertificateView`;
    await fetch(url, {
      method: "POST",
      body: formData,
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((json) => {
        if (json.CODE === 1) {
          console.log(json.DATA);
          setChallanData(json.DATA[0]);
        } else {
          alert(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE);
        }
      })
      .catch((error) => {
        if (error.status == 401) {
          // this.setState({
          //   isLoginMenu: true,
          //   isReload: true,
          // });
        } else {
          alert("Operation Failed, Please try again later.");
        }
        console.log(error);
      });
    setLoading(false);
  };

  return (

    <Fragment>
           <ReactToPrint
             trigger={() => {
               return (
                 <Button
                   style={{
                     float: "right",
                     marginTop: 10,
                     marginRight: 20,
                     textTransform: "capitalize",
                     opacity: 0.8,
                   }}
                   color="primary"
                   variant="contained"
                 >
                   <PrintIcon style={{ paddingRight: 5 }} /> Print
                 </Button>
               );
             }}
             content={() => componentRef.current}
             pageStyle="@page { size: landscape; margin: 0mm;}"
           />
    
    <div style={styles.container} ref={componentRef}>
      <h2 style={styles.heading}>TO WHOM IT MAY CONCERN</h2>
      <p style={styles.paragraph}>
        This is to certify that a sum of <strong>Rs. {challanData.grossSalary}/-</strong> has
        been paid to
        <strong> {challanData.employeeGender === 1 ? "Mr." : "Mrs."} {challanData.employeeLabel}</strong> on account of salary for the financial year
        ended on
        <strong> 30.06.2024</strong>, and <strong>Rs. {challanData.deductions}/-</strong> has
        been deducted and duly deposited as income tax. Breakup of the salary is
        given below:
      </p>

      <table style={styles.table}>
        <tbody>
          <tr>
            <td style={styles.leftCell}>Amount on which Deducted</td>
            <td style={styles.rightCell}>{challanData.grossSalaryWithoutMedicalAllowance
            }</td>
          </tr>
          <tr>
            <td style={styles.leftCell}>Exemption (Medical Allowance)</td>
            <td style={styles.rightCell}>{challanData.medicalAllowance}</td>
          </tr>
          <tr>
            <td style={styles.leftCell}>
              <strong>Gross Salary</strong>
            </td>
            <td style={styles.rightCell}>
              <strong>{challanData.grossSalary}</strong>
            </td>
          </tr>
        </tbody>
      </table>

      <div style={styles.signature}>
        <p>
          <strong>Accounts Department</strong>
        </p>
        <p>Dated: 03.09.2024</p>
      </div>
    </div>
    </Fragment>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    width: "80%",
    margin: "50px auto",
    padding: "20px",
    // border: "1px solid black",
    borderRadius: "10px",
    textAlign: "center",
  },
  heading: {
    textAlign: "center",
    textDecoration: "underline",
    marginBottom: "20px",
  },
  paragraph: {
    textAlign: "left",
    fontSize: "16px",
    lineHeight: "1.6",
    marginBottom: "30px",
  },
  table: {
    width: "100%",
    marginBottom: "30px",
    borderCollapse: "collapse",
  },
  leftCell: {
    textAlign: "left",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid black",
  },
  rightCell: {
    textAlign: "right",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid black",
  },
  signature: {
    textAlign: "right",
    marginTop: "50px",
  },
};

export default F332EmployeeTaxCertificateView;
