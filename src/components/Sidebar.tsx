import { useMemo, useState, type MouseEvent } from 'react';
import { buildEmailFromRequests, countClientRequests, generateRequests } from '../requests';
import type { FormValues } from '../types';
import { ClipboardIcon } from './Icons';

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

type SidebarProps = {
  values: FormValues;
  onNavigateToField?: (scrollTarget: string) => void;
};

export function Sidebar({ values, onNavigateToField }: SidebarProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [allCopied, setAllCopied] = useState(false);

  const groups = useMemo(() => generateRequests(values), [values]);
  const clientCount = countClientRequests(groups);
  const internalCount =
    groups.find((group) => group.title === 'ВНУТРЕННИЕ')?.items.length ?? 0;

  const handleCopyItem = async (id: string, text: string, event: MouseEvent) => {
    event.stopPropagation();
    await copyText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleCopyAll = async () => {
    await copyText(buildEmailFromRequests(groups));
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-panel">
        <header className="sidebar-header">
          <div className="sidebar-heading">
            <span aria-hidden>📋</span>
            <span>Что запросить у клиента</span>
          </div>
          <div className="sidebar-count">
            {clientCount} {clientCount === 1 ? 'пункт' : clientCount < 5 ? 'пункта' : 'пунктов'}
            {internalCount > 0 && (
              <span className="sidebar-count-internal">
                {' '}
                · {internalCount} внутр.
              </span>
            )}
          </div>
          {clientCount > 0 && onNavigateToField && (
            <p className="sidebar-hint">Нажмите на пункт — перейти к полю в форме</p>
          )}
        </header>

        <div className="sidebar-scroll">
          <div className="sidebar-content">
            {clientCount === 0 && internalCount === 0 ? (
              <div className="sidebar-empty">
                Все ключевые поля заполнены — список запросов пуст.
              </div>
            ) : (
              groups.map((group) => (
                <div key={group.id} className="sidebar-group">
                  <div className="sidebar-group-title">
                    {group.title}
                    <span className="sidebar-group-count">{group.items.length}</span>
                  </div>
                  <div className="sidebar-list">
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className={`sidebar-item ${item.scrollTarget ? 'sidebar-item--clickable' : ''}`}
                        onClick={() => item.scrollTarget && onNavigateToField?.(item.scrollTarget)}
                        onKeyDown={(e) => {
                          if (item.scrollTarget && (e.key === 'Enter' || e.key === ' ')) {
                            e.preventDefault();
                            onNavigateToField?.(item.scrollTarget);
                          }
                        }}
                        role={item.scrollTarget ? 'button' : undefined}
                        tabIndex={item.scrollTarget ? 0 : undefined}
                      >
                        <p className="sidebar-item-text">{item.text}</p>
                        <button
                          type="button"
                          className="sidebar-copy-btn"
                          title="Копировать"
                          onClick={(e) => handleCopyItem(item.id, item.text, e)}
                        >
                          <ClipboardIcon />
                        </button>
                        {copiedId === item.id && (
                          <span className="sidebar-toast">Скопировано</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <footer className="sidebar-footer">
          <button
            type="button"
            className="sidebar-copy-all"
            onClick={handleCopyAll}
            disabled={clientCount === 0}
          >
            <ClipboardIcon dark />
            <span>{allCopied ? 'Скопировано!' : 'Копировать всё'}</span>
          </button>
        </footer>
      </div>
    </aside>
  );
}
