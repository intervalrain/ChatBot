namespace ChatBot.Application.Models;

public class DSM
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Generation { get; set; }
    public string Technology { get; set; }
    public string Category { get; set; }
    public string Platform { get; set; }
    public string RevisionVersion { get; set; }
    public string CustomMark { get; set; }

    public override string ToString()
    {
        return Name;
    }
}