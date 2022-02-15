import { JobTest } from 'circle-client';
import { client } from '../lib/circleci';
import { events } from '../lib/events';
import { Events } from '../lib/types';
import { Tests } from '../tree-items/tests';

export class TestsController {
  view: Tests;
  tests: JobTest[];

  constructor(private jobNumber: number) {
    this.view = new Tests(this);
  }

  async fetch(): Promise<void> {
    this.view.setLoading(true);
    events.fire(Events.ReloadTree, this.view);

    this.tests = (await client.listJobTests(this.jobNumber)).items;

    this.view.setFetched(this.tests.length);
    this.view.setLoading(false);

    events.fire(Events.ReloadTree, this.view);
  }
}
