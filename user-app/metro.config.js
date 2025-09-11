// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');


/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

//start local package config
const localPackagePath = path.resolve(__dirname, '../packages/common');
config.watchFolders = [localPackagePath];
config.resolver.alias = {
  '@sm/common': localPackagePath,
};

//start react-native package config
const RNpackagePath = path.resolve(__dirname, '../packages/react-native');
config.watchFolders = [RNpackagePath];
config.resolver.alias = {
  '@sm/react-native': RNpackagePath,
};

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(localPackagePath, 'node_modules'),
];
config.resolver.blockList = [
  // Block react-native in the local package
  new RegExp(`${localPackagePath}/node_modules/react-native/.*`),
  // Block react to avoid duplicate React instances
  new RegExp(`${localPackagePath}/node_modules/react/.*`),
  // Block expo modules in local package
  new RegExp(`${localPackagePath}/node_modules/expo/.*`),
  new RegExp(`${localPackagePath}/node_modules/@expo/.*`),
];
// end local package config

module.exports = config;
