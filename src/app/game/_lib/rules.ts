/* ═══════════════════════════════════════════════════════════════
   EDU Card Game — Victory conditions & damage calculation
   ═══════════════════════════════════════════════════════════════ */

export type CardType = "character" | "event" | "location" | "tech";

export interface CardDef {
  id: string;
  name: string;
  type: CardType;
  cost: number;
  power: number;
  description: string;
  loreRef?: string | null;
  imageUrl?: string | null;
}

export interface BoardSlot {
  card: CardDef;
  turnsOnBoard: number;
  canAttack: boolean;
  shield: number; // remaining HP
}

export interface PlayerState {
  id: string;
  hp: number;
  hand: CardDef[];
  deck: CardDef[];
  board: BoardSlot[];
  graveyard: CardDef[];
  mana: number;
  maxMana: number;
}

export const MAX_HP = 30;
export const STARTING_HAND = 5;
export const MAX_BOARD_SIZE = 5;
export const MAX_HAND_SIZE = 10;
export const MANA_CAP = 10;

/** Can this card be played given current state? */
export function canPlayCard(player: PlayerState, card: CardDef): boolean {
  if (player.mana < card.cost) return false;
  if (player.hand.length <= 1 && card.type === "event") return true; // always ok if last card
  if (player.board.length >= MAX_BOARD_SIZE && card.type === "character") return false;
  return true;
}

/** Apply damage, return new HP (min 0) */
export function applyDamage(hp: number, damage: number): number {
  return Math.max(0, hp - damage);
}

/** Check win condition */
export function checkWinner(p1: PlayerState, p2: PlayerState): string | null {
  if (p1.hp <= 0) return p2.id;
  if (p2.hp <= 0) return p1.id;
  if (p1.deck.length === 0 && p1.hand.length === 0) return p2.id;
  if (p2.deck.length === 0 && p2.hand.length === 0) return p1.id;
  return null;
}

/** Compute board power sum */
export function boardPower(board: BoardSlot[]): number {
  return board.reduce((sum, s) => sum + s.card.power, 0);
}

/** Play a card: remove from hand, apply effects */
export function playCard(
  player: PlayerState,
  cardIndex: number
): { player: PlayerState; slot?: BoardSlot; directDamage?: number } {
  const card = player.hand[cardIndex];
  const newHand = [...player.hand];
  newHand.splice(cardIndex, 1);
  const newPlayer = { ...player, hand: newHand, mana: player.mana - card.cost };

  if (card.type === "character") {
    const slot: BoardSlot = {
      card,
      turnsOnBoard: 0,
      canAttack: false, // summoning sickness
      shield: card.power,
    };
    return { player: { ...newPlayer, board: [...newPlayer.board, slot] }, slot };
  }

  if (card.type === "tech" || card.type === "event") {
    // Direct damage to opponent = card power (or 0 for support)
    return { player: newPlayer, directDamage: card.power };
  }

  // location: buff all board characters +1 power
  if (card.type === "location") {
    const buffedBoard = newPlayer.board.map((s) => ({
      ...s,
      card: { ...s.card, power: s.card.power + 1 },
      shield: s.shield + 1,
    }));
    return { player: { ...newPlayer, board: buffedBoard } };
  }

  return { player: newPlayer };
}

/** Attack: resolve combat between attacker and defender */
export function resolveAttack(
  attacker: BoardSlot,
  defender: BoardSlot
): { atkSlot: BoardSlot; defSlot: BoardSlot; excessDamage: number } {
  const atkShield = attacker.shield - defender.card.power;
  const defShield = defender.shield - attacker.card.power;
  const excessDamage = Math.max(0, attacker.card.power - defShield);
  return {
    atkSlot: { ...attacker, shield: Math.max(0, atkShield) },
    defSlot: { ...defender, shield: Math.max(0, defShield) },
    excessDamage,
  };
}

/** Start of turn: draw card, increment mana */
export function startTurn(player: PlayerState): PlayerState {
  const newDeck = [...player.deck];
  const drawn = newDeck.pop();
  const newMaxMana = Math.min(player.maxMana + 1, MANA_CAP);
  const newHand = drawn ? [...player.hand, drawn] : [...player.hand];
  if (newHand.length > MAX_HAND_SIZE) newHand.shift(); // burn top
  // Enable attacks for cards that were on board before this turn
  const newBoard = player.board.map((s) => ({
    ...s,
    canAttack: true,
    turnsOnBoard: s.turnsOnBoard + 1,
  }));
  return {
    ...player,
    hand: newHand,
    deck: newDeck,
    mana: newMaxMana,
    maxMana: newMaxMana,
    board: newBoard,
  };
}

/** Remove dead cards from board */
export function cleanupBoard(player: PlayerState): PlayerState {
  const alive: BoardSlot[] = [];
  const dead: CardDef[] = [];
  for (const slot of player.board) {
    if (slot.shield <= 0) {
      dead.push(slot.card);
    } else {
      alive.push(slot);
    }
  }
  return { ...player, board: alive, graveyard: [...player.graveyard, ...dead] };
}
