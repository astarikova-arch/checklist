import { existsYesNoOptions, moduleUsageOptions } from '../data';
import type { FormValues } from '../types';
import { CheckboxRow } from './CheckboxRow';
import { PillGroup } from './PillGroup';

type OperatorTransferBlockProps = {
  values: FormValues;
  onPillChange: (fieldId: string, optionId: string, multiple?: boolean) => void;
  onCheckboxChange: (fieldId: string, checked: boolean) => void;
};

export function OperatorTransferBlock({
  values,
  onPillChange,
  onCheckboxChange,
}: OperatorTransferBlockProps) {
  const used = typeof values.operatorTransfer === 'string' ? values.operatorTransfer : '';
  const audioWhisper =
    typeof values.operatorTransferAudioWhisper === 'string'
      ? values.operatorTransferAudioWhisper
      : '';

  return (
    <div className="data-work-block field-anchor" id="field-operatorTransfer">
      <div className="field-row field-row--compact">
        <div className="field-label field-label--compact">Перевод на оператора</div>
        <div className="field-control">
          <PillGroup
            options={moduleUsageOptions}
            value={used}
            onChange={(optionId) => onPillChange('operatorTransfer', optionId)}
          />
        </div>
      </div>

      {used === 'yes' && (
        <div className="data-work-details">
          <div className="data-work-sub">
            <div className="data-work-sub-pills field-anchor" id="field-operatorTransferAudioWhisper">
              <span className="modules-table-details-label">Аудиошепот</span>
              <PillGroup
                options={existsYesNoOptions}
                value={audioWhisper}
                onChange={(optionId) => onPillChange('operatorTransferAudioWhisper', optionId)}
              />
            </div>
            {audioWhisper === 'yes' && (
              <div className="field-anchor" id="field-operatorTransferData">
                <CheckboxRow
                  id="operatorTransferData"
                  label="Данные, которые должны передавать оператору, указаны"
                  compact
                  checked={values.operatorTransferData === true}
                  onChange={(checked) => onCheckboxChange('operatorTransferData', checked)}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
