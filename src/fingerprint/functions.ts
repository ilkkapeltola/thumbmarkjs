import { getComponentPromises, timeoutInstance, componentInterface } from '../factory';
import { hash } from '../utils/hash';
import { raceAll} from '../utils/raceAll';

export async function getFingerprintData(): Promise<componentInterface>  {
    try {
        const timeout = 1000;
        const promiseMap = getComponentPromises();
        const keys = Object.keys(promiseMap);
        const promises = Object.values(promiseMap);
        const resolvedValues = await raceAll(promises, timeout, timeoutInstance );
        const resolvedComponents: { [key: string]: any } = {};
        resolvedValues.forEach((value, index) => {
            resolvedComponents[keys[index]] = value;
        });
        return resolvedComponents;
    }
    catch (error) {
        throw error;
    }
}

export async function getFingerprint(): Promise<string> {
    try {
        const fingerprintData = await getFingerprintData();
        const thisHash = hash(JSON.stringify(fingerprintData));
        return thisHash.toString();
    } catch (error) {
        throw error;
    }
}

