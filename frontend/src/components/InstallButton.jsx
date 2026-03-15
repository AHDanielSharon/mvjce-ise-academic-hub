import { useEffect, useState } from 'react';

export default function InstallButton() {
  const [promptEvent, setPromptEvent] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (event) => {
      event.preventDefault();
      setPromptEvent(event);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!visible || !promptEvent) return null;

  return (
    <button
      type="button"
      onClick={async () => {
        promptEvent.prompt();
        await promptEvent.userChoice;
        setVisible(false);
      }}
      className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white"
    >
      Install App
    </button>
  );
}
