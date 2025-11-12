import hexStringToUint8Array from '@/lib/FirePayment/utils/hexStringToUnit8Aray';
import { CompactEncrypt } from 'jose';

// 암호화 함수
export async function encrypt(
    target: string,
    securityKey: string
): Promise<string> {
    // Hex 키를 Uint8Array로 변환
    const keyBytes = hexStringToUint8Array(securityKey);

    // JWE 헤더 생성
    const headers = {
        alg: 'dir',
        enc: 'A256GCM',
        iat: new Date().toISOString(),
        nonce: crypto.randomUUID(),
    };

    // Content 암호화
    const encoder = new TextEncoder();
    const encodedPayload = encoder.encode(target);

    const jwe = await new CompactEncrypt(encodedPayload)
        .setProtectedHeader(headers)
        .encrypt(keyBytes);

    return jwe;
}
