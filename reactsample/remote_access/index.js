import axios from "axios";
import { FORM_ERROR } from "final-form";
import {
  generateAndRemoveNotification,
  isLoading
} from "../store/actionCreators";
import { getToken } from "../store/utils";

export const SERVER_URL = "localhost:9000";
// export const SERVER_URL = "wp.whyunified.com";

const protocol = window.location.protocol.split(":")[0];

const LOCAL_BASE_URL = `${protocol}://${SERVER_URL}/`;
export const RELATIVE_BASE_URL = `${protocol}://${SERVER_URL}`;

export const BASE_URL = LOCAL_BASE_URL;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  DELETED: 204,
  BAD: 400,
  FORBIDDEN: 401,
  UNAUTHORIZED: 403,
  IAMATEAPOT: 418,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

export async function APICaller({ method, url, data, config }) {
  const TOKEN = getToken();
  isLoading(true);
  config = config || {};
  data = data || {};
  config = {
    ...config,
    headers: {
      Authorization: TOKEN ? "JWT " + TOKEN : "",
      ...config.headers
    }
  };

  if (data instanceof FormData) {
    // we specifically use formdata when handling forms with file
    config["headers"]["Content-Type"] = "multipart/form-data";
  }

  let status;
  try {
    const { data: result, status } = await axios({
      method: method,
      url: url,
      data: data,
      validateStatus: function(status) {
        return status >= 200 && status <= 400;
      },
      ...config
    });

    isLoading(false);
    if (status === HTTP_STATUS.OK) {
      console.log("OK");
      return { ok: true, result: result };
    } else if (status === HTTP_STATUS.CREATED) {
      generateAndRemoveNotification(HTTP_STATUS.CREATED);
      return { ok: true, result: result };
    } else if (status === HTTP_STATUS.DELETED) {
      generateAndRemoveNotification(HTTP_STATUS.DELETED);
      return { ok: true, result: undefined };
    } else if (status === HTTP_STATUS.BAD) {
      if (typeof result === "string") {
        generateAndRemoveNotification(HTTP_STATUS.BAD, result);
        return { result: result };
      }
      let _result = { ...result };
      function replaceNonFieldError(o) {
        // works only at top-level
        // todo for nested(and also array level) non_field_errors
        Object.keys(o).forEach(function(k) {
          // if (typeof o[k] === "object") {
          //   replaceNonFieldError(o[k]);
          // }
          if (k === "non_field_errors") {
            _result[[FORM_ERROR]] = o[k];
            _result["errors"] = o[k];
          } else {
            _result[k] = o[k];
          }
        });
      }
      replaceNonFieldError(result);

      generateAndRemoveNotification(HTTP_STATUS.BAD);
      return _result;
      // return { [FORM_ERROR]: "Login Failed" };
    }
  } catch (e) {
    isLoading(false);

    if (e && e.response && e.response.status) {
      status = e.response.status;
      // console.log("rejected", e.response.status);
      if (status === HTTP_STATUS.SERVER_ERROR) {
        console.log("Server Error");
        generateAndRemoveNotification(HTTP_STATUS.SERVER_ERROR);
        return {};
        // Something grave occured. Our monkeys are on their way to patch things up!!!
      } else if (status === HTTP_STATUS.NOT_FOUND) {
        console.log("Object Not Found");
        generateAndRemoveNotification(HTTP_STATUS.NOT_FOUND);
        // You do not have authority to perform the action.
        return { status: HTTP_STATUS.NOT_FOUND };
      } else if (status === HTTP_STATUS.UNAUTHORIZED) {
        generateAndRemoveNotification(HTTP_STATUS.UNAUTHORIZED);
        // You do not have authority to perform the action.
        return {};
      } else if (status === HTTP_STATUS.FORBIDDEN) {
        generateAndRemoveNotification(HTTP_STATUS.FORBIDDEN);
        // You do not have authority to perform the action.
        return {};
      }
    } else {
      console.log("Server is down.");
      generateAndRemoveNotification(HTTP_STATUS.SERVICE_UNAVAILABLE);
      return {};
    }
  }

  return { [FORM_ERROR]: `Unhandled!!! FIX ME ${status}` };
}

export const objToQueryString = obj => {
  const keyValuePairs = [];
  for (const key in obj) {
    if (obj[key]) {
      keyValuePairs.push(
        encodeURIComponent(key) + "=" + encodeURIComponent(obj[key])
      );
    }
  }
  keyValuePairs.push(
    encodeURIComponent("page_size") + "=" + encodeURIComponent(obj["pageSize"])
  );
  return keyValuePairs.join("&");
};
