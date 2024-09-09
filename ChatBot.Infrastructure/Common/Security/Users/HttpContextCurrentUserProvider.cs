using System.Security.Claims;

using ChatBot.Application.Common.Interfaces;
using ChatBot.Application.Common.Security.Users;

using Microsoft.AspNetCore.Http;

using Throw;

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
        _httpContextAccessor.HttpContext.ThrowIfNull();

        var userId = GetSingleClaimValue(ClaimTypes.NameIdentifier);
        var engName = GetSingleClaimValue(ClaimTypes.Name);
        var chiName = GetSingleClaimValue("ChineseName");
        var email = GetSingleClaimValue(ClaimTypes.Email);

        var roles = GetClaimValues(ClaimTypes.Role);
        var permissions = GetClaimValues("Permission");
        var metaData = GetClaimValues("Metadata_Department");

        var metaDataFilter = new Dictionary<string, List<string>>();
        if (metaData.Any())
        {
            metaDataFilter.Add("department", metaData);
        }

        return new CurrentUser(userId, engName, chiName, email, roles, permissions, metaDataFilter);
    }

    private List<string> GetClaimValues(string claimType) =>
    _httpContextAccessor.HttpContext!.User.Claims
        .Where(claim => claim.Type == claimType)
        .Select(claim => claim.Value)
        .ToList();

    private string GetSingleClaimValue(string claimType) =>
        _httpContextAccessor.HttpContext!.User.Claims
            .Single(claim => claim.Type == claimType)
            .Value;
}

