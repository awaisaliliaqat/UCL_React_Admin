import React, { Fragment, useEffect, useRef, useState } from "react";
import Logo from "../../../../../assets/Images/logo.png";
import PropTypes from "prop-types";
import { Tooltip, IconButton } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import CircularProgress from "@material-ui/core/CircularProgress";
import ReactToPrint from "react-to-print";
import { Button } from "@material-ui/core";
import PrintIcon from "@material-ui/icons/Print";
import { useParams } from "react-router-dom";
const F331EmployeeMonthlySallaryChallanView = (props) => {
  const { data, feeCard } = props;
  const [challanData, setChallanData] = useState({});
  const componentRef = useRef(null);
  const { id } = useParams();
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    const sessionId = id.split("T")[0]; // sessionId is a string
    if (sessionId !== "0") {
      console.log("1");

      const monthId = id.split("T")[1];
      const employeeObject = id.split("T")[2];
      const year = id.split("T")[3];

      if (sessionId && monthId && employeeObject) {
        getData(sessionId, monthId, employeeObject, year);
      }
    } else {
      console.log("2");
      getDatas();
    }
  }, []);
  const getData = async (sessionId, monthId, employeeObject, year) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("sessionId", sessionId);
    formData.append("monthId", monthId);
    formData.append("employeeId", employeeObject);
    formData.append("year", year);

    let url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C331CommonEmployeesMonthlyPayrollVoucherView`;
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

  const getDatas = async () => {
    setLoading(true);
    // const formData = new FormData();
    // formData.append("sessionId", sessionId);
    // formData.append("monthId", monthId);
    // formData.append("employeeId", employeeObject);
    // formData.append("year", year);

    let url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C331CommonEmployeesMonthlyPayrollVoucherSlipView`;
    await fetch(url, {
      method: "POST",
      // body: formData,
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
      <div>
        <Tooltip title="Back">
          <IconButton onClick={() => window.history.back()}>
            <ArrowBackIcon fontSize="small" color="primary" />
          </IconButton>
        </Tooltip>
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
      </div>

      {challanData ? (
        <div
          ref={componentRef}
          style={{
            width: "50%",
            fontFamily: "inherit",
            marginTop: 50,
            marginLeft: "25%",
            marginRight: "25%",
          }}
        >
          <Fragment>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                }}
              >
                <img alt="" src={Logo} width={50} height={50} />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: "bolder",
                      fontFamily: "sans-serif",
                      letterSpacing: 1,
                      marginBottom: 3,
                    }}
                  >
                    Universal College Lahore
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: "bolder",
                      marginBottom: 3,
                    }}
                  >
                    A project of UCL (Pvt) Ltd
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      marginBottom: 3,
                    }}
                  >
                    <b>Salary Slip:</b> {"   "}{" "}
                    <b>{challanData.salarySlipMonth || ""}</b>
                  </span>
                </div>
              </div>
              {/* <div
    style={{
      marginBottom: 5,
      marginLeft: 60,
    }}
  >
    <span
      style={{
        fontSize: 14,
      }}
    >
      <b>Campus Code:</b> {"UCL"}
    </span>
  </div> */}

              {/* <div
    style={{
      width: "100%",
      display: "flex",
      padding: 5,
      border: "1px solid",
      flexDirection: "column",
      marginBottom: 4,
    }}
  >
    <div
      style={{
        display: "flex",
      }}
    >
      <span
        style={{
          fontSize: 14,
          marginBottom: 3,
          marginRight: 15,
        }}
      >
        <b>Academic Session:</b> {data.session || ""}
      </span>
      <span
        style={{
          fontSize: 14,
          marginBottom: 3,
        }}
      >
        <b>Bill No:</b> {data.billNo || ""}
      </span>
    </div>
    <div
      style={{
        display: "flex",
      }}
    >
      <span
        style={{
          fontSize: 14,
          marginBottom: 3,
          marginRight: 15,
        }}
      >
        <b>Fee Installment:</b>
      </span>
      <span
        style={{
          fontSize: 14,
        }}
      >
        {data.installment || ""}
      </span>
    </div>
  </div> */}

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  padding: 5,
                  border: "1px solid",
                  flexDirection: "column",
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      marginBottom: 3,
                      width: 50,
                    }}
                  >
                    <b>ID:</b>
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                    }}
                  >
                    {challanData.employeeId || ""}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      marginBottom: 3,
                      width: 50,
                    }}
                  >
                    <b>Name: </b>
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                    }}
                  >
                    {`${challanData.employeeLabel || ""}`}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  {/* <span
        style={{
          fontSize: 14,
          marginBottom: 3,
          width: 130,
        }}
      >
        <b>Class-Section</b>
      </span> */}
                  <span
                    style={{
                      fontSize: 14,
                    }}
                  >
                    {data.studentClass || ""}
                  </span>
                </div>
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  padding: 5,
                  border: "1px solid",
                  flexDirection: "column",
                  marginBottom: 4,
                  height: "63vh",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 5,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      marginBottom: 5,
                      width: 100,
                    }}
                  >
                    <b>Salary</b>
                  </span>
                  <span
                    style={{
                      marginLeft: 40,
                      fontSize: 14,
                    }}
                  ></span>
                  <span
                    style={{
                      width: 85,
                      textAlign: "end",
                      fontSize: 14,
                    }}
                  >
                    Rs. {challanData.perMonthSalary || 0}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 5,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      marginBottom: 5,
                      width: 100,
                    }}
                  >
                    <b>LE days</b>
                  </span>
                  <span
                    style={{
                      marginLeft: 40,
                      fontSize: 14,
                    }}
                  ></span>
                  <span
                    style={{
                      width: 85,
                      textAlign: "end",
                      fontSize: 14,
                    }}
                  >
                    {challanData.leaveInCashDays || 0}
                  </span>
                </div>

                {challanData?.allowances?.map((item, index) => {
                  console.log(item);

                  return (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 5,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 14,
                          marginBottom: 5,
                          width: 100,
                        }}
                      >
                        <b>{item?.allowanceLabel}</b>
                      </span>
                      <span
                        style={{
                          marginLeft: 40,
                          fontSize: 14,
                        }}
                      ></span>
                      <span
                        style={{
                          width: 85,
                          textAlign: "end",
                          fontSize: 14,
                        }}
                      >
                        Rs. {item.amount || 0}
                      </span>
                    </div>
                  );
                })}
                {/* <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <span
            style={{
              fontSize: 14,
              marginBottom: 5,
              width: 100,
            }}
          >
            <b>C. Allowance</b>
          </span>
          <span
            style={{
              marginLeft: 40,
              fontSize: 14,
            }}
          >
            Rs.
          </span>
          <span
            style={{
              width: 85,
              textAlign: "end",
              fontSize: 14,
            }}
          >
            {challanData.allowances[0].amount || 0}
          </span>
        </div> */}
                {/* <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <span
            style={{
              fontSize: 14,
              marginBottom: 5,
              width: 100,
            }}
          >
            <b>HM Allowance</b>
          </span>
          <span
            style={{
              marginLeft: 40,
              fontSize: 14,
            }}
          >
            Rs.
          </span>
          <span
            style={{
              width: 85,
              textAlign: "end",
              fontSize: 14,
            }}
          >
            {challanData.allowances[1].amount || 0}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <span
            style={{
              fontSize: 14,
              marginBottom: 5,
              width: 100,
            }}
          >
            <b>Clubs</b>
          </span>
          <span
            style={{
              marginLeft: 40,
              fontSize: 14,
            }}
          >
            Rs.
          </span>
          <span
            style={{
              width: 85,
              textAlign: "end",
              fontSize: 14,
            }}
          >
            {challanData.allowances[2].amount || 0}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <span
            style={{
              fontSize: 14,
              marginBottom: 5,
              width: 100,
            }}
          >
            <b>Other</b>
          </span>
          <span
            style={{
              marginLeft: 40,
              fontSize: 14,
            }}
          >
            Rs.
          </span>
          <span
            style={{
              width: 85,
              textAlign: "end",
              fontSize: 14,
            }}
          >
            {challanData.allowances[3].amount || 0}
          </span>
        </div> */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 5,
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      marginBottom: 5,
                      width: 100,
                    }}
                  >
                    <b>Gross Salary</b>
                  </span>
                  <span
                    style={{
                      marginLeft: 40,
                      fontSize: 14,
                    }}
                  ></span>
                  <span
                    style={{
                      width: 85,
                      textAlign: "end",
                      fontSize: 14,
                    }}
                  >
                    Rs. {challanData.grossSalary || 0}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 5,
                  }}
                >
                  <span
                    style={{
                      fontSize: 18,
                      marginBottom: 5,
                      width: 100,
                    }}
                  >
                    <b>Deductions</b>
                  </span>
                </div>

                {challanData?.deductions?.map((item, index) => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 5,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        marginBottom: 5,
                        width: 100,
                      }}
                    >
                      <b>{item.allowanceLabel}</b>
                    </span>
                    <span
                      style={{
                        marginLeft: 40,
                        fontSize: 14,
                      }}
                    ></span>
                    <span
                      style={{
                        width: 85,
                        textAlign: "end",
                        fontSize: 14,
                      }}
                    >
                      Rs. {item.amount || 0}
                    </span>
                  </div>
                ))}

                {/* 
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <span
            style={{
              fontSize: 14,
              marginBottom: 5,
              width: 100,
            }}
          >
            <b>LWP days</b>
          </span>
          <span
            style={{
              marginLeft: 40,
              fontSize: 14,
            }}
          >
            Rs.
          </span>
          <span
            style={{
              width: 85,
              textAlign: "end",
              fontSize: 14,
            }}
          >
            {challanData.deductions[1].amount || 0}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <span
            style={{
              fontSize: 14,
              marginBottom: 5,
              width: 100,
            }}
          >
            <b>EOBI</b>
          </span>
          <span
            style={{
              marginLeft: 40,
              fontSize: 14,
            }}
          >
            Rs.
          </span>
          <span
            style={{
              width: 85,
              textAlign: "end",
              fontSize: 14,
            }}
          >
            {challanData.deductions[3].amount || "370"}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <span
            style={{
              fontSize: 14,
              marginBottom: 5,
              width: 100,
            }}
          >
            <b>Income Tax</b>
          </span>
          <span
            style={{
              marginLeft: 40,
              fontSize: 14,
            }}
          >
            Rs.
          </span>
          <span
            style={{
              width: 85,
              textAlign: "end",
              fontSize: 14,
            }}
          >
            {data.tuitionFee || "140,000"}
          </span>
        </div> */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 5,
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      marginBottom: 5,
                      width: 100,
                    }}
                  >
                    <b>Net Salary</b>
                  </span>
                  <span
                    style={{
                      marginLeft: 40,
                      fontSize: 14,
                    }}
                  ></span>
                  <span
                    style={{
                      width: 85,
                      textAlign: "end",
                      fontSize: 14,
                    }}
                  >
                    Rs. {data.tuitionFee || "489,630"}
                  </span>
                </div>

                {/* <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 5,
      }}
    >
      <span
        style={{
          fontSize: 14,
          marginBottom: 3,
          width: 100,
        }}
      >
        <b>Security</b>
      </span>
      <span
        style={{
          marginLeft: 40,
          fontSize: 14,
        }}
      >
        Rs.
      </span>
      <span
        style={{
          width: 85,
          textAlign: "end",
          fontSize: 14,
        }}
      >
        {data.securityFee || ""}
      </span>
    </div>

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 5,
      }}
    >
      <span
        style={{
          fontSize: 14,
          marginBottom: 5,
          width: 100,
        }}
      >
        <b>Admission Fee</b>
      </span>
      <span
        style={{
          marginLeft: 40,
          fontSize: 14,
        }}
      >
        Rs.
      </span>
      <span
        style={{
          width: 85,
          textAlign: "end",
          fontSize: 14,
        }}
      >
        {data.admFee || ""}
      </span>
    </div>

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 5,
      }}
    >
      <span
        style={{
          fontSize: 14,
          marginBottom: 3,
          width: 140,
        }}
      >
        <b>Advance Income Tax</b>
      </span>
      <span
        style={{
          fontSize: 14,
        }}
      >
        Rs.
      </span>
      <span
        style={{
          width: 85,
          textAlign: "end",
          fontSize: 14,
        }}
      >
        {data.advanceIncomeTax || ""}
      </span>
    </div>

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 5,
      }}
    >
      <span
        style={{
          fontSize: 14,
          marginBottom: 3,
          width: 100,
        }}
      >
        <b>Annual Charges</b>
      </span>
      <span
        style={{
          marginLeft: 40,
          fontSize: 14,
        }}
      >
        Rs.
      </span>
      <span
        style={{
          width: 85,
          textAlign: "end",
          fontSize: 14,
        }}
      >
        {data.oneTimeFee || ""}
      </span>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 5,
      }}
    >
      <span
        style={{
          fontSize: 14,
          marginBottom: 3,
          width: 100,
        }}
      >
        <b>Other Fee</b>
      </span>
      <span
        style={{
          marginLeft: 40,
          fontSize: 14,
        }}
      >
        Rs.
      </span>
      <span
        style={{
          width: 85,
          textAlign: "end",
          fontSize: 14,
        }}
      >
        {data.otherFee || ""}
      </span>
    </div> */}
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  padding: 5,
                  border: "1px solid",
                  flexDirection: "column",
                  marginBottom: 4,
                  height: "10vh",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                    borderBottom: "1px solid",
                    marginBottom: 5,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      marginTop: "55px",
                    }}
                  >
                    <b>U.C.L (PVT)</b>
                  </span>
                  {/* <span
        style={{
          fontSize: 14,
        }}
      >
        <b>{data.dueDate || ""}</b>
      </span> */}
                </div>
                {/* <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "1px solid",
        marginBottom: 5,
      }}
    >
      <span
        style={{
          fontSize: 11,
          marginBottom: 3,
        }}
      >
        <b>Payable by the last date of payment</b>
      </span>
      <span
        style={{
          fontSize: 12,
        }}
      >
        <b>{`Rs. ${data.totalAmount || ""}`}</b>
      </span>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "1px solid",
        marginBottom: 5,
      }}
    >
      <span
        style={{
          fontSize: 11,
          marginBottom: 3,
        }}
      >
        <b>Bank last date of payment with fine </b>
      </span>
      <span
        style={{
          fontSize: 12,
        }}
      >
        <b>{``}</b>
      </span>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 5,
      }}
    >
      <span
        style={{
          fontSize: 11,
          marginBottom: 3,
        }}
      >
        <b>Payable with fine</b>
      </span>
      <span
        style={{
          fontSize: 12,
        }}
      >
        <b>{`Rs. ${data.totalAmountAfterDueDate || ""}`}</b>
      </span>
    </div> */}
              </div>

              {/* <div
    style={{
      width: "100%",
      display: "flex",
      padding: 5,
      border: "1px solid",
      flexDirection: "column",
      marginBottom: 4,
    }}
  >
    <span
      style={{
        width: 250,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      Fees paid by cheque payable to UCL (PVT) LTD are received by UCL
      Accounts Office. Fees paid in cash are ONLY received by ANY BRANCH
      of Faysal Bank A/C # 0334000524754039
    </span>
  </div> */}
              {/* <span
    style={{
      fontSize: 10,
      fontWeight: 700,
      textAlign: "center",
    }}
  >
    See overleaf / Fee Structure for further information
  </span> */}
              <div
                style={{
                  display: "block",
                  float: "right",
                  marginLeft: "82%",
                  marginTop: "2%",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: "600",
                    width: 200,
                    textAlign: "left",
                    float: "right",
                  }}
                >
                  <b> Issuing Authority: </b>
                </span>
                <br />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: "600",
                    width: 180,
                    textAlign: "left",
                    float: "right",
                  }}
                >
                  <b>Accounts Department</b>
                  <br />
                  <b>This is a system generated report</b>
                  <br />
                  <b>No signature required</b>
                </span>
              </div>
            </div>
          </Fragment>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            fontFamily: "inherit",
            marginTop: 50,
          }}
        >
          <Fragment>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p style={{}}>
                Salary slip is currently not available for this employee for the
                selected month and session.
              </p>
            </div>
          </Fragment>
        </div>
      )}
    </Fragment>
  );
};

F331EmployeeMonthlySallaryChallanView.propTypes = {
  feeCard: PropTypes.string,
  data: PropTypes.object,
};

F331EmployeeMonthlySallaryChallanView.defaultProps = {
  feeCard: "to UCL",
  data: {},
};

export default F331EmployeeMonthlySallaryChallanView;
