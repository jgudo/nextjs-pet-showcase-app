const fetcher = async (url: string) => {
    try {
        const res = await fetch(url)
        if (!res.ok) {
            const error = await res.json();
            throw error;
        }

        return res.json()
    } catch (err) {
        console.log(err)
    }
}

export default fetcher