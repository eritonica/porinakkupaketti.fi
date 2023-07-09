import { exec } from 'child_process';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Database configuration
const connectionString = process.env.ATLAS_URI; // MongoDB Atlas connection string
const backupDir = process.env.ATLAS_BACKUP_DIR;  // Backup directory

const backupUsingMongodump = () => {
  // Backup command using mongodump
  const backupCommand = `mongodump --uri "${connectionString}" --archive="${backupDir}/backup.archive"`;

  // Execute the backup command using mongodump
  exec(backupCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Backup using mongodump failed: ${error.message}`);
    } else if (stderr) {
      console.error(`Backup using mongodump failed: ${stderr}`);
    } else {
      console.log('Backup using mongodump completed successfully');
    }
  });
};

const backupUsingMongorestore = () => {
  // Backup command using mongorestore
  const backupCommand = `mongorestore --uri="${connectionString}" --archive="${backupDir}/backup.archive" --drop`;

  // Execute the backup command using mongorestore
  exec(backupCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Backup using mongorestore failed: ${error.message}`);
    } else if (stderr) {
      console.error(`Backup using mongorestore failed: ${stderr}`);
    } else {
      console.log('Backup using mongorestore completed successfully');
    }
  });
};

// Check if mongodump is installed
exec('mongodump --version', (error) => {
  if (error) {
    console.log('mongodump is not installed. Trying mongorestore...');
    backupUsingMongorestore();
  } else {
    if (!connectionString) {
      console.error('MongoDB Atlas connection string not found. Please provide a valid connection string.');
      return;
    }
    backupUsingMongodump();
  }
});
