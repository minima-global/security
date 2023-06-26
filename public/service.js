/* eslint-disable no-undef */

var backupStatus; // {active: boolean}

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
    MDS.log("MDS 1 hour time in play.");
    MDS.log(`BackupStatus ${JSON.stringify(backupStatus)}`);
    var autoBackupDisabled =
      !backupStatus ||
      (backupStatus && "active" in backupStatus && !backupStatus.active);
    if (autoBackupDisabled) {
      MDS.log("Backup is currently disabled.");
      return;
    }

    // do we need to prune any backups?
    MDS.file.list("/backups", function (response) {
      if (response.status) {
        const myBackups = response.response.list.reverse();

        MDS.log(`Total backups: ${myBackups.length}`);

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
  MDS.log("Assert table emptiness, create backup on truthy.");
  MDS.sql("SELECT COUNT(*) FROM BACKUPS", function (response) {
    MDS.log(JSON.stringify(response));
    var tableEmpty = response.rows[0]["COUNT(*)"] === "0";
    MDS.log(response.rows[0]["COUNT(*)"]);
    MDS.log(`Sql table count -> ${tableEmpty}`);

    MDS.file.getpath("/", function (response) {
      if (response.status) {
        const minidappPath = response.response.getpath.path;
        var today = new Date();
        var fileName = `minima_backup_${today.getDate()}${
          monthNames[today.getMonth()]
        }${today.getFullYear()}_${today.getHours()}${
          today.getMinutes() < 10
            ? "0" + today.getMinutes()
            : today.getMinutes()
        }.bak`;
        MDS.log(
          `Creating a new backup file with path -> ${minidappPath + fileName}`
        );

        MDS.cmd(
          `backup file:${
            minidappPath + "/backups/" + fileName
          } password:"auto"`,
          function (response) {
            MDS.log(JSON.stringify(response));
            if (!response.status) {
              MDS.log("Backup halted!");
              MDS.log(response.error);
            }
            if (response.status) {
              MDS.log("Backup has been created, inserting row into table");

              if (tableEmpty) {
                return MDS.sql(
                  `INSERT INTO BACKUPS (filename, block, timestamp) VALUES('${fileName}', '${response.backup.block}', CURRENT_TIMESTAMP)`,
                  function (response) {
                    MDS.log(JSON.stringify(response));
                  }
                );
              }

              MDS.sql("SELECT * FROM BACKUPS", function (response) {
                MDS.log(JSON.stringify(response));
              });
              MDS.sql(
                `UPDATE backups SET filename='${fileName}', block='${response.backup.block}', timestamp=CURRENT_TIMESTAMP WHERE id=1`,
                function (response) {
                  MDS.log(JSON.stringify(response));
                }
              );
            }
          }
        );
      }
    });
  });
}

function getAutomaticBackupStatus() {
  MDS.file.load("/backups/status.txt", function (response) {
    MDS.log(JSON.stringify(response));
  });
}

function deleteFile(filepath) {
  MDS.file.delete(filepath, function (response) {
    if (response.status) {
      MDS.log(`Deleted backup ${filepath}`);
    }
  });
}
