const event = (sequelize, DataTypes) => {
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
    },
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
  });

  Event.associate = function(models) {
    Event.belongsToMany(models.User, {
      through: {
        unique: false,
        model: models.UserEvent
      },
      foreignKey: "eventId"
    });
    Event.belongsTo(models.User, {
      foreignKey: "userId"
    });
  };

  sequelize.sync({ force: true }).then(() => {
    console.log("Database & Table");
  });

  return Event;
};

module.exports = event;
