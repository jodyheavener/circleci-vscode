import { Pipeline as PipelineData } from 'circle-client';
import { env } from 'vscode';
import { client } from '../lib/circleci';
import { configuration } from '../lib/config';
import { COMMANDS, URLS } from '../lib/constants';
import { events } from '../lib/events';
import { gitService } from '../lib/git-service';
import { ConfigKey, Events } from '../lib/types';
import { interpolate, openInBrowser, timeSince } from '../lib/utils';
import { Pipeline } from '../tree-items/pipeline';
import { WorkflowController } from './workflow';

export class PipelineController {
  view: Pipeline;
  workflows: WorkflowController[];

  constructor(private data: PipelineData) {
    this.view = new Pipeline(
      this,
      `#${data.number}`,
      `${timeSince(new Date(data.created_at))} ago`,
      `Triggered by ${data.trigger.actor.login} via ${data.trigger.type}`
    );

    if (configuration.get(ConfigKey.WorkflowsAutoLoad)) {
      this.fetch();
    } else {
      this.view.setDescription('Load workflows →');
      this.view.setCommand(COMMANDS.REFETCH, 'Load workflows');
    }
  }

  async fetch(): Promise<void> {
    this.view.setLoading(true);
    events.fire(Events.ReloadTree, this.view);

    const workflows = (await client.listPipelineWorkflows(this.data.id)).items;

    this.workflows = workflows.map(
      (workflow) => new WorkflowController(this, workflow)
    );

    this.view.children = this.workflows.map((workflow) => workflow.view);
    this.view.setDescription(
      `${timeSince(new Date(this.data.created_at))} ago`
    );
    this.view.setLoading(false);
    this.view.setCommand();

    events.fire(Events.ReloadTree, this.view);
  }

  openPage(): void {
    const { vcs, user, repo } = gitService.data;
    openInBrowser(
      interpolate(URLS.PIPELINE_URL, {
        vcs,
        user,
        repo,
        pipeline_number: this.data.number,
      })
    );
  }

  copyId(): void {
    env.clipboard.writeText(this.data.id);
  }

  copyNumber(): void {
    env.clipboard.writeText(this.data.number.toString());
  }
}
