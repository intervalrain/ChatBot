using ChatBot.Application.Services;

namespace ChatBot.Infrastructure.Services;

public class ChatService : IChatService
{	
    public async Task<string> ProcessChatAsync(string userPrompt, string systemPrompt, int topK, Dictionary<string, List<string>> metaDataFilter = null)
    {
        return "Response to " + userPrompt;
    }
}

