import CryptoJS from "crypto-js";

const generateOrderNumber = (fullName, phoneNumber) => {
    const currentDate = new Date();
    const datePart = currentDate.toISOString().slice(0, 10).replace(/-/g, ''); // Data w formacie RRRRMMDD
    const timePart = currentDate.toTimeString().slice(0, 8).replace(/:/g, ''); // Czas w formacie HHMMSS
    const dataToHash = `${fullName}${phoneNumber}${datePart}${timePart}`;
    const x = CryptoJS.SHA256(dataToHash).toString(CryptoJS.enc.Hex)
        .slice(0, 24)
    // .toUpperCase();
    return x;
}

export default generateOrderNumber;