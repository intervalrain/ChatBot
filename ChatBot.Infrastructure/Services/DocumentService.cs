using ChatBot.Application.Models;
using ChatBot.Application.Services;

namespace ChatBot.Infrastructure.Services;

public class DocumentService : IDocumentService
{
    private static readonly string[] Generations = { "22nm", "28nm", "40nm", "55nm", "90nm", "130nm" };
    private static readonly string[] Technologies = { "BCD", "eHV", "logic-mixed", "flash" };
    private static readonly string[] Categories = { "G-01", "G-02", "G-03", "G-04", "G-05", "G-06" };
    private static readonly string[] Platforms = { "LP", "HPC", "HPC+", "ULP", "ULL" };
    private static readonly string[] RevisionVersions = { "1.0.0.0", "1.1.0.0", "1.2.1.1", "1.3.0.0", "1.4.1.1" };
    private static readonly string[] CustomMarks = { "A", "B", "C", "D", "E" };

    private static readonly Random Random = new Random();

    private static T GetRandomElement<T>(T[] array) => array[Random.Next(array.Length)];

    public IEnumerable<DSM> GetDocuments(string userId)
    {
        return Enumerable.Range(1, 100).Select(i => GenerateRandomDSM());
    }

    private DSM GenerateRandomDSM()
    {
        var dsm = new DSM
        {
            Id = Guid.NewGuid(),
            Generation = GetRandomElement(Generations),
            Technology = GetRandomElement(Technologies),
            Category = GetRandomElement(Categories),
            Platform = GetRandomElement(Platforms),
            RevisionVersion = GetRandomElement(RevisionVersions),
            CustomMark = Random.Next(2) == 0 ? GetRandomElement(CustomMarks) : null
        };

        dsm.Name = $"{dsm.Category}-{dsm.Technology}{dsm.Generation}-{dsm.Platform}, {dsm.RevisionVersion}{(dsm.CustomMark != null ? "-" + dsm.CustomMark : "")}.pdf";

        return dsm;
    }
}

