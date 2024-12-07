declare module 'react-mathquill' {
  export function addStyles(): void;
  
  export interface MathFieldConfig {
    spaceBehavesLikeTab?: boolean;
    leftRightIntoCmdGoes?: "up" | "down";
    restrictMismatchedBrackets?: boolean;
    sumStartsWithNEquals?: boolean;
    supSubsRequireOperand?: boolean;
    autoCommands?: string;
    autoOperatorNames?: string;
  }

  export interface EditableMathFieldProps {
    latex?: string;
    onChange?: (mathField: any) => void;
    config?: MathFieldConfig;
    mathquillDidMount?: (mathField: any) => void;
    disabled?: boolean;
  }

  export const EditableMathField: React.FC<EditableMathFieldProps>;
  export const StaticMathField: React.FC<{ children: string }>;
}

declare module '@monaco-editor/react' {
  import type * as monaco from 'monaco-editor';
  
  interface EditorProps {
    height?: string | number;
    defaultLanguage?: string;
    defaultValue?: string;
    value?: string;
    theme?: string;
    options?: monaco.editor.IStandaloneEditorConstructionOptions;
    onChange?: (value: string | undefined) => void;
    onMount?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  }

  export const Editor: React.FC<EditorProps>;
}

declare module 'monaco-editor' {
  export * from 'monaco-editor/esm/vs/editor/editor.api';
} 