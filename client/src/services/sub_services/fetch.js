import fetch from 'isomorphic-fetch';
import Swal from 'sweetalert2';
import ExceptionHandleService from 'utils/exceptionHandler';
import apiResponseHandler from './apiResponseHandler';
import localStorageUtil from 'utils/localStorageUtil';
import LocalStorageKeys from 'constants/localStorageKeys';

const _EHS = new ExceptionHandleService({
  _NAME: 'service/fetch.js',
  _NOTICE: 'fetchJson'
});

/**
 * fetch
 * @param {*} url
 * @param {*} options
 * @param {*} token
 */
const fetchJson = (url, options = {}) => {
  try {
    const token = localStorageUtil.getItem(
      LocalStorageKeys.UserInfo
    )?.accessToken;
    const rToken = localStorageUtil.getItem(
      LocalStorageKeys.UserInfo
    )?.refreshToken;
    const authorization = token ? { Authorization: `Bearer ${token}` } : {};
    let requestHeaders;
    if (token === '' && rToken) {
      requestHeaders =
        options.headers ||
        new Headers({
          'refresh-token': rToken,
          ...authorization,
          Accept: 'application/json'
        });
    } else {
      requestHeaders =
        options.headers ||
        new Headers({
          ...authorization,
          Accept: 'application/json'
        });
    }

    if (
      !requestHeaders.has('Content-Type') &&
      !(options && options.body && options.body instanceof FormData)
    ) {
      requestHeaders.set('Content-Type', 'application/json');
    }

    return fetch(url, { ...options, headers: requestHeaders })
      .then((response) => {
        return apiResponseHandler(response, 'json', url, options);
      })
      .catch((err) => {
        errorNotice(`status: ${err.name} | ${err.message}`);
        _EHS.errorReport(err, '', _EHS._LEVEL.ERROR);
      });
  } catch (error) {
    // do some error handle.
    alert('SYSTEM FETCH ERROR: ', error);
    _EHS.errorReport(error, 'SYSTEM FETCH ERROR:', _EHS._LEVEL.ERROR);
  }
};

const fetchBlob = (url, options = {}, type = 'blob') => {
  try {
    const token = localStorageUtil.getItem(
      LocalStorageKeys.UserInfo
    )?.accessToken;
    const authorization = token ? { Authorization: `Bearer ${token}` } : {};
    const requestHeaders =
      options.headers ||
      new Headers({ ...authorization, Accept: 'application/json' });

    if (
      !requestHeaders.has('Content-Type') &&
      !(options && options.body && options.body instanceof FormData)
    ) {
      requestHeaders.set('Content-Type', 'application/json');
    }

    return fetch(url, { ...options, headers: requestHeaders })
      .then((response) => {
        // Check if the response has the Content-Disposition header
        const contentDispositionHeader = response.headers.get(
          'Content-Disposition'
        );
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          // Handle JSON response here
          return apiResponseHandler(response, 'json', url, options);
        }

        if (contentDispositionHeader) {
          // Extract the filename from the header
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(contentDispositionHeader);
          const filename =
            matches !== null && matches[1]
              ? matches[1].replace(/['"]/g, '')
              : 'downloaded-file.zip';

          // You can use the filename here for further processing if needed
          console.log('Suggested filename:', filename);
        }
        // Start the download by creating a Blob from the response and triggering a download
        return response.blob();
      })
      .then((blob) => {
        return blob;
      })
      .catch((err) => {
        errorNotice(`status: ${err.name} | ${err.message}`);
        _EHS.errorReport(err, '', _EHS._LEVEL.ERROR);
      });
  } catch (error) {
    // do some error handle.
    alert('SYSTEM FETCH ERROR: ', error);
    _EHS.errorReport(error, 'SYSTEM FETCH ERROR:', _EHS._LEVEL.ERROR);
  }
};

const errorNotice = (msg) => {
  Swal.fire({
    icon: 'error',
    // title: 'Oops...',
    // text: msg
    html: `抱歉，系統出現技術問題，我們正在積極著手解決。請幾分鐘後再試一次或請洽系統管理員。<br>${msg ? `(${msg})` : ''}`
  });
};

export { fetchBlob };
export default fetchJson;
