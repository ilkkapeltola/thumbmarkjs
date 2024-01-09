import { options, fingerprintOptionsInterface, getFingerprint } from '../index'

const getItem = async (key: string): Promise<string> => {
    const errors = validOptions(options)
    if (errors) { throw errors }
    const { storageUrl, namespace } = options
    const fp = await getFingerprint()
    const url = `${storageUrl}/${namespace}/${fp}/${key}`

    return fetch(url, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        console.error('There was an error!', error);
    });
}

const validOptions = (opt: fingerprintOptionsInterface): Error | null => {
    const errors = []
    if (typeof opt.storageUrl !== 'string' || typeof opt.namespace !== 'string')
        errors.push('storageUrl and namespace must be strings')
    if (opt.namespace.length < 5)
        errors.push('namespace must be at least 5 characters long')

    if (errors.length > 0)
        return new Error(errors.join(', '))
    return null
}

export { getItem }