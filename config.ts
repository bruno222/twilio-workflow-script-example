import { mountAllQueues } from './helper';

export const orgUnit = ['MPA', 'IPA', 'AH', 'CAM'];
export const intents = ['Claims', 'Research', 'Complaint', 'Commercial'];
export const languages = {
  ptBR: ['ptBR', 'ptPT'],
  ptPT: ['ptPT', 'ptBR'],
  frFR: ['frFR', 'feBE'],
  frBE: ['feBE', 'frFR'],
  nlNL: ['nlNL', 'nlBE'],
  nlBE: ['nlBE', 'nlNL'],
  en: ['en'],
};
export const queues = mountAllQueues(orgUnit, intents);
