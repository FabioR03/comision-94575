import { UserModel } from "../models/user.model.js";

export default class UserDAO {
    async getByEmail(email) {
        return await UserModel.findOne({ email });
    }
    async getById(id) {
        return await UserModel.findById(id);
    }
    async create(user) {
        return await UserModel.create(user);
    }

    async updatePassword(email, newPassword) {
        return await UserModel.findOneAndUpdate({ email }, { password: newPassword });
    }
    async update(id, data) {
        return await UserModel.findByIdAndUpdate(id, data, { new: true });
    }
}