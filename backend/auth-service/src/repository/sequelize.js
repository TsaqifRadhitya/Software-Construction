import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'auth.sqlite'
});

export const checkConnection = async () => {
    await sequelize.authenticate();
}
