namespace JwtRefreshDemo.Api.Dtos;

public class LoginRequest
{
    public string UserName { get; set; } = default!;
    public string Password { get; set; } = default!;
}
