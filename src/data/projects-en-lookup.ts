import { CaseStudy } from '../types';
import { caseStudiesEn } from './projects-en';
import { caseStudiesEn2 } from './projects-en-2';

const allEn = { ...caseStudiesEn, ...caseStudiesEn2 };

export function getProjectEn(id: string): CaseStudy | undefined {
  return allEn[id];
}
