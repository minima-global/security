/* eslint-disable no-undef */

var backupStatus; // {active: boolean}
var keyPairPassword = "autopassword";
var debugLogs = false;

MDS.init(function (msg) {
  if (msg.event === "inited") {
    // create schema
    MDS.sql(
      "CREATE TABLE IF NOT EXISTS BACKUPS (id bigint auto_increment, filename varchar(256), block varchar(256), timestamp TIMESTAMP)"
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

    log("MDS 1 hour time in play.");
    log(`BackupStatus ${JSON.stringify(backupStatus)}`);
    var autoBackupDisabled =
      !backupStatus ||
      (backupStatus && "active" in backupStatus && !backupStatus.active);
    if (autoBackupDisabled) {
      log("Backup is currently disabled.");
      return;
    }

    // do we need to prune any backups?
    MDS.file.list("/backups", function (response) {
      if (response.status) {
        const myBackups = response.response.list.reverse();

        log(`Total backups: ${myBackups.length}`);

        if (myBackups.length > 14) {
          // time to delete the backups
          for (var i = 15; i <= myBackups.length - 1; i++) {
            deleteFile("/backups/" + myBackups[i].name);
          }
        }
      }
    });

    createBackup();
  }
});

// SELECT * FROM news WHERE date >= now() + INTERVAL 1 DAY;
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
function createBackup() {
  log("Assert table emptiness, create backup on truthy.");

  MDS.sql("select * from BACKUPS", function (response) {
    log(JSON.stringify(response));
  });
  MDS.sql("SELECT COUNT(*) FROM BACKUPS", function (response) {
    var tableEmpty = response.rows[0]["COUNT(*)"] === "0";
    // is it time for a new backup?
    MDS.sql(
      "SELECT * FROM BACKUPS WHERE TIMESTAMP + INTERVAL '1' SECOND <= CURRENT_TIMESTAMP",
      function (response) {
        log(JSON.stringify(response));

        const timeForNewBackup = response.count > 0 || tableEmpty;
        // it is time for  a new backup
        if (timeForNewBackup) {
          // get full path for minidapp
          MDS.file.getpath("/", function (response) {
            if (response.status) {
              const minidappPath = response.response.getpath.path;
              // create a new filename with latest datetime
              var today = new Date();
              var fileName = `auto_minima_backup__${today.getDate()}${
                monthNames[today.getMonth()]
              }${today.getFullYear()}_${today.getHours()}${
                today.getMinutes() < 10
                  ? "0" + today.getMinutes()
                  : today.getMinutes()
              }.bak`;
              log(
                `Creating a new backup file with path -> ${
                  minidappPath + fileName
                }`
              );

              // get the auto password
              MDS.keypair.get(keyPairPassword, function (response) {
                var backupPassword = "auto";
                if (response.status) {
                  backupPassword = response.value;
                }
                // create the backup
                MDS.cmd(
                  `backup file:${
                    minidappPath + "/backups/" + fileName
                  } password:"${backupPassword}"`,
                  function (response) {
                    // something went wrong
                    if (!response.status) {
                      log("Backup halted!");
                      log(response.error);
                    }
                    // backup success
                    if (response.status) {
                      // if the table is fresh let's insert our first row
                      if (tableEmpty) {
                        return MDS.sql(
                          `INSERT INTO BACKUPS (filename, block, timestamp) VALUES('${fileName}', '${response.backup.block}', CURRENT_TIMESTAMP)`,
                          function (response) {
                            log(JSON.stringify(response));
                          }
                        );
                      }
                      // already existing row, let's update it with the latest backup
                      return MDS.sql(
                        `UPDATE backups SET filename='${fileName}', block='${response.backup.block}', timestamp=CURRENT_TIMESTAMP WHERE id=1`,
                        function (response) {
                          log(JSON.stringify(response));
                        }
                      );
                    }
                  }
                );
              });
            }
          });
        }
      }
    );
  });
}

function getAutomaticBackupStatus() {
  MDS.file.load("/backups/status.txt", function (response) {
    log(JSON.stringify(response));
  });
}

function deleteFile(filepath) {
  MDS.file.delete(filepath, function (response) {
    if (response.status) {
      log(`Deleted backup ${filepath}`);
    }
  });
}

function log(log) {
  if (debugLogs) {
    return MDS.log(log);
  }
}
