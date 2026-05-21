import { DataTypes } from "sequelize";
import { sequelize } from "../lib/sequalize.js";

export const Transaction = sequelize.define("transaction", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    amount: {
        type: DataTypes.FLOAT
    },
    product_id: {
        type: DataTypes.INTEGER
    },
    user_id: {
        type: DataTypes.INTEGER // Ownership, but no DB FK constraint to Auth Service DB
    }
}, {
})

Transaction.sync({
    alter: true
})
