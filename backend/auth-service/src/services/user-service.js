import { User } from "../repository/user-repository.js";
import { Op } from "sequelize";

export const getAllUsers = async (ids = [], page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    
    if (ids && ids.length > 0) {
        return await User.findAndCountAll({ where: { id: { [Op.in]: ids } }, limit, offset });
    }
    return await User.findAndCountAll({ limit, offset });
};

export const getUserById = async (id) => {
    return await User.findByPk(parseInt(id));
};

export const createUser = async (nama, role) => {
    return await User.create({ nama, role: role || 'user' });
};

export const updateUser = async (id, nama, role) => {
    const user = await User.findByPk(parseInt(id));
    if (!user) return null;
    await user.update({ nama, role: role || user.role });
    return user;
};

export const deleteUser = async (id) => {
    const user = await User.findByPk(parseInt(id));
    if (!user) return false;
    await user.destroy();
    return true;
};
