namespace ChatBot.Application.Persistence.Users;

public interface IUserRepository
{
	User GetUserById(string userId);
	IEnumerable<User> GetAllUsers();
	void AddUser(User user);
	void RemoveUser(string userId);
}

