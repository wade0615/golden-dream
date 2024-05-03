import * as path from 'path';

const filePath = path.dirname(__filename);
const envPath = path.join(filePath, '../../env');
const defaultStage = 'LOCAL';
const commonENV = '.env';
const stageENVDict = {
  LOCAL: 'LOCAL.env',
  DEV: 'DEV.env',
  QAS: 'QAS.env',
  PRD: 'PRD.env',
};

const APP_ENV = (process.env.APP_ENV || defaultStage).toUpperCase();
const stageENV = stageENVDict[APP_ENV] || stageENVDict[defaultStage];
export const envFilePath = [stageENV, commonENV].map((x) =>
  path.join(envPath, x),
);
