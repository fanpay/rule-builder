// Kontent.ai Custom Element API types
export interface CustomElementInit {
  value: string | null;
  disabled: boolean;
  config: CustomElementConfig | null;
}

export interface CustomElementContext {
  projectId: string;
  variant: {
    id: string;
    codename: string;
  } | null;
  item: {
    id: string;
    codename: string;
  };
}

export interface CustomElementConfig {
  // Configuration passed from Kontent.ai
  [key: string]: string;
}

// Global CustomElement API
declare global {
  interface Window {
    CustomElement: {
      init: (
        callback: (element: CustomElementInit, context: CustomElementContext) => void
      ) => void;
      setValue: (value: string) => void;
      setHeight: (height: number) => void;
      onDisabledChanged: (callback: (disabled: boolean) => void) => void;
    };
  }
}

// Rule Builder Types
export type OperatorType = '$eq' | '$ne' | '$in' | '$nin' | '$gt' | '$lt' | '$gte' | '$lte' | '$contains';

export type SignalField = 
  | 'industry' 
  | 'solution' 
  | 'returning_visitor' 
  | 'visit_intent'
  | 'page_category'
  | 'content_type';

export interface RuleCondition {
  id: string;
  field: SignalField;
  operator: OperatorType;
  value: string | string[] | boolean;
}

export type LogicOperator = '$and' | '$or';

export interface RuleGroup {
  logic: LogicOperator;
  conditions: RuleCondition[];
}

// Simplified JSON output for basic rules
export type RuleJSON = 
  | { [key in LogicOperator]: RuleOperatorCondition[] }
  | RuleOperatorCondition;

export type RuleOperatorCondition = {
  [key in OperatorType]?: {
    field: string;
    value: string | string[] | boolean;
  }
};

// Field options for dropdowns
export interface FieldOption {
  value: SignalField;
  label: string;
  valueType: 'text' | 'select' | 'boolean';
  options?: { value: string; label: string }[];
}

// Available signal fields configuration
export const SIGNAL_FIELDS: FieldOption[] = [
  {
    value: 'industry',
    label: 'Industry',
    valueType: 'select',
    options: [
      { value: 'pharma', label: 'Pharma & Life Sciences' },
      { value: 'logistics', label: 'Logistics & Supply Chain' },
      { value: 'food', label: 'Food & Beverage' },
      { value: 'retail', label: 'Retail' },
      { value: 'manufacturing', label: 'Manufacturing' },
    ],
  },
  {
    value: 'solution',
    label: 'Solution Interest',
    valueType: 'select',
    options: [
      { value: 'automation', label: 'Automation' },
      { value: 'digital', label: 'Digital Solutions' },
      { value: 'packaging', label: 'Packaging' },
      { value: 'supply_chain', label: 'Supply Chain' },
    ],
  },
  {
    value: 'returning_visitor',
    label: 'Returning Visitor',
    valueType: 'boolean',
  },
  {
    value: 'visit_intent',
    label: 'Visit Intent',
    valueType: 'select',
    options: [
      { value: 'learn', label: 'Learn' },
      { value: 'explore', label: 'Explore Solutions' },
      { value: 'contact', label: 'Contact Sales' },
    ],
  },
  {
    value: 'page_category',
    label: 'Page Category',
    valueType: 'select',
    options: [
      { value: 'products', label: 'Products' },
      { value: 'solutions', label: 'Solutions' },
      { value: 'about', label: 'About Us' },
      { value: 'resources', label: 'Resources' },
    ],
  },
  {
    value: 'content_type',
    label: 'Content Type',
    valueType: 'select',
    options: [
      { value: 'article', label: 'Article' },
      { value: 'case_study', label: 'Case Study' },
      { value: 'whitepaper', label: 'Whitepaper' },
      { value: 'video', label: 'Video' },
    ],
  },
];

export const OPERATORS: { value: OperatorType; label: string }[] = [
  { value: '$eq', label: 'equals' },
  { value: '$ne', label: 'not equals' },
  { value: '$in', label: 'is one of' },
  { value: '$nin', label: 'is not one of' },
  { value: '$contains', label: 'contains' },
  { value: '$gt', label: 'greater than' },
  { value: '$lt', label: 'less than' },
  { value: '$gte', label: 'greater or equal' },
  { value: '$lte', label: 'less or equal' },
];
