const { DataTypes } = require("sequelize");
const db = require("../config/db");

const TestRating = db.define("TestRating", {
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1, max: 5 },
        },
        feedback: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        timestamps: true,
        updatedAt: "updated_at",
        createdAt: "created_at",
    }
);

module.exports = TestRating;
