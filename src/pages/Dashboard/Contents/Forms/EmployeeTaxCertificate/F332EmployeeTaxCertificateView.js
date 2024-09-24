// import React, { Fragment, useEffect, useRef, useState } from "react";
// import Logo from "../../../../../assets/Images/logo.png";
// import PropTypes from "prop-types";

// import CircularProgress from "@material-ui/core/CircularProgress";
// import ReactToPrint from "react-to-print";
// import { Button } from "@material-ui/core";
// import PrintIcon from "@material-ui/icons/Print";
// import { useParams } from "react-router-dom/cjs/react-router-dom";
// const F332EmployeeTaxF332EmployeeTaxCertificateViewView = (props) => {
//   const { data, feeCard } = props;
//   const [challanData, setChallanData] = useState({});
//   const componentRef = useRef(null);
//   const { id } = useParams();
//   const [isLoading, setLoading] = useState(false);
//   useEffect(() => {
//     const sessionId = id.split("T")[0];
//     const monthId = id.split("T")[1];
//     const employeeObject = id.split("T")[2];

//     if (sessionId && monthId && employeeObject) {
//       getData(sessionId, monthId, employeeObject);
//     }
//   }, []);
//   const getData = async (sessionId, monthId, employeeObject) => {
//     setLoading(true);
//     const formData = new FormData();
//     formData.append("sessionId", sessionId);
//     formData.append("monthId", monthId);
//     formData.append("employeeId", employeeObject);

//     let url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C331CommonEmployeesMonthlyPayrollVoucherView`;
//     await fetch(url, {
//       method: "POST",
//       body: formData,
//       headers: new Headers({
//         Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
//       }),
//     })
//       .then((res) => {
//         if (!res.ok) {
//           throw res;
//         }
//         return res.json();
//       })
//       .then((json) => {
//         if (json.CODE === 1) {
//           console.log(json.DATA);
//           setChallanData(json.DATA[0]);
//         } else {
//           alert(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE);
//         }
//       })
//       .catch((error) => {
//         if (error.status == 401) {
//           // this.setState({
//           //   isLoginMenu: true,
//           //   isReload: true,
//           // });
//         } else {
//           alert("Operation Failed, Please try again later.");
//         }
//         console.log(error);
//       });
//     setLoading(false);
//   };

//   return (
//     <Fragment>
//       <ReactToPrint
//         trigger={() => {
//           return (
//             <Button
//               style={{
//                 float: "right",
//                 marginTop: 10,
//                 marginRight: 20,
//                 textTransform: "capitalize",
//                 opacity: 0.8,
//               }}
//               color="primary"
//               variant="contained"
//             >
//               <PrintIcon style={{ paddingRight: 5 }} /> Print
//             </Button>
//           );
//         }}
//         content={() => componentRef.current}
//         pageStyle="@page { size: landscape; margin: 0mm;}"
//       />

//       {challanData ? (
//         <div
//           ref={componentRef}
//           style={{
//             display: "flex",
//             justifyContent: "space-around",
//             fontFamily: "inherit",
//             marginTop: 50,
//           }}
//         >
//           <Fragment>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                 }}
//               >
//                 <img alt="" src={Logo} width={50} height={50} />
//                 <div
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     marginLeft: 10,
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontSize: 14,
//                       fontWeight: "bolder",
//                       fontFamily: "sans-serif",
//                       letterSpacing: 1,
//                       marginBottom: 3,
//                     }}
//                   >
//                     Universal College Lahore
//                   </span>
//                   <span
//                     style={{
//                       fontSize: 14,
//                       fontWeight: "bolder",
//                       marginBottom: 3,
//                     }}
//                   >
//                     A project of UCL (Pvt) Ltd
//                   </span>
//                   <span
//                     style={{
//                       fontSize: 14,
//                       marginBottom: 3,
//                     }}
//                   >
//                     <b>Salary Slip:</b> {"   "} <b>{"August 2024" || ""}</b>
//                   </span>
//                 </div>
//               </div>
//               {/* <div
//     style={{
//       marginBottom: 5,
//       marginLeft: 60,
//     }}
//   >
//     <span
//       style={{
//         fontSize: 14,
//       }}
//     >
//       <b>Campus Code:</b> {"UCL"}
//     </span>
//   </div> */}

