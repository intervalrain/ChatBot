using ChatBot.Api.Contracts;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChatBot.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class ChatBotController : ControllerBase
{
	/// <summary>
	/// Send message to chat bot
	/// </summary>
	/// <param name="message"></param>
	/// <returns>Reply from chat bot</returns>
	[HttpPost("chat")]
	[ProducesResponseType(typeof(ChatResponse), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	public IActionResult Chat([FromBody] ChatMessage message)
	{
		return Ok(new ChatResponse { Reply = $"Response to {message.Content}" });
	}
}

