// src/utils/storage.ts
// In-memory storage implementation

// In-memory storage to simulate AsyncStorage
const memoryStorage: { [key: string]: string } = {};

const USER_TOKEN = 'USER_TOKEN';
const USER_SETTINGS = 'USER_SETTINGS';
const USER_CART = 'USER_CART';
const NEW_USER = 'NEW_USER';
const RECENT_LIST = 'RECENT_LIST';
const USER = 'USER';

// Utility to simulate network delay
const delay = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms));

export const setData = async (key: string, value: string) => {
  try {
    await delay();
    memoryStorage[`@${key}:key`] = `${value}`;
    return true;
  } catch (error) {
    return false;
  }
};

export const getData = async (key: string) => {
  try {
    await delay();
    const value = memoryStorage[`@${key}:key`];
    return value || '';
  } catch (error) {
    return '';
  }
};

export const setUser = async (value: any) => {
  try {
    await delay();
    memoryStorage[`@${USER}:key`] = JSON.stringify(value);
    return true;
  } catch (error) {
    return false;
  }
};

export const getUser = async () => {
  try {
    await delay();
    const value = memoryStorage[`@${USER}:key`];
    return value ? JSON.parse(value) : '';
  } catch (error) {
    return '';
  }
};

export const saveToken = async (value: string) => {
  try {
    await delay();
    memoryStorage[`@${USER_TOKEN}:key`] = value;
    return true;
  } catch (error) {
    return false;
  }
};

export const clearToken = async () => saveToken('');
export const clearUser = async () => setUser(undefined);

export const getToken = async () => {
  try {
    await delay();
    return memoryStorage[`@${USER_TOKEN}:key`] || '';
  } catch (error) {
    return '';
  }
};

export const getSettings = async () => {
  try {
    await delay();
    const value = memoryStorage[`@${USER_SETTINGS}:key`];
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
};

export const saveSettings = async (value: any) => {
  try {
    await delay();
    memoryStorage[`@${USER_SETTINGS}:key`] = JSON.stringify(value);
    return true;
  } catch (error) {
    return false;
  }
};

export const saveCart = async (value: any) => {
  try {
    await delay();
    memoryStorage[`@${USER_CART}:key`] = JSON.stringify(value);
    return true;
  } catch (error) {
    return false;
  }
};

export const getCart = async () => {
  try {
    await delay();
    const value = memoryStorage[`@${USER_CART}:key`];
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
};

export const clearCart = async () => saveCart([]);

export const setnewUser = async (value: any) => {
  try {
    await delay();
    memoryStorage[`@${NEW_USER}:key`] = JSON.stringify(value);
    return true;
  } catch (error) {
    return false;
  }
};

export const getnewUser = async () => {
  try {
    await delay();
    const value = memoryStorage[`@${NEW_USER}:key`];
    return value ? JSON.parse(value) : true;
  } catch (error) {
    return true;
  }
};

export const setRecentList = async (value: any) => {
  try {
    await delay();
    memoryStorage[`@${RECENT_LIST}:key`] = JSON.stringify(value);
    return true;
  } catch (error) {
    return false;
  }
};

export const getRecentList = async () => {
  try {
    await delay();
    const value = memoryStorage[`@${RECENT_LIST}:key`];
    return value ? JSON.parse(value) : [];
  } catch (error) {
    return [];
  }
};