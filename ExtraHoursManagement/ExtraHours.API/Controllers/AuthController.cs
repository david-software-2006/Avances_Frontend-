using ExtraHours.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExtraHours.API.Controllers 
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase 
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request){
            var token = await _userService.Authenticate(request.Email, request.Password);
            if(token == null) return Unauthorized("Credenciales incorrectas.");
            return Ok(new {token});
        }


    }

    public class LoginRequest {
        public required string Email {get; set;}
        public required string Password {get; set;}
    }
}