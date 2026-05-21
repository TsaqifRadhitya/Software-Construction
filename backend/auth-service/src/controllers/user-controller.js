import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../services/user-service.js";
import { response } from "../utils/response.js";

export const getMe = (req, res) => {
    return res.status(200).json(response(req.user));
};

export const listUsers = async (req, res) => {
    let ids = [];
    if (req.query.ids) {
        ids = req.query.ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const users = await getAllUsers(ids, page, limit);
    return res.json(response(users));
};

export const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json(response(undefined, undefined, "Not Found", 404));
        }
        return res.json(response(user));
    } catch {
        return res.status(404).json(response(undefined, undefined, "Not Found", 404));
    }
};

export const create = async (req, res) => {
    const { nama, role } = req.body;
    if (!nama) {
        return res.status(400).json(response(undefined, { name: "name is required" }, "Validation Exception", 400));
    }
    const newUser = await createUser(nama, role);
    return res.status(201).json(response(newUser, undefined, "Created", 201));
};

export const update = async (req, res) => {
    const { id } = req.params;
    const { nama, role } = req.body;
    if (!nama) {
        return res.status(400).json(response(undefined, { name: "name is required" }, "Validation Exception", 400));
    }
    try {
        const user = await updateUser(id, nama, role);
        if (!user) {
            return res.status(404).json(response(undefined, undefined, "Not Found", 404));
        }
        return res.json(response(user));
    } catch {
        return res.status(404).json(response(undefined, undefined, "Not Found", 404));
    }
};

export const remove = async (req, res) => {
    const { id } = req.params;
    try {
        const success = await deleteUser(id);
        if (!success) {
            return res.status(404).json(response(undefined, undefined, "Not Found", 404));
        }
        return res.status(200).json(response(undefined, undefined, "No Content", 204));
    } catch {
        return res.status(404).json(response(undefined, undefined, "Not Found", 404));
    }
};
