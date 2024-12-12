import {decode} from "bs58";

const base58ToHex = (base58: string): string => {
    try {
        if(parseInt(base58) < 30) {
            // Early Civic passes use smaller EVM slot ID's not derived from base58. These can be passed in as integers.
            return parseInt(base58).toString(16);
        }
    } catch {}
    try {
        return Buffer.from(decode(base58)).toString('hex');
    } catch (error) {
        console.log('Error decoding base58 string:', error);
        throw new Error(`Invalid base58 string: ${base58}. Pass types created before July 2024 are mapped to a slot ID in the gateway contract - these are not supported here.`);
    }
}
const hexToBigInt = (hex: string) => BigInt(`0x${hex}`)
export const base58ToBigInt = (base58: string) => hexToBigInt(base58ToHex(base58))

export const GATEWAY_CONTRACT_ADDRESS = '0xF65b6396dF6B7e2D8a6270E3AB6c7BB08BAEF22E';