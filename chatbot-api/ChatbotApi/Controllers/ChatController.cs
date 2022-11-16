using ChatbotApi.Hubs;
using ChatbotApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace ChatbotApi.Controllers;

[Route("/api/chat")]
public class ChatController : ControllerBase
{
    private readonly IHubContext<ChatHub> _hubContext;
    private ChatHub _chatHub;

    public ChatController(IHubContext<ChatHub> hubContext)
    {
        _chatHub = new ChatHub();
        _hubContext = hubContext;
    }

    [Route("send")]
    [HttpPost]
    //method 2: message is recieved in an http request and the http request handles the message sending through signalr
    public IActionResult SendRequest([FromBody] Message msg)
    {
        _hubContext.Clients.All.SendAsync("ReceiveMessage", msg.User, msg.MsgText);
        return Ok();
    }
}