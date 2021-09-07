export const updatePet = (id: string, form: FormData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res: Response = await fetch(`/api/pets/${id}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                },
                body: form,
                credentials: 'include'
            })

            // Throw error with status code in case Fetch API req failed
            if (!res.ok) {
                const { message } = await res.json();
                throw new Error(message);
            }

            const { data } = await res.json();

            resolve(data);
        } catch (error) {
            reject(error?.message || 'Failed to update pet');
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
                    'Accept': 'application/json',
                },
                credentials: 'include'
            })

            // Throw error with status code in case Fetch API req failed
            if (!res.ok) {
                const { message } = await res.json();
                throw new Error(message);
            }

            const { data } = await res.json();
            resolve(data);
        } catch (error) {
            reject(error?.message || 'Failed to add new pet');
        }
    });
}

export const updateUser = (id: string, form: FormData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res: Response = await fetch(`/api/user/${id}`, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                },
                body: form,
                credentials: 'include'
            })

            // Throw error with status code in case Fetch API req failed
            if (!res.ok) {
                const { message } = await res.json();
                throw new Error(message);
            }

            const { data } = await res.json();

            resolve(data);
        } catch (error) {
            reject(error?.message || 'Failed to update user details.');
        }
    })
}

export const deletePet = (id: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res: Response = await fetch(`/api/pets/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            if (!res.ok) {
                const { message } = await res.json();
                throw new Error(message);
            }

            resolve({ success: true });
        } catch (error) {
            reject(error?.message || 'Failed to delete pet');
        }
    })
}