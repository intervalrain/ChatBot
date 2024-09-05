using ChatBot.Application.Common.Interfaces;
using ChatBot.Application.Common.Security.Documents;
using ChatBot.Infrastructure.Common.Security.Documents;
using ChatBot.Infrastructure.Common.Security.Users;

using Microsoft.Extensions.DependencyInjection;

namespace ChatBot.Infrastructure;

public static class DependencyInjection
{
	public static IServiceCollection AddInfrastructure(this IServiceCollection services)
	{
		services.AddHttpContextAccessor();
		services.AddSecurity();

		return services;
	}

	private static IServiceCollection AddSecurity(this IServiceCollection services)
	{
		services.AddScoped<ICurrentUserProvider, HttpContextCurrentUserProvider>();
		services.AddScoped<IDocumentProvider, MockDocumentProvider>();

		return services;
	}
}