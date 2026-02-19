import React from 'react';
import type { RuleCondition, SignalField, OperatorType } from '../types';
import { SIGNAL_FIELDS, OPERATORS } from '../types';

interface ConditionProps {
  condition: RuleCondition;
  onUpdate: (updatedCondition: RuleCondition) => void;
  onRemove: () => void;
  disabled: boolean;
}

export const Condition: React.FC<ConditionProps> = ({
  condition,
  onUpdate,
  onRemove,
  disabled,
}) => {
  const selectedField = SIGNAL_FIELDS.find((f) => f.value === condition.field);

  const handleFieldChange = (newField: SignalField) => {
    const fieldConfig = SIGNAL_FIELDS.find((f) => f.value === newField);
    let newValue: string | string[] | boolean = '';

    // Set default value based on field type
    if (fieldConfig?.valueType === 'boolean') {
      newValue = true;
    } else if (fieldConfig?.valueType === 'select' && fieldConfig.options) {
      newValue = fieldConfig.options[0].value;
    }

    onUpdate({
      ...condition,
      field: newField,
      value: newValue,
    });
  };

  const handleOperatorChange = (newOperator: OperatorType) => {
    onUpdate({
      ...condition,
      operator: newOperator,
    });
  };

  const handleValueChange = (newValue: string | string[] | boolean) => {
    onUpdate({
      ...condition,
      value: newValue,
    });
  };

  const renderValueInput = () => {
    if (!selectedField) return null;

    switch (selectedField.valueType) {
      case 'boolean':
        return (
          <select
            value={String(condition.value)}
            onChange={(e) => handleValueChange(e.target.value === 'true')}
            disabled={disabled}
            className="condition-select"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );

      case 'select':
        if (!selectedField.options) return null;
        
        // For $in and $nin operators, allow multiple selection
        if (condition.operator === '$in' || condition.operator === '$nin') {
          const currentValues = Array.isArray(condition.value) 
            ? condition.value 
            : [condition.value];

          return (
            <select
              multiple
              value={currentValues}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                handleValueChange(selected);
              }}
              disabled={disabled}
              className="condition-select condition-select-multiple"
            >
              {selectedField.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          );
        }

        // Single selection
        return (
          <select
            value={String(condition.value)}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={disabled}
            className="condition-select"
          >
            {selectedField.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'text':
      default:
        return (
          <input
            type="text"
            value={String(condition.value)}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={disabled}
            className="condition-input"
            placeholder="Enter value..."
          />
        );
    }
  };

  return (
    <div className="condition-row">
      <select
        value={condition.field}
        onChange={(e) => handleFieldChange(e.target.value as SignalField)}
        disabled={disabled}
        className="condition-select condition-field"
      >
        {SIGNAL_FIELDS.map((field) => (
          <option key={field.value} value={field.value}>
            {field.label}
          </option>
        ))}
      </select>

      <select
        value={condition.operator}
        onChange={(e) => handleOperatorChange(e.target.value as OperatorType)}
        disabled={disabled}
        className="condition-select condition-operator"
      >
        {OPERATORS.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>

      {renderValueInput()}

      <button
        onClick={onRemove}
        disabled={disabled}
        className="condition-remove"
        aria-label="Remove condition"
        title="Remove condition"
      >
        ×
      </button>
    </div>
  );
};
