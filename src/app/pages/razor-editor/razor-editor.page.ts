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
