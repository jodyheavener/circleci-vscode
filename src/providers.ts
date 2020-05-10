import { TextDocumentContentProvider, Uri } from "vscode";

export class CircleCIContentProvider implements TextDocumentContentProvider {
  provideTextDocumentContent(uri: Uri) {
    return decodeURIComponent(uri.path);
  }
}
