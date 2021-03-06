const userEvent = (sequelize, DataTypes) => {
  const UserEvent = sequelize.define("UserEvent", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    eventId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNumeric: true,
        notEmpty: true
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  });

  UserEvent.associate = models => {
    UserEvent.belongsTo(models.User, {
      foreignKey: "userId",
      sourceKey: models.User.id
    });
    UserEvent.belongsTo(models.Event, {
      foreignKey: "eventId",
      sourceKey: models.Event.id
    });
  };

  sequelize.sync({ force: true }).then(() => {
    console.log("Database & Table");
  });

  return UserEvent;
};

module.exports = userEvent;
