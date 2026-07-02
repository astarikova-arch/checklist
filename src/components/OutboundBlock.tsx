import { launchOptions } from '../data';
import type { FormValues } from '../types';
import { CheckboxRow } from './CheckboxRow';
import { PillGroup } from './PillGroup';

type OutboundBlockProps = {
  values: FormValues;
  onCheckboxChange: (fieldId: string, checked: boolean) => void;
  onPillChange: (fieldId: string, optionId: string) => void;
};

export function OutboundBlock({ values, onCheckboxChange, onPillChange }: OutboundBlockProps) {
  const launch = typeof values.outboundLaunch === 'string' ? values.outboundLaunch : '';

  return (
    <div className="outbound-block">
      <CheckboxRow
        id="outboundTimeRestrictions"
        label="Ограничения по времени звонков"
        checked={values.outboundTimeRestrictions === true}
        onChange={(checked) => onCheckboxChange('outboundTimeRestrictions', checked)}
      />
      <CheckboxRow
        id="outboundCallbackLogic"
        label="Логика перезвонов"
        checked={values.outboundCallbackLogic === true}
        onChange={(checked) => onCheckboxChange('outboundCallbackLogic', checked)}
      />
      <div className="outbound-launch">
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
