import type { RuleCondition, RuleGroup, RuleJSON, LogicOperator } from '../types';

/**
 * Generates a unique ID for conditions
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Converts internal rule group to JSON format for storage
 */
export function ruleGroupToJSON(group: RuleGroup): RuleJSON {
  const conditions = group.conditions.map((condition) => {
    return {
      [condition.operator]: {
        field: condition.field,
        value: condition.value,
      },
    };
  });

  if (conditions.length === 0) {
    return {} as RuleJSON;
  }

  if (conditions.length === 1 && group.logic === '$and') {
    // Single condition - no need for logic wrapper
    return conditions[0];
  }

  // Multiple conditions or explicit OR - use logic wrapper
  return {
    [group.logic]: conditions,
  } as RuleJSON;
}

/**
 * Parses stored JSON value back to internal rule group format
 */
export function jsonToRuleGroup(json: string | null): RuleGroup {
  const defaultGroup: RuleGroup = {
    logic: '$and',
    conditions: [],
  };

  if (!json) {
    return defaultGroup;
  }

  try {
    const parsed = JSON.parse(json);

    // Handle empty object
    if (Object.keys(parsed).length === 0) {
      return defaultGroup;
    }

    // Check if it's a logic wrapper ($and or $or)
    const logicKey = Object.keys(parsed).find(
      (key) => key === '$and' || key === '$or'
    ) as LogicOperator | undefined;

    if (logicKey) {
      // Multiple conditions with logic operator
      const conditionsList = parsed[logicKey] as Array<Record<string, unknown>>;
      
      const conditions: RuleCondition[] = conditionsList.map((cond, index) => {
        const operatorKey = Object.keys(cond)[0];
        const condData = cond[operatorKey] as { field: string; value: string | string[] | boolean };
        
        return {
          id: generateId(),
          field: condData.field as RuleCondition['field'],
          operator: operatorKey as RuleCondition['operator'],
          value: condData.value,
        };
      });

      return {
        logic: logicKey,
        conditions,
      };
    } else {
      // Single condition without logic wrapper
      const operatorKey = Object.keys(parsed)[0];
      const condData = parsed[operatorKey] as { field: string; value: string | string[] | boolean };

      return {
        logic: '$and',
        conditions: [
          {
            id: generateId(),
            field: condData.field as RuleCondition['field'],
            operator: operatorKey as RuleCondition['operator'],
            value: condData.value,
          },
        ],
      };
    }
  } catch (error) {
    console.error('Failed to parse rule JSON:', error);
    return defaultGroup;
  }
}

/**
 * Formats the JSON for display (pretty print)
 */
export function formatJSON(json: RuleJSON): string {
  return JSON.stringify(json, null, 2);
}

/**
 * Validates a rule group
 */
export function validateRuleGroup(group: RuleGroup): boolean {
  if (group.conditions.length === 0) {
    return true; // Empty is valid (no rules)
  }

  return group.conditions.every((condition) => {
    // Check if field is set
    if (!condition.field) return false;
    
    // Check if operator is set
    if (!condition.operator) return false;
    
    // Check if value is set (can be empty string for text fields)
    if (condition.value === null || condition.value === undefined) return false;
    
    // For array values, ensure at least one item
    if (Array.isArray(condition.value) && condition.value.length === 0) return false;
    
    return true;
  });
}

/**
 * Creates an empty condition
 */
export function createEmptyCondition(): RuleCondition {
  return {
    id: generateId(),
    field: 'industry',
    operator: '$eq',
    value: '',
  };
}
