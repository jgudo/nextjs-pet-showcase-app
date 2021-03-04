import { PetGrid, SomethingWentWrong } from "@/components/shared";
import PageNotFound from "@/components/shared/Messages/PageNotFound";
import ProfileCard from "@/components/shared/ProfileCard";
import { useUser } from "@/hooks/useUser";
import fetcher from "@/lib/fetcher";
import { useRouter } from "next/router";
import useSWR from "swr";

const Owner = () => {
    const router = useRouter();
    const { uid } = router.query;
    const { user, error: userError } = useUser(uid as string);
    const { data: pets, error } = useSWR(`/api/pets?owner=${uid}`, fetcher);

    if (userError) return <PageNotFound />
    if (!user) return <h1>Loading...</h1>

    const renderErrorPage = () => {
        if (error.statusCode === 404) {
            return <h1>{user.name} has no pet.</h1>
        } else {
            return <SomethingWentWrong />
        }
    }

    return (
        <div className="w-full py-8 px-20 mt-20 flex items-start">
            <div className="flex-basis-30 sticky top-20">
                <ProfileCard user={user} />
            </div>
            <div className="flex-basis-70 ml-8">
                {!error && (
                    <h1 className="mb-10">
                        {user.isOwnProfile ? 'My Pets' : `${user.name}'s Pets`}
                    </h1>
                )}
                {error
                    ? renderErrorPage()
                    : !pets
                        ? <h1>Loading...</h1>
                        : <PetGrid pets={pets.data} />
                }
            </div>
        </div>
    )
};

export default Owner;
