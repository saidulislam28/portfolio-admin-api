const { withAppBuildGradle } = require('@expo/config-plugins');

function applyReleaseKeystore(buildGradle, params) {
  const { keystorePath, keystorePassword, keyAlias, keyPassword } = params;

  // Add signing config if not already present
  if (!buildGradle.includes('signingConfigs {')) {
    buildGradle = buildGradle.replace(
      /android\s*{/,
      `android {
        signingConfigs {
            release {
                storeFile file('${keystorePath}')
                storePassword '${keystorePassword}'
                keyAlias '${keyAlias}'
                keyPassword '${keyPassword}'
            }
        }`
    );
  }

  // Add signing config to release build type if not present
  if (!buildGradle.includes('signingConfig signingConfigs.release')) {
    buildGradle = buildGradle.replace(
      /buildTypes\s*{\s*release\s*{/,
      `buildTypes {
          release {
              signingConfig signingConfigs.release
          `
    );
  }

  return buildGradle;
}

const withAndroidReleaseKeystore = (config, params) => {
  return withAppBuildGradle(config, config => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents = applyReleaseKeystore(config.modResults.contents, params);
    } else {
      throw new Error('Cannot configure release keystore because the build.gradle is not groovy');
    }
    return config;
  });
};

module.exports = withAndroidReleaseKeystore;