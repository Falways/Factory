let chokidar = require('chokidar');
let path = require('path');
let config = require('../config.json');
let log4js = require('log4js');
let logger = log4js.getLogger();
logger.level = 'debug';
let fs = require('fs');

let taskArr = {};
let index = 0;
let isLock = false;
let eventPools = [];


// Initialize watcher
let watcher = chokidar.watch(path.resolve(__dirname,config.watchDirectory),{
    ignored: /(^|[\/\\])\../,
    persistent: true });

// start watcher
let startWatcher = () => {
    watcher.on('add', path => {
        logger.info(`File ${path} has been added`);
        let serialNumber = index + 1;
        index = index+1;
        taskArr[serialNumber] = {fp: path};
        eventPools.push(serialNumber);
    });

    watcher.on('unlink', path => logger.info(`File ${path} has been removed`))
        .on("error", error => logger.error('Error: '+error));
}

/**
 * every 5 seconds check a time
 */
let beatBounds = () => {
    setInterval(()=>{
        try {
            if (isLock) {
                logger.info('Other events are blocking');
            }else if (eventPools.length>0) {
                isLock = true;
                let eventId = eventPools[0];
                logger.info('EventPools are: ' + eventPools)
                logger.info('TaskArr are: '+ JSON.stringify(taskArr));
                logger.info('File path: '+ taskArr[eventId].fp);
                asyncTask(taskArr[eventId].fp,function () {
                    // delete file
                    fs.unlinkSync(taskArr[eventId].fp);
                    // remove has finished things
                    delete taskArr[eventId];
                    logger.info('Async taskArr detail: '+ JSON.stringify(taskArr));
                    isLock = false;
                    eventPools.splice(eventPools.indexOf(eventId),1)
                })
            }else {
                logger.info('Catalogue is on free holiday...')
            }
        }catch (e) {
            logger.error('Runtime catch error: '+e);
        }
    },5000)
}

let stopWatcher = () => watcher.close();

/**
 * async task
 * @param filePath
 * @param callback
 */
let asyncTask = (filePath,callback) => {
    setTimeout(() => {
        // do somethings
        let result = fs.readFileSync(filePath);
        logger.debug(JSON.parse(result));
        callback()
    },Math.round(Math.random()*(1000,10000)))
};

/**
 * deal with unfinished things
 * @returns {Promise<void>}
 */
let readyStarting = async ()=> {
    /*let taskArr_ready = {};
    taskArr_ready['index']=0;
    let path_dir = path.resolve(__dirname,config.watchDirectory)
    let taskJsonArr = fs.readdirSync(path_dir);
    if (taskJsonArr.length>0){
        logger.info('Deal unfinished task before start watcher...');
        for (let i = 0; i < taskJsonArr.length; i++) {
            let serialNumber = index + 1;
            index = index+1;
            taskArr[serialNumber] = {fp:`${path_dir}/${taskJsonArr[i]}`};
            eventPools.push(serialNumber);
            /!*logger.info(`${path_dir}/${taskJsonArr[i]}`);
            taskArr_ready.index = taskArr_ready.index++;
            let serialNumber = taskArr_ready.index+1;
            taskArr[serialNumber] = JSON.parse(fs.readFileSync(`${path_dir}/${taskJsonArr[i]}`));
            logger.info(taskArr_ready);
            await asyncTask(`${path_dir}/${taskJsonArr[i]}`,()=>{
                // remove has finished things
                delete taskArr_ready[serialNumber];
                // delete file
                fs.unlinkSync(`${path_dir}/${taskJsonArr[i]}`);
                logger.info(taskArr_ready);
                // Complete all before tasks, now start watcher
                if (taskJsonArr.length-1 == i){
                    logger.info(' Complete all before tasks, now start watcher...');
                    startWatcher();
                    beatBounds();
                }
            });*!/
        }
        console.log(eventPools)
        startWatcher();
        beatBounds();
    }else {
        logger.info(' Complete all before tasks, now start watcher...');
        startWatcher();
        beatBounds();
    }*/
    startWatcher();
    beatBounds();
}

// entrance
readyStarting();
