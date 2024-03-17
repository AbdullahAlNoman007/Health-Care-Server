const pick = <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]) => {

    const finalFilters: Partial<T> = {}
    for (const key of keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            finalFilters[key] = obj[key]
        }
    }
    return finalFilters;

}

export default pick;