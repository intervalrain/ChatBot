using ChatBot.Application.Common.Interfaces;
using ChatBot.Application.Common.Security.TokenGenerator;
using ChatBot.Application.Persistence.Users;
using ChatBot.Application.Services;
using ChatBot.Infrastructure.Common.Security.TokenGenerator;
using ChatBot.Infrastructure.Common.Security.Users;
using ChatBot.Infrastructure.Persistence.Users;
using ChatBot.Infrastructure.Services;

using Microsoft.Extensions.DependencyInjection;

namespace ChatBot.Infrastructure;

public static class DependencyInjection
{
	public static IServiceCollection AddInfrastructure(this IServiceCollection services)
	{
		services.AddServices();
		services.AddPersistence();
		services.AddHttpContextAccessor();
		services.AddSecurity();

		return services;
	}

    private static IServiceCollection AddServices(this IServiceCollection services)
	{
		services.AddScoped<IChatService, ChatService>();
		services.AddSingleton<IDocumentService, DocumentService>();

		return services;
	}


    private static IServiceCollection AddPersistence(this IServiceCollection services)
	{
		services.AddSingleton<IUserRepository, UserRepository>();

		return services;
	}

	private static IServiceCollection AddSecurity(this IServiceCollection services)
	{
		services.AddScoped<ICurrentUserProvider, HttpContextCurrentUserProvider>();
		services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();

		return services;
	}
}