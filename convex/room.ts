import { v } from "convex/values";
import { MutationCtx, mutation, query } from "./_generated/server";
import { hashPassword } from "@/lib/hashing";
import { GAME_TYPES } from '../src/lib/gamestate';
import { UserIdentity } from "convex/server";
import { Id } from "./_generated/dataModel";
import { isPasswordCorrect } from "@/lib/hashing";


export const createRoom = mutation({
  args: {
    name: v.string(),
    password: v.string(),
    gameType: v.string(),
  },
  handler: async (ctx, { name, password, gameType }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return [];

    if (!name || name === "") return [];
    if (!gameType || gameType === "") return [];
    if (!GAME_TYPES.find(GAME_TYPE => GAME_TYPE.shortName === gameType)) return [];

    const roomId = await ctx.db.insert('room', {
      name: name,
      password: password.trim() === "" ? "" : await hashPassword(password),
      creatorId: user.subject,
      players: [{ userId: user.subject, userName: user.name as string }],
      lastActivity: Date.now(),
      gameType,
    });
    await createEmptyGameState(gameType, ctx, user, roomId);
    await ctx.db.insert('chat', { messages: [], roomId })
    return roomId;
  }
});

export const joinRoom = mutation({
  args: {
    roomId: v.id('room'),
    password: v.string()
  },
  handler: async (ctx, { roomId, password }) => {
    if (!roomId) return false;
    const user = await ctx.auth.getUserIdentity();
    if (!user) return false;

    const foundRoom = await ctx.db.get(roomId);
    if (!foundRoom) return false;
    const foundPlayer = foundRoom.players.find(pl => pl.userId === user.subject)
    if (foundPlayer) return true;
    if (!foundPlayer && foundRoom.players.length === 2) return false;
    if (foundRoom.password !== "" && !(await isPasswordCorrect(password, foundRoom.password))) return false;

    await assignGameStateOnJoin(foundRoom.gameType, ctx, user, roomId);

    await ctx.db.patch(roomId, {
      players: [...foundRoom.players, {
        userId: user.subject,
        userName: user.name as string
      }]
    })
    return true;
  }
})
export const getRoomsByGameType = query({
  args: { gameType: v.string() },
  handler: async (ctx, { gameType }) => {
    return await ctx.db.query('room').filter(q => q.eq(q.field('gameType'), gameType)).collect()
  }
})

export const getRoomById = query({
  args: { roomId: v.id('room') },
  handler: async (ctx, { roomId }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return null;

    const foundRoom = await ctx.db.get(roomId);
    if (!foundRoom) return null;
    if (!foundRoom.players.find(pl => pl.userId === user.subject)) return null;

    return foundRoom;
  }
})

const createEmptyGameState = async (gameType: string, ctx: MutationCtx, currentUser: UserIdentity, roomId: Id<'room'>) => {
  if (gameType === 'rps') {
    return await ctx.db.insert('rps', {
      rounds: [],
      roomId,
      moves: [],
    })
  }
  if (gameType === 'tictactoe') {
    return await ctx.db.insert('tictactoe', {
      roomId,
      rounds: [],
      board: ["", "", "", "", "", "", "", "", ""],
      currentMoveSymbol: "X",
      playerSymbols: [{
        playerId: currentUser.subject,
        symbol: "X"
      }],
    })
  }
}

const assignGameStateOnJoin = async (gameType: string, ctx: MutationCtx, currentUser: UserIdentity, roomId: Id<'room'>) => {
  if (gameType === 'tictactoe') {
    const foundGameState = await ctx.db.query('tictactoe').filter(q => q.eq(q.field('roomId'), roomId)).first();
    if (!foundGameState) return [];
    return await ctx.db.patch(foundGameState?._id, {
      playerSymbols: [
        ...foundGameState?.playerSymbols,
        { playerId: currentUser.subject, symbol: '0' }
      ]
    })
  }
}