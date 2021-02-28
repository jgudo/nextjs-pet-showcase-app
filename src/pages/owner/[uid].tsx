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

    return (
        <div className="container">
            <div className="card-container">
                <ProfileCard user={user} />
            </div>
            <div className="grid-container">
                {!error && (
                    <h1 className="title">
                        {user.isOwnProfile ? 'My Pets' : `${user.name}'s Pets`}
                    </h1>
                )}
                {error
                    ? <SomethingWentWrong />
                    : !pets
                        ? <h1>Loading...</h1>
                        : <PetGrid pets={pets.data} />
                }
            </div>
            <style jsx>
                {`
                    .container {
                        width: 100%;
                        padding: 30px 50px;
                        margin-top: 80px;
                        display: flex;
                        align-items: flex-start;
                    }

                    .grid-container {
                        width: 100%;
                        margin-left: 30px;
                    }

                    .card-container {
                        width: 300px;
                        position: sticky;
                        top: 80px;
                    }

                    .title {
                        margin-bottom: 40px;
                    }
                `}
            </style>
        </div>
    )
};

export default Owner;
