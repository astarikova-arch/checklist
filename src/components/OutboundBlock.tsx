import { callbackTypeOptions, launchOptions, moduleUsageOptions } from '../data';
import type { FormValues } from '../types';
import { CheckboxRow } from './CheckboxRow';
import { PillGroup } from './PillGroup';

type OutboundBlockProps = {
  values: FormValues;
  onCheckboxChange: (fieldId: string, checked: boolean) => void;
  onPillChange: (fieldId: string, optionId: string, multiple?: boolean) => void;
};

export function OutboundBlock({ values, onCheckboxChange, onPillChange }: OutboundBlockProps) {
  const timeUsed = typeof values.outboundTimeUsed === 'string' ? values.outboundTimeUsed : '';
  const callbackUsed =
    typeof values.outboundCallbackUsed === 'string' ? values.outboundCallbackUsed : '';
  const callbackType =
    typeof values.outboundCallbackType === 'string' ? values.outboundCallbackType : '';
  const launch = typeof values.outboundLaunch === 'string' ? values.outboundLaunch : '';

  return (
    <div className="outbound-block">
      <div className="field-block field-anchor" id="field-outboundTimeUsed">
        <div className="field-row field-row--compact">
          <div className="field-label field-label--compact">Ограничения по времени звонков</div>
          <div className="field-control">
            <PillGroup
              options={moduleUsageOptions}
              value={timeUsed}
              onChange={(optionId) => onPillChange('outboundTimeUsed', optionId)}
            />
          </div>
        </div>
        {timeUsed === 'yes' && (
          <div className="field-details field-details--compact field-anchor" id="field-outboundTimeLogic">
            <CheckboxRow
              id="outboundTimeLogic"
              label="Логика ограничения по времени указана"
              compact
              checked={values.outboundTimeLogic === true}
              onChange={(checked) => onCheckboxChange('outboundTimeLogic', checked)}
            />
          </div>
        )}
      </div>

      <div className="field-block field-anchor" id="field-outboundCallbackUsed">
        <div className="field-row field-row--compact">
          <div className="field-label field-label--compact">Перезвоны</div>
          <div className="field-control">
            <PillGroup
              options={moduleUsageOptions}
              value={callbackUsed}
              onChange={(optionId) => onPillChange('outboundCallbackUsed', optionId)}
            />
          </div>
        </div>
        {callbackUsed === 'yes' && (
          <div className="field-details field-details--compact field-anchor" id="field-outboundCallbackType">
            <span className="modules-table-details-label">Тип логики</span>
            <PillGroup
              options={callbackTypeOptions}
              value={callbackType}
              onChange={(optionId) => onPillChange('outboundCallbackType', optionId)}
            />
          </div>
        )}
      </div>

      <div className="outbound-launch field-anchor" id="field-outboundLaunch">
        <span className="outbound-launch-label">Способ запуска</span>
        <PillGroup
          options={launchOptions}
          value={launch}
          onChange={(optionId) => onPillChange('outboundLaunch', optionId)}
        />
      </div>
    </div>
  );
}
