import UserDTO from "../dto/user.dto.js";

export default class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getUser(email) {
        return await this.dao.getByEmail(email);
    }

    async getUserDTO(email) {
        const user = await this.dao.getByEmail(email);
        return user ? new UserDTO(user) : null;
    }

    async createUser(user) {
        return await this.dao.create(user);
    }
}