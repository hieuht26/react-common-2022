import axios from 'axios';
import EventObj from 'utils/events/Event';
import { BASE_URL, EVENT_LOADING } from 'utils/constants';
import { sleep } from 'utils/helper';

const UNAUTHORIZED = 401;
const TOKEN_EXPIRED = 403;
const BAD_REQUEST = 400;

const getJWT = () => "token"

let instance = null;

const moveToLogin = () => {
  window.location.href = "#/logout";
};

const init = () => {

  /** Creating an instance */
  instance = axios.create({
    // baseURL: BASE_URL,
    withCredentials: true,
    timeout: 20 * 1000,
    // headers: {'X-Custom-Header': 'foobar'}
  });

  /** Add a request interceptor */
  instance.interceptors.request.use(async (config) => { // eslint-disable-line
    // set loading = true
    EventObj.publish(EVENT_LOADING, true);

    // delay request
    if (config?.customDelay) {
      await sleep(config?.customDelay);
    }

    // Do something before request is sent
    if (config.url && config.url.indexOf("http") < 0) {
      config.url = BASE_URL + config.url;
    }
    if (!config.noAuth)
      config.headers = {
        ...{ 'Content-Type': 'application/json' },
        ...{ Authorization: "Bearer " + getJWT() },
        ...config.headers
      }
    config.withCredentials = true;
    return config;
  }, (error) => { // eslint-disable-line
    // Do something with request error
    return Promise.reject(error);
  });

  /** Add a response interceptor */
  instance.interceptors.response.use((response) => { // eslint-disable-line
    // set loading false
    EventObj.publish(EVENT_LOADING, false);
    // Do something with response data
    return response;
  }, (error) => {
    // set loading false
    EventObj.publish(EVENT_LOADING, false);
    // Do something with response error
    if (axios.isCancel(error)) {
      // console.log('Request canceled', error.message);
      const newError = new Error('canceled');
      return Promise.reject(newError);
    }
    if (error.response && error.response.config && error.response.config.noAuth) {
      //
    } else {
      switch (error.response.status) {
        case UNAUTHORIZED:
        case BAD_REQUEST:
        case TOKEN_EXPIRED:
          if (!error.response.config.noAuth)
            moveToLogin();
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  });
};

const getInstance = () => {
  if (!instance) init();
  return instance;
};

/**
 * Preprocess requestConfig
 * @param {object} request
 */
function requestProcess(request) {
  const configRequest = { ...request };
  // if (!configRequest.noAuth) {
  //   const token = getJWT();
  //   if (token) {
  //     const auth = `Bearer ${token}`;
  //     configRequest.headers = {
  //       ...configRequest.headers,
  //       Authorization: auth
  //     };
  //   }
  // }
  return configRequest;
}

/**
 * Add cancel for request
 * @param  {...any} arg
 */
function api(requestConfig) {
  const { CancelToken } = axios;
  const source = CancelToken.source();
  const promise = getInstance()(requestProcess({
    ...requestConfig,
    cancelToken: source.token
  }));
  return {
    promise,
    source
  };
}

export function makeGet(request) {
  return api({
    ...request,
    method: 'get'
  });
}

export function makePost(request) {
  return api({
    ...request,
    method: 'post'
  });
}

export function makePut(request) {
  return api({
    ...request,
    method: 'put'
  });
}

export function makePatch(request) {
  return api({
    ...request,
    method: 'patch'
  });
}

export function makeDelete(request) {
  return api({
    ...request,
    method: 'delete'
  });
}