//               {/* <div
//     style={{
//       width: "100%",
//       display: "flex",
//       padding: 5,
//       border: "1px solid",
//       flexDirection: "column",
//       marginBottom: 4,
//     }}
//   >
//     <div
//       style={{
//         display: "flex",
//       }}
//     >
//       <span
//         style={{
//           fontSize: 14,
//           marginBottom: 3,
//           marginRight: 15,
//         }}
//       >
//         <b>Academic Session:</b> {data.session || ""}
//       </span>
//       <span
//         style={{
//           fontSize: 14,
//           marginBottom: 3,
//         }}
//       >
//         <b>Bill No:</b> {data.billNo || ""}
//       </span>
//     </div>
//     <div
//       style={{
//         display: "flex",
//       }}
//     >
//       <span
//         style={{
//           fontSize: 14,
//           marginBottom: 3,
//           marginRight: 15,
//         }}
//       >
//         <b>Fee Installment:</b>
//       </span>
//       <span
//         style={{
//           fontSize: 14,
//         }}
//       >
//         {data.installment || ""}
//       </span>
//     </div>
//   </div> */}

//               <div
//                 style={{
//                   width: "100%",
//                   display: "flex",
//                   padding: 5,
//                   border: "1px solid",
//                   flexDirection: "column",
//                   marginBottom: 4,
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontSize: 14,
//                       marginBottom: 3,
//                       width: 130,
//                     }}
//                   >
//                     <b>ID</b>
//                   </span>
//                   <span
//                     style={{
//                       fontSize: 14,
//                     }}
//                   >
//                     {challanData.employeeId || ""}
//                   </span>
//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontSize: 14,
//                       marginBottom: 3,
//                       width: 130,
//                     }}
//                   >
//                     <b>Name: </b>
//                   </span>
//                   <span
//                     style={{
//                       fontSize: 14,
//                     }}
//                   >
//                     {`${challanData.employeeLabel || ""}`}
//                   </span>
//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                   }}
//                 >
//                   {/* <span
//         style={{
//           fontSize: 14,
//           marginBottom: 3,
//           width: 130,
//         }}
//       >
//         <b>Class-Section</b>
//       </span> */}
//                   <span
//                     style={{
//                       fontSize: 14,
//                     }}
//                   >
//                     {data.studentClass || ""}
//                   </span>
//                 </div>
//               </div>

//               <div
//                 style={{
//                   width: "100%",
//                   display: "flex",
//                   padding: 5,
//                   border: "1px solid",
//                   flexDirection: "column",
//                   marginBottom: 4,
//                   height: "63vh",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     marginBottom: 5,
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontSize: 14,
//                       marginBottom: 5,
//                       width: 100,
//                     }}
//                   >
//                     <b>Salary</b>
//                   </span>
//                   <span
//                     style={{
//                       marginLeft: 40,
//                       fontSize: 14,
//                     }}
//                   >
//                     Rs.
//                   </span>
//                   <span
//                     style={{
//                       width: 85,
//                       textAlign: "end",
//                       fontSize: 14,
//                     }}
//                   >
//                     {challanData.perMonthSalary || 0}
//                   </span>
//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     marginBottom: 5,
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontSize: 14,
//                       marginBottom: 5,
//                       width: 100,
//                     }}
//                   >
//                     <b>LE days</b>
//                   </span>
//                   <span
//                     style={{
//                       marginLeft: 40,
//                       fontSize: 14,
//                     }}
//                   ></span>
//                   <span
//                     style={{
//                       width: 85,
//                       textAlign: "end",
//                       fontSize: 14,
//                     }}
//                   >
//                     {challanData.leaveInCashDays || 0}
//                   </span>
//                 </div>

//                 {challanData?.allowances?.map((item, index) => {
//                   console.log(item);

