import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/router";

const Owner = () => {
    const router = useRouter();
    const { uid } = router.query;
    const [user] = useUser(uid as string);

    console.log(user);
    return (
        <div>
            <h1>Pet Owner</h1>
        </div>
    )
};

export default Owner;
