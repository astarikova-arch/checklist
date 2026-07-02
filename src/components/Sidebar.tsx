import { useMemo, useState } from 'react';
import { buildEmailFromRequests, generateRequests } from '../requests';
import type { FormValues } from '../types';
import { ClipboardIcon } from './Icons';

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

type SidebarProps = {
  values: FormValues;
};

export function Sidebar({ values }: SidebarProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [allCopied, setAllCopied] = useState(false);

  const groups = useMemo(() => generateRequests(values), [values]);
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);

  const handleCopyItem = async (id: string, text: string) => {
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
          <div className="sidebar-count">{total} пунктов</div>
        </header>

        <div className="sidebar-scroll">
          <div className="sidebar-content">
            {total === 0 ? (
              <div className="sidebar-empty">
                Все ключевые поля заполнены — список запросов пуст.
              </div>
            ) : (
              groups.map((group) => (
                <div key={group.id} className="sidebar-group">
                  <div className="sidebar-group-title">{group.title}</div>
                  <div className="sidebar-list">
                    {group.items.map((item) => (
                      <div key={item.id} className="sidebar-item">
                        <p className="sidebar-item-text">{item.text}</p>
                        <button
                          type="button"
                          className="sidebar-copy-btn"
                          title="Копировать"
                          onClick={() => handleCopyItem(item.id, item.text)}
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
            disabled={total === 0}
          >
            <ClipboardIcon dark />
            <span>{allCopied ? 'Скопировано!' : 'Копировать всё'}</span>
          </button>
        </footer>
      </div>
    </aside>
  );
}
