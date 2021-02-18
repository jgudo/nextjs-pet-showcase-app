import Router from 'next/router';
import { useState } from "react";

const Register = () => {
    const [field, setField] = useState({
        email: '',
        password: '',
        name: ''
    });

    const onFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const name = e.target.name;

        setField({ ...field, [name]: val });
    };

    const onSubmit = async () => {
        if (Object.values(field).every(val => Boolean(val))) {
            await fetch('/api/register', {
                method: 'POST',
                body: JSON.stringify({ //explicitly set fields to avoid unnecessary data to be sent to server
                    email: field.email,
                    password: field.password,
                    name: field.name
                }),
                headers: { 'Content-Type': 'application/json' },
            });

            Router.push('/');
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <input
                type="text"
                name="name"
                onChange={onFieldChange}
                placeholder="Full Name"
                required
                value={field.name}
            />
            <input
                type="email"
                name="email"
                onChange={onFieldChange}
                placeholder="Email"
                required
                value={field.email}
            />
            <input
                type="password"
                name="password"
                onChange={onFieldChange}
                placeholder="Password"
                required
                value={field.password}
            />
            <button onClick={onSubmit}>Log In</button>
        </div>
    );
};

export default Register;
