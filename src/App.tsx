import { useCallback, useEffect, useRef, useState } from 'react';
import { emptyState } from './engine/game';
import { clearState, loadState, saveState } from './storage';
import type { GameState } from './types';
import SetupScreen from './screens/SetupScreen';
import PassScreen from './screens/PassScreen';
import DrawScreen from './screens/DrawScreen';
import RevealScreen from './screens/RevealScreen';
import GameOverScreen from './screens/GameOverScreen';
import RulesSheet from './components/RulesSheet';
import ConfirmDialog from './components/ConfirmDialog';
import CardLog from './components/CardLog';
import StatusStrip from './components/StatusStrip';

export default function App() {
  const [state, setState] = useState<GameState>(() => loadState() ?? emptyState());
  const [showRules, setShowRules] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.phase === 'setup' && state.players.length === 0) {
      clearState();
      return;
    }
    saveState(state);
  }, [state]);

  const modalOpen = showRules || confirmReset;

  useEffect(() => {
    if (modalOpen) document.body.classList.add('modal-open');
    else document.body.classList.remove('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, [modalOpen]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (modalOpen) el.setAttribute('inert', '');
    else el.removeAttribute('inert');
  }, [modalOpen]);

  const handleReset = useCallback(() => {
    clearState();
    setState(emptyState());
    setConfirmReset(false);
  }, []);

  let screen;
  switch (state.phase) {
    case 'setup':
      screen = <SetupScreen state={state} setState={setState} onOpenRules={() => setShowRules(true)} />;
      break;
    case 'pass':
      screen = <PassScreen state={state} setState={setState} onOpenRules={() => setShowRules(true)} onAskReset={() => setConfirmReset(true)} />;
      break;
    case 'draw':
      screen = <DrawScreen state={state} setState={setState} onOpenRules={() => setShowRules(true)} onAskReset={() => setConfirmReset(true)} />;
      break;
    case 'reveal':
      screen = <RevealScreen state={state} setState={setState} onOpenRules={() => setShowRules(true)} onAskReset={() => setConfirmReset(true)} />;
      break;
    case 'gameover':
      screen = <GameOverScreen state={state} onReset={handleReset} onOpenRules={() => setShowRules(true)} />;
      break;
  }

  return (
    <div className="app">
      <div className="app-content" ref={contentRef}>
        {state.phase !== 'setup' && state.phase !== 'gameover' && (
          <div className="left-sidebar">
            <CardLog state={state} />
          </div>
        )}
        {screen}
        {state.phase !== 'setup' && state.phase !== 'gameover' && (
          <div className="right-sidebar">
            <StatusStrip state={state} />
          </div>
        )}
      </div>
      {showRules && <RulesSheet state={state} onClose={() => setShowRules(false)} />}
      {confirmReset && (
        <ConfirmDialog
          title="Start a new game?"
          body="Your current game will be cleared."
          cancelLabel="Keep playing"
          confirmLabel="New game"
          onCancel={() => setConfirmReset(false)}
          onConfirm={handleReset}
        />
      )}
    </div>
  );
}
