import { keys } from "./config";

const LOCAL = "LOCAL";
const DEV = "DEV";
const STAGE = "STAGE";
const PROD = "PROD";

let IP = "127.0.0.1";

export const configValue = (_target, _env) => {
  let result;
  switch (_target) {
    case keys.SERVER_POINT:
      if (_env === LOCAL) result = `http://${IP}:5500/api/`;
      if (_env === DEV) result = `http://${IP}:5500/api/`;
      if (_env === STAGE) result = `https://sample/api/`;
      if (_env === PROD) result = `https://sample/api/`;
      break;
    default:
  }
  return result;
};

export default configValue;
