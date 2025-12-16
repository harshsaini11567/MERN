import { useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
    const { login } = useContext(AuthContext);
    const [data, setData] = useState({ email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await api.post("/auth/login", data);
        login(res.data);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input placeholder="Email" onChange={(e) => setData({ ...data, email: e.target.value })} />
            <input placeholder="Password" type="password" onChange={(e) => setData({ ...data, password: e.target.value })} />
            <button type="submit">Login</button>
        </form>
    );
}
