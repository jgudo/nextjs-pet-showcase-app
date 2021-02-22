import { CustomInputField } from "@/components/common";
import FacebookIcon from "@/components/common/Icons/FacebookIcon";
import GoogleIcon from "@/components/common/Icons/GoogleIcon";
import fetcher from "@/lib/fetcher";
import { Field, Form, Formik } from "formik";
import Link from "next/link";
import Router from "next/router";
import { useState } from "react";
import useSWR from "swr";
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
    const { data: user } = useSWR('api/user', fetcher);

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
        <div className="auth auth_login">
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
                        <h1 className="form_title">Login</h1>
                        <p className="form_subtitle">
                            New user? &nbsp;
                            <Link href="/signup">Create an account</Link>
                        </p>
                        {error && (
                            <h4 style={{ marginBottom: '10px' }} className="msg--error">{error}</h4>
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
                                <Form>
                                    <Field
                                        disabled={isLoading}
                                        name="email"
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
                                    <div className="auth_button">
                                        <button disabled={isLoading} type="submit">Continue</button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                        <span className="social-divider">OR</span>
                        <div className="social-button">
                            <button
                                className="button--block button--google button--social"
                            >
                                <GoogleIcon />
                                Continue with Google
                            </button>
                            <button
                                className="button--block button--fb button--social"
                            >
                                <FacebookIcon />
                                Continue with Facebook
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
