// import { TreeItem, TreeItemCollapsibleState } from 'vscode';
// import circleClient from '../lib/circle-client';
// import { getAsset, l, pluralize } from '../lib/utils';
// import Job from './job';

// export default class JobTests extends TreeItem {
//   readonly contextValue = 'circleciJobTests';
//   private fetching = false;
//   private fetched = false;

//   constructor(readonly job: Job) {
//     super(l('lookUpTests', 'Look up Tests →'), TreeItemCollapsibleState.None);

//     this.iconPath = getAsset('clipboard');

//     this.command = {
//       command: 'circleci.fetchJobTests',
//       title: l('fetchTests', 'Fetch Tests'),
//       arguments: [this],
//     };
//   }

//   async fetchTests(): Promise<void> {
//     if (this.fetching || this.fetched) {
//       return;
//     }

//     this.fetching = true;
//     const { items: tests } = await (await circleClient()).listJobTests(
//       this.job.job.job_number!
//     );

//     this.label = tests.length
//       ? `${pluralize(
//           tests.length,
//           l('testSingular', 'Test'),
//           l('testPlural', 'Tests')
//         )}`
//       : l('noTests', 'No tests');

//     this.collapsibleState = tests.length
//       ? TreeItemCollapsibleState.Expanded
//       : TreeItemCollapsibleState.None;

//     this.fetching = false;
//     this.fetched = true;
//     this.command = undefined;
//     this.job.workflow.pipeline.refresh();
//   }
// }
