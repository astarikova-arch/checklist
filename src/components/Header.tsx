import type { FormValues } from '../types';
import { getOverallProgress } from '../utils';

type HeaderProps = {
  values: FormValues;
  requestCount: number;
  onReset: () => void;
  onExport: () => void;
  exportCopied: boolean;
};

export function Header({ values, requestCount, onReset, onExport, exportCopied }: HeaderProps) {
  const { filled, total } = getOverallProgress(values);
  const percent = total > 0 ? Math.round((filled / total) * 100) : 0;

  return (
    <header className="app-header">
      <div className="app-header-main">
        <h1 className="app-title">Оценка проекта</h1>
        <div className="app-progress">
          <div className="app-progress-label">
            <span>
              {filled}/{total} блоков заполнено
            </span>
            <span className="app-progress-percent">{percent}%</span>
          </div>
          <div className="app-progress-bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
            <div className="app-progress-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>
      <div className="app-header-actions">
        <button type="button" className="btn btn--ghost" onClick={onReset}>
          Сбросить
        </button>
        <button type="button" className="btn btn--primary" onClick={onExport}>
          {exportCopied ? 'Скопировано!' : `Экспорт списка запросов (${requestCount})`}
        </button>
      </div>
    </header>
  );
}
