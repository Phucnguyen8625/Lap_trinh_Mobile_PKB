const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Exclude server/ folder — Node.js backend, không bundle vào app
config.resolver.blockList = [
  new RegExp(path.resolve(__dirname, 'server') + '/.*'),
];

module.exports = config;
