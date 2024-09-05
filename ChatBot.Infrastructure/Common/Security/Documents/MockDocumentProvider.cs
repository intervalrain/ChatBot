using ChatBot.Application.Common.Interfaces;
using ChatBot.Application.Common.Security.Documents;

namespace ChatBot.Infrastructure.Common.Security.Documents;

public class MockDocumentProvider : IDocumentProvider
{
    private readonly List<Document> _documents = new()
    {
        new("40LP", "General", "40LP content"),
        new("22eHV", "Customized", "22eHV content"),
        new("28eHV", "Customized", "28eHV content"),
        new("28HPC+", "General", "28HPC+ content"),
        new("28HLP", "General", "28HLP content")
    };

    public IEnumerable<Document> GetDocuments(ICurrentUserProvider currentUserProvider)
    {
        var user = currentUserProvider.GetCurrentUser();

        return user.IsAdmin
            ? (IEnumerable<Document>)_documents
            : _documents.Where(doc => doc.Category == "General");
    }
}

