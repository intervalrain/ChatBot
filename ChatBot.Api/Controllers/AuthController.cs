using ChatBot.Api.Contracts;
using ChatBot.Application.Common.Security.TokenGenerator;
using ChatBot.Application.Persistence.Users;

using Microsoft.AspNetCore.Mvc;

namespace ChatBot.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IUserRepository _userRepository;

    public AuthController(IJwtTokenGenerator jwtTokenGenerator, IUserRepository userRepository)
	{
        _jwtTokenGenerator = jwtTokenGenerator;
        _userRepository = userRepository;
    }

    /// <summary>
    /// Retrieve JSON Web Token(JWT)
    /// </summary>
    /// <param name="model">Login Model</param>
    /// <returns>JWT</returns>
    /// <response code="200">return JWT</response>
    /// <response code="400">Model Validation failed</response>
    /// <resopnse code="401">Either Uesrname or password is incorrent</resopnse>
    [HttpPost("login")]
    [ProducesResponseType(typeof(TokenResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult GetToken([FromBody] LoginModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (IsValidUser(model.UserName, model.Password))
        {
            var user = _userRepository.GetUserById(model.UserName); 
            var token = _jwtTokenGenerator.GenerateToken(user);
            return Ok(new TokenResponse { Token = token });
        }

        return Unauthorized("Invalid username or password");
    }

    private bool IsValidUser(string userName, string password)
    {
        return userName == "00053997" && password == "0931639433";
    }
}