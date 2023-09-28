const AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-2",
});
const iot = new AWS.Iot();

const createThingRules = async (thingName, topic) => {
    const params = {
        ruleName: `${thingName}_Rule`,
        topicRulePayload: {
            sql: `SELECT * FROM "${topic}"`,
            actions: [
                {
                    lambda: {
                        functionArn:
              "arn:aws:lambda:us-east-2:121288770406:function:SmartHome_IoT_Rule",
                    },
                },
            ],
        },
    };

    try {
        await iot.createTopicRule(params).promise();

        console.log(`Thing Rule Created: ${thingName}`);
    } catch (err) {
        console.error(`Error creating IoT Core rule: ${err}`);
    }
};

const addThingToThingGroup = (thingName, thingType) => {
    const params = {
        thingArn: `arn:aws:iot:us-east-2:121288770406:thing/${thingName}`,
        thingGroupArn: `arn:aws:iot:us-east-2:121288770406:thinggroup/${thingType}`,
        thingGroupName: thingType,
        thingName,
    };
    iot.addThingToThingGroup(params, (err, data) => {
        if (err) console.log(err, err.stack);
        else console.log(data);
    });
};

const energyUsage = (wattage) => {

    return wattage * (secondsSinceEpoch / 3600);
};

module.exports = { createThingRules, addThingToThingGroup, energyUsage };
