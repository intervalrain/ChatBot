using ChatBot.Api.Contracts;
using ChatBot.Application.Common.Interfaces;
using ChatBot.Application.Services;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChatBot.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class DocumentController : ControllerBase
{
    private readonly ILogger<DocumentController> _logger;
    private readonly IDocumentService _documentService;
    private readonly ICurrentUserProvider _currentUserProvider;

    public DocumentController(ILogger<DocumentController> logger, IDocumentService documentService, ICurrentUserProvider currentUserProvider)
    {
        _logger = logger;
        _documentService = documentService;
        _currentUserProvider = currentUserProvider;
    }

    /// <summary>
    /// Get authenticated documents
    /// </summary>
    /// <returns>Authenticated documents</returns>
    [HttpGet("getDocuments")]
    [ProducesResponseType(typeof(ChatResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetDocuments()
    {
        var currentUser = _currentUserProvider.GetCurrentUser();
        if (currentUser == null)
        {
            return Unauthorized("Unauthorized user");
        }

        var documents = _documentService.GetDocuments(currentUser.UserId);
        return Ok(documents);
    }
}

