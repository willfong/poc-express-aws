// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ecs/index.html
import { ECSClient, DescribeTasksCommand, DescribeContainerInstancesCommand, ListClustersCommand, ListServicesCommand, ListTasksCommand } from "@aws-sdk/client-ecs";
import {instancesDetails} from "./ec2.js";

const client = new ECSClient();

const _listClustersCommand = async () => {
    const command = new ListClustersCommand({});
    try {
        const response = await client.send(command);
        return response;
    } catch(err) {
        return err;
    }
}

const _listServicesCommand = async (arn) => {
    const command = new ListServicesCommand({cluster: arn, maxResults: 100});
    try {
        const response = await client.send(command);
        return response;
    } catch(err) {
        return err;
    }
}

const _listTasksCommand = async (cluster, serviceName) => {
    const command = new ListTasksCommand({cluster, serviceName});
    try {
        const response = await client.send(command);
        return response;
    } catch(err) {
        return err;
    }
}

const _describeTasksCommand = async (cluster, tasks) => {
    const command = new DescribeTasksCommand({cluster, tasks});
    try {
        const response = await client.send(command);
        return response;
    } catch(err) {
        return err;
    }
}

const _describeContainerInstancesCommand = async (cluster, containerInstances) => {
    const command = new DescribeContainerInstancesCommand({cluster, containerInstances});
    try {
        const response = await client.send(command);
        return response;
    } catch(err) {
        return err;
    }
}

export const clustersList = async () => {
    const response = await _listClustersCommand();
    let clusters = response.clusterArns || [];
    return [false, clusters];
};

export const servicesByCluster = async (arn) => {
    const response = await _listServicesCommand(arn);
    let services = response.serviceArns || [];
    return [false, services];
};

export const servicesListInstances = async (cluster, service) => {
    const response1 = await _listTasksCommand(cluster, service);
    let taskArns = response1.taskArns || [];
    const response2 = await _describeTasksCommand(cluster, taskArns);
    let tasks = response2.tasks || [];
    const containerInstanceArn = tasks.map(t => t.containerInstanceArn);
    const response3 = await _describeContainerInstancesCommand(cluster, containerInstanceArn);
    let containerInstances = response3.containerInstances || [];
    const ec2Instances = containerInstances.map(i => i.ec2InstanceId);
    const [err, response4] = await instancesDetails(ec2Instances);
    const instances = response4.map(i => {
        return {InstanceId: i.InstanceId, InstanceType: i.InstanceType, PrivateDnsName: i.PrivateDnsName}
    });
    return [false, instances];
}