document.addEventListener('DOMContentLoaded', function () {
    // Thực hiện mã hóa hoặc giải mã khi nhập dữ liệu
    document.getElementById('inputText').addEventListener('input', updateResult);
    document.getElementById('shiftValue').addEventListener('input', updateResult);
    document.getElementById('affineA').addEventListener('input', updateResult);
    document.getElementById('affineB').addEventListener('input', updateResult);
    document.getElementById('vigenereKey').addEventListener('input', updateResult);
    document.querySelectorAll('input[name="action"]').forEach((elem) => {
        elem.addEventListener('change', updateResult);
    });
    document.getElementById('cipherType').addEventListener('change', updateResult);

    // Thực hiện khi tải tệp lên
    document.getElementById('fileInput').addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('inputText').value = e.target.result;
                updateResult(); // Cập nhật kết quả ngay khi tệp được tải lên
            };
            reader.readAsText(file);
        }
    });
});

// Hàm cập nhật kết quả
function updateResult() {
    let text = document.getElementById('inputText').value;
    let action = document.querySelector('input[name="action"]:checked');
    let cipherType = document.getElementById('cipherType').value;
    let result = '';

    if (action) {
        action = action.id;
        if (cipherType === 'caesar') {
            let shift = parseInt(document.getElementById('shiftValue').value) || 0;
            if (action === 'encodeAction') {
                result = encodeText(text, shift);
            } else if (action === 'decodeAction') {
                result = decodeText(text, shift);
            }
        } else if (cipherType === 'affine') {
            let a = parseInt(document.getElementById('affineA').value) || 1;
            let b = parseInt(document.getElementById('affineB').value) || 0;
            if (action === 'encodeAction') {
                result = encodeAffine(text, a, b);
            } else if (action === 'decodeAction') {
                result = decodeAffine(text, a, b);
            }
        } else if (cipherType === 'vigenere') {
            let key = document.getElementById('vigenereKey').value;
            if (action === 'encodeAction') {
                result = encodeVigenere(text, key);
            } else if (action === 'decodeAction') {
                result = decodeVigenere(text, key);
            }
        } else if (cipherType === 'hill') {
            let matrixKey = document.getElementById('hillKey').value;
            if (action === 'encodeAction') {
                result = encodeHill(text, matrixKey);
            } else if (action === 'decodeAction') {
                result = decodeHill(text, matrixKey);
            }
        }
    }

    document.getElementById('outputText').value = result;
}

// Hàm mã hóa Caesar Cipher với bảng ASCII 256 ký tự
function encodeText(text, shift) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        let encodedCharCode = (charCode + shift) % 256;
        result += String.fromCharCode(encodedCharCode);
    }
    return result;
}

// Hàm giải mã Caesar Cipher với bảng ASCII 256 ký tự
function decodeText(text, shift) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        let decodedCharCode = (charCode - shift + 256) % 256;
        result += String.fromCharCode(decodedCharCode);
    }
    return result;
}

// Hàm mã hóa Affine Cipher với bảng ASCII 256 ký tự
function encodeAffine(text, a, b) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        let encodedCharCode = (a * charCode + b) % 256;
        result += String.fromCharCode(encodedCharCode);
    }
    return result;
}

// Hàm giải mã Affine Cipher với bảng ASCII 256 ký tự
function decodeAffine(text, a, b) {
    let a_inv = modInverse(a, 256);  // Tìm nghịch đảo modular của a (mod 256)
    if (a_inv === -1) {
        console.log("No modular inverse for the given key.");
        return "Error: No modular inverse for the given key.";
    }

    let result = '';
    for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        let decodedCharCode = (a_inv * (charCode - b + 256)) % 256;
        result += String.fromCharCode(decodedCharCode);
    }
    return result;
}

// Tìm nghịch đảo modular
function modInverse(a, m) {
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) {
            return x;
        }
    }
    return -1;  // Trả về -1 nếu không tìm thấy nghịch đảo.
}

// Hàm mã hóa Vigenère Cipher với bảng ASCII 256 ký tự
function encodeVigenere(text, key) {
    let result = '';
    key = key.repeat(Math.ceil(text.length / key.length)).slice(0, text.length); // Repeat key to match text length
    for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        let keyCode = key.charCodeAt(i);
        let encodedCharCode = (charCode + keyCode) % 256;
        result += String.fromCharCode(encodedCharCode);
    }
    return result;
}

// Hàm giải mã Vigenère Cipher với bảng ASCII 256 ký tự
function decodeVigenere(text, key) {
    let result = '';
    key = key.repeat(Math.ceil(text.length / key.length)).slice(0, text.length); // Repeat key to match text length
    for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        let keyCode = key.charCodeAt(i);
        let decodedCharCode = (charCode - keyCode + 256) % 256;
        result += String.fromCharCode(decodedCharCode);
    }
    return result;
}

// Hàm mã hóa Hill Cipher với bảng ASCII 256 ký tự
function encodeHill(text, matrixKey) {
    let matrix = parseMatrix(matrixKey);
    if (!matrix) {
        return 'Error: Invalid matrix';
    }

    let size = matrix.length;
    let textVector = getTextVector(text, size);
    if (!textVector) {
        return 'Error: Text length does not match matrix size';
    }

    let result = '';
    for (let i = 0; i < textVector.length; i++) {
        let encryptedVector = multiplyMatrix(matrix, textVector[i]);
        result += encryptedVector.map(num => String.fromCharCode(num % 256)).join('');
    }
    return result;
}

