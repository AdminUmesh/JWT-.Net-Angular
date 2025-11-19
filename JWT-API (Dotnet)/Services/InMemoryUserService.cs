using JwtRefreshDemo.Api.Models;

namespace JwtRefreshDemo.Api.Services;

public class InMemoryUserService : IUserService
{
    private readonly List<User> _users = new()
    {
        new User { Id = "1", UserName = "admin", Password = "123", Role = "Admin" },
        new User { Id = "2", UserName = "user",  Password = "123", Role = "User" }
    };

    public User? ValidateUser(string userName, string password)
        => _users.FirstOrDefault(u => u.UserName == userName && u.Password == password);

    public User? GetById(string id)
        => _users.FirstOrDefault(u => u.Id == id);
}
