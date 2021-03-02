import { FC } from "react";
import { FcGoogle } from "react-icons/fc";
import { ImFacebook } from "react-icons/im";

const SocialLogin: FC<{ forLogin?: boolean; }> = ({ forLogin = false }) => {
    return (
        <div className="social-button">
            <a
                className="button button--block button--google button--social"
                href="/api/auth/google"
            >
                <FcGoogle style={{ fontSize: '16px' }} />
                {forLogin ? 'Continue' : 'Sign Up'} with Google
            </a>
            <a
                className="button button--block button--social button--fb"
                href="/api/auth/facebook"
            >
                <ImFacebook style={{ fontSize: '16px' }} />
                {forLogin ? 'Continue' : 'Sign Up'} with Facebook
            </a>
        </div>
    )
};

export default SocialLogin;