// Hàm giải mã Hill Cipher với bảng ASCII 256 ký tự
function decodeHill(text, matrixKey) {
    let matrix = parseMatrix(matrixKey);
    if (!matrix) {
        return 'Error: Invalid matrix';
    }

    let inverseMatrix = getInverseMatrix(matrix);
    if (!inverseMatrix) {
        return 'Error: Matrix is not invertible';
    }

    let size = matrix.length;
    let textVector = getTextVector(text, size);
    if (!textVector) {
        return 'Error: Text length does not match matrix size';
    }

    let result = '';
    for (let i = 0; i < textVector.length; i++) {
        let decryptedVector = multiplyMatrix(inverseMatrix, textVector[i]);
        result += decryptedVector.map(num => String.fromCharCode(num % 256)).join('');
    }
    return result;
}

// Hàm chuyển ma trận từ chuỗi
function parseMatrix(matrixString) {
    let values = matrixString.split(',').map(Number);
    let size = Math.sqrt(values.length);
    if (size % 1 !== 0) {
        return null; // Không phải ma trận vuông
    }
    let matrix = [];
    for (let i = 0; i < size; i++) {
        matrix.push(values.slice(i * size, (i + 1) * size));
    }
    return matrix;
}

// Hàm chuyển văn bản thành vector
function getTextVector(text, size) {
    let vector = [];
    for (let i = 0; i < text.length; i += size) {
        let row = [];
        for (let j = 0; j < size; j++) {
            row.push(text.charCodeAt(i + j) || 0); // Nếu không có ký tự thì thêm 0
        }
        vector.push(row);
    }
    return vector;
}

// Hàm nhân ma trận với vector
function multiplyMatrix(matrix, vector) {
    let result = [];
    for (let i = 0; i < matrix.length; i++) {
        let sum = 0;
        for (let j = 0; j < vector.length; j++) {
            sum += matrix[i][j] * vector[j];
        }
        result.push(sum);
    }
    return result;
}

// Hàm tính nghịch đảo ma trận
function getInverseMatrix(matrix) {
    let det = determinant(matrix);
    let modInv = modInverse(det, 256);
    if (modInv === -1) {
        return null; // Không tìm thấy nghịch đảo
    }

    let adjugateMatrix = adjugate(matrix);
    let inverseMatrix = adjugateMatrix.map(row => row.map(value => (value * modInv) % 256));
    return inverseMatrix;
}

// Hàm tính định thức
function determinant(matrix) {
    if (matrix.length === 2) {
        return (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) % 256;
    }
    // Tính cho ma trận lớn hơn (có thể sử dụng phương pháp đệ quy)
}

// Hàm tính ma trận adjugate
function adjugate(matrix) {
    if (matrix.length === 2) {
        return [
            [matrix[1][1], -matrix[0][1]],
            [-matrix[1][0], matrix[0][0]]
        ];
    }
    // Tính cho ma trận lớn hơn (đệ quy hoặc phương pháp mở rộng)
}


// Hàm tải kết quả về dưới dạng tệp
function downloadResult() {
    let text = document.getElementById('outputText').value;
    let blob = new Blob([text], { type: 'text/plain' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'result.txt';
    link.click();
}

// Hàm xóa nội dung của các textarea
function clearText() {
    document.getElementById('inputText').value = '';
    document.getElementById('outputText').value = '';
    document.getElementById('shiftValue').value = 0;
    document.getElementById('affineA').value = 0;
    document.getElementById('affineB').value = 0;
    document.getElementById('vigenereKey').value = '';
}

// Hàm hiển thị hoặc ẩn input cho kiểu mã hóa được chọn
function toggleCipherInputs() {
    let cipherType = document.getElementById('cipherType').value;
    let affineDiv = document.getElementById('affineShiftDiv');
    let caesarDiv = document.getElementById('caesarShiftDiv');
    let vigenereDiv = document.getElementById('vigenereKeyDiv');
    let hillDiv = document.getElementById('hillKeyDiv')

    if (cipherType === 'affine') {
        affineDiv.style.display = 'flex';  // Hiển thị các ô a & b cạnh nhau
        caesarDiv.style.display = 'none';  // Ẩn ô shift Caesar
        vigenereDiv.style.display = 'none'; // Ẩn ô key Vigenère
        hillDiv.style.display = 'none'; 
    } else if (cipherType === 'caesar') {
        affineDiv.style.display = 'none';   // Ẩn các ô a & b
        caesarDiv.style.display = 'block';  // Hiển thị ô shift Caesar
        vigenereDiv.style.display = 'none'; // Ẩn ô key Vigenère
        hillDiv.style.display = 'none'; 
    } else if (cipherType === 'vigenere') {
        affineDiv.style.display = 'none';   // Ẩn các ô a & b
        caesarDiv.style.display = 'none';  // Ẩn ô shift Caesar
        vigenereDiv.style.display = 'block'; // Hiển thị ô key Vigenère
        hillDiv.style.display = 'none'; 
    } else if (cipherType === 'hill'){
        affineDiv.style.display = 'none';  
        caesarDiv.style.display = 'none'; 
        vigenereDiv.style.display = 'none'; 
        hillDiv.style.display = 'block'; 
    }
}

