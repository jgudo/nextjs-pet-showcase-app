import fetcher from '@/lib/fetcher';
import useSWR from 'swr';

export function useCurrentUser() {
    const { data: user, mutate } = useSWR('/api/user', fetcher);
    return [user, { mutate }];
}

export function useUser(id: string) {
    const { data } = useSWR(`/api/users/${id}`, fetcher, { revalidateOnFocus: false });
    return data?.user;
}
