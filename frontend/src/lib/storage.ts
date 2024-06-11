const storagePrefix = 'image_generation_react_';

const storage = {
  getToken: () => {
    return JSON.parse(window.localStorage.getItem(`${storagePrefix}token`) as string);
  },
  setToken: (token: string) => {
    window.localStorage.setItem(`${storagePrefix}token`, JSON.stringify(token));
  },
  clearToken: () => {
    window.localStorage.removeItem(`${storagePrefix}token`);
  },
  getRole: () => {
    return JSON.parse(window.localStorage.getItem(`${storagePrefix}role`) as string);
  },
  setRole: (role: string) => {
    window.localStorage.setItem(`${storagePrefix}role`, JSON.stringify(role));
  },
  clearRole: () => {
    window.localStorage.removeItem(`${storagePrefix}role`);
  },
  clearAll: () => {
    window.localStorage.removeItem(`${storagePrefix}token`);
    window.localStorage.removeItem(`${storagePrefix}role`);
  },
};

export default storage;
