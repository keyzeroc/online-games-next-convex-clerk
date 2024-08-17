
import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { createRandomBoard, decideBattleshipsWinner } from "@/lib/battleships";

export const getGameDetails = query({
  args: {
    roomId: v.id('room')
  },
  handler: async (ctx, { roomId }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return null;

    const foundRoom = await ctx.db.get(roomId);
    if (!foundRoom || !foundRoom.players.find(pl => pl.userId === user.subject)) return null;

    return await ctx.db.query('battleships').filter(q => q.eq(q.field('roomId'), roomId)).first();
  }
})

export const makeAMove = mutation({
  args: {
    roomId: v.id('room'),
    gameId: v.id('battleships'),
    rowIndex: v.number(),
    colIndex: v.number()
  },
  handler: async (ctx, { roomId, gameId, rowIndex, colIndex }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return [];

    const foundRoom = await ctx.db.get(roomId);
    if (!foundRoom || !foundRoom.players.find(pl => pl.userId === user.subject)) return [];

    const foundGame = await ctx.db.get(gameId)
    if (!foundGame || !foundGame.playerBoards.find(pb => pb.playerId === user.subject)) return [];
    if (foundGame.currentMovePlayerId !== user.subject) return [];

    const oppBoardIdx = foundGame.playerBoards.findIndex(pb => pb.playerId !== user.subject);
    if (oppBoardIdx === -1) return [];
    if (rowIndex >= foundGame.playerBoards[oppBoardIdx].board.length || rowIndex < 0) return [];
    if (colIndex >= foundGame.playerBoards[oppBoardIdx].board.length || colIndex < 0) return [];

    let newCellValue = '.';
    const targetCell = foundGame.playerBoards[oppBoardIdx].board[rowIndex][colIndex]
    // don't waste a move on already previously targeted cell
    if (targetCell === '.' || targetCell === '%') return [];
    if (targetCell === '#') newCellValue = '%'
    foundGame.playerBoards[oppBoardIdx].board[rowIndex][colIndex] = newCellValue;

    const isWinner = decideBattleshipsWinner(foundGame.playerBoards[oppBoardIdx].board);
    if (isWinner) {
      return await ctx.db.patch(gameId, {
        rounds: [...foundGame.rounds, { winnerId: user.subject }],
        currentMovePlayerId: null
      })
    }


    return await ctx.db.patch(gameId, {
      playerBoards: foundGame.playerBoards,
      currentMovePlayerId: foundGame.playerBoards[oppBoardIdx].playerId
    })
  }
})

export const resetGameState = mutation({
  args: {
    gameId: v.id('battleships')
  },
  handler: async (ctx, { gameId }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return [];

    await ctx.scheduler.runAfter(3000, internal.battleships.resetGameInternal, { gameId, userId: user.subject })
  }
})

export const resetGameInternal = internalMutation({
  args: {
    gameId: v.id('battleships'),
    userId: v.string()
  },
  handler: async (ctx, { gameId, userId }) => {

    const foundGame = await ctx.db.get(gameId);
    if (!foundGame) return [];

    await ctx.db.patch(gameId, {
      playerBoards: foundGame.playerBoards.map(pb => { return { ...pb, board: createRandomBoard(9) } }),
      currentMovePlayerId: userId
    })
  },
});

