declare module "react-mathquill" {
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
} 