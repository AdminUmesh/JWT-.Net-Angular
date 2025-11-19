using JwtRefreshDemo.Api.Models;
using JwtRefreshDemo.Api.Dtos;

namespace JwtRefreshDemo.Api.Services;

public interface ITokenService
{
    TokenResponse GenerateTokens(User user);
    string GenerateRefreshToken();
}
