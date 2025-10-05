import { Component, signal, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import loader from '@monaco-editor/loader';

declare const monaco: any;

@Component({
  selector: 'app-razor-editor-page',
  imports: [CommonModule],
  templateUrl: './razor-editor.page.html',
  styleUrl: './razor-editor.page.scss'
})
export class RazorEditorPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('editorContainer', { static: false }) editorContainer!: ElementRef;

  private editor: any;
  private completionProviderDisposable: { dispose: () => void } | undefined;

  code = signal(`@page
@model IndexModel
@{
    ViewData["Title"] = "Home page";
}

<div class="text-center">
    <h1 class="display-4">Welcome</h1>
    <p>Learn about <a href="https://learn.microsoft.com/aspnet/core">building Web apps with ASP.NET Core</a>.</p>
</div>

@section Scripts {
    <script>
        console.log('Razor page loaded');
    </script>
}
`);

  ngOnInit(): void {
    loader.config({ paths: { vs: 'assets/monaco/min/vs' } });
  }

  ngAfterViewInit(): void {
    loader.init().then((monacoInstance) => {
      const indexModelProperties = [
        {
          label: 'Message',
          insertText: 'Message',
          documentation: 'Gets or sets the welcome message for the page.'
        },
        {
          label: 'PageTitle',
          insertText: 'PageTitle',
          documentation: 'Gets or sets the title displayed on the page.'
        },
        {
          label: 'LastUpdated',
          insertText: 'LastUpdated',
          documentation: 'Gets the timestamp representing the last update time.'
        }
      ];

      this.completionProviderDisposable = monacoInstance.languages.registerCompletionItemProvider('razor', {
        triggerCharacters: ['.'],
        provideCompletionItems: (model: any, position: any, _context: any, _token: any) => {
          const modelDeclarationRegex = /@model\s+IndexModel/;
          if (!modelDeclarationRegex.test(model.getValue())) {
            return { suggestions: [] };
          }

          const lineContent = model.getLineContent(position.lineNumber).slice(0, position.column - 1);
          if (!/Model\.\w*$/.test(lineContent)) {
            return { suggestions: [] };
          }

          const word = model.getWordUntilPosition(position);
          const range = new monacoInstance.Range(
            position.lineNumber,
            word.startColumn,
            position.lineNumber,
            word.endColumn
          );

          const suggestions = indexModelProperties.map((property) => ({
            label: property.label,
            kind: monacoInstance.languages.CompletionItemKind.Property,
            insertText: property.insertText,
            range,
            detail: 'IndexModel property',
            documentation: property.documentation
          }));

          return { suggestions };
        }
      });

      this.editor = monacoInstance.editor.create(this.editorContainer.nativeElement, {
        value: this.code(),
        language: 'razor',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: true },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        cursorStyle: 'line'
      });

      this.editor.onDidChangeModelContent(() => {
        this.code.set(this.editor.getValue());
      });
    });
  }

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.dispose();
    }
    this.completionProviderDisposable?.dispose();
  }

  clearCode(): void {
    if (this.editor) {
      this.editor.setValue('');
    }
    this.code.set('');
  }

  resetCode(): void {
    const defaultCode = `@page
@model IndexModel
@{
    ViewData["Title"] = "Home page";
}

<div class="text-center">
    <h1 class="display-4">Welcome</h1>
    <p>Learn about <a href="https://learn.microsoft.com/aspnet/core">building Web apps with ASP.NET Core</a>.</p>
</div>

@section Scripts {
    <script>
        console.log('Razor page loaded');
    </script>
}
`;
    if (this.editor) {
      this.editor.setValue(defaultCode);
    }
    this.code.set(defaultCode);
  }

  downloadCode(): void {
    const blob = new Blob([this.code()], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'page.cshtml';
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
