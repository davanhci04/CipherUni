#include <stdio.h>
#include <string.h>

void encryptCaesar(char* plain, int key) {
    int i;
    for (i = 0; plain[i] != '\0'; i++) {
        if (plain[i] >= 'A' && plain[i] <= 'Z') {
            plain[i] = ((plain[i] - 'A' + key) % 26) + 'A';
        }
    }
    printf("Encrypted Caesar: %s\n", plain);
}

void decryptCaesar(char* cipher, int key) {
    int i;
    for (i = 0; cipher[i] != '\0'; i++) {
        if (cipher[i] >= 'A' && cipher[i] <= 'Z') {
            cipher[i] = ((cipher[i] - 'A' - key + 26) % 26) + 'A';
        }
    }
    printf("Decrypted Caesar: %s\n", cipher);
}

int modInverse(int a, int m) {
    for (int x = 1; x < m; x++) {
        if ((a * x) % m == 1) {
            return x;
        }
    }
    return -1;  // Trả về -1 nếu không tìm thấy nghịch đảo.
}

void encryptAffine(char* plain, int a, int b) {
    int i;
    for (i = 0; plain[i] != '\0'; i++) {
        if (plain[i] >= 'A' && plain[i] <= 'Z') {
            plain[i] = ((a * (plain[i] - 'A') + b) % 26) + 'A';
        }
    }
    printf("Encrypted Affine: %s\n", plain);
}

void decryptAffine(char* cipher, int a, int b) {
    int a_inv = modInverse(a, 26);  // Tìm nghịch đảo của a modulo 26.
    if (a_inv == -1) {
        printf("No modular inverse for the given key.\n");
        return;
    }

    int i;
    for (i = 0; cipher[i] != '\0'; i++) {
        if (cipher[i] >= 'A' && cipher[i] <= 'Z') {
            cipher[i] = (a_inv * (cipher[i] - 'A' - b + 26)) % 26 + 'A';
        }
    }
    printf("Decrypted Affine: %s\n", cipher);
}

void encryptVigenere(char* plain, char* key) {
    int i, j = 0, n = strlen(key);
    for (i = 0; plain[i] != '\0'; i++) {
        if (plain[i] >= 'A' && plain[i] <= 'Z') {
            plain[i] = ((plain[i] - 'A' + (key[j % n] - 'A')) % 26) + 'A';
            j++;
        }
    }
    printf("Encrypted Vigenere: %s\n", plain);
}

void decryptVigenere(char* cipher, char* key) {
    int i, j = 0, n = strlen(key);
    for (i = 0; cipher[i] != '\0'; i++) {
        if (cipher[i] >= 'A' && cipher[i] <= 'Z') {
            cipher[i] = ((cipher[i] - 'A' - (key[j % n] - 'A') + 26) % 26) + 'A';
            j++;
        }
    }
    printf("Decrypted Vigenere: %s\n", cipher);
}

int main() {
    char caesarText[] = "HELLO";  // Văn bản gốc cho Caesar.
    char affineText[] = "A";  // Văn bản gốc cho Affine.
    char vigenereText[] = "ATTACKATDAWN";  // Văn bản gốc cho Vigenere.
    
    // int keyCaesar = 3;  // Khóa cho mã Caesar.
    int a = 6, b = 2;   // Khóa cho mã Affine.
    // char keyVigenere[] = "LEMON";  // Khóa cho mã Vigenere.

    // // Mã hóa và giải mã Caesar
    // encryptCaesar(caesarText, keyCaesar);
    // decryptCaesar(caesarText, keyCaesar);
    
    // Mã hóa và giải mã Affine
    encryptAffine(affineText, a, b);
    decryptAffine(affineText, a, b);
    
    // Mã hóa và giải mã Vigenere
    // encryptVigenere(vigenereText, keyVigenere);
    // decryptVigenere(vigenereText, keyVigenere);

    return 0;
}
