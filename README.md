# CircleCI for VS Code

A simple extension for VS Code to allow you to monitor, inspect, run, and cancel Pipeline Builds on [CircleCI](https://circleci.com).

This project is still in beta. You can [report issues here](https://github.com/jodyheavener/circleci-vscode/issues).

_This extension is not built or endorsed by CircleCI. The "C" logo is a trademark of Circle Internet Services, Inc._

## How to Use

💻 You have two options for installation:

- From the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=jodyh.circleci-vscode). Just search for "CircleCI" from the Marketplace extension.
- Manually from the [Releases](https://github.com/jodyheavener/circleci-vscode/releases) page. Download the latest release of the `.vsix` file. In VS Code you can open the command palette, type "vsix", choose "Extensions: Install from VSIX...", and select the downloaded file.

📝 Either `./circle.yaml` _or_ `.circleci/config.yaml` must exist in your workspace.

🔑 An API Token needs to be set. It can be created from your [Personal API Tokens page](https://app.circleci.com/settings/user/tokens). Open settings and search for "CircleCI" (specifically `circleci.apiToken`) and fill in your token.

✅ You're ready to go. Open up the CircleCI view from your activity bar. The extension will look for builds happening on the current branch, and will update as you change branches. It does a few things:

- Pulls in data for each recent Build in the Pipeline, including the related commit data, workflow, and build duration.
- Continually checks CircleCI for updates to a Build if it's currently running.
- Provides you with Build Artifacts; if artifacts are available there will be a "Look up Artifacts" row that you can click to fetch a list of Build Artifacts. Clicking an Artifact will open it in VS Code.

⚙️ Beyond the API Token you can also configure:

- "Build Count" (`circleci.buildCount`) determines how many Builds to retrieve in a given Pipeline, to a maximum of 30.
- "Build Refresh Interval" (`circleci.buildRefreshInterval`) determines how frequently, in seconds, we should poll CircleCI for an update to an active Build (running, scheduled, queued). Set to `0` to disable.
- "Custom Branches" (`circleci.customBranches`) will, for each line item, attempt to load that branch's Pipeline, in addition to the Pipeline of the branch you're currently on. For example, `master`.
- "Pipeline Refresh Interval" (`circleci.pipelineRefreshInterval`) determines how frequently, in seconds, we should poll CircleCI for updates to a Pipeline. Does not fire on active branches. Set to `0` to disable.

🛠 Various context menu commands can be performed in the extension view:

- "Open Pipelines in browser" from the CircleCI view title will open your current repository on CircleCi in your default browser.
- "Refresh Pipelines" from the CircleCI view title will refresh all the current Pipelines.
- "Open in browser" on a Pipeline or Build row will open the selected item on CircleCi in your default browser.
- "Remove" on a Pipeline row will remove that saved Pipeline from the "Custom Branches" config option. You cannot remove the active Git branch.
- "Refresh" on a Pipeline or Build row will query the API for the latest data on that item.
- "Cancel build" on a Build row will cancel the selected Build if it is running.
- "Retry build" on a Build row will create a new Build as a retry of the selected Build.
- "Copy build number" on a Build row will copy its number to your clipboard.
- "Copy commit hash" on a Build's commit row will copy the full commit hash to your clipboard.
- "Copy workflow ID" on a Build's workflow row will copy the Build's workflow ID to your clipboard.

## Development

This project is built with Node, TypeScript, [vsce](https://github.com/microsoft/vscode-vsce), the [VS Code Extension API](https://code.visualstudio.com/api), and the [CircleCI API](https://www.npmjs.com/package/circleci). Development is pretty straightforward:

- Clone the [project](https://github.com/jodyheavener/circleci-vscode)
- Install dependencies: `npm install`
- Build and watch for changes: `npm run watch`
- Run the extension locally by pressing F5 or click `Run > Start Debugging`.
- Use the on-screen debugging tools to restart and stop debugging

When you're ready to package for distribution run `vsce package`.

## License

[MIT](./LICENSE)