//                   return (
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         marginBottom: 5,
//                       }}
//                     >
//                       <span
//                         style={{
//                           fontSize: 14,
//                           marginBottom: 5,
//                           width: 100,
//                         }}
//                       >
//                         <b>{item?.allowanceLabel}</b>
//                       </span>
//                       <span
//                         style={{
//                           marginLeft: 40,
//                           fontSize: 14,
//                         }}
//                       >
//                         Rs.
//                       </span>
//                       <span
//                         style={{
//                           width: 85,
//                           textAlign: "end",
//                           fontSize: 14,
//                         }}
//                       >
//                         {item.amount || 0}
//                       </span>
//                     </div>
//                   );
//                 })}
//                 {/* <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             marginBottom: 5,
//           }}
//         >
//           <span
//             style={{
//               fontSize: 14,
//               marginBottom: 5,
//               width: 100,
//             }}
//           >
//             <b>C. Allowance</b>
//           </span>
//           <span
//             style={{
//               marginLeft: 40,
//               fontSize: 14,
//             }}
//           >
//             Rs.
//           </span>
//           <span
//             style={{
//               width: 85,
//               textAlign: "end",
//               fontSize: 14,
//             }}
//           >
//             {challanData.allowances[0].amount || 0}
//           </span>
//         </div> */}
//                 {/* <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             marginBottom: 5,
//           }}
//         >
//           <span
//             style={{
//               fontSize: 14,
//               marginBottom: 5,
//               width: 100,
//             }}
//           >
//             <b>HM Allowance</b>
//           </span>
//           <span
//             style={{
//               marginLeft: 40,
//               fontSize: 14,
//             }}
//           >
//             Rs.
//           </span>
//           <span
//             style={{
//               width: 85,
//               textAlign: "end",
//               fontSize: 14,
//             }}
//           >
//             {challanData.allowances[1].amount || 0}
//           </span>
//         </div>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             marginBottom: 5,
//           }}
//         >
//           <span
//             style={{
//               fontSize: 14,
//               marginBottom: 5,
//               width: 100,
//             }}
//           >
//             <b>Clubs</b>
//           </span>
//           <span
//             style={{
//               marginLeft: 40,
//               fontSize: 14,
//             }}
//           >
//             Rs.
//           </span>
//           <span
//             style={{
//               width: 85,
//               textAlign: "end",
//               fontSize: 14,
//             }}
//           >
//             {challanData.allowances[2].amount || 0}
//           </span>
//         </div>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             marginBottom: 5,
//           }}
//         >
//           <span
//             style={{
//               fontSize: 14,
//               marginBottom: 5,
//               width: 100,
//             }}
//           >
//             <b>Other</b>
//           </span>
//           <span
//             style={{
//               marginLeft: 40,
//               fontSize: 14,
//             }}
//           >
//             Rs.
//           </span>
//           <span
//             style={{
//               width: 85,
//               textAlign: "end",
//               fontSize: 14,
//             }}
//           >
//             {challanData.allowances[3].amount || 0}
//           </span>
//         </div> */}

//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     marginBottom: 5,
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontSize: 16,
//                       marginBottom: 5,
//                       width: 100,
//                     }}
//                   >
//                     <b>Gross Sallary</b>
//                   </span>
//                   <span
//                     style={{
//                       marginLeft: 40,
//                       fontSize: 14,
//                     }}
//                   >
//                     Rs.
//                   </span>
//                   <span
//                     style={{
//                       width: 85,
//                       textAlign: "end",
//                       fontSize: 14,
//                     }}
//                   >
//                     {challanData.grossSalary || 0}
//                   </span>
//                 </div>

//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     marginBottom: 5,
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontSize: 18,
//                       marginBottom: 5,
//                       width: 100,
//                     }}
//                   >
//                     <b>Deductions</b>
//                   </span>
//                 </div>

//                 {challanData?.deductions?.map((item, index) => (
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       marginBottom: 5,
//                     }}
//                   >
//                     <span
//                       style={{
//                         fontSize: 14,
//                         marginBottom: 5,
//                         width: 100,
//                       }}
//                     >
//                       <b>{item.allowanceLabel}</b>
//                     </span>
//                     <span
//                       style={{
//                         marginLeft: 40,
//                         fontSize: 14,
//                       }}
//                     >
//                       Rs.
//                     </span>
//                     <span
//                       style={{
//                         width: 85,
//                         textAlign: "end",
//                         fontSize: 14,
//                       }}
//                     >
//                       {item.amount || 0}
//                     </span>
//                   </div>
//                 ))}

