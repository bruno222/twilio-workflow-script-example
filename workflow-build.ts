require('dotenv').config();
import { buildTargetFilters, workspace } from './helper';
import { intents, languages, businessLines, queues } from './config';
import './config';
import fs from 'fs';

const workflow: any = {
  task_routing: {
    filters: [],
  },
};

const run = async () => {
  const allQueues = await workspace.taskQueues.list();
  const allFriendlyNames = allQueues.map((queue) => queue.friendlyName);
  const mapNameToSid: any = {};

  for (let queue of queues) {
    if (!allFriendlyNames.includes(queue)) {
      throw new Error(`Ops, I found a queue here in the config.ts that is not yet in taskRouter.... Run npm run queues:create first.`);
    }
  }

  allQueues.map((queue) => (mapNameToSid[queue.friendlyName] = queue.sid));

  for (let BL of businessLines) {
    for (let intent of intents) {
      const queueName = `${BL}-${intent}`;
      const queueSid = mapNameToSid[queueName];
      if (!queueSid) {
        console.log('mapNameToSid', mapNameToSid);
        throw new Error(`queueSid not found for ${queueName}.`);
      }

      const filter = {
        filter_friendly_name: queueName,
        expression: `BL == "${BL}" AND intent == "${intent}"`,
        targets: buildTargetFilters(queueSid, languages),
      };

      workflow.task_routing.filters.push(filter);
    }
  }

  const workflowStringified = JSON.stringify(workflow, null, 2);
  fs.writeFileSync('./public/workflow.json', workflowStringified);
  console.log('/public/workflow.json generated.');

  if (process.argv[2] === 'deploy') {
    const ret = await workspace.workflows(process.env.TASKROUTER_WORKFLOW_SID!).update({
      configuration: workflowStringified,
    });

    console.log('workflow has been updated.', process.env.TASKROUTER_WORKFLOW_SID!, ret);
  }
};

run();
