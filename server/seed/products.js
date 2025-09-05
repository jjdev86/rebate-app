// seed.js
const { Product, sequelize } = require('../models');

// Generate a 7-digit ENERGY STAR ID (string, zero-padded)
const energyStarId = () =>
  String(Math.floor(Math.random() * 10_000_000)).padStart(7, '0');

const seedProducts = async () => {
  await sequelize.sync({ alter: true });

  // === SMART THERMOSTATS ===
  const thermostatModels = [
    { brand: 'ecobee', modelNumber: 'EB-STATE6', name: 'Smart Thermostat Premium' },
    { brand: 'ecobee', modelNumber: 'EB-STATE6L', name: 'Smart Thermostat Enhanced' },
    { brand: 'Google Nest', modelNumber: 'GA0####-**', name: 'Nest Thermostat (2020)' },
    { brand: 'Google Nest', modelNumber: 'T3###**', name: 'Nest Learning Thermostat' },
    { brand: 'Honeywell Home', modelNumber: 'RCHT8610WF****', name: 'T5 Wi-Fi' },
    { brand: 'Honeywell Home', modelNumber: 'TH6220WF****', name: 'T6 Pro Wi-Fi' },
    { brand: 'Emerson Sensi', modelNumber: 'ST75S', name: 'Sensi Touch' },
  ].map(x => ({
    type: 'ST',
    description: 'Smart Thermostat',
    brand: x.brand,
    modelNumber: x.modelNumber,
    name: `${x.brand} ${x.name}`,
    energyStarId: energyStarId(),
  }));

  // === HEAT PUMP WATER HEATERS ===
  const heatPumpModels = [
    { brand: 'A. O. Smith', modelNumber: 'HPTU-50N 1**', name: 'Voltex Hybrid 50-gal' },
    { brand: 'A. O. Smith', modelNumber: 'HPTU-66N 1**', name: 'Voltex Hybrid 66-gal' },
    { brand: 'Bradford White', modelNumber: 'RE2H50S*-*****', name: 'AeroTherm 50-gal' },
    { brand: 'Bradford White', modelNumber: 'RE2H80T*-*****', name: 'AeroTherm 80-gal' },
    { brand: 'Hubbell', modelNumber: 'ME50HPT', name: 'ME50HPT 50-gal' },
    { brand: 'LG', modelNumber: 'APHWC501M', name: 'Heat Pump Water Heater 50-gal' },
  ].map(x => ({
    type: 'HPWH',
    description: 'Heat Pump Water Heater',
    brand: x.brand,
    modelNumber: x.modelNumber,
    name: `${x.brand} ${x.name}`,
    energyStarId: energyStarId(),
  }));

  await Product.bulkCreate([...thermostatModels, ...heatPumpModels], {
    validate: true,
  });

  console.log('Seed complete');
  process.exit(0);
};

seedProducts();
