using ChatBot.Api.Contracts;
using ChatBot.Application.Services;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChatBot.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class ChatBotController : ControllerBase
{
    private readonly ILogger<ChatBotController> _logger;
    private readonly IChatService _chatService;

    public ChatBotController(ILogger<ChatBotController> logger, IChatService chatService)
	{
        _logger = logger;
        _chatService = chatService;
    }

	/// <summary>
	/// Send message to chat bot
	/// </summary>
	/// <param name="message"></param>
	/// <returns>Reply from chat bot</returns>
	[HttpPost("chat")]
	[ProducesResponseType(typeof(ChatResponse), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	public async Task<IActionResult> Chat([FromBody] ChatRequest request)
	{ 
		if (!ModelState.IsValid)
		{
			return BadRequest(ModelState);
		}

		try
		{
			var response = await _chatService.ProcessChatAsync(request.UserPrompt, request.SystemPrompt, request.TopK, request.MetaDataFilter);
			return Ok(response);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, $"Error processing chat request for user {User.Identity.Name}");
			return StatusCode(500, "An error occurred while processing your request");
		}
	}
}

