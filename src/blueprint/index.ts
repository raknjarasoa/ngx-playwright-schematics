import { Rule } from '@angular-devkit/schematics';
import { Schema } from '../ng-add/schema';
import { ngAdd } from '../ng-add';

export function blueprint(options: Schema): Rule {
  return ngAdd(options);
}
