const { Product, sequelize } = require('../models');

const seedProducts = async () => {
  await sequelize.sync({ alter: true });

  const heatPumpModels = Array.from({ length: 15 }, (_, i) => ({
    type: 'Heat Pump Water Heater',
    modelNumber: `HPWH-${i + 1}`
  }));

  const thermostatModels = Array.from({ length: 15 }, (_, i) => ({
    type: 'Thermostats',
    modelNumber: `THM-${i + 1}`
  }));

  await Product.bulkCreate([...heatPumpModels, ...thermostatModels]);
  console.log('Seed complete');
  process.exit();
};

seedProducts();
