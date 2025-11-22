# JWT-.Net-Angular

## Step-1
Install Package `Microsoft.AspNetCore.Authentication.JwtBearer`

## Step-2
Generate JWT Token after successfull login `using your Secret Key.`
```c#
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequest request)
{
    var user = _userService.ValidateUser(request.UserName, request.Password);
    if (user == null)
        return Unauthorized(new { message = "Invalid credentials" });

    var tokens = _tokenService.GenerateTokens(user);

    return Ok(tokens);
}
```

## Step-3
1. Store Your Access Token & Refresh Token on client side.
2. Send claim token `in Authorization:` in every request.

```js
 if (accessToken) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      });
    }
```

## Step-4
- Add JWT Service and Middleware in `Program.cs` file
- This validate the token `using your same secret key`
- If Token found and valid, it `sets HttpContext.User` (ClaimsPrincipal) using `app.UseAuthentication();`
- `app.UseAuthorization()` Uses `HttpContext.User` to check [Authorize], roles, policies, etc. 

## Step-5
- if token found expiry then `Angular Intercepter call RefreshToken() function`.
- RefreshToken() function generate new access token and refresh token. 