const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const {
    createThingRules,
    addThingToThingGroup,
    energyUsage,
} = require("../functions/topicrules");

AWS.config.update({ region: "us-east-2" });

const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
const iot = new AWS.Iot();
module.exports = {
    createThing: async (req, res) => {
        const {
            thingName, thingType, thingBrand, wattage, powerConsume, status, temperature
        } = req.body;
        console.log("DATA: ", req.body);
        console.log("DATA: ", typeof thingName);
        const topic = `Home/${thingType}/${thingName}`;

        try {
            const params = {
                TableName: "Things",
                FilterExpression: "ThingName = :tn",
                ExpressionAttributeValues: {
                    ":tn": { S: thingName },
                },
            };

            const exist = await ddb.scan(params).promise();
            console.log("EXIST------ ", exist);
            if (Object.keys(exist.Items).length !== 0) {
                return res
                    .status(400)
                    .json({ status: "Fail", message: "Device Already Registered" });
            }

            const par = {
                thingName,
                attributePayload: {
                    attributes: {
                        thingName,
                        thingTypeName: thingType,
                    },
                    //   merge: true || false
                },
                thingTypeName: thingType,
            };
            iot.createThing(par, async (err, data) => {
                if (err) {
                    console.log("Error:: ", err, err.stack);
                    return res.status(500).json({
                        status: "Fail",
                        message: "Error While Creting thing: ",
                        err,
                    });
                }
                console.log(`Device ${thingName} Registered Successfully`);

                // createThingRules(thingName, topic);
                addThingToThingGroup(thingName, thingType);

                const thingId = new Date().getTime().toString();
                const createdDate = new Date().toLocaleString(undefined, {
                    timeZone: "Asia/Kolkata",
                });

                const thingsDBParams = {
                    TableName: "Things",
                    Item: {
                        ThingId: { N: thingId },
                        ThingName: { S: thingName },
                        ThingType: { S: thingType },
                        ThingBrand: { S: thingBrand },
                        Wattage: { N: wattage.toString() },
                        PowerConsume: { N: powerConsume.toString() },
                        Temperature: { N: temperature.toString() },
                        CreatedDate: { S: createdDate },
                        Origin: { S: "default" },
                        Topic: { S: topic },
                        Status: { S: status },
                    },
                };

                const realTimeDataParams = {
                    TableName: "RealTimeData",
                    Item: {
                        DataId: { S: uuidv4() },
                        ThingId: { N: thingId },
                        ThingName: { S: thingName },
                        ThingType: { S: thingType },
                        ThingBrand: { S: thingBrand },
                        Wattage: { N: wattage.toString() },
                        PowerConsume: { N: powerConsume.toString() },
                        Temperature: { N: temperature.toString() },
                        Origin: { S: "default" },
                        CreatedDate: { S: createdDate },
                        Topic: { S: topic },
                        Status: { S: status },
                    },
                };

                await ddb.putItem(thingsDBParams).promise();
                await ddb.putItem(realTimeDataParams).promise();
                console.log("Device Data Stored");

                return res.status(201).json({
                    status: "Success",
                    message: `Device ${thingName} Registered Successfully`,
                });
            });
            return 0;
        } catch (err) {
            console.log(`Server Error: ${err}`);
            return res.status(500).json({
                status: "Fail",
                message: "Server Error",
            });
        }
    },

    pubSubThing: async (req, res) => {
        const iotdata = new AWS.IotData({
            endpoint: "a987ew7legg0z-ats.iot.us-east-2.amazonaws.com",
        });
        const thingId = req.params.id;
        console.log(req.body);
        const { status } = req.body;
        let { temperature } = req.body
        temperature = Number(temperature);

        const origin = "client";

        const params = {
            TableName: "RealTimeData",
            FilterExpression: "ThingId = :id",
            ExpressionAttributeValues: {
                ":id": { N: thingId },
            },
        };

        let thingValue = await ddb.scan(params).promise();
        [thingValue] = thingValue.Items;
        console.log("Thing Value: ", thingValue);

        if (Object.keys(thingValue).length === 0) {
            return res
                .status(400)
                .json({ status: "Fail", message: "Device Not Registered" });
        }

        const publishParams = {
            topic: thingValue.Topic.S,
            payload: JSON.stringify({
                thingId,
                thingName : thingValue.ThingName.S,
                thingType: thingValue.ThingType.S,
                thingBrand: thingValue.ThingBrand.S,
                status,
                temperature,
                origin,
                wattage: thingValue.Wattage.N,
                powerConsume: thingValue.PowerConsume.N,
                topic: thingValue.Topic.S, 
            }),
            qos: 1,
        };
        try {
            iotdata.publish(publishParams).promise();
            console.log("Published successfully");

            return res.status(201).json({
                status: "Success",
                message: "Published Successfully",
            });
        } catch (error) {
            console.error("Error while publishing message:", error);
            return res.status(500).json({
                status: "Fail",
                message: "Server Error",
            });
        }
    },

    getThing: async (req, res) => {
        const { thingId } = req.params;
        try {
            const params = {
                TableName: "Things",
                Key: {
                    ThingId: { N: thingId },
                },
            };

            const getThing = await ddb.getItem(params).promise();

            if (Object.keys(getThing).length === 0) {
                return res
                    .status(404)
                    .json({ status: "Fail", message: "Data Not Found" });
            }

            return res.status(200).json({
                status: "Success",
                message: "Thing Fetched Successfully!",
                data: getThing,
            });
        } catch (err) {
            console.log(`Server Error: ${err}`);
            return res.status(500).json({
                status: "Fail",
                message: "Server Error",
            });
        }
    },

    getThings: async (req, res) => {
        try {
            const params = {
                TableName: "Things",
            };

            const getAllThings = await ddb.scan(params).promise();

            if (Object.keys(getAllThings).length === 0) {
                return res
                    .status(404)
                    .json({ status: "Fail", message: "Data Not Found" });
            }

            return res.status(200).json({
                status: "Success",
                message: "Things Fetched Successfully!",
                data: getAllThings,
            });
        } catch (err) {
            console.log(`Server Error: ${err}`);
            return res.status(500).json({
                status: "Fail",
                message: "Server Error",
            });
        }
    },

    deleteThing: async (req, res) => {
        const { thingId } = req.params;
        const { thingName } = req.body;

        try {
            const param = {
                thingName,
            };
            await iot.deleteThing(param).promise();
            const par = {
                TableName: "Things",
                Key: {
                    ThingId: { N: thingId },
                },
            };
            await ddb.deleteItem(par).promise();
            return res.status(200).json({
                status: "Success",
                message: "Thing Deleted Successfully!",
            });
        } catch (err) {
            console.log(`Server Error: ${err}`);
            return res.status(500).json({
                status: "Fail",
                message: "Server Error",
            });
        }
    },
};
