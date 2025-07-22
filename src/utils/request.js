import { getHeaders } from "./helper";

export let Request = async (
  method = "GET",
  url = "",
  data = {},
  headerVariant = ""
) => {
  let response = {};
  let config = {
    method: method,
    headers: getHeaders(headerVariant),
  };
  if (data != null) {
    config.body = data;
  }
  await fetch(url, config)
    .then((res) => {
      if (!res.ok) {
        throw res;
      }
      return res.json();
    })
    .then((result) => {
      if (result.success === 1) {
        response = {
          statusCode: result.success,
          isSuccess: true,
          message: "something",
          data: result || [],
        };
      } else {
        if (result.CODE === 1) {
          response = {
            statusCode: result.CODE,
            isSuccess: true,
            message: result.SYSTEM_MESSAGE + "\n" + result.USER_MESSAGE,
            data: result.DATA || [],
          };
        } else {
          response = {
            statusCode: result.CODE || result.success,
            isSuccess: false,
            message: result.SYSTEM_MESSAGE + "\n" + result.USER_MESSAGE,
            data: null,
          };
        }
      }
    })
    .catch((error) => {
      if (error.status == 401) {
        response = {
          statusCode: error.status,
          isSuccess: false,
          message: "Invalid/Expired token, Please login again to continue",
          data: [],
        };
      } else {
        response = {
          statusCode: error.status,
          isSuccess: false,
          message: "An error occured: " + error.status,
          data: [],
        };
      }
    });
  return response;
};

export let RequestFileDownload = async (
  method = "GET",
  url = "",
  headerVariant = ""
) => {
  let response = {};
  await fetch(url, {
    method: method,
    headers: getHeaders(headerVariant),
  })
    .then((res) => {
      if (!res.ok) {
        throw res;
      }
      return res.blob();
    })
    .then((result) => {
      response = {
        statusCode: 200,
        isSuccess: true,
        message: "file Received",
        data: result || [],
      };
    })
    .catch((error) => {
      if (error.status == 401) {
        response = {
          statusCode: error.status,
          isSuccess: false,
          message: "Invalid/Expired token, Please login again to continue",
          data: [],
        };
      } else {
        response = {
          statusCode: error.status,
          isSuccess: false,
          message: "An error occured: " + error.status,
          data: [],
        };
      }
    });
  return response;
};