using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using ChatBot.Application.Common.Security.TokenGenerator;
using ChatBot.Application.Persistence.Users;

using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace ChatBot.Infrastructure.Common.Security.TokenGenerator;

public class JwtTokenGenerator : IJwtTokenGenerator
{
    private readonly JwtSettings _jwtSettings;

    public JwtTokenGenerator(IOptions<JwtSettings> jwtOptions)
	{
        _jwtSettings = jwtOptions.Value;
    }

    public string GenerateToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserId),
            new Claim(ClaimTypes.Name, user.EngName),
            new Claim("ChineseName", user.ChiName),
            new Claim(JwtRegisteredClaimNames.Email, user.Email)
        };

        user.Roles?.ForEach(role => claims.Add(new Claim(ClaimTypes.Role, role)));
        user.Permissions?.ForEach(permission => claims.Add(new Claim("Permission", permission)));

        foreach (var key in user.Metadata?.Keys)
        {
            foreach (var value in user.Metadata[key])
            {
                claims.Add(new Claim($"Metadata_{key}", value));
            }
        }

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.Expiration),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}