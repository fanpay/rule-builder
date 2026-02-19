import { useState, useEffect } from 'react';
import { Condition } from './components/Condition';
import type { RuleGroup, RuleCondition, LogicOperator } from './types';
import {
  jsonToRuleGroup,
  ruleGroupToJSON,
  createEmptyCondition,
  formatJSON,
  validateRuleGroup,
} from './utils/ruleUtils';
import './App.css';

function App() {
  const [ruleGroup, setRuleGroup] = useState<RuleGroup>({
    logic: '$and',
    conditions: [],
  });
  const [disabled, setDisabled] = useState(true);
  const [showJSON, setShowJSON] = useState(false);

  // Initialize custom element
  useEffect(() => {
    if (!window.CustomElement) {
      console.error('CustomElement SDK not found');
      return;
    }

    window.CustomElement.init((element, _context) => {
      // Parse initial value
      const initialGroup = jsonToRuleGroup(element.value);
      setRuleGroup(initialGroup);

      // Set disabled state
      setDisabled(element.disabled);

      // Set initial height
      window.CustomElement.setHeight(400);

      // Listen for disabled changes
      window.CustomElement.onDisabledChanged((isDisabled) => {
        setDisabled(isDisabled);
      });
    });
  }, []);

  // Update Kontent.ai when rule group changes
  useEffect(() => {
    if (window.CustomElement && validateRuleGroup(ruleGroup)) {
      const json = ruleGroupToJSON(ruleGroup);
      const jsonString = Object.keys(json).length > 0 ? JSON.stringify(json) : '';
      window.CustomElement.setValue(jsonString);

      // Adjust height based on content
      const baseHeight = 300;
      const conditionHeight = 60;
      const totalHeight = baseHeight + (ruleGroup.conditions.length * conditionHeight);
      window.CustomElement.setHeight(Math.min(totalHeight, 800));
    }
  }, [ruleGroup]);

  const handleLogicChange = (newLogic: LogicOperator) => {
    setRuleGroup({ ...ruleGroup, logic: newLogic });
  };

  const handleConditionUpdate = (index: number, updatedCondition: RuleCondition) => {
    const newConditions = [...ruleGroup.conditions];
    newConditions[index] = updatedCondition;
    setRuleGroup({ ...ruleGroup, conditions: newConditions });
  };

  const handleConditionRemove = (index: number) => {
    const newConditions = ruleGroup.conditions.filter((_, i) => i !== index);
    setRuleGroup({ ...ruleGroup, conditions: newConditions });
  };

  const handleAddCondition = () => {
    const newCondition = createEmptyCondition();
    setRuleGroup({
      ...ruleGroup,
      conditions: [...ruleGroup.conditions, newCondition],
    });
  };

  const currentJSON = ruleGroupToJSON(ruleGroup);
  const isValid = validateRuleGroup(ruleGroup);

  return (
    <div className="rule-builder">
      <div className="rule-builder-header">
        <h3 className="rule-builder-title">Personalization Rules</h3>
        {!isValid && (
          <span className="validation-error">
            Please complete all condition fields
          </span>
        )}
      </div>

      <div className="logic-selector">
        <label htmlFor="logic-select">Match:</label>
        <select
          id="logic-select"
          value={ruleGroup.logic}
          onChange={(e) => handleLogicChange(e.target.value as LogicOperator)}
          disabled={disabled || ruleGroup.conditions.length < 2}
          className="logic-select"
        >
          <option value="$and">ALL</option>
          <option value="$or">ANY</option>
        </select>
        <span className="logic-description">
          of the following conditions
        </span>
      </div>

      <div className="conditions-container">
        {ruleGroup.conditions.length === 0 ? (
          <div className="empty-state">
            <p>No conditions defined yet.</p>
            <p className="empty-state-hint">
              Click "Add condition" to create a personalization rule.
            </p>
          </div>
        ) : (
          ruleGroup.conditions.map((condition, index) => (
            <Condition
              key={condition.id}
              condition={condition}
              onUpdate={(updated) => handleConditionUpdate(index, updated)}
              onRemove={() => handleConditionRemove(index)}
              disabled={disabled}
            />
          ))
        )}
      </div>

      <div className="actions">
        <button
          onClick={handleAddCondition}
          disabled={disabled}
          className="btn-add-condition"
        >
          + Add condition
        </button>

        <button
          onClick={() => setShowJSON(!showJSON)}
          className="btn-toggle-json"
          disabled={!isValid}
        >
          {showJSON ? 'Hide JSON' : 'Show JSON'}
        </button>
      </div>

      {showJSON && isValid && (
        <div className="json-preview">
          <div className="json-preview-header">
            <span className="json-preview-label">Stored JSON:</span>
          </div>
          <pre className="json-preview-content">
            {formatJSON(currentJSON)}
          </pre>
        </div>
      )}

      {disabled && (
        <div className="disabled-overlay">
          <span className="disabled-message">
            This content item is not editable
          </span>
        </div>
      )}
    </div>
  );
}

export default App;
