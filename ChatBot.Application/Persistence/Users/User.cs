namespace ChatBot.Application.Persistence.Users;

public class User
{
    public string UserId { get; set; }
    public string EngName { get; set; }
    public string ChiName { get; set; }
    public string Email { get; set; }
    public List<string> Permissions { get; set; }
    public List<string> Roles { get; set; }
    public Dictionary<string, List<string>> Metadata { get; set; }

    public User(string userId, string engName, string chiName, string email, List<string> permissions, List<string> roles, Dictionary<string, List<string>> metadata)
    {
        UserId = userId;
        EngName = engName;
        ChiName = chiName;
        Email = email;
        Permissions = permissions;
        Roles = roles;
        Metadata = metadata;
    }
}

