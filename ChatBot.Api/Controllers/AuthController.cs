using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using ChatBot.Api.Contracts;

using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

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
            var token = GenerateJwtToken(model.UserName);
            return Ok(new TokenResponse { Token = token });
        }

        return Unauthorized("Invalid username or password");
    }

    private bool IsValidUser(string userName, string password)
    {
        return userName == "intervalrain" && password == "0931639433";
    }

    private string GenerateJwtToken(string userName)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Name, userName)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(60),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}