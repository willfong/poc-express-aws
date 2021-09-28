// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/index.html
import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";

const client = new EC2Client();

const _describeInstancesCommand = async (InstanceIds) => {
    const command = new DescribeInstancesCommand({InstanceIds});
    try {
        const response = await client.send(command);
        return response;
    } catch(err) {
        return err;
    }
}

export const instancesDetails = async (InstanceIds) => {
    const response = await _describeInstancesCommand(InstanceIds);
    let reservations = response.Reservations || [];
    let instances = [];
    reservations.forEach(r => {
        r.Instances.forEach(i => instances.push(i));
    });
    console.log(instances);
    return [false, instances];
};
