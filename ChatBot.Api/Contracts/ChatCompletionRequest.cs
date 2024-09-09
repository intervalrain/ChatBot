namespace ChatBot.Api.Contracts;

public class ChatCompletionRequest
{
    public string Model { get; set; }
    public List<Message> Messages { get; set; }
    public bool Stream { get; set; }
}