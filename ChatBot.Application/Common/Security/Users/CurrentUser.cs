namespace ChatBot.Application.Common.Security.Users;

public record CurrentUser(
    string UserId,
    string EngName,
    string ChiName,
    string Email,
    List<string>? Roles = null,
    List<string>? Permissions = null,
    Dictionary<string, List<string>>? MetaDataFilter = null)
{
    public bool IsAdmin => Roles.Contains("Admin");
}