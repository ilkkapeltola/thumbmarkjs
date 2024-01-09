import { getFingerprint, getFingerprintData } from './fingerprint/functions';
import * as packageJson from '../package.json';
import './components'
import { getItem, setItem } from './storage'

//const componentsContext = require.context('./components', true, /^(?!.*\.test\.ts$).*\.ts$/);
//componentsContext.keys().forEach(componentsContext);

export interface fingerprintOptionsInterface {
    showElapsed: boolean,
    storageUrl: string,
    namespace: string
}

const options: fingerprintOptionsInterface = {
    showElapsed: false,
    storageUrl: 'https://storage-test.thumbmarkjs.com/v1/fingerprint',
    namespace: 'thumbmarkjs'
}

function getVersion(): string {
    return packageJson.version;
}

export { getVersion, getFingerprint, getFingerprintData, getItem, setItem, options }