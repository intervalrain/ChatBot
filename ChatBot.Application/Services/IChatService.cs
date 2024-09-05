namespace ChatBot.Application.Services;

public interface IChatService
{
    Task<string> ProcessChatAsync(string userPrompt, string systemPrompt, int topK, Dictionary<string, List<string>> metaDataFilter = null);
}