//                 {/*
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             marginBottom: 5,
//           }}
//         >
//           <span
//             style={{
//               fontSize: 14,
//               marginBottom: 5,
//               width: 100,
//             }}
//           >
//             <b>LWP days</b>
//           </span>
//           <span
//             style={{
//               marginLeft: 40,
//               fontSize: 14,
//             }}
//           >
//             Rs.
//           </span>
//           <span
//             style={{
//               width: 85,
//               textAlign: "end",
//               fontSize: 14,
//             }}
//           >
//             {challanData.deductions[1].amount || 0}
//           </span>
//         </div>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             marginBottom: 5,
//           }}
//         >
//           <span
//             style={{
//               fontSize: 14,
//               marginBottom: 5,
//               width: 100,
//             }}
//           >
//             <b>EOBI</b>
//           </span>
//           <span
//             style={{
//               marginLeft: 40,
//               fontSize: 14,
//             }}
//           >
//             Rs.
//           </span>
//           <span
//             style={{
//               width: 85,
//               textAlign: "end",
//               fontSize: 14,
//             }}
//           >
//             {challanData.deductions[3].amount || "370"}
//           </span>
//         </div>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             marginBottom: 5,
//           }}
//         >
//           <span
//             style={{
//               fontSize: 14,
//               marginBottom: 5,
//               width: 100,
//             }}
//           >
//             <b>Income Tax</b>
//           </span>
//           <span
//             style={{
//               marginLeft: 40,
//               fontSize: 14,
//             }}
//           >
//             Rs.
//           </span>
//           <span
//             style={{
//               width: 85,
//               textAlign: "end",
//               fontSize: 14,
//             }}
//           >
//             {data.tuitionFee || "140,000"}
//           </span>
//         </div> */}

//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     marginBottom: 5,
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontSize: 16,
//                       marginBottom: 5,
//                       width: 100,
//                     }}
//                   >
//                     <b>Net Salary</b>
//                   </span>
//                   <span
//                     style={{
//                       marginLeft: 40,
//                       fontSize: 14,
//                     }}
//                   >
//                     Rs.
//                   </span>
//                   <span
//                     style={{
//                       width: 85,
//                       textAlign: "end",
//                       fontSize: 14,
//                     }}
//                   >
//                     {data.tuitionFee || "489,630"}
//                   </span>
//                 </div>

//                 {/* <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         marginBottom: 5,
//       }}
//     >
//       <span
//         style={{
//           fontSize: 14,
//           marginBottom: 3,
//           width: 100,
//         }}
//       >
//         <b>Security</b>
//       </span>
//       <span
//         style={{
//           marginLeft: 40,
//           fontSize: 14,
//         }}
//       >
//         Rs.
//       </span>
//       <span
//         style={{
//           width: 85,
//           textAlign: "end",
//           fontSize: 14,
//         }}
//       >
//         {data.securityFee || ""}
//       </span>
//     </div>

//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         marginBottom: 5,
//       }}
//     >
//       <span
//         style={{
//           fontSize: 14,
//           marginBottom: 5,
//           width: 100,
//         }}
//       >
//         <b>Admission Fee</b>
//       </span>
//       <span
//         style={{
//           marginLeft: 40,
//           fontSize: 14,
//         }}
//       >
//         Rs.
//       </span>
//       <span
//         style={{
//           width: 85,
//           textAlign: "end",
//           fontSize: 14,
//         }}
//       >
//         {data.admFee || ""}
//       </span>
//     </div>

//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         marginBottom: 5,
//       }}
//     >
//       <span
//         style={{
//           fontSize: 14,
//           marginBottom: 3,
//           width: 140,
//         }}
//       >
//         <b>Advance Income Tax</b>
//       </span>
//       <span
//         style={{
//           fontSize: 14,
//         }}
//       >
//         Rs.
//       </span>
//       <span
//         style={{
//           width: 85,
//           textAlign: "end",
//           fontSize: 14,
//         }}
//       >
//         {data.advanceIncomeTax || ""}
//       </span>
//     </div>

//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         marginBottom: 5,
//       }}
//     >
//       <span
//         style={{
//           fontSize: 14,
//           marginBottom: 3,
//           width: 100,
//         }}
//       >
//         <b>Annual Charges</b>
//       </span>
//       <span
//         style={{
//           marginLeft: 40,
//           fontSize: 14,
//         }}
//       >
//         Rs.
//       </span>
//       <span
//         style={{
//           width: 85,
//           textAlign: "end",
//           fontSize: 14,
//         }}
//       >
//         {data.oneTimeFee || ""}
//       </span>
//     </div>
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         marginBottom: 5,
//       }}
//     >
//       <span
//         style={{
//           fontSize: 14,
//           marginBottom: 3,
//           width: 100,
//         }}
//       >
//         <b>Other Fee</b>
//       </span>
//       <span
//         style={{
//           marginLeft: 40,
//           fontSize: 14,
//         }}
//       >
//         Rs.
//       </span>
//       <span
//         style={{
//           width: 85,
//           textAlign: "end",
//           fontSize: 14,
//         }}
//       >
//         {data.otherFee || ""}
//       </span>
//     </div> */}
//               </div>

