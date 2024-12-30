import CryptoJS from "crypto-js";

const createHashPassword = (password) => {
    return CryptoJS.SHA256(password + 10).toString(CryptoJS.enc.Hex);
}

export default createHashPassword;