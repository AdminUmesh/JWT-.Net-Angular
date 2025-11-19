namespace JwtRefreshDemo.Api.Models;

public class User
{
    public string Id { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public string Password { get; set; } = default!;
    public string Role { get; set; } = "User";
}
