using ChatBot.Application;
using ChatBot.Infrastructure;
using ChatBot.Api;

var builder = WebApplication.CreateBuilder(args);
{
    builder.Services.AddApplication()
                    .AddInfrastructure()
                    .AddPresentation(builder.Configuration);
}

var app = builder.Build();
{
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "Chat Bot API v1");
            c.OAuthClientId("swagger");
            c.OAuthAppName("Swagger UI");
        });
    }

    app.UseHttpsRedirection();
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    app.Run();
}