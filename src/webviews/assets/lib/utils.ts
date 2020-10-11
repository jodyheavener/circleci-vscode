import * as nls from 'vscode-nls';
import constants from '../../../lib/constants';
import { JobTestDetails } from '../../../lib/types';

export function l(
  key: string | nls.LocalizeInfo,
  message: string,
  ...args: (string | number | boolean | undefined | null)[]
): string {
  if (typeof key === 'string') {
    return nls.config()()(
      `${constants.LOCALIZATION_PREFIX}.${key}`,
      message,
      ...args
    );
  } else {
    return nls.config()()(key, message, ...args);
  }
}

export function interpolate(
  value: string,
  replacements: { [key: string]: string | number }
): string {
  return Object.keys(replacements).reduce((p, c) => {
    return p.split('{' + c + '}').join(String(replacements[c]));
  }, value);
}

export function getJobUrl(details: JobTestDetails): string {
  return interpolate(constants.JOB_URL, {
    vcs: details.vcs,
    user: details.user,
    repo: details.repo,
    pipeline_number: details.pipelineNumber,
    workflow_id: details.workflowId,
    job_number: details.jobNumber,
  });
}
