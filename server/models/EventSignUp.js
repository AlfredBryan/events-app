module.exports = (sequelize, DataTypes) => {
  const EventSignUp = sequelize.define("EventSignUp", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
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

  EventSignUp.associate = models => {
    EventSignUp.belongsTo(models.User, {
      as: "usersigned",
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    EventSignUp.belongsTo(models.Event, {
      as: "signedup",
      foreignKey: "eventId",
      onDelete: "CASCADE"
    });
  };

  return EventSignUp;
};
