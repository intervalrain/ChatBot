using ChatBot.Application.Models;

namespace ChatBot.Application.Services;

public interface IDocumentService
{
    IEnumerable<DSM> GetDocuments(string userId);
}