require('dotenv').config();
import { Twilio } from 'twilio';
import { workspace } from './helper';
import { businessLines, intents, queues } from './config';
import './config';

const run = async () => {
  const allQueues = await workspace.taskQueues.list();
  const allFriendlyNames = allQueues.map((queue) => queue.friendlyName);

  const mapNameToSid: any = {};
  allQueues.map((queue) => (mapNameToSid[queue.friendlyName] = queue.sid));

  for (let queueName of allFriendlyNames) {
    for (let BL of businessLines) {
      if (queueName.includes(`${BL}-`)) {
        const queueSid = mapNameToSid[queueName];
        await workspace.taskQueues(queueSid).remove();
        console.log('Queue deleted: ', queueSid, queueName);
      }
    }
  }

  for (let queueName of allFriendlyNames) {
    for (let intent of intents) {
      if (queueName.includes(`-${intent}`)) {
        const queueSid = mapNameToSid[queueName];
        await workspace.taskQueues(queueSid).remove();
        console.log('Queue deleted: ', queueSid, queueName);
      }
    }
  }
};

run();
