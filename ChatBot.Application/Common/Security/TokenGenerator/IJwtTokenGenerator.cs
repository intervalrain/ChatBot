using ChatBot.Application.Persistence.Users;

namespace ChatBot.Application.Common.Security.TokenGenerator;

public interface IJwtTokenGenerator
{
	string GenerateToken(User user);
}