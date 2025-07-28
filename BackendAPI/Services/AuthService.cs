using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using BackendAPI.Models;
using BackendAPI.Models.DataTransferObjects;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace BackendAPI.Services
{
    public class AuthService(ScalpersParadiseContext context) : IAuthService
    {
        private readonly string jwtToken = Environment.GetEnvironmentVariable("JWT_TOKEN")!;
        private readonly string validIssuer = Environment.GetEnvironmentVariable("VALID_ISSUER")!;
        private readonly string validAudience = Environment.GetEnvironmentVariable("VALID_AUDIENCE")!;

        public async Task<User?> RegisterAsync(UserDto request)
        {
            if (await context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return null;
            }

            var user = new User();
            var hashedPassword = new PasswordHasher<User>()
                .HashPassword(user, request.Password);


            user.UserId = Guid.NewGuid();
            user.Username = request.Username;
            user.Email = request.Email;
            user.PasswordHash = hashedPassword;
            user.CreatedAt = DateTime.UtcNow;
            user.Role = "Standard";

            context.Users.Add(user);
            await context.SaveChangesAsync();

            return user;
        }
        public async Task<TokenResponseDto?> LoginAsync(UserDto request)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
            if (user is null)
            {
                return null;
            }
            if (new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, request.Password) == PasswordVerificationResult.Failed)
            {
                return null;
            }

            return await CreateTokenResponse(user);
        }

        private async Task<TokenResponseDto> CreateTokenResponse(User user)
        {
            return new TokenResponseDto
            {
                AccessToken = CreateToken(user),
                RefreshToken = await GenerateAndSaveRefreshTokenAsync(user),
            };
        }

        public async Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto request)
        {
            var user = await ValidateRefreshTokenAsync(request.UserId, request.RefreshToken);
            if (user is null)
            {
                return null;
            }

            return await CreateTokenResponse(user);
        }

        public async Task<User?> ValidateRefreshTokenAsync(Guid userId, string refreshToken)
        {
            var user = await context.Users.FindAsync(userId);
            if (user is null || user.RefreshToken != refreshToken ||
            user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return null;
            }

            return user;
        }



        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private async Task<string> GenerateAndSaveRefreshTokenAsync(User user)
        {
            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await context.SaveChangesAsync();
            return refreshToken;
        }

        private string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Role, user.Role),
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtToken)
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var tokenDescriptor = new JwtSecurityToken(
                issuer: validIssuer,
                audience: validAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }

    }
}