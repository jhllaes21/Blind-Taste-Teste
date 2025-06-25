// Step 1: Project Setup (Vite + React + TypeScript)
// Command: npm create vite@latest blind-tasting-room -- --template react-ts

// Then inside project root:
// npm install
// npm install jspdf html2pdf.js

// Step 2: Directory Structure
// src/
// ├── components/
// │   ├── GameSetup.tsx
// │   ├── TastingRound.tsx
// │   ├── RoundSummary.tsx
// │   ├── FinalReveal.tsx
// │   ├── FinalScoreboard.tsx
// │   └── common/
// │       ├── StarRating.tsx
// │       ├── Button.tsx
// │       └── Card.tsx
// ├── context/
// │   └── GameContext.tsx
// ├── hooks/
// │   └── useLocalStorage.ts
// ├── services/
// │   └── professionalFetcher.ts
// ├── utils/
// │   └── scoreUtils.ts
// ├── App.tsx
// ├── main.tsx
// ├── theme.ts
// └── index.css

// Step 3: GameContext - lightweight global state
import React, { createContext, useContext, useReducer, Dispatch } from 'react';

interface Player {
  name: string;
  guesses: PlayerGuess[];
  score: number;
}

interface Bottle {
  id: number;
  varietal: string;
  producer: string;
  year: string;
  country: string;
}

interface PlayerGuess {
  bottleId: number;
  ratings: number[]; // [Nose, Body, Finish, Complexity, Balance]
  guessVarietal: string;
  foodPairing: string;
}

interface GameState {
  players: Player[];
  bottles: Bottle[];
  currentRound: number;
  isDiscussionPhase: boolean;
  phase: 'setup' | 'tasting' | 'reveal' | 'tie-breaker' | 'final';
}

const initialState: GameState = {
  players: [],
  bottles: [],
  currentRound: 0,
  isDiscussionPhase: false,
  phase: 'setup',
};

type Action =
  | { type: 'SETUP_GAME'; payload: Pick<GameState, 'players' | 'bottles'> }
  | { type: 'SUBMIT_ROUND' }
  | { type: 'NEXT_ROUND' }
  | { type: 'FINAL_REVEAL' }
  | { type: 'FINAL_SCORE' };

type GameContextType = {
  state: GameState;
  dispatch: Dispatch<Action>;
};

const GameContext = createContext<GameContextType>({
  state: initialState,
  dispatch: () => {
    throw new Error('dispatch function must be overridden by GameProvider');
  },
});

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SETUP_GAME':
      return { ...state, players: action.payload.players, bottles: action.payload.bottles, phase: 'tasting' };
    case 'SUBMIT_ROUND':
      return { ...state, isDiscussionPhase: true };
    case 'NEXT_ROUND':
      return {
        ...state,
        currentRound: state.currentRound + 1,
        isDiscussionPhase: false,
      };
    case 'FINAL_REVEAL':
      return { ...state, phase: 'reveal' };
    case 'FINAL_SCORE':
      return { ...state, phase: 'final' };
    default:
      throw new Error(`Unhandled action type: ${(action as any).type}`);
  }
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

// Next steps: StarRating.tsx → TastingRound.tsx → GameSetup.tsx → FinalReveal.tsx → PDF Export
// Let me know to proceed building the UI components and features step by step.
