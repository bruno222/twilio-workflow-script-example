import { Twilio } from 'twilio';

export const client = new Twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
export const workspace = client.taskrouter.workspaces(process.env.TASKROUTER_WORKSPACE_SID!);

export const mountAllQueues = (orgUnit: string[], intents: string[]) => {
  const _queues = [];
  for (let org of orgUnit) {
    for (let intent of intents) {
      _queues.push(`${org}-${intent}`);
    }
  }
  return _queues;
};

const buildExpression = (expression: string, union: string, langs: string[]) => {
  let ret = '';
  for (let lang of langs) {
    ret += expression.replace(/LANG/g, lang) + ` ${union} `;
  }

  return ret
    .trim()
    .slice(0, -1 * union.length)
    .trim();
};
export const buildTargetFilters = (queueSid: string, languages: any) => {
  const targets = [];

  for (let language of Object.keys(languages)) {
    const possibleLanguages = languages[language];

    const target = {
      queue: queueSid,
      expression: `task.language == '${language}' AND (${buildExpression('worker.routing.skills has "LANG"', 'OR', possibleLanguages)})`,
      order_by: buildExpression('worker.routing.levels.LANG DESC', ',', possibleLanguages),
      skip_if: '1==1',
    };

    targets.push(target);
  }
  return targets;
};
