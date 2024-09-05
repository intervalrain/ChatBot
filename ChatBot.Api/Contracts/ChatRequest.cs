using System.ComponentModel.DataAnnotations;

namespace ChatBot.Api.Contracts;

public class ChatRequest
{
    [Required]
    public string UserPrompt { get; set; }

    public string SystemPrompt { get; set; }

    public Dictionary<string, List<string>> MetaDataFilter { get; set; }

    [Range(1, 50)]
    public int TopK { get; set; } = 5;
}