//               <div
//                 style={{
//                   width: "100%",
//                   display: "flex",
//                   padding: 5,
//                   border: "1px solid",
//                   flexDirection: "column",
//                   marginBottom: 4,
//                   height: "10vh",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "flex-end",
//                     justifyContent: "flex-end",
//                     borderBottom: "1px solid",
//                     marginBottom: 5,
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontSize: 14,
//                       marginTop: "55px",
//                     }}
//                   >
//                     <b>U.C.L (PVT)</b>
//                   </span>
//                   {/* <span
//         style={{
//           fontSize: 14,
//         }}
//       >
//         <b>{data.dueDate || ""}</b>
//       </span> */}
//                 </div>
//                 {/* <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         borderBottom: "1px solid",
//         marginBottom: 5,
//       }}
//     >
//       <span
//         style={{
//           fontSize: 11,
//           marginBottom: 3,
//         }}
//       >
//         <b>Payable by the last date of payment</b>
//       </span>
//       <span
//         style={{
//           fontSize: 12,
//         }}
//       >
//         <b>{`Rs. ${data.totalAmount || ""}`}</b>
//       </span>
//     </div>
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         borderBottom: "1px solid",
//         marginBottom: 5,
//       }}
//     >
//       <span
//         style={{
//           fontSize: 11,
//           marginBottom: 3,
//         }}
//       >
//         <b>Bank last date of payment with fine </b>
//       </span>
//       <span
//         style={{
//           fontSize: 12,
//         }}
//       >
//         <b>{``}</b>
//       </span>
//     </div>
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         marginBottom: 5,
//       }}
//     >
//       <span
//         style={{
//           fontSize: 11,
//           marginBottom: 3,
//         }}
//       >
//         <b>Payable with fine</b>
//       </span>
//       <span
//         style={{
//           fontSize: 12,
//         }}
//       >
//         <b>{`Rs. ${data.totalAmountAfterDueDate || ""}`}</b>
//       </span>
//     </div> */}
//               </div>

//               {/* <div
//     style={{
//       width: "100%",
//       display: "flex",
//       padding: 5,
//       border: "1px solid",
//       flexDirection: "column",
//       marginBottom: 4,
//     }}
//   >
//     <span
//       style={{
//         width: 250,
//         fontSize: 12,
//         fontWeight: 700,
//       }}
//     >
//       Fees paid by cheque payable to UCL (PVT) LTD are received by UCL
//       Accounts Office. Fees paid in cash are ONLY received by ANY BRANCH
//       of Faysal Bank A/C # 0334000524754039
//     </span>
//   </div> */}
//               {/* <span
//     style={{
//       fontSize: 10,
//       fontWeight: 700,
//       textAlign: "center",
//     }}
//   >
//     See overleaf / Fee Structure for further information
//   </span> */}
//             </div>
//           </Fragment>
//         </div>
//       ) : (
//         ""
//       )}
//     </Fragment>
//   );
// };

// F332EmployeeTaxF332EmployeeTaxCertificateViewView.propTypes = {
//   feeCard: PropTypes.string,
//   data: PropTypes.object,
// };

// F332EmployeeTaxF332EmployeeTaxCertificateViewView.defaultProps = {
//   feeCard: "to UCL",
//   data: {},
// };

// export default F332EmployeeTaxF332EmployeeTaxCertificateViewView;

import React from "react";

const F332EmployeeTaxCertificateView = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>TO WHOM IT MAY CONCERN</h2>
      <p style={styles.paragraph}>
        This is to certify that a sum of <strong>Rs. 8,139,600/-</strong> has
        been paid to
        <strong> MR. ABC</strong> on account of salary for the financial year
        ended on
        <strong> 30.06.2024</strong>, and <strong>Rs. 1,585,200/-</strong> has
        been deducted and duly deposited as income tax. Breakup of the salary is
        given below:
      </p>

      <table style={styles.table}>
        <tbody>
          <tr>
            <td style={styles.leftCell}>Amount on which Deducted</td>
            <td style={styles.rightCell}>7,399,638</td>
          </tr>
          <tr>
            <td style={styles.leftCell}>Exemption (Medical Allowance)</td>
            <td style={styles.rightCell}>739,962</td>
          </tr>
          <tr>
            <td style={styles.leftCell}>
              <strong>Gross Salary</strong>
            </td>
            <td style={styles.rightCell}>
              <strong>8,139,600</strong>
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
