const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) {
        const error = await res.json();
        throw error;
    }

    return res.json()
}

export default fetcher