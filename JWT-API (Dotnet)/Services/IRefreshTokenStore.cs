using JwtRefreshDemo.Api.Models;

namespace JwtRefreshDemo.Api.Services;

public interface IRefreshTokenStore
{
    Task SaveAsync(RefreshToken token);
    Task<RefreshToken?> GetAsync(string token);
    Task MarkUsedAsync(RefreshToken token);
    Task RevokeAllForUserAsync(string userId);
}
