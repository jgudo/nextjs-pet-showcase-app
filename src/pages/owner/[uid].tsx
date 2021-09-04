import { Footer } from '@/components/common';
import { AddNewButton, PetGrid, SomethingWentWrong } from "@/components/shared";
import PageNotFound from "@/components/shared/Messages/PageNotFound";
import ProfileCard from "@/components/shared/ProfileCard";
import { useUser } from "@/hooks/useUser";
import fetcher from "@/lib/fetcher";
import { useRouter } from "next/router";
import Skeleton from 'react-loading-skeleton';
import useSWR from "swr";

const Owner = () => {
    const router = useRouter();
    const { uid } = router.query;
    const { user, error: userError } = useUser(uid as string);
    const { data: pets, error } = useSWR(`/api/pets?owner=${uid}`, fetcher);

    if (userError) return <PageNotFound />

    const renderErrorPage = () => {
        if (error.statusCode === 404) {
            return <h1>{user.name} has no pet.</h1>
        } else {
            return <SomethingWentWrong />
        }
    }

    return (
        <div className="w-full py-8 mt-10 flex items-start flex-col laptop:mt-20 laptop:px-20 laptop:flex-row">
            <div className="flex-basis-100 w-full laptop:flex-basis-30 laptop:sticky laptop:top-20 ">
                <ProfileCard user={user} />
            </div>
            <div className="flex-basis-100 w-full laptop:flex-basis-70 p-4 laptop:p-0 laptop:ml-8">
                {!error && (
                    <div className="w-full flex items-center justify-between mb-10">
                        {!user ? (
                            <Skeleton width={200} height={40} />
                        ) : (
                            <h1 className="text-2xl laptop:text-4xl">
                                {user?.isOwnProfile ? 'My Pets' : `${user?.name}'s Pets`}
                            </h1>
                        )}
                        {user && user.isOwnProfile && <AddNewButton />}
                    </div>
                )}
                {error
                    ? renderErrorPage()
                    : !pets
                        ? <PetGrid isLoading={true} pets={[]} />
                        : <PetGrid isLoading={false} pets={pets.data} />
                }
                <Footer />
            </div>
        </div>
    )
};

export default Owner;
