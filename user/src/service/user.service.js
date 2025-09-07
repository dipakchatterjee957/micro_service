import userQuery from "../query/user.query.js";
import connection from "../utils/mysql.controller.js";
import sequelize from "../utils/sequelize.js";
import User from "../models/User.js";
import UserRoleMap from "../models/UserRoleMap.js";
import UserRoleMaster from "../models/UserRoleMaster.js";
import bcrypt from "bcryptjs";
import amqp from "amqplib";

export default new class Userservice {

    // getUserList = async (req) => {
    //     try {
    //         const queryString = userQuery.GET_USER_LIST;
    //         const params = [ req.params.branch_master_id];
    //         const data = await connection.query(queryString, params);
    //         return data.response;
    //     } catch (error) {
    //         throw error;
    //     }
    // };

    async getUserAllList(req) {
        try {
            const users = await User.findAll({
                where: { active_flag: "A" },
                include: [
                    {
                        model: UserRoleMaster,
                        as: "role_details",
                        through: { attributes: [] }, // hide join table data
                        attributes: ["user_role_master_id", "role_code", "role_description"] // pick only required fields
                    }
                ]
            });
            return users;
        } catch (error) {
            throw error;
        }
    }

    async getUserListByBranch(req) {
        try {
            const { branch_master_id } = req.params;

            const users = await User.findAll({
                where: { branch_master_id, active_flag: "A" }, // filtering like your old query
                include: [
                    {
                        model: UserRoleMaster,
                        as: "role_details",
                        attributes: ["user_role_master_id", "role_code", "role_description"],
                        through: { attributes: [] }
                    }
                ],
                attributes: [
                    "user_master_id",
                    "user_name",
                    "login_id",
                    "mobile_primary",
                    "active_flag"
                ],
                raw: true,   // 👈 makes it flat
                nest: false  // 👈 prevents nesting under role_details
            });

            const formatted = users.map(user => ({
                user_master_id: user.user_master_id,
                user_name: user.user_name,
                login_id: user.login_id,
                mobile_primary: user.mobile_primary,
                active_flag: user.active_flag,
                user_role_master_id: user["role_details.user_role_master_id"],   // 👈 flatten
                role_code: user["role_details.role_code"],
                role_description: user["role_details.role_description"]
            }));

            return formatted;
        } catch (error) {
            throw error;
        }
    }

    async createUser(req) {
        const t = await sequelize.transaction(); // start transaction
        try {
            // 1. Create User
            const { user_role_master_id, ...userData } = req.body;
            const hashsalt = bcrypt.genSaltSync(10);
            userData.password = bcrypt.hashSync(userData.password, hashsalt);


            const user = await User.create(userData, { transaction: t });

            // 2. Insert mapping into user_role_map
            await UserRoleMap.create({
                user_master_id: user.user_master_id,
                user_role_master_id: user_role_master_id,
                created_by: userData.created_by
            }, { transaction: t });

            // 3. Commit transaction
            await t.commit();

            return user; // return newly created user

        } catch (error) {
            // Rollback if anything fails
            await t.rollback();
            throw error;
        }
    }

    // Update user
    async updateUser(req) {
        try {
            const { user_master_id } = req.params;
            const [updated] = await User.update(req.body, {
                where: { user_master_id }
            });

            if (updated) {
                return await User.findByPk(user_master_id); // return updated user
            }
            throw new Error("User not found");
        } catch (error) {
            throw error;
        }
    }

    // Delete user
    async deleteUser(req) {
        try {
            const { user_master_id } = req.params;
            const deleted = await User.destroy({
                where: { user_master_id }
            });

            if (!deleted) throw new Error("User not found");
            return { message: "User deleted successfully" };
        } catch (error) {
            throw error;
        }
    }



    async login(req) {
        try {
            const { login_id, ...userData } = req.body;
            const users = await User.findOne({
                where: { login_id, active_flag: "A" },
                include: [
                    {
                        model: UserRoleMaster,
                        as: "role_details",
                        attributes: ["user_role_master_id", "role_code", "role_description"],
                        through: { attributes: [] }
                    }
                ],
                attributes: [
                    "user_master_id",
                    "user_name",
                    "login_id",
                    "mobile_primary",
                    "password",
                    "active_flag"
                ],
                raw: true,
                nest: false
            });

            if (!users) {
                throw new Error("User not found");
            }

            const passwordMatch = await bcrypt.compare(userData.password, users.password);

            if (passwordMatch) {
                // Publish to RabbitMQ
                await this.publishLoginEvent(users);
                return users;
            } else {
                throw new Error("Password mismatch");
            }
        } catch (error) {
            // 🔑 Preserve actual error message
            throw new Error(error.message || "Login failed");
        }
    }

    async publishLoginEvent(user) {
        try {
            const connection = await amqp.connect("amqp://guest:guest@localhost:5672");
            const channel = await connection.createChannel();
            const queue = "user_login_events";

            await channel.assertQueue(queue, { durable: true });

            const message = JSON.stringify({
                userId: user.user_master_id,
                loginId: user.login_id,
                loginTime: new Date(),
                time: new Date().toISOString()
            });

            channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
            console.log("✅ Sent to RabbitMQ:", message);
        } catch (err) {
            console.error("RabbitMQ Publish Error:", err.message);
        }
    }


};
