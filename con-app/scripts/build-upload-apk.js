#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const FormData = require('form-data');
const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');
const ProgressBar = require('progress');

// Load environment variables
require('dotenv').config();

const config = {
  serverUrl: process.env.APK_SERVER_URL || 'http://localhost:3000',
  apiKey: process.env.APK_API_KEY || '',
  appPrefix: process.env.APK_PREFIX || 'MyApp',
  buildType: process.env.BUILD_TYPE || 'release', // release or debug
  androidPath: process.env.ANDROID_PATH || './android',
  outputPath: process.env.OUTPUT_PATH || './builds',
};

// Ensure output directory exists
if (!fs.existsSync(config.outputPath)) {
  fs.mkdirSync(config.outputPath, { recursive: true });
}

// Helper functions
const log = {
  info: msg => console.log(chalk.blue('ℹ'), msg),
  success: msg => console.log(chalk.green('✅'), msg),
  error: msg => console.log(chalk.red('❌'), msg),
  warning: msg => console.log(chalk.yellow('⚠️'), msg),
  step: msg => console.log(chalk.magenta('🚀'), chalk.bold(msg)),
};

const formatFileSize = bytes => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
};

const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}_${hour}${minute}`;
};

const getGitCommitHash = () => {
  try {
    const hash = execSync('git rev-parse --short HEAD', {
      encoding: 'utf8',
    }).trim();
    return hash;
  } catch (error) {
    log.warning('Could not get git commit hash, using "unknown"');
    return 'unknown';
  }
};

const checkGradleWrapper = () => {
  const gradlewPath = path.join(config.androidPath, 'gradlew');
  if (!fs.existsSync(gradlewPath)) {
    throw new Error(`Gradle wrapper not found at ${gradlewPath}`);
  }

  // Make gradlew executable on Unix systems
  if (process.platform !== 'win32') {
    try {
      execSync(`chmod +x "${gradlewPath}"`);
    } catch (error) {
      log.warning('Could not make gradlew executable');
    }
  }

  return gradlewPath;
};

const buildAPK = async () => {
  log.step('🏗️  Starting APK build process...');

  const gradlewPath = checkGradleWrapper();
  const buildCommand =
    config.buildType === 'release' ? 'assembleRelease' : 'assembleDebug';

  log.info(`Building ${config.buildType} APK...`);

  const spinner = ora({
    text: 'Building APK... This may take a few minutes',
    spinner: 'dots12',
  }).start();

  return new Promise((resolve, reject) => {
    const gradleProcess = spawn(
      process.platform === 'win32' ? 'gradlew.bat' : './gradlew',
      [buildCommand, '--no-daemon'],
      {
        cwd: config.androidPath,
        stdio: ['pipe', 'pipe', 'pipe'],
      }
    );

    let output = '';
    let errorOutput = '';

    gradleProcess.stdout.on('data', data => {
      output += data.toString();
      // Update spinner with current task
      const lines = data.toString().split('\n');
      const taskLine = lines.find(line => line.includes('> Task :'));
      if (taskLine) {
        spinner.text = `Building APK: ${taskLine.trim()}`;
      }
    });

    gradleProcess.stderr.on('data', data => {
      errorOutput += data.toString();
    });

    gradleProcess.on('close', code => {
      spinner.stop();

      if (code === 0) {
        log.success('APK build completed successfully!');
        resolve({ output, errorOutput });
      } else {
        log.error('APK build failed!');
        console.log(chalk.gray('--- Build Output ---'));
        console.log(output);
        if (errorOutput) {
          console.log(chalk.red('--- Error Output ---'));
          console.log(errorOutput);
        }
        reject(new Error(`Gradle build failed with exit code ${code}`));
      }
    });

    gradleProcess.on('error', error => {
      spinner.stop();
      log.error('Failed to start build process');
      reject(error);
    });
  });
};

const findBuiltAPK = () => {
  const buildDir = path.join(
    config.androidPath,
    'app',
    'build',
    'outputs',
    'apk'
  );
  const releaseDir = path.join(buildDir, config.buildType);

  log.info(`Looking for APK in: ${releaseDir}`);

  if (!fs.existsSync(releaseDir)) {
    throw new Error(`Build directory not found: ${releaseDir}`);
  }

  const apkFiles = fs
    .readdirSync(releaseDir)
    .filter(file => file.endsWith('.apk'));

  if (apkFiles.length === 0) {
    throw new Error(`No APK files found in ${releaseDir}`);
  }

  // Get the most recently created APK
  const apkFile = apkFiles
    .map(file => ({
      name: file,
      path: path.join(releaseDir, file),
      stats: fs.statSync(path.join(releaseDir, file)),
    }))
    .sort((a, b) => b.stats.mtime - a.stats.mtime)[0];

  log.success(
    `Found APK: ${apkFile.name} (${formatFileSize(apkFile.stats.size)})`
  );
  return apkFile.path;
};

const renameAndCopyAPK = originalPath => {
  const date = getCurrentDate();
  const gitHash = getGitCommitHash();
  const newFileName = `${config.appPrefix}_${date}_${gitHash}.apk`;
  const newPath = path.join(config.outputPath, newFileName);

  log.step(`📝 Renaming APK to: ${chalk.cyan(newFileName)}`);

  // Copy file to new location with new name
  fs.copyFileSync(originalPath, newPath);

  const stats = fs.statSync(newPath);
  log.success(`APK renamed and copied to: ${newPath}`);
  log.info(`File size: ${formatFileSize(stats.size)}`);

  return {
    path: newPath,
    filename: newFileName,
    size: stats.size,
  };
};

const uploadAPK = async apkInfo => {
  log.step('📤 Uploading APK to server...');

  if (!config.apiKey) {
    throw new Error(
      'API key not found! Please set APK_API_KEY in your .env file'
    );
  }

  const uploadUrl = `${config.serverUrl}/api/upload`;
  log.info(`Upload URL: ${uploadUrl}`);

  // Create form data
  const form = new FormData();
  const fileStream = fs.createReadStream(apkInfo.path);
  form.append('apk', fileStream, apkInfo.filename);

  // Create progress bar
  let uploadedBytes = 0;
  const progressBar = new ProgressBar(
    `${chalk.cyan('Uploading')} [:bar] ${chalk.green(':percent')} :rate/bps :etas (:current/:total bytes)`,
    {
      complete: '█',
      incomplete: '░',
      width: 40,
      total: apkInfo.size,
      renderThrottle: 100,
    }
  );

  // Track upload progress
  fileStream.on('data', chunk => {
    uploadedBytes += chunk.length;
    progressBar.update(uploadedBytes / apkInfo.size);
  });

  try {
    const response = await axios.post(uploadUrl, form, {
      headers: {
        ...form.getHeaders(),
        'x-api-key': config.apiKey,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 5 * 60 * 1000, // 5 minutes timeout
      onUploadProgress: progressEvent => {
        if (progressEvent.total) {
          const progress = progressEvent.loaded / progressEvent.total;
          progressBar.update(progress);
        }
      },
    });

    progressBar.update(1); // Complete the progress bar
    console.log(); // New line after progress bar

    log.success('APK uploaded successfully! 🎉');
    log.info(`Server response: ${response.data.message}`);

    if (response.data.file) {
      const file = response.data.file;
      log.info(
        `Download URL: ${chalk.cyan(config.serverUrl + file.downloadUrl)}`
      );
      log.info(`File size on server: ${formatFileSize(file.size)}`);
    }

    return response.data;
  } catch (error) {
    console.log(); // New line after progress bar

    if (error.response) {
      log.error(
        `Upload failed: ${error.response.status} - ${error.response.data.error || error.response.statusText}`
      );
      if (error.response.status === 401) {
        log.warning('Please check your API key in the .env file');
      }
    } else if (error.code === 'ECONNREFUSED') {
      log.error('Connection refused. Is the server running?');
      log.info(`Trying to connect to: ${config.serverUrl}`);
    } else if (error.code === 'ENOTFOUND') {
      log.error('Server not found. Please check the server URL');
      log.info(`Current server URL: ${config.serverUrl}`);
    } else {
      log.error(`Upload error: ${error.message}`);
    }
    throw error;
  }
};

const cleanup = apkInfo => {
  if (process.env.CLEANUP_AFTER_UPLOAD === 'true') {
    log.step('🧹 Cleaning up...');
    try {
      fs.unlinkSync(apkInfo.path);
      log.success('Temporary APK file cleaned up');
    } catch (error) {
      log.warning('Could not clean up temporary file');
    }
  } else {
    log.info(`APK saved locally at: ${chalk.cyan(apkInfo.path)}`);
  }
};

const displayConfig = () => {
  console.log(chalk.bold.cyan('\n🔧 Configuration:'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(`${chalk.yellow('Server URL:')} ${config.serverUrl}`);
  console.log(`${chalk.yellow('App Prefix:')} ${config.appPrefix}`);
  console.log(`${chalk.yellow('Build Type:')} ${config.buildType}`);
  console.log(`${chalk.yellow('Android Path:')} ${config.androidPath}`);
  console.log(`${chalk.yellow('Output Path:')} ${config.outputPath}`);
  console.log(`${chalk.yellow('API Key:')} ${config.apiKey}`);
  console.log(chalk.gray('─'.repeat(50)));
};

const main = async () => {
  console.log(chalk.bold.magenta('\n🚀 APK Build & Upload Tool\n'));

  displayConfig();

  try {
    // Step 1: Build APK
    await buildAPK();

    // Step 2: Find built APK
    log.step('🔍 Locating built APK...');
    const builtApkPath = findBuiltAPK();

    // Step 3: Rename and copy APK
    const apkInfo = renameAndCopyAPK(builtApkPath);

    // Step 4: Upload APK
    await uploadAPK(apkInfo);

    // Step 5: Cleanup (optional)
    cleanup(apkInfo);

    console.log(chalk.bold.green('\n✨ Process completed successfully! ✨\n'));
  } catch (error) {
    log.error(`Process failed: ${error.message}`);

    // Show helpful tips based on error type
    if (error.message.includes('Gradle')) {
      console.log(chalk.yellow('\n💡 Tips:'));
      console.log("• Make sure you're running this from the project root");
      console.log('• Ensure Android SDK is properly configured');
      console.log('• Try running: cd android && ./gradlew clean');
    } else if (error.message.includes('API key')) {
      console.log(chalk.yellow('\n💡 Tips:'));
      console.log('• Create a .env file with APK_API_KEY=your-api-key');
      console.log('• Make sure the API key matches your server configuration');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log(chalk.yellow('\n💡 Tips:'));
      console.log('• Make sure your APK server is running');
      console.log('• Check the server URL in your .env file');
      console.log('• Test server: curl http://your-server/api/files');
    }

    process.exit(1);
  }
};

// Handle process interruption gracefully
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\n⚠️  Process interrupted by user'));
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(chalk.yellow('\n\n⚠️  Process terminated'));
  process.exit(0);
});

// Run the main function
if (require.main === module) {
  main();
}

module.exports = {
  main,
  buildAPK,
  uploadAPK,
  config,
};
