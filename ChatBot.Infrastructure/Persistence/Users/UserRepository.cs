using ChatBot.Application.Persistence.Users;

namespace ChatBot.Infrastructure.Persistence.Users;

public class UserRepository : IUserRepository
{
    private List<User> _users;

	public UserRepository()
	{
        _users = new List<User>
        {
            new User("00012345", "John Doe", "逗約翰", "john_doe@umc.com",
                new List<string> { "READ", "WRITE" },
                new List<string> { "Admin" },
                new Dictionary<string, List<string>> { { "Department", new List<string> { "HR" } } }
            ),
            new User("00023412", "Jane Smith", "史密珍", "jane_smith@umc.com",
                new List<string> { "READ" },
                new List<string> { "User" },
                new Dictionary<string, List<string>> { { "Department", new List<string> { "Finance" } } }
            ),
            new User("00053997", "Rain Hu", "胡鎮宇", "rain_hu@umc.com",
                new List<string> { "READ", "WRITE" },
                new List<string> { "Admin" },
                new Dictionary<string, List<string>> { { "Department", new List<string> { "SMG" } } })
        };
	}

    public User GetUserById(string userId)
    {
        return _users.FirstOrDefault(u => u.UserId == userId);
    }

    public IEnumerable<User> GetAllUsers()
    {
        return _users;
    }

    public void AddUser(User user)
    {
        _users.Add(user);
    }

    public void RemoveUser(string userId)
    {
        var user = _users.FirstOrDefault(u => u.UserId == userId);
        if (user != null)
        {
            _users.Remove(user);
        }
    }
}

