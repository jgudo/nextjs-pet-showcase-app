import fetcher from "@/lib/fetcher";
import Router from "next/router";
import { useState } from "react";
import useSWR from "swr";

const Login = () => {
    const [field, setField] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { data: user } = useSWR('api/user', fetcher);

    if (user) Router.push('/');

    const onFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const name = e.target.name;

        setField({ ...field, [name]: val });
    };

    const onSubmit = async () => {
        if (field.email && field.password) {
            try {
                const req = await fetch('/api/auth', {
                    method: 'POST',
                    body: JSON.stringify({ email: field.email, password: field.password }),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!req.ok) {
                    const { message } = await req.json();
                    return setError(message);
                }

                window.location.href = '/';
            } catch (err) {
                console.log(err);
            }
        }
    }

    return (
        <div>
            <h1>Login</h1>
            {error && (
                <h6>{error}</h6>
            )}
            <input
                type="text"
                name="email"
                onChange={onFieldChange}
                placeholder="Email"
                value={field.email}
            />
            <input
                type="password"
                name="password"
                onChange={onFieldChange}
                placeholder="Password"
                value={field.password}
            />
            <button onClick={onSubmit}>Log In</button>
        </div>
    );
};

export default Login;
