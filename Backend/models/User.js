// models/User.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import bcrypt from "bcryptjs";

const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, allowNull: false },
    

  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  mobile: { type: DataTypes.STRING },
  role: { type: DataTypes.ENUM("student", "recruiter", "admin"), allowNull: false, defaultValue: "student" },
 
  
}, {
  tableName: "users",
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    },
    beforeUpdate: async (user) => {
      if (user.changed("password")) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

export default User;
