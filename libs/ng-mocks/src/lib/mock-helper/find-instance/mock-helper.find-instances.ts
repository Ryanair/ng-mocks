import { getSourceOfMock } from '../../common/func.get-source-of-mock';
import { isNgDef } from '../../common/func.is-ng-def';
import mockHelperCrawl from '../crawl/mock-helper.crawl';
import mockHelperFindAll from '../find/mock-helper.find-all';
import funcGetFromNode from '../func.get-from-node';
import funcGetLastFixture from '../func.get-last-fixture';
import funcParseFindArgs from '../func.parse-find-args';

import funcIsValidFindInstanceSelector from './func.is-valid-find-instance-selector';

export default <T>(...args: any[]): T[] => {
  const [el, sel] = funcParseFindArgs(args, funcIsValidFindInstanceSelector);
  if (typeof sel !== 'function' && !isNgDef(sel, 't')) {
    throw new Error('Only classes or tokens are accepted');
  }

  const declaration = getSourceOfMock(sel);
  const result: T[] = [];
  const scanned: any[] = [];
  const elements = mockHelperFindAll(funcGetLastFixture(), el, undefined);
  for (const element of elements) {
    mockHelperCrawl(
      element,
      node => {
        if (scanned.indexOf(node) === -1) {
          funcGetFromNode(result, node, declaration);
          scanned.push(node);
        }
      },
      true,
    );
  }

  return result;
};
