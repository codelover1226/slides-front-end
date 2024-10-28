import Cookies from "js-cookie";

const domain = {
  path: process.env.REACT_APP_COOKIE_PATH,
  domain: process.env.REACT_APP_COOKIE_DOMAIN,
  expires: parseInt(process.env.REACT_APP_COOKIE_EXPIRES),
};

export const get = key => {
  const value = Cookies.get(key);
  if (!!value) return JSON.parse(value);
  else return null;
};

export const set = (key, value) => {
  Cookies.set(key, JSON.stringify(value), domain);
};

export const remove = key => {
  Cookies.remove(key, domain);
};

export const clear = () => {
  ["token", "mainToken", "userId", "site"].forEach(key => {
    remove(key);
  });
};
