/* eslint-disable no-undef */

var backupStatus = { active: false }; // {active: boolean}
var keyPairPassword = "autopassword";
var debugLogs = false;
const MDS_TIMER = "MDS_TIMER_1HOUR"; // "MDS_TIMER_1HOUR"

MDS.init(function (msg) {
  if (msg.event === "inited") {
    // Make the backups directory available
    MDS.file.makedir("backups");

    // create schema
    MDS.sql(
      "CREATE TABLE IF NOT EXISTS BACKUPS (id bigint auto_increment, filename varchar(256), block varchar(256), timestamp TIMESTAMP)"
    );

    MDS.sql(
      "CREATE TABLE IF NOT EXISTS cache (name varchar(255), data longtext)"
    );

    MDS.keypair.get("backupStatus", function (response) {
      if (response.status) {
        var status = JSON.parse(response.value);
        backupStatus = status;
      }
    });
  }
  if (msg.event === MDS_TIMER) {
    // check status..
    MDS.keypair.get("backupStatus", function (response) {
      if (response.status) {
        var status = JSON.parse(response.value);
        backupStatus = status;
      }
    });

    log(`BackupStatus ${JSON.stringify(backupStatus)}`);
    const autoBackupDisabled = !backupStatus || !backupStatus.active;

    if (autoBackupDisabled) {
      log("Backup is currently disabled.");
      return;
    }

    // do we need to prune any backups?
    MDS.file.list("/backups", function (response) {
      if (response.status) {
        const myBackups = response.response.list.reverse();

        myBackups.sort(function (a, b) {
          return (
            getTimeMilliFromBackupName(a.name) -
            getTimeMilliFromBackupName(b.name)
          );
        });

        log(`Total backups: ${myBackups.length}`);

        if (myBackups.length > 14) {
          log(`Backups exceed total amount, time to delete some backups..`);
          // time to delete the backups
          log(`Deleting backup: ${myBackups[0].location}`);
          deleteFile(myBackups[0].location);
          myBackups.slice(0, 1);
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
  var logs = [];
  const newLog = {
    timestamp: new Date().getTime(),
    status: 0,
    size: 0,
    message: "",
  };
  MDS.sql("SELECT * FROM cache WHERE name = 'BACKUP_LOGS'", function (resp) {
    // Get existing backup logs...
    if (resp.status && resp.rows.length > 0) {
      const data = resp.rows[0];
      // old Logs
      log(JSON.stringify(data));
      logs = JSON.parse(data.DATA);

      const maxLogs = 25;
      // keep 30 logs max
      if (logs.length > maxLogs) {
        const logsToRemove = logs.length - maxLogs;
        logs.splice(0, logsToRemove);
      }
    } else {
      logs = [];
    }

    MDS.sql("SELECT COUNT(*) FROM BACKUPS", function (response) {
      var tableEmpty = response.rows[0]["COUNT(*)"] === "0";
      // is it time for a new backup?
      MDS.sql(
        "SELECT * FROM BACKUPS WHERE TIMESTAMP + INTERVAL '24' HOUR <= CURRENT_TIMESTAMP",
        function (response) {
          // log(JSON.stringify(response));

          const notTimeForBackup = response.count === 0 && !tableEmpty;
          if (notTimeForBackup) {
            newLog.status = 1;
            newLog.message = "24 hours not over yet.";
            logs.push(newLog);
            logBackup(logs);
          }

          const timeForNewBackup = response.count > 0 || tableEmpty;
          // it is time for  a new backup
          if (timeForNewBackup) {
            // get full path for minidapp
            MDS.file.getpath("/", function (response) {
              if (response.status) {
                const minidappPath = response.response.getpath.path;
                // create a new filename with latest datetime
                var today = new Date();
                var fileName = `auto_minima_backup_${today.getTime()}__${today.getDate()}${
                  monthNames[today.getMonth()]
                }${today.getFullYear()}_${today.getHours()}${
                  today.getMinutes() < 10
                    ? "0" + today.getMinutes()
                    : today.getMinutes()
                }.bak`;

                // get the auto password
                MDS.keypair.get(keyPairPassword, function (response) {
                  var backupPassword = "minima";
                  if (response.status) {
                    backupPassword = response.value;
                  }
                  // create the backup
                  MDS.cmd(
                    `backup file:${minidappPath + "/backups/" + fileName} ${
                      backupPassword ? "password:" + backupPassword : ""
                    }`,
                    function (response) {
                      // something went wrong
                      if (!response.status) {
                        newLog.status = 1;
                        newLog.message = response.error;
                        logs.push(newLog);
                        logBackup(logs);
                      }

                      // backup success
                      if (response.status) {
                        // if the table is fresh let's insert our first row
                        if (tableEmpty) {
                          return MDS.sql(
                            `INSERT INTO BACKUPS (filename, block, timestamp) VALUES('${fileName}', '${response.backup.block}', CURRENT_TIMESTAMP)`,
                            function () {
                              newLog.status = 2;
                              newLog.message = "Backup created!";
                              newLog.size = response.backup.size;
                              logs.push(newLog);
                              logBackup(logs);
                            }
                          );
                        }
                        // already existing row, let's update it with the latest backup
                        return MDS.sql(
                          `UPDATE backups SET filename='${fileName}', block='${response.backup.block}', timestamp=CURRENT_TIMESTAMP WHERE id=1`,
                          function () {
                            newLog.status = 2;
                            newLog.message = "Backup created!";
                            logs.push(newLog);
                            logBackup(logs);
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
  });
}

function getAutomaticBackupStatus() {
  MDS.file.load("/backups/status.txt", function (response) {
    log(JSON.stringify(response));
  });
}

function deleteFile(filepath) {
  log(`Deleting backup file:${filepath}`);
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

function getTimeMilliFromBackupName(name) {
  try {
    const timeMilli = name.split("backup_")[1];

    return parseInt(timeMilli.split("__")[0]);
  } catch (error) {
    return 0;
  }
}

// Log that this happened
function logBackup(logs) {
  log("Adding new log....!");
  log(JSON.stringify(logs));
  if (logs.length === 1) {
    MDS.sql(
      `INSERT INTO cache (name, data) VALUES ('BACKUP_LOGS', '${JSON.stringify(
        logs
      )}')`,
      function (response) {
        log(JSON.stringify(response));
      }
    );
  } else {
    MDS.sql(
      `UPDATE cache SET data = '${JSON.stringify(
        logs
      )}' WHERE name='BACKUP_LOGS'`,
      function (response) {
        log(JSON.stringify(response));
      }
    );
  }
}
