import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const AdminUsers = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ email: "", password: "", role: "user" });
    const [editId, setEditId] = useState(null);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        if (!user || user.role !== "admin") return;
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/users?admin_id=${user.id}`);
        const data = await res.json();
        if (res.ok) setUsers(data);
    };

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setMsg("");
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/create_user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, admin_id: user.id })
        });
        const data = await res.json();
        if (res.ok) {
            setMsg("Usuario creado");
            setForm({ email: "", password: "", role: "user" });
            fetchUsers();
        } else {
            setMsg(data.msg || "Error");
        }
    };

    const handleEdit = (u) => {
        setEditId(u.id);
        setForm({ email: u.email, password: "", role: u.role });
    };

    const handleUpdate = async e => {
        e.preventDefault();
        setMsg("");
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/edit_user/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, admin_id: user.id })
        });
        const data = await res.json();
        if (res.ok) {
            setMsg("Usuario actualizado");
            setEditId(null);
            setForm({ email: "", password: "", role: "user" });
            fetchUsers();
        } else {
            setMsg(data.msg || "Error");
        }
    };

    const handleDelete = async id => {
        if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/delete_user/${id}?admin_id=${user.id}`, {
            method: "DELETE"
        });
        const data = await res.json();
        if (res.ok) {
            setMsg("Usuario eliminado");
            fetchUsers();
        } else {
            setMsg(data.msg || "Error");
        }
    };

    return (
        <div className="container py-5">
            <h2>Administrar Usuarios</h2>
            <form onSubmit={editId ? handleUpdate : handleSubmit} className="mb-4">
                <div className="row g-2">
                    <div className="col-md-4">
                        <input type="text" name="email" value={form.email} onChange={handleChange} className="form-control" placeholder="Usuario o Email" required />
                    </div>
                    <div className="col-md-4">
                        <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" placeholder="Contraseña" required={!editId} />
                    </div>
                    <div className="col-md-2">
                        <select name="role" value={form.role} onChange={handleChange} className="form-select">
                            <option value="user">Usuario</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <button type="submit" className="btn btn-primary w-100">{editId ? "Guardar" : "Crear"}</button>
                    </div>
                </div>
                {msg && <div className="mt-2 alert alert-info">{msg}</div>}
            </form>
            <div className="card">
                <div className="card-body">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                    <td>
                                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(u)}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.id)}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
