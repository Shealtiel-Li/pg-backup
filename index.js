const schedule = require('node-schedule');
const {exec} = require('child_process');
const config = require('config')
const path = require('path')
const moment = require('moment')

process.env.BACKUP_DIR = path.resolve(__dirname, 'backup');
process.env.USER = config.get('pg.user');
process.env.PASSWORD = config.get('pg.password');
process.env.CONTAINER_NAME = config.get('pg.containerName');
process.env.DUMP_PATH = config.get('pg.dumpDir');
process.env.DATABASE = config.get('pg.database');
process.env.PORT = config.get('pg.port');

function executeShell(file, ...args) {
    return new Promise((resolve, reject) => {
        exec(`sh ${file} ${args.join(' ')}`, (err, stdout, stderr) => {
            if (err) {
                reject(err);
                return;
            }
            if (stdout) {
                console.log(`stdout: ${stdout}`);
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
            }
            resolve();
        });
    })
}

function getFolder(str) {
    return path.join(process.env.BACKUP_DIR, str, moment().format('YYYYMMDD'));
}

function fullyBak() {
    return executeShell('core/pg-fully.sh', [getFolder('week')]);
}

fullyBak();

schedule.scheduleJob('0 45 23  *  *  0', fullyBak)

