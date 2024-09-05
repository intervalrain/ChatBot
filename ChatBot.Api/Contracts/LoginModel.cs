using System.ComponentModel.DataAnnotations;

namespace ChatBot.Api.Contracts;

public class LoginModel
{
	[Required]
	public string UserName { get; set; }

	[Required]
	public string Password { get; set; }
}

