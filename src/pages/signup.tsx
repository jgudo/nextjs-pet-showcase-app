import { CustomInputField } from '@/components/common';
import { SocialLogin } from '@/components/shared';
import { useCurrentUser } from '@/hooks/useUser';
import { IError } from '@/types/types';
import { Field, Form, Formik } from 'formik';
import Link from 'next/link';
import Router from 'next/router';
import { useState } from "react";
import { AiOutlineLoading } from 'react-icons/ai';
import * as Yup from "yup";

interface IFormState {
    email: string;
    password: string;
    name: string;
}

const SignupSchema = Yup.object().shape({
    name: Yup.string()
        .min(4, 'Name length must be greater or equal to 4 chars.')
        .max(60, 'Name length must be less than 60 chars')
        .required('Name is required.'),
    email: Yup.string()
        .email('Email is not valid.')
        .required('Email is required.'),
    password: Yup.string()
        .min(8, 'Password length must be greater or equal to 8 chars.')
        .required('Password is required.')
});

const SignUp = () => {
    const [error, setError] = useState<IError | null>(null);
    const [isLoading, setLoading] = useState(false);
    const { user } = useCurrentUser();

    if (user) Router.push('/');

    const onSubmit = async (field: IFormState) => {
        setLoading(true);
        const req = await fetch('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ //explicitly set fields to avoid unnecessary data to be sent to server
                email: field.email,
                password: field.password,
                name: field.name
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (!req.ok) {
            const { message } = await req.json();
            setLoading(false);
            return setError(message);
        }

        setLoading(false);
        window.location.href = '/';
    };

    return (
        <div
            className="w-full min-h-screen relative flex justify-center items-center !bg-no-repeat !bg-cover overlay before:bg-black"
            style={{ background: 'url("/pet_cat_bg.jpg")' }}
        >
            <div className="absolute w-full h-full top-0 left-0 bg-black bg-opacity-20" />
            <div className="w-full h-full relative p-5 flex z-10">
                <div className="hidden laptop:block w-full p-12">
                    <Link href="/">
                        <img
                            alt="Logo"
                            className="w-28 object-contain mb-8"
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
                    <div className="w-full laptop:w-3/4 h-full bg-white rounded-lg py-8 px-5 laptop:px-12 relative overflow-hidden">
                        <div className="mb-4 laptop:hidden cursor-pointer">
                            <Link href="/">
                                <img
                                    alt="Logo"
                                    className="w-12 object-contain"
                                    src="/logo.png"
                                />
                            </Link>
                        </div>
                        <h1 className="text-gray-800 mb-2">Sign Up</h1>
                        <p className="text-gray-600 mb-4">
                            Already have an account? &nbsp;
                            <Link href="/login">Login</Link>
                        </p>
                        {error && (
                            <h4 className="text-red-500 bg-red-100 text-center p-2">{error}</h4>
                        )}
                        <Formik
                            initialValues={{
                                email: '',
                                password: '',
                                name: ''
                            }}
                            validateOnChange
                            validationSchema={SignupSchema}
                            onSubmit={onSubmit}
                        >
                            {({ errors, touched }) => (
                                <Form className="space-y-4">
                                    <Field
                                        disabled={isLoading}
                                        name="name"
                                        label="* Name"
                                        component={CustomInputField}
                                    />
                                    <Field
                                        disabled={isLoading}
                                        name="email"
                                        label="* Email"
                                        type="email"
                                        component={CustomInputField}
                                    />
                                    <Field
                                        disabled={isLoading}
                                        name="password"
                                        label="* Password"
                                        type="password"
                                        component={CustomInputField}
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
                        <SocialLogin />
                    </div>
                </div>
            </div>
        </div >
    );
};

export default SignUp;
