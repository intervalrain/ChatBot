using System.ComponentModel.DataAnnotations;

namespace ChatBot.Api.Contracts;

public class ChatMessage
{
	[Required]
	public string Content { get; set; }
}

