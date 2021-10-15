import { Twilio } from 'twilio';

export const client = new Twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
export const workspace = client.taskrouter.workspaces(process.env.TASKROUTER_WORKSPACE_SID!);

export const mountAllQueues = (businessLine: string[], intents: string[]) => {
  const _queues = [];
  for (let BL of businessLine) {
    for (let intent of intents) {
      _queues.push(`${BL}-${intent}`);
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
export const buildTargetFilters = (queueSid: string, language: string, possibleLanguages: string[], BL: string, intent: string) => {
  const targets = [];

  //
  // First try Agents on that BL + Intent
  //
  const target = {
    queue: queueSid,
    expression: `worker.routing.skills has '${BL}' AND worker.routing.skills has '${intent}' AND (${buildExpression(
      'worker.routing.skills has "LANG"',
      'OR',
      possibleLanguages
    )})`,
    order_by:
      buildExpression(`worker.routing.levels.LANG DESC`, ',', possibleLanguages) +
      `, worker.routing.levels.${BL} DESC, worker.routing.levels.${intent} DESC`,
    skip_if: '1==1',
  };

  targets.push(target);

  //
  // If no agent is available, increase the agent-audience ignoring the BL, only maintaing the Intent.
  //
  const target2 = {
    queue: queueSid,
    expression: `worker.routing.skills has '${intent}' AND (${buildExpression('worker.routing.skills has "LANG"', 'OR', possibleLanguages)})`,
    order_by: buildExpression(`worker.routing.levels.LANG DESC`, ',', possibleLanguages) + `, worker.routing.levels.${intent} DESC`,
    skip_if: '1==1',
  };

  targets.push(target2);

  //
  // Again if no agent is available, increase the agent-audience ignoring the BL and the Intent.
  //
  const target3 = {
    queue: queueSid,
    expression: `(${buildExpression('worker.routing.skills has "LANG"', 'OR', possibleLanguages)})`,
    order_by: buildExpression(`worker.routing.levels.LANG DESC`, ',', possibleLanguages),
    // skip_if: '1==1',
  };

  targets.push(target3);

  return targets;
};
