import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getGameDetails = query({
  args: {
    roomId: v.id('room')
  },
  handler: async (ctx, { roomId }) => {
    if (!roomId) return [];
    const user = await ctx.auth.getUserIdentity();
    if (!user) return [];
    const foundRoom = await ctx.db.get(roomId);
    if (!foundRoom || !foundRoom.players.find(pl => pl.userId === user.subject)) return [];

    return await ctx.db.query('tictactoe').filter(q => q.eq(q.field('roomId'), roomId)).first();
  }
})

export const makeAMove = mutation({
  args: {
    roomId: v.id('room'),
    gameId: v.id('tictactoe'),
    cell: v.number()
  },
  handler: async (ctx, { roomId, gameId, cell }) => {
    if (cell > 8 || cell < 0) return [];
    const user = await ctx.auth.getUserIdentity();
    if (!user) return [];

    const foundRoom = await ctx.db.get(roomId);
    if (!foundRoom || !foundRoom.players.find(pl => pl.userId === user.subject)) return [];

    const foundGameState = await ctx.db.get(gameId)
    if (!foundGameState) return [];

    const playerSymbol = foundGameState.playerSymbols.find(ps => ps.playerId === user.subject);
    if (!playerSymbol) return [];
    // ["", "", "", "", "", "", "", "", ""]

    if (foundGameState.board[cell] !== "") return [];
    foundGameState.board[cell] = playerSymbol.symbol;

    return await ctx.db.patch(gameId, {
      board: foundGameState.board
    })
  }
})





