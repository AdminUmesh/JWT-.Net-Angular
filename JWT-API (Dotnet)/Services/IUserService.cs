using JwtRefreshDemo.Api.Models;

namespace JwtRefreshDemo.Api.Services;

public interface IUserService
{
    User? ValidateUser(string userName, string password);
    User? GetById(string id);
}
