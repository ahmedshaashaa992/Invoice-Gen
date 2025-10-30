import { User, UserData, Template } from '../types';

const APP_STORAGE_KEY = 'invoiceGeneratorAppData';
const RESET_CODE_KEY_PREFIX = 'invoiceGenResetCode_';

interface AppData {
    users: Record<string, Omit<User, 'username'>>;
    currentUser: string | null;
}

// Template specifically for the pre-configured 'ahmed992' user
const ahmedsDefaultTemplate: Template = {
  id: 'default-template-ahmed',
  name: 'Default Course Invoice',
  taxNumber: '121/5278/7179',
  logoUrl: 'https://i.imgur.com/r44S2uM.png', // Default ADTCO logo
  sender: {
    name: 'Ahmed Shaashaa',
    address: 'Am Antoiusshügel 32\n41189 Mönchengladbach',
    phone: '491 7623955713',
  },
  subject: 'Web-Entwicklung Kurs',
  contractDate: '01.10.2025',
  items: [
    { id: crypto.randomUUID(), description: 'Stundenstaz Web-entwicklung Kurs', hours: 72, rate: 30.00 },
    { id: crypto.randomUUID(), description: 'Oct.2025' },
    { id: crypto.randomUUID(), description: 'Lehrerverwaltung', details: 'Pauchale', rate: 400.00 },
    { id: crypto.randomUUID(), description: '', rate: 0.00 },
  ],
  payee: 'Ahmed Shaashaa',
  bankDetails: 'PostBank PBNKDEFFXXX, IBAN DE83 1001 0010 0942 4881 12',
  notes: 'gemäß § 19 Abs.1 UStG, Es wird keine Umsatzsteuer enthalt',
  recipient: {
    name: 'IRAD Academy GmbH',
    address: 'Bismarckstraße 67\n45128 Essen',
  }
};

// Generic template for any new user who signs up
const getNewUserTemplate = (): Template => ({
    id: crypto.randomUUID(),
    name: 'My First Template',
    sender: { name: 'Your Company', address: '123 Main St\nCity, State 12345', phone: '555-123-4567' },
    taxNumber: '',
    payee: 'Your Name',
    bankDetails: 'Your Bank, IBAN, BIC',
    logoUrl: '',
    items: [{ id: crypto.randomUUID(), description: 'Service Description', hours: 1, rate: 50 }],
    notes: 'Thank you for your business!',
    recipient: { name: 'Client Company', address: '456 Oak Ave\nCity, State 54321'}
});

// The initial state of the app now includes the pre-configured user
const getInitialAppData = (): AppData => ({
    users: {
        'ahmed992': {
            password: 'ahmed992',
            email: 'ahmed992@example.com',
            data: {
                customers: [],
                templates: [ahmedsDefaultTemplate],
            }
        }
    },
    currentUser: null,
});

const getAppData = (): AppData => {
    try {
        const data = localStorage.getItem(APP_STORAGE_KEY);
        if (data) {
            const parsedData = JSON.parse(data);
             // This ensures that if someone already used the app, the 'ahmed992' account is added.
            if (!parsedData.users.ahmed992) {
                parsedData.users.ahmed992 = getInitialAppData().users.ahmed992;
            }
            return parsedData;
        }
    } catch (error) {
        console.error("Failed to parse app data from localStorage", error);
    }
    // If there's no data in localStorage, initialize with the default user
    return getInitialAppData();
};

const saveAppData = (data: AppData) => {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(data));
};

export const auth = {
    getCurrentUser: (): string | null => {
        const data = getAppData();
        return data.currentUser;
    },
    getUserByUsername: (username: string): (Omit<User, 'username'> & {username: string}) | null => {
        const data = getAppData();
        if (data.users[username]) {
            return { username, ...data.users[username]};
        }
        return null;
    },
    login: (username: string, password: string):boolean => {
        const data = getAppData();
        const user = data.users[username];
        if (user && user.password === password) {
            data.currentUser = username;
            saveAppData(data);
            return true;
        }
        return false;
    },
    logout: () => {
        const data = getAppData();
        data.currentUser = null;
        saveAppData(data);
    },
    signup: (username: string, password: string, email: string): boolean => {
        const data = getAppData();
        if (data.users[username]) {
            return false; // User already exists
        }
        // New users get the generic blank template
        data.users[username] = {
            password,
            email,
            data: {
                customers: [],
                templates: [getNewUserTemplate()],
            }
        };
        data.currentUser = username;
        saveAppData(data);
        return true;
    },
    changePassword: (username: string, oldPassword: string, newPassword: string): {success: boolean, message: string} => {
        const data = getAppData();
        const user = data.users[username];
        if (!user) {
            return { success: false, message: "User not found."};
        }
        if (user.password !== oldPassword) {
            return { success: false, message: "Incorrect current password."};
        }
        user.password = newPassword;
        saveAppData(data);
        return { success: true, message: "Password updated successfully."};
    },
    setUserResetCode: (username: string, code: string): void => {
        // Store code with a 10-minute expiry
        const expiry = Date.now() + 10 * 60 * 1000;
        const item = { code, expiry };
        localStorage.setItem(`${RESET_CODE_KEY_PREFIX}${username}`, JSON.stringify(item));
    },
    verifyAndResetPassword: (username: string, code: string, newPassword: string): {success: boolean, message: string} => {
        const itemStr = localStorage.getItem(`${RESET_CODE_KEY_PREFIX}${username}`);
        if (!itemStr) {
            return { success: false, message: "No reset code found or it has expired. Please try again." };
        }
        const item = JSON.parse(itemStr);
        if (item.expiry < Date.now()) {
            localStorage.removeItem(`${RESET_CODE_KEY_PREFIX}${username}`);
            return { success: false, message: "Reset code has expired. Please try again." };
        }
        if (item.code !== code) {
            return { success: false, message: "Invalid reset code." };
        }

        const data = getAppData();
        if (data.users[username]) {
            data.users[username].password = newPassword;
            saveAppData(data);
            localStorage.removeItem(`${RESET_CODE_KEY_PREFIX}${username}`);
            return { success: true, message: "Password has been reset successfully."};
        }
        return { success: false, message: "User not found."};
    }
};

export const db = {
    getUserData: (): UserData | null => {
        const data = getAppData();
        const currentUser = data.currentUser;
        if (currentUser && data.users[currentUser]) {
            return data.users[currentUser].data;
        }
        return null;
    },
    saveUserData: (userData: UserData) => {
        const data = getAppData();
        const currentUser = data.currentUser;
        if (currentUser && data.users[currentUser]) {
            data.users[currentUser].data = userData;
            saveAppData(data);
        }
    }
};