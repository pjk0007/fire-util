import hexStringToUint8Array from '@/lib/FirePayment/utils/hexStringToUnit8Aray';
import { compactDecrypt } from 'jose';

export async function decrypt(
    encryptedJWE: string,
    hexKey: string
): Promise<string> {
    const keyBytes = hexStringToUint8Array(hexKey);

    const { plaintext } = await compactDecrypt(encryptedJWE, keyBytes);

    const decoder = new TextDecoder();
    return decoder.decode(plaintext);
}
