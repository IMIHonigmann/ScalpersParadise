using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.DataTransferObjects
{
    public class RefreshTokenRequestDto
    {
        public Guid UserId { get; set; }
        public required string RefreshToken { get; set; }
    }
}