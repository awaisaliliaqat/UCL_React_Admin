/* eslint-disable react/no-unescaped-entities */
import React, { Fragment } from 'react';

export const IsEmpty = (obj) => {
    if (obj == null) return true;
  
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;
  
    if (typeof obj !== "object") return true;
  
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) return false;
    }
  
    return true;
  };

export const getHeaders = (type = "") => {
    const jwtToken = localStorage.getItem("uclAdminToken") || "";
    switch (type) {
      case "publicJson":
        return new Headers({
          "Content-Type": "application/json",
        });
      case "publicMultipart":
        return new Headers({
          "Content-Type": "multipart/formdata",
        });
      case "authorizeMultipart":
        return new Headers({
          Authorization: "Bearer " + jwtToken,
          "Content-Type": "multipart/formdata",
        });
      case "authorizeJson":
        return new Headers({
          Authorization: "Bearer " + jwtToken,
          "Content-Type": "application/json",
        });
      case "authorize":
        return new Headers({
          Authorization: "Bearer " + jwtToken,
        });
      default:
        return new Headers({});
    }
  };

export default function GetRequirementsDetails(num) {
    switch (num) {
        case 1:
            return <Fragment><p>To be eligible for the BSc degrees, an applicant must:<br /> </p>
                <ul>
                    <li>normally be at least 17 years old <strong>AND</strong></li>
                    <li>have GCSE/GCE 'O' level in Mathematics and English Language with at least grade C or equivalent <strong>AND</strong></li>
                    <li>have two subjects at GCE 'A' Level, plus at least three further subjects at GCSE/GCE 'O' level (at not less than grade C) <strong>OR</strong></li>
                    <li>three subjects at GCE 'A' level (with one 'A' level at not less than grade D) <strong>OR</strong></li>
                    <li>three subjects at GCE 'A' level, plus one further subject at GCSE/GCE 'O' level (at not less than grade C) <strong>OR</strong></li>
                    <li>two subjects at GCE 'A' level, plus two further subjects at GCE 'AS' level <strong>OR</strong></li>
                    <li>BA/BSc/BCom from any recognised university of Pakistan <strong>OR</strong></li>
                    <li>High School Diploma plus two APs (excluding Studio Art) with grade 3, 4, or 5</li>
                </ul>
            </Fragment>

        case 2:
            return <Fragment><p>To be eligible for the BSc Business Administration degree, an applicant must:</p>
                <ul>
                    <li>normally be at least 17 years old <strong>AND</strong></li>
                    <li>have GCSE/GCE 'O' level English Language at grade C or above or, within the last three years, to have passed at the required standard a test of proficiency in English that is recognized by the University of London.</li>
                    <li>have two subjects at GCE 'A' Level, plus at least three further subjects at GCSE/GCE 'O' level (at not less than grade C) <strong>OR</strong></li>
                    <li>three subjects at GCE 'A' level (with one 'A' level at not less than grade D) <strong>OR</strong></li>
                    <li>three subjects at GCE 'A' level, plus one further subject at GCSE/GCE 'O' level (at not less than grade C) <strong>OR</strong></li>
                    <li>two subjects at GCE 'A' level, plus two further subjects at GCE 'AS' level or<br /> BA/BSc/BCom from any recognised university of Pakistan <strong>OR</strong></li>
                    <li>High School Diploma plus two APs (excluding Studio Art) with grade 3, 4, or 5</li>
                </ul>
            </Fragment>
        case 3:
            return <Fragment><ul>
                <li>
                    <p>To be eligible for the LLB degree, an applicant must:</p>
                    <ul>
                        <li>normally be at least 17 years old <strong>AND</strong></li>
                        <li>must have access to the internet <strong>AND</strong></li>
                        <li>have GCSE/GCE 'O' level in English Language with at least grade C or equivalent <strong>AND</strong></li>
                        <li>have two subjects at GCE 'A' Level, plus at least three further subjects at GCSE/GCE 'O' level (at not less than grade C) <strong>OR</strong></li>
                        <li>three subjects at GCE 'A' level (with one 'A' level at not less than grade D) <strong>OR</strong></li>
                        <li>three subjects at GCE 'A' level, plus one further subject at GCSE/GCE 'O' level (at not less than grade C) <strong>OR</strong></li>
                        <li>two subjects at GCE 'A' level, plus two further subjects at GCE 'AS' level <strong>OR</strong></li>
                        <li>BA/BSc/BCom from any recognised university of Pakistan <strong>OR</strong></li>
                        <li>High School Diploma plus two APs (excluding Studio Art) with grade 3, 4, or 5</li>
                    </ul>
                </li>
            </ul>
            </Fragment>
        case 4:
            return <Fragment><ul>
                <li>6 UK GCSEs at grade A &ndash; C,&nbsp;<strong>including Mathematics and English Language</strong>. If English is not passed at grade A &ndash; C then applicants might be required to take an acceptable proficiency test (such as IELTS or TOEFL)&nbsp;<strong>OR</strong></li>
                <li>1 UK GCE A Level at grade A &ndash; E plus 4 UK GCSEs at grade A &ndash; C, one of these A or GCSEs must be in<strong>&nbsp;Mathematics and one must be in English Language</strong>. If English is not passed then applicants might be required to take an acceptable proficiency test (such as IELTS or TOEFL)&nbsp;<strong>OR</strong></li>
                <li>(Pakistan)&nbsp;Year 12 HSC: 6 subjects passed at 50% or above, including Mathematics. If Mathematics is not passed at Year 12 HSC (50%) then we can accept Mathematics at Year 10 SSC at 80% or above. Furthermore, you must upload evidence confirming their schooling was taught in medium of English, otherwise&nbsp;applicants might be required to take an acceptable proficiency test (such as IELTS or TOEFL)&nbsp;<strong>OR</strong>&nbsp;</li>
                <li>(Pakistan) Year 12 HSC: an overall average of 70% from all subjects taken, including Mathematics passed at 50% or above. If Mathematics is not passed at Year 12 HSC (50%) then we can accept Mathematics at Year 10 SSC at 80% or above. Furthermore, you must upload evidence confirming their schooling was taught in medium of English, otherwiseapplicants might be required to take an acceptable proficiency test (such as IELTS or TOEFL)</li>
            </ul>
            </Fragment>
        case 5:
            return <Fragment><ul>
                <li>
                    <p>To be eligible to register for the CertHE Common Law you must:</p>
                    <ul>
                        <li>be aged 18 or above by the 1st of November in the year of registration;</li>
                        <li>have done O-Level/Intermediate/High School Diploma/IB or equivalent;</li>
                        <li>pass the UoL entrance test and clear the interview with the Universal College Lahore Admissions Panel.</li>
                    </ul>
                </li>
            </ul>
            </Fragment>
        case 6:
            return <Fragment><ul>
                <li>
                    <p>In order to satisfy the entrance requirements you must:</p>
                    <ul>
                        <li>Normally be aged 17 or over before 31 December in the year of registration;</li>
                        <li>Have passed at least four separate subjects at GCSE or GCE O level, with grades A to C or the equivalent;<strong> OR </strong></li>
                        <li>Have passed at least four separate subjects in FA/FSc/I-Com with 50% or better marks; <strong>AND</strong></li>
                        <li>Provide proof of competence in English which is acceptable to the University. (A test of proficiency may be required - see below for more details) <strong>AND</strong></li>
                        <li>Have been admitted to a full or part-time course of instruction at an institution which is recognised to teach the International Foundation Programme.</li>
                    </ul>
                </li>
            </ul>
            </Fragment>
        case 7:
            return <Fragment><ul>
                <li>
                    <p>You will&nbsp;<em>usually</em>&nbsp;met the English language requirement for undergraduate programmes if you:</p>
                    <ul>
                        <li>hold a UK GCSE / GCE O level in English at grade C or above</li>
                        <li>have five years secondary schooling taught solely in English or have passed GCE A levels or IB in essay-based subjects</li>
                        <li>have passed an International Foundation programme that permits entry onto a recognised UK bachelor degree</li>
                    </ul>
                    <p>The following English language proficiency tests are considered acceptable evidence of proficiency in English for all undergraduate programmes provided they have been awarded within the past three years:</p>
                    <ul>
                        <li>(IELTS) International English Language Testing System when an overall score of at least 6 is achieved with a minimum of 5.5 in each sub-test.</li>
                        <li>Pearson Test of English (Academic) score 54 or above, with at least 54 in both Reading and Writing elements.</li>
                        <li>University of Cambridge Local Examinations Syndicate (UCLES) Business English Certificate Level 3 only (BEC 3 award).</li>
                        <li>Cambridge Certificate of Advanced English.</li>
                        <li>City &amp; Guilds International ESOL 8984 Mastery award.</li>
                    </ul>
                </li>
            </ul>
            </Fragment>
        default:
            return <Fragment><ul>
                <li>
                    <p>Sorry ! This Programme doesn't have any Infomation.</p>

                </li>
            </ul>
            </Fragment>
    }

}