require('dotenv').config();
import { Twilio } from 'twilio';
import { workspace } from './helper';
import { queues } from './config';
import './config';

const run = async () => {
  const allQueues = await workspace.taskQueues.list();
  const allFriendlyNames = allQueues.map((queue) => queue.friendlyName);

  for (let queue of queues) {
    if (!allFriendlyNames.includes(queue)) {
      await workspace.taskQueues.create({ friendlyName: queue });
      console.log('Created queue: ', queue);
    }
  }
};

run();
