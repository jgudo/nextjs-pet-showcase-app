import { CustomInputField } from "@/components/common";
import { SocialLogin } from "@/components/shared";
import { useCurrentUser } from "@/hooks/useUser";
import { Field, Form, Formik } from "formik";
import Link from "next/link";
import Router from "next/router";
import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import * as Yup from 'yup';

interface IFormState {
    email: string;
    password: string;
}

const SignInSchema = Yup.object().shape({
    email: Yup.string()
        .email('Email is not valid.')
        .required('Email is required.'),
    password: Yup.string()
        .required('Password is required.')
});

const Login = () => {
    const [error, setError] = useState('');
    const [isLoading, setLoading] = useState(false);
    const { user } = useCurrentUser();

    if (user) Router.push('/');

    const onSubmit = async (field: IFormState, { resetForm }) => {
        try {
            setLoading(true);
            const req = await fetch('/api/auth', {
                method: 'POST',
                body: JSON.stringify({ email: field.email, password: field.password }),
                headers: { 'Content-Type': 'application/json' }
            });

            setLoading(false);

            if (!req.ok) {
                const { message } = await req.json();
                return setError(message);
            }

            setError(null);
            resetForm();
            window.location.href = '/';
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div
            className="w-full min-h-screen relative flex justify-center items-center !bg-no-repeat !bg-cover overlay before:bg-black"
            style={{ background: 'url("/pet_bg.jpg")' }}
        >
            <div className="absolute w-full h-full top-0 left-0 bg-black bg-opacity-20" />
            <div className="w-full h-full relative p-5 flex z-10">
                <div className="laptop:block hidden  w-full p-12">
                    <Link href="/">
                        <img
                            alt="Logo"
                            className="w-24 h-24 object-contain"
                            src="/logo.png"
                        />
                    </Link>
                    <h1 className="text-white">
                        Make your <span className="line-through font-normal">pet</span> <span className="font-bold">best friend</span>
                        <br />
                        be known to the world.
                    </h1>
                </div>
                <div className="w-full h-full">
                    <div className="auth_form w-full laptop:w-3/4 h-full bg-white rounded-lg py-8 px-5 laptop:px-12 relative overflow-hidden">
                        <div className="mt-4 laptop:mt-0 laptop:hidden">
                            <Link href="/">
                                <img
                                    alt="Logo"
                                    className="w-12 h-12"
                                    src="/logo.png"
                                />
                            </Link>
                        </div>
                        <h1 className="text-gray-800 mb-2">Login</h1>
                        <p className="text-gray-600 mb-4">
                            New user? &nbsp;
                            <Link href="/signup">Create an account</Link>
                        </p>
                        {error && (
                            <h4 className="text-red-500 bg-red-100 text-center p-2">{error}</h4>
                        )}
                        <Formik
                            initialValues={{
                                email: '',
                                password: '',
                            }}
                            validateOnChange
                            validationSchema={SignInSchema}
                            onSubmit={onSubmit}
                        >
                            {() => (
                                <Form className="space-y-4">
                                    <Field
                                        disabled={isLoading}
                                        name="email"
                                        type="email"
                                        label="Email"
                                        component={CustomInputField}
                                    />
                                    <Field
                                        disabled={isLoading}
                                        name="password"
                                        type="password"
                                        component={CustomInputField}
                                        label="Password"
                                    />
                                    <div className="flex justify-end">
                                        <button className="flex items-center" disabled={isLoading} type="submit">
                                            {isLoading && <AiOutlineLoading className="spin" />}
                                            &nbsp;
                                            Continue
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                        <span className="social-divider">OR</span>
                        <SocialLogin forLogin={true} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
