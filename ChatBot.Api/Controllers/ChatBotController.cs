using System.Text.Json;

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

    /// <summary>
    /// Send message to chat bot
    /// </summary>
    /// <param name="message"></param>
    /// <returns>Streamoutputs from chat bot</returns>
    [HttpPost("completions")]
    [ProducesResponseType(typeof(ChatResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task CompletionAsync([FromBody] ChatCompletionRequest request)
    {
        Response.Headers.Add("Content-Type", "text/event-stream");

        var responseText = @"# Mathematics and Physics: A Brief Overview

## Introduction

Mathematics and physics are deeply interconnected fields that help us understand the fundamental principles of the universe. This document will explore some key concepts from both disciplines.

## Mathematical Foundations

### The Pythagorean Theorem

One of the most famous theorems in mathematics is the Pythagorean theorem, which states:

For a right-angled triangle with sides of length $a$, $b$, and hypotenuse $c$:

$a^2 + b^2 = c^2$

### Euler's Identity

Euler's identity is often considered the most beautiful equation in mathematics:

$e^{i\pi} + 1 = 0$

This equation connects five fundamental mathematical constants:
- $e$ (Euler's number)
- $i$ (imaginary unit)
- $\pi$ (pi)
- 1 (multiplicative identity)
- 0 (additive identity)

## Physics Concepts

### Newton's Second Law of Motion

Newton's second law of motion can be expressed as:

$\vec{F} = m\vec{a}$

Where:
- $\vec{F}$ is the net force vector
- $m$ is the mass of the object
- $\vec{a}$ is the acceleration vector

### Einstein's Mass-Energy Equivalence

Perhaps the most famous equation in physics is Einstein's mass-energy equivalence:

$E = mc^2$

Where:
- $E$ is energy
- $m$ is mass
- $c$ is the speed of light in vacuum

## Advanced Topic: Schrödinger Equation

The time-independent Schrödinger equation is a fundamental equation in quantum mechanics:

$-\frac{\hbar^2}{2m}\nabla^2\Psi + V\Psi = E\Psi$

Where:
- $\hbar$ is the reduced Planck constant
- $m$ is the mass of the particle
- $\nabla^2$ is the Laplacian operator
- $\Psi$ is the wave function
- $V$ is the potential energy
- $E$ is the total energy of the system

## Conclusion

These equations and concepts form the backbone of much of our understanding of the physical world. From the simplicity of the Pythagorean theorem to the complexity of quantum mechanics, mathematics and physics continue to reveal the elegant structure of the universe.";

        var words = responseText.Split(' ');
        foreach (var word in words)
        {
            var chunk = new
            {
                choices = new[]
                {
                    new
                    {
                        delta = new { content = word + " " }
                    }
                }
            };

            var json = JsonSerializer.Serialize(chunk);
            await Response.WriteAsync($"data: {json}\n\n");
            await Response.Body.FlushAsync();

            await Task.Delay(100);
        }

        await Response.WriteAsync("data: [DONE]\n\n");
        await Response.Body.FlushAsync();
    }
}

