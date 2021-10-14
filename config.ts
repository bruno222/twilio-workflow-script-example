import { mountAllQueues } from './helper';

export const businessLines = ['MPA', 'IPA', 'AEH', 'CAM'];
export const intents = ['Research', 'Complaint', 'eCommerce', 'Commercial'];
export const languages = {
  ptBR: ['ptBR', 'ptPT'],
  ptPT: ['ptPT', 'ptBR'],
  frFR: ['frFR', 'feBE'],
  frBE: ['feBE', 'frFR'],
  nlNL: ['nlNL', 'nlBE'],
  nlBE: ['nlBE', 'nlNL'],
  en: ['en'],
};
export const queues = mountAllQueues(businessLines, intents);
