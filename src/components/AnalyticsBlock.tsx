import { moduleUsageOptions } from '../data';
import type { PillOption, FormValues } from '../types';
import { PillGroup } from './PillGroup';

type AnalyticsBlockProps = {
  formatOptions: PillOption[];
  values: FormValues;
  onPillChange: (fieldId: string, optionId: string, multiple?: boolean) => void;
};

export function AnalyticsBlock({ formatOptions, values, onPillChange }: AnalyticsBlockProps) {
  const needed =
    typeof values.analyticsNeeded === 'string' ? (values.analyticsNeeded as string) : '';
  const formatVal = Array.isArray(values.analyticsFormat)
    ? (values.analyticsFormat as string[])
    : [];

  return (
    <div className="field-block field-anchor" id="field-analyticsNeeded">
      <div className="field-row field-row--compact">
        <div className="field-label field-label--compact">Аналитика в личном кабинете</div>
        <div className="field-control">
          <PillGroup
            options={moduleUsageOptions}
            value={needed}
            onChange={(optionId) => onPillChange('analyticsNeeded', optionId)}
          />
        </div>
      </div>
      {needed === 'yes' && (
        <div className="field-details field-details--compact field-anchor" id="field-analyticsFormat">
          <span className="modules-table-details-label">Формат аналитики</span>
          <PillGroup
            options={formatOptions}
            value={formatVal}
            multiple
            onChange={(optionId) => onPillChange('analyticsFormat', optionId, true)}
          />
        </div>
      )}
    </div>
  );
}
