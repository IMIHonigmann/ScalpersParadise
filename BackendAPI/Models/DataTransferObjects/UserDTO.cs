namespace BackendAPI.Models.DataTransferObjects
{
    public class UserDTO
    {
        public Guid UserId { get; set; }
        public string Email { get; set; } = string.Empty;
    }
}