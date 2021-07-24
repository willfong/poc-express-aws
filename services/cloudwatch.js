import { CloudWatchClient, PutMetricDataCommand } from "@aws-sdk/client-cloudwatch"; // ES Modules import

const Namespace = 'developmentTesting';

const client = new CloudWatchClient();

const _putMetricDataCommand = async (MetricData) => {
    const input = { MetricData, Namespace };
    const command = new PutMetricDataCommand(input);
    const response = await client.send(command);
    return response;
};

export const metricIncrement = async (MetricName) => {
    const MetricData = [{ MetricName, Value: 1 }]
    const response = await _putMetricDataCommand(MetricData);
    return response;
}
