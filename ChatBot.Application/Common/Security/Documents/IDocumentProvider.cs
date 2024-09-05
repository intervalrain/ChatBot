using ChatBot.Application.Common.Interfaces;

namespace ChatBot.Application.Common.Security.Documents;

public interface IDocumentProvider
{
	IEnumerable<Document> GetDocuments(ICurrentUserProvider currentUserProvider);
}