module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('plans', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('plans');
  },
};
