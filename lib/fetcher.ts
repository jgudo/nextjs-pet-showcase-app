const fetcher = (url: string) => fetch(url).then(res => res.json().then(json => json.data));

export default fetcher;