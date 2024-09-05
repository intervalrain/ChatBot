using System.Security.Claims;

using ChatBot.Application.Common.Interfaces;
using ChatBot.Application.Common.Security.Users;

using Microsoft.AspNetCore.Http;

namespace ChatBot.Infrastructure.Common.Security.Users;

public class HttpContextCurrentUserProvider : ICurrentUserProvider
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public HttpContextCurrentUserProvider(IHttpContextAccessor httpContextAccessor)
	{
        _httpContextAccessor = httpContextAccessor;
    }

    public CurrentUser GetCurrentUser()
    {
        var user = _httpContextAccessor.HttpContext.User;

        return new CurrentUser
        {
            UserName = user.Identity.Name,
            Role = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value!
        };
    }
}

