import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getChatMessages = query({
  args: {
    roomId: v.optional(v.id('room'))
  },
  handler: async (ctx, { roomId }) => {
    if (!roomId) return await ctx.db.query('chat').filter(q => q.eq(q.field('roomId'), null)).first();
    const user = await ctx.auth.getUserIdentity();
    if (!user) return null;

    const foundRoom = await ctx.db.get(roomId);
    if (!foundRoom || !foundRoom?.players.find(usr => usr.userId === user.subject)) return null;

    return await ctx.db
      .query('chat')
      .filter((q) => q.eq(q.field('roomId'), roomId))
      .first()
  }
})

export const sendMessage = mutation({
  args: {
    message: v.string(),
    roomId: v.optional(v.id('room'))
  },
  handler: async (ctx, { message, roomId }) => {
    if (!message || message === "") return [];
    const user = await ctx.auth.getUserIdentity();
    if (!user) return [];

    let foundChat = null;
    if (!roomId) {
      foundChat = await ctx.db.query('chat').filter(q => q.eq(q.field('roomId'), null)).first();
    } else {
      const foundRoom = await ctx.db.get(roomId);
      if (!foundRoom || !foundRoom?.players.find(usr => usr.userId === user.subject)) return [];
      foundChat = await ctx.db.query('chat').filter(q => q.eq(q.field('roomId'), roomId)).first();
    }
    if (!foundChat) return [];

    const newMessageObj = {
      userName: user.name as string,
      message: message
    }
    return await ctx.db.patch(foundChat._id, { messages: [...foundChat.messages, newMessageObj] });
  }
})
