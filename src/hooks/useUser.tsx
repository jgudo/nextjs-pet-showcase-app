import fetcher from '@/lib/fetcher';
import useSWR from 'swr';

export function useCurrentUser() {
    const { data, error, mutate } = useSWR('/api/user', fetcher);
    const user = data?.user || null;

    return { user, error, mutate };
}

export function useUser(id: string) {
    const { data, error, mutate } = useSWR(`/api/user/${id}`, fetcher, { revalidateOnFocus: false });
    const user = data?.user || null;

    return { user, error, mutate };
}
