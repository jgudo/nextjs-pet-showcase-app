import { FC } from "react";
import { FcGoogle } from "react-icons/fc";
import { ImFacebook } from "react-icons/im";

const SocialLogin: FC<{ forLogin?: boolean; }> = ({ forLogin = false }) => {
    return (
        <div className="space-y-4">
            <a
                className="button w-full block text-gray-800 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 border border-solid border-gray-200 text-center py-4"
                href="/api/auth/google"
            >
                <FcGoogle className="text-md absolute top-0 left-4 bottom-0 my-auto" />
                {forLogin ? 'Continue' : 'Sign Up'} with Google
            </a>
            <a
                className="button w-full block text-white hover:text-white bg-fb hover:bg-fb-hover text-center py-4"
                href="/api/auth/facebook"
            >
                <ImFacebook className="text-md absolute top-0 left-4 bottom-0 my-auto" />
                {forLogin ? 'Continue' : 'Sign Up'} with Facebook
            </a>
        </div>
    )
};

export default SocialLogin;
