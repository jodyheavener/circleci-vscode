import { TextDocumentContentProvider, Uri } from 'vscode';

export default class ArtifactContentProvider
  implements TextDocumentContentProvider
{
  provideTextDocumentContent(uri: Uri): string {
    return decodeURIComponent(uri.path);
  }
}
