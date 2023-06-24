/* eslint-disable no-undef */

var backupStatus; // {active: boolean}

MDS.init(function (msg) {
  if (msg.event === "inited") {
    // create schema
    MDS.sql(
      "CREATE TABLE IF NOT EXISTS backups (id bigint auto_increment, filename varchar(256), block varchar(256), timestamp TIMESTAMP)"
    );

    MDS.keypair.get("backupStatus", function (response) {
      if (response.status) {
        var status = JSON.parse(response.value);
        backupStatus = status;
      }
    });
  }
  if (msg.event === "MDS_TIMER_10SECONDS") {
    // check status..
    MDS.keypair.get("backupStatus", function (response) {
      if (response.status) {
        var status = JSON.parse(response.value);
        backupStatus = status;
      }
    });
    MDS.log("MDS 1 hour time in play.");
    MDS.log(`BackupStatus ${JSON.stringify(backupStatus)}`);
    var autoBackupDisabled =
      !backupStatus ||
      (backupStatus && "active" in backupStatus && !backupStatus.active);
    if (autoBackupDisabled) {
      MDS.log("Backup is currently disabled.");
      return;
    }

    createBackup();
  }
});

// SELECT * FROM news WHERE date >= now() + INTERVAL 1 DAY;
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
function createBackup() {
  MDS.log("Assert table emptiness, create backup on truthy.");
  MDS.sql("SELECT COUNT(*) FROM backups", function (response) {
    MDS.log(JSON.stringify(response));
    var tableEmpty = response.count === 0;
    MDS.log(`Sql table count -> ${tableEmpty}`);

    if (tableEmpty) {
      var today = new Date();
      var fileName = `minima_backup_${today.getDay()}${
        monthNames[today.getMonth()]
      }${today.getFullYear()}_${today.getHours()}${today.getMinutes()}.bak`;
      MDS.log(`Creating a new backup file with name -> ${fileName}`);
      MDS.cmd(`backup file:${fileName} password:"auto"`, function (response) {
        MDS.log(JSON.stringify(response));
        if (response.status) {
          MDS.log("Backup has been created, inserting row into table");
          MDS.sql(
            `INSERT INTO backups (filename, block) VALUES('${response.backup.file}', '${response.backup.block}')`
          );
        }
      });
    }

    if (!tableEmpty) {
      MDS.sql("SELECT * FROM BACKUPS", function (response) {
        MDS.log(JSON.stringify(response));
      });
      var _today = new Date();
      var _fileName = `minima_backup_${_today.getDay()}${_today.getMonth()}${_today.getFullYear()}_${_today.getHours()}${_today.getMinutes()}.bak`;
      MDS.log(`Creating a new backup file with name -> ${_fileName}`);
      MDS.cmd(`backup file:${_fileName} password:"auto"`, function (response) {
        MDS.log(JSON.stringify(response));
        if (response.status) {
          MDS.log("Backup has been created, inserting row into table");
          MDS.sql(
            `UPDATE backups SET filename='${response.backup.file}', block='${response.backup.block}'  WHERE id=1`
          );
        }
      });
    }
  });
}

function getAutomaticBackupStatus() {
  MDS.file.load("/backups/status.txt", function (response) {
    MDS.log(JSON.stringify(response));
  });
}
