using ChatBot.Api.Contracts;

using Microsoft.AspNetCore.Mvc;

namespace ChatBot.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public AuthController(IConfiguration configuration)
	{
        _configuration = configuration;
    }

    /// <summary>
    /// Retrieve JSON Web Token(JWT)
    /// </summary>
    /// <param name="model">Login Model</param>
    /// <returns>JWT</returns>
    [HttpPost("token")]
    [ProducesResponseType(typeof(TokenResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult GetToken([FromBody] LoginModel model)
    {
        return Ok(new TokenResponse { Token = "generated_token_here" });
    }
}