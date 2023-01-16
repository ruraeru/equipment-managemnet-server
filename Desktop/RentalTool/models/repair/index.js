module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "repairs",
        {
            repair_id : {
                primaryKey : true,
                autoIncrement: true,
                type : DataTypes.INTEGER
            },
            
            repair_reason : {
                allowNull: false,
                type: DataTypes.STRING(255)
            },

            repair_create_at : {
                allowNull: false,
                type: DataTypes.DATE
            },

            is_repaired : {
                allowNull: false,
                type : DataTypes.INTEGER
            }

        },
        {
            charset: "utf8",
            collate: "utf8_general_ci",
            timestamps: false
        }
    )
}