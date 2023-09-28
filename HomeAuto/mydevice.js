const awsIot = require("aws-iot-device-sdk");
const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-2" });
const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

// let deviceData = {};
try {
  const ThingId = 1695638872030;
  const params = {
    TableName: "Things",
    Key: {
      ThingId: { N: ThingId.toString() },
    },
  };

  const getDataOfDevice = async () => {
    try {
      const data = await ddb.getItem(params).promise();
      return data; // Return the data directly, no need for Promise.all
    } catch (err) {
      console.log("Failure", err.message);
      throw err; // Re-throw the error to be caught by the outer try-catch block if needed
    }
  };

  getDataOfDevice()
    .then((res) => {
      // console.log("Response: ", res);
      deviceScript(res);
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
} catch (err) {
  console.log("Error", err);
}

function deviceScript(deviceData) {
  try {
    console.log("Data-----", deviceData);

    const thingName = deviceData.Item.ThingName.S;
    const device = awsIot.device({
      keyPath: "./private.pem.key",
      certPath: "./certificate.pem.crt",
      caPath: "./AmazonRootCA1.pem",
      clientId: thingName,
      host: "a987ew7legg0z-ats.iot.us-east-2.amazonaws.com",
    });
    const deviceTopic = deviceData.Item.Topic.S;
    const heartBeat = Date.now()
    let powerConsume;
    const devicePayload = {
      thingId: deviceData.Item.ThingId.N,
      thingName: deviceData.Item.ThingName.S,
      thingType: deviceData.Item.ThingType.S,
      thingBrand: deviceData.Item.ThingBrand.S,
      status: "ON",
      wattage: deviceData.Item.Wattage.N,
      powerConsume: Number(deviceData.Item.PowerConsume.N),
      temperature: Number(deviceData.Item.Temperature.N),
      topic: deviceData.Item.Topic.S,
      origin: "device",
      heartBeat
    };

    let runningTimeSeconds = 0;
    let runningTimeHours = 0;
    function powerconsumeInUnit(watt) {
      runningTimeSeconds += 5;
      runningTimeHours = runningTimeSeconds / 3600;

      const powerConsumeUnit = (watt * runningTimeHours) / 1000;
      return powerConsumeUnit;
    }

    let check;
    let check2Running = false;
    let check3Running = false;
    device.on("connect", () => {
      console.log("connect");
      check = setInterval(() => {
        devicePayload.heartBeat = Date.now();
        devicePayload.powerConsume += powerconsumeInUnit(
          deviceData.Item.Wattage.N
        );

        device.publish(deviceTopic, JSON.stringify(devicePayload), { qos: 1 });
      }, 5000);
      device.subscribe(deviceTopic);
    });

    let res, check2, check3;
    device.on("message", (topic, payload) => {
      res = payload.toString();
      console.log("message: ", topic, payload.toString());

      res = JSON.parse(res);
      if (res.status === "ON" && res.origin === "client") {
        console.log("publishing data");
        clearInterval(check);
        clearInterval(check3);

        if (!check2Running) {
          check2 = setInterval(() => {
            devicePayload.heartBeat = Date.now();
            devicePayload.powerConsume += powerconsumeInUnit(
              deviceData.Item.Wattage.N
            );
            devicePayload.temperature = res.temperature;
            devicePayload.origin = res.origin;
            devicePayload.status = res.status;
            device.publish(deviceTopic, JSON.stringify(devicePayload), {
              qos: 1,
            });
          }, 5000);
          check2Running = true;
          check3Running = false;
        }
      }

      if (res.status === "OFF") {
        console.log("AC is turned OFF");
        clearInterval(check);
        clearInterval(check2);
        if (!check3Running) {
          check3 = setInterval(() => {
            devicePayload.heartBeat = Date.now();
            devicePayload.origin = res.origin;
            devicePayload.status = res.status;
            device.publish(deviceTopic, JSON.stringify(devicePayload), {
              qos: 1,
            });
          }, 5000);
          check2Running = false;
          check3Running = true;
        }
      }
    });
  } catch (error) {
    console.log("Server Error: ", error);
    return 0;
  }
}
