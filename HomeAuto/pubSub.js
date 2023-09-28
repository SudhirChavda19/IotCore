const AWS = require("aws-sdk");

exports.handler = async (event, context) => {
    const iot = new AWS.IotData({
        endpoint: "a987ew7legg0z-ats.iot.us-east-2.amazonaws.com",
    });
    // Publish a message
    const fanData = [];
    fanData.push({ sensor_code: "Fan_1", value: "ON" });
    fanData.push({ sensor_code: "Fan_2", value: "OFF" });
    const publishParams = {
        topic: "home/fan",
        payload: JSON.stringify({
            message: fanData,
        }),
        qos: 1,
    };
    try {
        await iot.publish(publishParams).promise();
        console.log("Message published successfully");
    } catch (error) {
        console.error("Error while publishing message:", error);
    }

    // Subscribe to a topic
    const subscribeParams = {
        topic: "home/fan",
        qos: 1,
    };
    try {
        const subscription = await iot.subscribe(subscribeParams).promise();
        subscription.on("message", (topic, message) => {
            console.log(`Received message on topic ${topic}: ${message.toString()}`);
            // Process the received message as needed
        });
        console.log("Subscribed to topic:", subscribeParams.topic);
    } catch (error) {
        console.error("Error subscribing to topic:", error);
    }
    return "Execution completed";
};
