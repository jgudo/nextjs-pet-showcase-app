export const updatePet = (id: string, form: FormData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res: Response = await fetch(`/api/pets/${id}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                },
                body: form,
            })

            // Throw error with status code in case Fetch API req failed
            if (!res.ok) {
                throw new Error(String(res.status))
            }

            const { data } = await res.json();

            resolve(data);
        } catch (error) {
            console.error(error);
            reject('Failed to update pet');
        }
    })
}

export const addPet = (form: FormData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch('/api/pets', {
                method: 'POST',
                body: form,
                headers: {
                    'Accept': 'application/json'
                }
            })

            // Throw error with status code in case Fetch API req failed
            if (!res.ok) {
                throw new Error(String(res.status))
            }

            const { data } = await res.json();
            resolve(data);
        } catch (error) {
            console.error(error)
            reject('Failed to new pet');
        }
    });
}