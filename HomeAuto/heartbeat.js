const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-2",
});

const doc = new AWS.DynamoDB.DocumentClient();

const val = async () => {
  const currentTime = Date.now();
  const offlineThreshold = 10000; // Threshold in milliseconds
  const data = await doc.scan({ TableName: "Things" }).promise();
  const connectedDevices = data.Items;
  for (const item of connectedDevices) {
    const lastSeenTimestamp = item.HeartBeat;
    if (currentTime - lastSeenTimestamp > offlineThreshold) {
      const deviceStatus = "offline";
      const status = "OFF"
      console.log("Device disconnected:", item.ThingName);
      try {
        // console.log(item.ThingId);
        if (item.DeviceStatus === "online") {
          await doc
            .update({
              TableName: "Things",
              Key: { ThingId: item.ThingId },
              UpdateExpression: "set #ds = :nds, #st = :nst",
              ExpressionAttributeValues: {
                ":nds": deviceStatus,
                ":nst": status,
              },
              ExpressionAttributeNames: {
                "#ds": "DeviceStatus",
                "#st": "Status",
              },
            })
            .promise();
        }
        // console.log(check)
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log(`Device ${item.ThingName} is online`);
      if (item.DeviceStatus === "offline") {
        const deviceStatus = "online";
        await doc
          .update({
            TableName: "Things",
            Key: { ThingId: item.ThingId },
            UpdateExpression: "set #ds = :nds",
            ExpressionAttributeValues: {
              ":nds": deviceStatus,
            },
            ExpressionAttributeNames: {
              "#ds": "DeviceStatus",
            },
          })
          .promise();
      }
    }
  }
};
setInterval(val, 3000);
