import { useState } from "react";
import api from "../api";

export default function Register() {
    const [data, setData] = useState({ username: "", email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post("/auth/register", data);
        alert("Registration successful!");
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input placeholder="Username" onChange={(e) => setData({ ...data, username: e.target.value })} />
            <input placeholder="Email" onChange={(e) => setData({ ...data, email: e.target.value })} />
            <input placeholder="Password" type="password" onChange={(e) => setData({ ...data, password: e.target.value })} />
            <button type="submit">Register</button>
        </form>
    );
}
