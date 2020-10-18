## v0.2.0

Welcome to v0.2.0, and your first official changelog! With this and all future updates, if something's not quite right you can [report issues here](https://github.com/jodyheavener/circleci-vscode/issues).

So what's new? **Everything.**

### Entirely rewritten

Everything about the extension has been reworked, from the code to the README. This allowed me to break things up into cleaner, purpose-built components that will hopefully make things more extensible and easier to debug.

With the new code comes new underlying architecture, including the use of a different [client for the CircleCI API](https://www.npmjs.com/package/circle-client), one which gives access to [V2 API endpoints](https://circleci.com/docs/api/v2/). Some of these endpoints are still evolving, so the extension could break because of this, but I'll do my best to keep everything up to date.

Alongside the code changes comes some cosmetic updates as well, with brand new icons hand-made for the extension, updated status icons, and new webview layouts (we'll get to this later).

### Updated tree view

v0.1.0 of the extension displayed each Pipeline's Job builds, regardless of the Workflow, which was mostly a limitation of the API client I was using. This was fine, but was a little hard to follow and didn't really resemble the same type of hierarchy present in Circle's web UI. With this release comes a whole new tree view that displays nested Pipelines, Workflows, and Jobs. You can learn more about each tree item and all of its capabilities in the [README](https://github.com/jodyheavener/circleci-vscode#-features).

### Inspect tests

One of the major new features of the extension is the ability to inspect Job Test metadata. That means, if your Job [supports it](https://circleci.com/docs/2.0/collect-test-data/), you can load the results of your test suite right inside VS Code. Not can you see results, but you can also check out failure messages and even click right over to the relevant code.

### All the small things

In addition to the new layout and test UI, there are all sorts of small updates, such as approving hold jobs, better support for artifact files, and improved Workflow re-run functionality.

### What's up next

There will be bugs, but I'll be trying to stay on top of them. Additionally, I'm aiming to get the following completed before too long:

- Localize everything and provide a few translations.
- Release a 1.x version; this is dependent on Circle moving their V2 API endpoints out of Preview.
- Better in-app Artifact viewing.
- Workflow summary metrics and other Project analytics.
