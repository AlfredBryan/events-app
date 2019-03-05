const user = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
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

  User.beforeCreate(function(user) {
    user.fullName = user.fullName.toLowerCase();
    user.email = user.email.toLowerCase();

    return user;
  });

  User.associate = function(models) {
    User.belongsToMany(models.Event, {
      through: {
        unique: false,
        model: models.UserEvent
      },
      foreignKey: "userId"
    });
    User.hasMany(models.Event, {
      foreignKey: "userId"
    });
  };

  sequelize.sync({ force: true }).then(() => {
    console.log("Database & Table");
  });

  return User;
};

module.exports = user;
