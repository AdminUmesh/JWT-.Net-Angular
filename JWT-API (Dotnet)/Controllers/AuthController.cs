using JwtRefreshDemo.Api.Dtos;
using JwtRefreshDemo.Api.Models;
using JwtRefreshDemo.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JwtRefreshDemo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ITokenService _tokenService;
    private readonly IRefreshTokenStore _refreshStore;

    public AuthController(
        IUserService userService,
        ITokenService tokenService,
        IRefreshTokenStore refreshStore)
    {
        _userService = userService;
        _tokenService = tokenService;
        _refreshStore = refreshStore;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = _userService.ValidateUser(request.UserName, request.Password);
        if (user == null)
            return Unauthorized(new { message = "Invalid credentials" });

        var tokens = _tokenService.GenerateTokens(user);

        var refreshEntity = new RefreshToken
        {
            Token = tokens.RefreshToken,
            UserId = user.Id,
            ExpiresAt = tokens.RefreshTokenExpiresAt,
            IsUsed = false,
            IsRevoked = false
        };

        await _refreshStore.SaveAsync(refreshEntity);

        return Ok(tokens);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
    {
        var stored = await _refreshStore.GetAsync(request.RefreshToken);
        if (stored == null)
            return Unauthorized(new { message = "Invalid refresh token" });

        if (stored.IsUsed || stored.IsRevoked || stored.ExpiresAt < DateTime.UtcNow)
            return Unauthorized(new { message = "Refresh token invalid or expired" });

        var user = _userService.GetById(stored.UserId);
        if (user == null)
            return Unauthorized(new { message = "User not found" });

        await _refreshStore.MarkUsedAsync(stored);

        var tokens = _tokenService.GenerateTokens(user);

        var newRefresh = new RefreshToken
        {
            Token = tokens.RefreshToken,
            UserId = user.Id,
            ExpiresAt = tokens.RefreshTokenExpiresAt,
            IsUsed = false,
            IsRevoked = false
        };
        await _refreshStore.SaveAsync(newRefresh);

        return Ok(tokens);
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId != null)
            await _refreshStore.RevokeAllForUserAsync(userId);

        return Ok(new { message = "Logged out" });
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        return Ok(new
        {
            id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
            name = User.Identity?.Name,
            role = User.FindFirst(ClaimTypes.Role)?.Value
        });
    }
}
