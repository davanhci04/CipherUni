document.getElementById('inputText').addEventListener('input', updateOutput);
document.getElementById('cipherKey').addEventListener('input', updateOutput);
document.getElementById('encodeAction').addEventListener('change', updateOutput);
document.getElementById('decodeAction').addEventListener('change', updateOutput);
document.getElementById('cipherType').addEventListener('change', updateOutput);

function updateOutput() {
    const action = document.getElementById('encodeAction').checked ? 'encode' : 'decode';
    const cipherType = document.getElementById('cipherType').value;
    const key = document.getElementById('cipherKey').value;
    const inputText = document.getElementById('inputText').value;

    let outputText = '';

    if (action === 'encode') {
        if (cipherType === 'des') {
            outputText = encryptDES(inputText, key);
        } else if (cipherType === 'aes') {
            outputText = encryptAES(inputText, key);
        }
    } else {
        if (cipherType === 'des') {
            outputText = decryptDES(inputText, key);
        } else if (cipherType === 'aes') {
            outputText = decryptAES(inputText, key);
        }
    }

    document.getElementById('outputText').value = outputText;
}

function encryptDES(message, key) {
    if (key.length !== 8) {
        return '';
    }
    const encrypted = CryptoJS.DES.encrypt(message, CryptoJS.enc.Utf8.parse(key), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

function decryptDES(encryptedMessage, key) {
    if (key.length !== 8) {
        return '';
    }
    const decrypted = CryptoJS.DES.decrypt(encryptedMessage, CryptoJS.enc.Utf8.parse(key), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

function encryptAES(message, key) {
    if (![16, 24, 32].includes(key.length)) {
        return '';
    }
    const encrypted = CryptoJS.AES.encrypt(message, CryptoJS.enc.Utf8.parse(key), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

function decryptAES(encryptedMessage, key) {
    if (![16, 24, 32].includes(key.length)) {
        return '';
    }
    const decrypted = CryptoJS.AES.decrypt(encryptedMessage, CryptoJS.enc.Utf8.parse(key), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

function clearText() {
    document.getElementById('inputText').value = '';
    document.getElementById('outputText').value = '';
}

function toggleCipherInputs() {
    const cipherType = document.getElementById('cipherType').value;
    const keyDiv = document.getElementById('keyDiv');
    if (cipherType === 'aes' || cipherType === 'des') {
        keyDiv.style.display = 'block';
    }
}
