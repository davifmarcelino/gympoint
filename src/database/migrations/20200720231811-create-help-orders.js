module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('help_orders', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      student_id: {
        references: { model: 'students', key: 'id' },
        type: Sequelize.INTEGER,
        allowNull: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      question: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      answer: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      answer_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('help_orders');
  },
};
