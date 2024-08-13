import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { decideTicTacToeWinner } from "@/lib/tictactoe";
import { internal } from "./_generated/api";

export const getGameDetails = query({
  args: {
    roomId: v.id('room')
  },
  handler: async (ctx, { roomId }) => {
    if (!roomId) return null;
    const user = await ctx.auth.getUserIdentity();
    if (!user) return null;
    const foundRoom = await ctx.db.get(roomId);
    if (!foundRoom || !foundRoom.players.find(pl => pl.userId === user.subject)) return null;

    return await ctx.db.query('tictactoe').filter(q => q.eq(q.field('roomId'), roomId)).first();
  }
})

export const makeAMove = mutation({
  args: {
    roomId: v.id('room'),
    gameId: v.id('tictactoe'),
    cellId: v.number()
  },
  handler: async (ctx, { roomId, gameId, cellId }) => {
    if (cellId > 8 || cellId < 0) return [];
    const user = await ctx.auth.getUserIdentity();
    if (!user) return [];

    const foundRoom = await ctx.db.get(roomId);
    if (!foundRoom || !foundRoom.players.find(pl => pl.userId === user.subject)) return [];

    const foundGameState = await ctx.db.get(gameId)
    if (!foundGameState) return [];

    const playerSymbol = foundGameState.playerSymbols.find(ps => ps.playerId === user.subject);
    if (!playerSymbol) return [];
    // ["", "", "", "", "", "", "", "", ""]

    if (foundGameState.board[cellId] !== "") return [];
    if (foundGameState.currentMoveSymbol !== playerSymbol.symbol) return [];
    foundGameState.board[cellId] = playerSymbol.symbol;

    const winnerSymbol = decideTicTacToeWinner(foundGameState.board);
    if (winnerSymbol !== "") {
      return await ctx.db.patch(gameId, {
        board: foundGameState.board,
        rounds: [...foundGameState.rounds, { winnerId: foundGameState.playerSymbols.find(ps => ps.symbol === winnerSymbol)?.playerId as string }],
        currentMoveSymbol: null
      })
    }

    return await ctx.db.patch(gameId, {
      board: foundGameState.board,
      currentMoveSymbol: playerSymbol.symbol === "X" ? "0" : "X"
    })
  }
})

export const resetGameState = mutation({
  args: {
    gameId: v.id('tictactoe')
  },
  handler: async (ctx, { gameId }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return [];

    await ctx.scheduler.runAfter(3000, internal.tictactoe.resetGameInternal, { gameId })
  }
})

export const resetGameInternal = internalMutation({
  args: {
    gameId: v.id('tictactoe')
  },
  handler: async (ctx, { gameId }) => {
    await ctx.db.patch(gameId, {
      board: ["", "", "", "", "", "", "", "", ""],
      currentMoveSymbol: "X"
    })
  },
});






