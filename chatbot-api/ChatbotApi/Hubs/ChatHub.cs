using ChatbotApi.Models;

namespace ChatbotApi.Hubs;

using Microsoft.AspNetCore.SignalR;

public class ChatHub : Hub
{
    // method 1: sendMessage is accessed without an http request but directly from signalr
    public Task SendMessage(Message msg)
    {
        // TODO: filter message
        // TODO: save to database
        return Clients.All.SendAsync("ReceiveMessage", msg.User, msg.MsgText);
    }
}
