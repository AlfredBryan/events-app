module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define("Event", {
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
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  });

  Event.associate = models => {
    Event.belongsTo(models.User, {
      as: "user",
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
  };

  Event.associate = models => {
    Event.hasMany(models.EventSignUp, {
      as: "event",
      foreignKey: "eventId",
      onDelete: "CASCADE"
    });
  };

  return Event;
};
