export function WriteToLocalStorage(key: string, value: any) {
    const data = value;
    const timestamp = Date.now();

    localStorage.setItem(key, JSON.stringify({ data, timestamp }));
}

export function ReadFromLocalStorage(key: string) {
    const cachedData = localStorage.getItem(key);
    if (!cachedData) {
        return null;
    }

    const { data, timestamp } = JSON.parse(cachedData);
    const currentTime = Date.now();

    const cacheExpirationTime = 1 * 60 * 1000;

    if (currentTime - timestamp <= cacheExpirationTime) {
        return data;
    }

    return null;
}