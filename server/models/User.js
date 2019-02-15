module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  });

  User.associate = models => {
    User.hasMany(models.EventSignUp, {
      as: "user",
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
  };

  User.associate = models => {
    User.hasMany(models.Event, {
      as: "user",
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
  };

  return User;
};
