using ChatBot.Application.Common.Security.Users;

namespace ChatBot.Application.Common.Interfaces;

public interface ICurrentUserProvider
{
    CurrentUser GetCurrentUser();
}