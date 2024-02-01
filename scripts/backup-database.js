const { exec } = require('child_process');

function backupDatabase() {
  const dbName = process.env.DB_NAME;
  const dbUser = process.env.DB_USER;
  const dbHost = process.env.DB_HOST;
  const dbPort = process.env.DB_PORT || 5432;
  const dbPassword = process.env.DB_PASSWORD;

  const backupPath = `/backup_${Date.now()}.sql`;

  const command = `PGPASSWORD=${dbPassword} pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} ${dbName} > ${backupPath}`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      // handle error
      console.error('Backup error:', err);
      return;
    }
    console.log('Backup completed successfully');
  });
}
