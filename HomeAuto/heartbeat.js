const awsIot = require("aws-iot-device-sdk");
const AWS = require("aws-sdk");
const heartbeatDevice = require('./mydevice');

AWS.config.update({ region: "us-east-2" });
const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

// // let deviceData = {};
// try {
//   const ThingId = 1695638872030;
//   const params = {
//     TableName: "Things",
//     Key: {
//       ThingId: { N: ThingId.toString() },
//     },
//   };

//   const getDataOfDevice = async () => {
//     try {
//       const data = await ddb.getItem(params).promise();
//       return data; // Return the data directly, no need for Promise.all
//     } catch (err) {
//       console.log("Failure", err.message);
//       throw err; // Re-throw the error to be caught by the outer try-catch block if needed
//     }
//   };

//   getDataOfDevice()
//     .then((res) => {
//       // console.log("Response: ", res);
//       heartBeat(res);
//     })
//     .catch((err) => {
//       console.log("Error: ", err);
//     });
// } catch (err) {
//   console.log("Error", err);
// }

// function heartBeat(deviceData) {

// }

const deviceHeartbeatTimestamps = {};
console.log(heartbeatDevice);

heartbeatDevice.subscribe(deviceTopic);

heartbeatDevice.on('message', (topic, payload) => {
    console.log("Topic: ", topic);
    console.log("Payload: ", payload);
  // Update the timestamp for the device that sent the heartbeat
//   const deviceId = extractDeviceIdFromTopic(topic); // Implement this function to extract the device ID from the topic
//   deviceHeartbeatTimestamps[deviceId] = Date.now();
});


// const checkInterval = 5000; // Check every 15 seconds
// const offlineThreshold = 30000; // Threshold for considering a device offline (30 seconds)

// setInterval(() => {
//   const currentTime = Date.now();

//   for (const deviceId in deviceHeartbeatTimestamps) {
//     const lastHeartbeat = deviceHeartbeatTimestamps[deviceId];
//     if (currentTime - lastHeartbeat >= offlineThreshold) {
//       // Device is considered offline
//       console.log(`Device ${deviceId} is offline.`);
//       // Implement actions to handle offline devices (e.g., update database status)
//     }
//   }
// }, checkInterval);

