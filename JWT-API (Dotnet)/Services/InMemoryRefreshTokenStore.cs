using JwtRefreshDemo.Api.Models;

namespace JwtRefreshDemo.Api.Services;

public class InMemoryRefreshTokenStore : IRefreshTokenStore
{
    private readonly List<RefreshToken> _tokens = new();
    private readonly object _lock = new();

    public Task SaveAsync(RefreshToken token)
    {
        lock (_lock)
        {
            _tokens.Add(token);
        }
        return Task.CompletedTask;
    }

    public Task<RefreshToken?> GetAsync(string token)
    {
        lock (_lock)
        {
            var found = _tokens.FirstOrDefault(t => t.Token == token);
            return Task.FromResult(found);
        }
    }

    public Task MarkUsedAsync(RefreshToken token)
    {
        lock (_lock)
        {
            token.IsUsed = true;
        }
        return Task.CompletedTask;
    }

    public Task RevokeAllForUserAsync(string userId)
    {
        lock (_lock)
        {
            foreach (var t in _tokens.Where(t => t.UserId == userId))
            {
                t.IsRevoked = true;
            }
        }
        return Task.CompletedTask;
    }
}
