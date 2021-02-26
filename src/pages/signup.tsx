import { CustomInputField, FacebookIcon, GoogleIcon } from '@/components/common';
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
        const req = await fetch('/api/signup', {
            method: 'POST',
            body: JSON.stringify({ //explicitly set fields to avoid unnecessary data to be sent to server
                email: field.email,
                password: field.password,
                name: field.name
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (!req.ok) {
            const err = await req.json();
            console.log(err);
            return setError(err);
        }

        setLoading(false);
        window.location.href = '/';
    };

    return (
        <div className="auth auth_signup">
            <div className="auth_wrapper">
                <div className="auth_brand">
                    <img src="/logo.png" alt="" />
                    <h1 className="tagline">
                        Make your <span className="strike">pet</span> <span className="bold">best friend</span>
                        <br />
                        be known to the world.
                    </h1>
                </div>
                <div className="auth_formWrapper">
                    <div className="auth_form">
                        {(error && error.status !== 'validation-error') && (
                            <h4 className="auth-error-message">{error.message}</h4>
                        )}
                        <h1 className="form_title">Sign Up</h1>
                        <p className="form_subtitle">
                            Already have an account? &nbsp;
                            <Link href="/login">Login</Link>
                        </p>
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
                                <Form>
                                    <Field
                                        disabled={isLoading}
                                        name="name"
                                        label="Name"
                                        component={CustomInputField}
                                    />
                                    <Field
                                        disabled={isLoading}
                                        name="email"
                                        label="Email"
                                        type="email"
                                        component={CustomInputField}
                                    />
                                    <Field
                                        disabled={isLoading}
                                        name="password"
                                        label="Password"
                                        type="password"
                                        component={CustomInputField}
                                    />
                                    <div className="auth_button">
                                        <button disabled={isLoading} type="submit">
                                            {isLoading && <AiOutlineLoading className="spin" />}
                                            &nbsp;
                                            Continue
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                        <span className="social-divider">OR</span>
                        <div className="social-button">
                            <button
                                className="button--social button--block button--google"
                            >
                                <GoogleIcon />
                                Sign Up with Google
                            </button>
                            <button
                                className="button--social button--block button--fb"
                            >
                                <FacebookIcon />
                                Sign Up with Facebook
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default SignUp;
